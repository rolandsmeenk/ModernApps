using ModernCSApp.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Storage;

namespace ks
{
    public partial class MainPage
    {


        private async Task<StorageFile> GetPackagedFile(string folderName, string fileName)
        {
            StorageFolder installFolder = Windows.ApplicationModel.Package.Current.InstalledLocation;

            if (folderName != null)
            {
                StorageFolder subFolder = await installFolder.GetFolderAsync(folderName);
                return await subFolder.GetFileAsync(fileName);
            }
            else
            {
                return await installFolder.GetFileAsync(fileName);
            }
        }


    }

}
