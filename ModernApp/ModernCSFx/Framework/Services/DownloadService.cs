using System;
using System.IO;
using System.Net;
using System.Linq;
using System.Threading.Tasks;
using Windows.Storage;
using Windows.Storage.Search;
using System.Collections.Generic;
using SumoNinjaMonkey.Framework.Services;
using GalaSoft.MvvmLight.Messaging;
using SumoNinjaMonkey.Framework.Controls.Messages;


namespace ModernCSApp.Services
{

    public class DownloadService
    {
        private static DownloadService _downloadService = null;

        public static DownloadService Current
        {
            get
            {
                if (DownloadService._downloadService == null)
                {
                    DownloadService._downloadService = new DownloadService();
                }
                return DownloadService._downloadService;
            }
        }



        private DownloadService()
        {
        }

        private struct DownloadRequest{
            public string AggregateId { get; set; }
            public string Url { get; set; }
            public string BackupUrl { get; set; }
            public string FileName { get; set; }
            public int Type { get; set; }
            public string StorageFolder { get; set; }
        }

        private Queue<DownloadRequest> _downloadVideoRequests = new Queue<DownloadRequest>();
        private Queue<DownloadRequest> _downloadPictureRequests = new Queue<DownloadRequest>();
        private bool _isDownloadingVideo = false;
        private bool _isDownloadingPicture = false;
        public async Task Downloader(string aggregateId, string url, string backupUrl, string fileName, int type, string storageFolder = "ModernCSFx")
        {
            if (type == 1) //video download
            {
                _downloadVideoRequests.Enqueue(new DownloadRequest()
                {
                    Url = url,
                    AggregateId = aggregateId,
                    FileName = fileName,
                    StorageFolder = storageFolder,
                    Type = type,
                    BackupUrl = backupUrl
                });

                await AttemptToDownloadVideo();
            }
            else if (type == 2) //picture download
            {
                _downloadPictureRequests.Enqueue(new DownloadRequest()
                {
                    Url = url,
                    AggregateId = aggregateId,
                    FileName = fileName,
                    StorageFolder = storageFolder,
                    Type = type,
                    BackupUrl = backupUrl
                });
                await AttemptToDownloadPicture();
            }

        }

        private async Task AttemptToDownloadVideo()
        {
            if (!_isDownloadingVideo && _downloadVideoRequests.Count() > 0)
            {
                _isDownloadingVideo = true;
                await ExecuteDownload(_downloadVideoRequests.Dequeue());
            }
        }

        private async Task AttemptToDownloadPicture()
        {
            if (!_isDownloadingPicture && _downloadPictureRequests.Count() > 0)
            {
                _isDownloadingPicture = true;
                await ExecuteDownload(_downloadPictureRequests.Dequeue());
            }
        }

        private async Task ExecuteDownload(DownloadRequest request)
        {

            string[] partsUrl = request.Url.Split(".".ToCharArray());
            string fileNameToUse = request.FileName.Replace("\"", "").Replace(" ", "").Replace("'", "").Replace(".", "");

            if (request.Type == 1) //video download
            {
                string fileUri = request.FileName + ".mp4";
                string folderUri = request.StorageFolder;
                StorageFolder folder = Windows.Storage.KnownFolders.VideosLibrary;
                var appFolder = await folder.CreateFolderAsync(folderUri, CreationCollisionOption.OpenIfExists);

                StorageFile file = await FileExists(folderUri, fileUri, 1);

                bool isNewDownload = false;
                if (file == null)
                {
                    isNewDownload = true;
                    file = await appFolder.CreateFileAsync(fileUri, CreationCollisionOption.ReplaceExisting);

                    SendSystemWideMessage("DASHBOARD", "", action: "SEND INFORMATION NOTIFICATION", text1: "Download started '" + fileUri + "'", int1: 2);
                    using (var newFileStream = await file.OpenStreamForWriteAsync())
                    {
                        await SaveUrlContentToStorage(request.Url, newFileStream);
                    }

                    
                }


                if (isNewDownload) SendSystemWideMessage("DASHBOARD", "", action: "SEND INFORMATION NOTIFICATION", text1: "Download complete '" + fileUri + "'", int1: 2);

                var vp = await file.Properties.GetVideoPropertiesAsync();
                AppDatabase.Current.UpdateUIElementStateField(request.AggregateId, "Width", vp.Width, sendAggregateUpdateMessage: false);
                AppDatabase.Current.UpdateUIElementStateField(request.AggregateId, "Height", vp.Height, sendAggregateUpdateMessage: false);
                AppDatabase.Current.UpdateUIElementStateField(request.AggregateId, "udfBool1", true); //file has been downloaded so tell the world its ok to start using it

                _isDownloadingVideo = false;

                await AttemptToDownloadVideo();
            }
            else if (request.Type == 2) //image
            {


                string fileUri = fileNameToUse + "." + partsUrl[partsUrl.Length - 1];
                string folderUri = request.StorageFolder;
                StorageFolder folder = Windows.Storage.KnownFolders.PicturesLibrary;
                var appFolder = await folder.CreateFolderAsync(folderUri, CreationCollisionOption.OpenIfExists);

                StorageFile file = await FileExists(folderUri, fileUri, request.Type);

                bool isNewDownload = false;
                if (file == null)
                {
                    isNewDownload = true;
                    file = await appFolder.CreateFileAsync(fileUri, CreationCollisionOption.ReplaceExisting);

                    //SendSystemWideMessage("DASHBOARD", "", action: "SEND INFORMATION NOTIFICATION", text1: "Download started '" + fileUri + "'", int1: 2);
                    using (var newFileStream = await file.OpenStreamForWriteAsync())
                    {
                        await SaveUrlContentToStorage(request.Url, newFileStream);
                    }

                    var bp = await file.GetBasicPropertiesAsync();
                    if (bp.Size < 1000 )
                    {
                        file = await appFolder.CreateFileAsync(fileUri, CreationCollisionOption.ReplaceExisting);
                        using (var newFileStream = await file.OpenStreamForWriteAsync())
                        {
                            await SaveUrlContentToStorage(request.BackupUrl, newFileStream);
                        }
                    }

                }

                //if (isNewDownload) SendSystemWideMessage("DASHBOARD", "", action: "SEND INFORMATION NOTIFICATION", text1: "Download complete '" + fileUri + "'", int1: 2);



                //var vp = await file.Properties.GetImagePropertiesAsync();
                //AppDatabase.Current.UpdateUIElementStateField(aggregateId, "Width", vp.Width, sendAggregateUpdateMessage: false);
                //AppDatabase.Current.UpdateUIElementStateField(aggregateId, "Height", vp.Height, sendAggregateUpdateMessage: false);
                //AppDatabase.Current.UpdateUIElementStateField(aggregateId, "udfBool1", true); //file has been downloaded so tell the world its ok to start using it

                _isDownloadingPicture = false;

                await AttemptToDownloadPicture();
            }

            
        }

        private async Task<IReadOnlyList<StorageFile>> GetFilesAsync(string subFolder, int type = 0)
        {
            //var folder = ApplicationData.Current.LocalFolder;
            var parts = subFolder.Split("\\".ToCharArray());
            StorageFolder folderToUse = null;
            foreach (var part in parts)
            {
                StorageFolder tempFolder = null;
                if (folderToUse == null)
                {
                    if (type == 1) tempFolder = await KnownFolders.VideosLibrary.GetFolderAsync(part);
                    else if (type == 2) tempFolder = await KnownFolders.PicturesLibrary.GetFolderAsync(part);
                }
                else tempFolder = await folderToUse.GetFolderAsync(part);

                folderToUse = tempFolder;
            }
            //var folder = await KnownFolders.VideosLibrary.GetFolderAsync(subFolder);
            return await folderToUse.GetFilesAsync(CommonFileQuery.OrderByName)
                               .AsTask().ConfigureAwait(false);
        }

        //type 0 = video, 1 = picture
        private async Task<StorageFile> FileExists(string subFolder, string filename, int type = 0)
        {
            var files = await GetFilesAsync(subFolder, type);

            var file = files.FirstOrDefault(x => x.Name == filename);
            if (file != null)
            {
                return file;
                //return "ms-appdata:///local/" + filename;
            }
            return null;
        }


        private async Task SaveUrlContentToStorage(string url, Stream stream)
        {
            try
            {
                HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(url);

                using (WebResponse response = await request.GetResponseAsync())
                {
                    using (Stream rs = response.GetResponseStream())
                    {
                        await rs.CopyToAsync(stream);
                    }
                }

                return;
            }
            catch (WebException ex)
            {
                return;
            }
        }



        public void SendSystemWideMessage(string identifier, string content, string sourceId = "", string action = "", string url1 = "", string aggregateId = "", string text1 = "", string text2 = "", int int1 = 2)
        {
            LoggingService.LogInformation("system message ... " + content, "DownloadService.SendSystemWideMessage");
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage(content) { Identifier = identifier, SourceId = sourceId, Url1 = url1, Action = action, AggregateId = aggregateId, Text1 = text1, Text2 = text2, Int1 = int1 });
        }



    }
}
