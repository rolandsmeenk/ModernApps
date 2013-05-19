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
        public event EventHandler ChangeViewState;
        public event EventHandler PictureChanged;

        private string _currentViewState = "Normal";

        public ListOfPics()
        {
            this.InitializeComponent();

            
        }

        public void LoadPictures(FlickrNet.PhotoCollection col, string title)
        {
            tbTitle.Text = title;
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

                //DOWNLOAD ACTUAL IMAGE INTO PICTURES LIBRARY
                await DownloadService.Current.Downloader("1", item.MediumUrl, string.Empty, item.PhotoId + "_" + item.Secret, 2, storageFolder: "ModernCSApp");


                //UPDATE D2D BACKGROUND WITH DOWNLOADED IMAGE
                var br = RenderingService.BackgroundRenderer;
                string[] partsUrl = item.MediumUrl.Split(".".ToCharArray());
                br.ChangeBackground("ModernCSApp\\" + item.PhotoId + "_" + item.Secret + "." + partsUrl[partsUrl.Length-1]);


                //REQUEST TO MINIMIZE THIS LIST IN ITS PARENT
                if (ChangeViewState != null)
                {
                    this._currentViewState = "Minimized";
                    grdTitle.Opacity = 0.5;
                    ChangeViewState("Minimized", EventArgs.Empty);
                }

                //TELL PARENT PICTURE HAS CHANGED
                if (PictureChanged != null)
                {
                    PictureChanged(item, EventArgs.Empty);
                }

                //DISABLE THE LIST TILL ITS NORMAL/MAXIMIZED
                gvMain.IsEnabled = false;

            }
        }

        private void layoutRoot_PointerReleased(object sender, PointerRoutedEventArgs e)
        {
            if (this._currentViewState == "Minimized")
            {
                if (ChangeViewState != null) ChangeViewState("Normal", EventArgs.Empty);

                gvMain.IsEnabled = true;
                grdTitle.Opacity = 1;
            }
        }

    }
}
