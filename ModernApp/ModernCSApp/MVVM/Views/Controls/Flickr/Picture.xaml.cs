using FlickrNet;
using ModernCSApp.Services;
using ModernCSApp.Views;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Storage;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Media.Animation;
using Windows.UI.Xaml.Media.Imaging;
using Windows.UI.Xaml.Navigation;

namespace ModernCSApp.Views.Controls.Flickr
{
    public sealed partial class Picture : BaseUserControl
    {
        public event EventHandler ChangeViewState;

        public Picture()
        {
            this.InitializeComponent();
        }

        public async void LoadPicture(FlickrNet.Photo photo)
        {
            //imgMain.Source = new Uri(photo.OwnerName);

            try
            {
                var folder = await Windows.Storage.KnownFolders.PicturesLibrary.GetFolderAsync("ModernCSApp");
                var file = await folder.GetFileAsync(photo.PhotoId + "_" + photo.Secret + ".jpg");

                using (var stream = await file.OpenReadAsync())
                {
                    BitmapImage bi = new BitmapImage();
                    bi.SetSource(stream);
                    imgMain.Source = bi;
                }


                //imgMain.Source = bi;
                if (ChangeViewState != null) ChangeViewState("Normal", EventArgs.Empty);
            }
            catch { 
            
            }
        }

        public async Task UnloadControl()
        {
            base.UnloadControl();

        }


    }
}
