using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Storage;
using Windows.Storage.Streams;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Media.Imaging;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234238

namespace ModernCSApp3
{

    public sealed partial class MediaManager : Page
    {
        int success = 1;

        public MediaManager()
        {
            this.InitializeComponent();

            //StorageFolder folder = Windows.Storage.KnownFolders.RemovableDevices;

            
        }


        //private async Task<int> getMediaAsync()
        //{
        //    int count = 0;

        //    var folders = await Windows.Storage.KnownFolders.RemovableDevices.GetFoldersAsync();
        //    foreach (var storageFolder in folders)
        //    {
        //        var files = await storageFolder.GetFilesAsync();

        //        foreach (var file in files)
        //        {
        //            count++;
        //        }
                
        //    }

        //    return count;
        //}

        //private async Task<int> getMediaManuallyAsync()
        //{
        //    int count = 0;

        //    // Get all removable devices
        //    var selector = Windows.Devices.Portable.StorageDevice.GetDeviceSelector();
        //    var devices = await Windows.Devices.Enumeration.DeviceInformation.FindAllAsync(selector);

        //    foreach (Windows.Devices.Enumeration.DeviceInformation device in devices)
        //    {
        //        // Get device root folder
        //        StorageFolder rootFolder = Windows.Devices.Portable.StorageDevice.FromId(device.Id);

        //        //string myFile = Path.Combine(Package.Current.InstalledLocation.Path, "Content/MyTest1.txt");
        //        string myFile = rootFolder.Provider.DisplayName + @"\" + rootFolder.Name + @"\Phone\Music";
        //        StorageFolder myFolder = await StorageFolder.GetFolderFromPathAsync(Path.GetDirectoryName(myFile));

        //        //using (Stream s = await myFolder.OpenStreamForReadAsync(Path.GetFileName(myFile)))
        //        //{
        //        //    using (StreamReader sr = new StreamReader(s))
        //        //    {
        //        //        // do whateve you want
        //        //    }
        //        //}

        //    }


        //    return count;
        //}


        //private async Task<int> getMusicAsync() {
        //    int count = 0;

        //    var folders = await Windows.Storage.KnownFolders.MusicLibrary.GetFoldersAsync();
        //    foreach (var storageFolder in folders)
        //    {
        //        //var files = await storageFolder.GetFilesAsync();

        //        //foreach (var file in files)
        //        //{
        //        //    count++;
        //        //}

        //    }
        //    return count;
        //}



 
        private async Task<int> getMediaViaDevicesAsync() {

            
            List<MediaItem> runningList = new List<MediaItem>();
           
            
            // Get all removable devices
            var selector = Windows.Devices.Portable.StorageDevice.GetDeviceSelector();
            var devices = await Windows.Devices.Enumeration.DeviceInformation.FindAllAsync(selector);

            foreach (Windows.Devices.Enumeration.DeviceInformation device in devices)
            {
                // Get device root folder
                StorageFolder rootFolder = Windows.Devices.Portable.StorageDevice.FromId(device.Id);

                var folders = await rootFolder.GetFoldersAsync();

                foreach (var folder in folders)
                {

                    var folders2 = await folder.GetFoldersAsync();

                    
                    foreach (var folder2 in folders2)
                    {
                        //record folder
                        MediaItem mi = new MediaItem();
                        mi.Name = folder2.Name;
                        mi.ParentName = folder.Name;
                        mi.Type = 3;
                        mi.rawStorageFolder = folder2;
                        mi.Children = new List<MediaItem>();
                        runningList.Add(mi);

                        ////itterate thru each folder and get its folders/files
                        //var ret = await itterateThruEachFolderAsync(folder2, mi);

                        
                    }

                    if (runningList.Count > 0)
                    {
                        lbMediaFolders.ItemsSource = runningList;
                    }

                }

            }

            return success;

        }
        
        //private async Task<int> itterateThruEachFolder(StorageFolder rootFolder)
        //{
            
        //    var folders = await rootFolder.GetFoldersAsync();

        //    int runningCounter = 0;
        //    foreach (var folder in folders)
        //    {
        //        // go thru folders in folder
        //        var returnedRunningCountForFolder = await itterateThruEachFolder(folder);
        //        runningCounter += returnedRunningCountForFolder;

        //        // go thru files in folder
        //        var returnedFileCountInFolder = await getFileCountInFolder(folder);
        //        runningCounter += returnedFileCountInFolder;
        //    }


        //    return runningCounter;
        //}

        private async Task<List<MediaItem>> itterateThruEachFolderAsync(StorageFolder rootFolder, MediaItem parentMediaItem)
        {
            
            var folders = await rootFolder.GetFoldersAsync();

            List<MediaItem> runningList = new List<MediaItem>();
            foreach (var folder in folders)
            {
                //record folder
                MediaItem mi = new MediaItem();
                mi.Name = folder.Name;
                mi.ParentName = rootFolder.Name;
                mi.Type = 5;
                mi.Children = new List<MediaItem>();
                mi.rawStorageFolder = folder;
                parentMediaItem.Children.Add(mi);
                //runningList.Add(mi);

                //// go thru folders in folder
                //var returnedRunningList = await itterateThruEachFolderAsync(folder, mi);
                //runningList.AddRange(returnedRunningList);

                // go thru files in folder
                var files = await getFilesInFolderAsync(folder, mi);
                //runningList.AddRange(files);
            }


            return runningList;
        }

        //private async Task<int> getFileCountInFolder(StorageFolder folder)
        //{
        //    var fileCount = 0;
        //    var files = await folder.GetFilesAsync();
        //    foreach (var file in files)
        //    {
        //        fileCount++;
        //    }


        //    return fileCount;
        //}

        private async Task<List<MediaItem>> getFilesInFolderAsync(StorageFolder folder, MediaItem parentMediaItem)
        {
            List<MediaItem> mediaItems = new List<MediaItem>(); 
            var files = await folder.GetFilesAsync();

            foreach (var file in files)
            {
                //record file
                MediaItem mi = new MediaItem();
                mi.Name = file.Name;
                mi.ParentName = folder.Name;
                mi.Type = 10;
                mi.rawStorageFile = file;
                mi.Children = new List<MediaItem>();

                parentMediaItem.Children.Add(mi);
                //mediaItems.Add(mi);
            }


            return mediaItems;
        }


        private async void layoutRoot_Loaded(object sender, RoutedEventArgs e)
        {

            //var totalFiles = await getMediaAsync();
            var totalFiles = await getMediaViaDevicesAsync();
            //var totalFiles = await getMusicAsync();
            //var totalFiles = await getMediaManuallyAsync();
        }
        private async void changeFolderClicked(object sender, PointerRoutedEventArgs e)
        {
            if (sender is StackPanel)
            {
                StackPanel sp = sender as StackPanel;
                if (sp.DataContext is MediaItem)
                {
                    MediaItem mi = sp.DataContext as MediaItem;

                    //itterate thru each folder and get its folders/files
                    var ret = await itterateThruEachFolderAsync(mi.rawStorageFolder, mi);

                    var data1 = mi.Children.Where(x=>x.Type != 10);
                    lbMediaFolders.ItemsSource = data1;
                    var data2 = mi.Children.Where(x => x.Type == 10);
                    lbMedia.ItemsSource = data2;
                }
            }
        }
        private async void mediaItemClicked(object sender, PointerRoutedEventArgs e)
        {
            if (sender is StackPanel)
            {
                StackPanel sp = sender as StackPanel;
                if (sp.DataContext is MediaItem)
                {
                    meMainMediaPlayer.Visibility = Visibility.Collapsed;
                    imgSelectedMedia.Visibility = Visibility.Collapsed;

                    MediaItem mi = sp.DataContext as MediaItem;
                    if (mi.rawStorageFile.FileType == ".jpg" || mi.rawStorageFile.FileType == ".jpeg")
                    {
                        imgSelectedMedia.Visibility = Visibility.Visible;
                        var bytes = await GetBtyeFromFileAsync(mi.rawStorageFile);

                        if(bytes!=null){
                            //var stream = new MemoryStream(bytes);   
                            var randomAccessStream = new InMemoryRandomAccessStream();
                            randomAccessStream.WriteAsync(bytes.AsBuffer());
                            randomAccessStream.Seek(0);
                            var bi = new BitmapImage();   
                            bi.ImageFailed += (s, o) =>   
                            {   
                                // This event is optional and is used to let us know if something went wrong   
                                var m = "Failure";   
                            };   
  
                            await bi.SetSourceAsync(randomAccessStream);   
                            imgSelectedMedia.Source = bi;
                        }

                    }
                    else if (mi.rawStorageFile.FileType == ".wma" || mi.rawStorageFile.FileType == ".mp3")
                    { 
                        meMainMediaPlayer.Visibility = Visibility.Visible;
                        var bytes = await GetBtyeFromFileAsync(mi.rawStorageFile);

                        if (bytes != null)
                        {
                            var randomAccessStream = new InMemoryRandomAccessStream();
                            randomAccessStream.WriteAsync(bytes.AsBuffer());
                            randomAccessStream.Seek(0);
                            meMainMediaPlayer.SetSource(randomAccessStream, mi.rawStorageFile.ContentType);
                            meMainMediaPlayer.Play();
                            meMainMediaPlayer.Volume = 0.5;
                        }
                    }

                }
            }
        }

        // This is the method to convert the StorageFile to a Byte[]           
        private async Task<byte[]> GetBtyeFromFileAsync(StorageFile storageFile)
        {
            var stream = await storageFile.OpenReadAsync();

            using (var dataReader = new DataReader(stream))
            {
                var bytes = new byte[stream.Size];
                await dataReader.LoadAsync((uint)stream.Size);
                dataReader.ReadBytes(bytes);

                return bytes;
            }
        }  

    }

    public class MediaItem
    {
        public string Name { get; set; }
        public string ParentName { get; set; }
        public int Type { get; set; }
        public StorageFile rawStorageFile { get; set; }
        public StorageFolder rawStorageFolder { get; set; }
        public List<MediaItem> Children { get; set; }
    }

}
