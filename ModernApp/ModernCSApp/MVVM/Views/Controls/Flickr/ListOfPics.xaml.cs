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
    public sealed partial class ListOfPics : BaseUserControl
    {
        public ListOfPics()
        {
            this.InitializeComponent();

            
        }

        public void LoadPictures(FlickrNet.PhotoCollection col)
        {
            gvMain.ItemsSource = col;
        }

        public async Task UnloadControl()
        {
            base.UnloadControl();

        }

        private async void gvMain_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (e != null && e.AddedItems != null && e.AddedItems.Count > 0)
            {
                var item  = (Photo)e.AddedItems[0];
                await DownloadService.Current.Downloader("1", item.MediumUrl, string.Empty, item.PhotoId + "_" + item.Secret, 2, storageFolder: "ModernCSApp"); 
            }
        }

    }
}
