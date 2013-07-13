using ModernCSApp.Services;
using SumoNinjaMonkey.Framework.Controls.DrawingSurface;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;


namespace ModernCSApp.Views.Controls.Flickr
{
    public sealed partial class ListOfFavouritePics : BaseUserControl
    {
        public event PointerBasedEventHandler ChangeViewState;
        public event EventHandler PictureChanged;
        
        private string _currentViewState = "Normal";

        public ListOfFavouritePics()
        {
            this.InitializeComponent();
        }



        public void LoadPictures(List<Favourite> col, string title)
        {
            grdTitle.Visibility = Visibility.Visible;
            tbTitle1.Text = title;
            gvMain.ItemsSource = col;
        }
        public void LoadPictures(List<Promote> col, string title)
        {
            grdTitle.Visibility = Visibility.Visible;
            tbTitle1.Text = title;
            gvMain.ItemsSource = col;
        }

        public async Task UnloadControl()
        {
            base.UnloadControl();

        }

        private void gvMain_Tapped(object sender, TappedRoutedEventArgs e)
        {
            if (RenderingService.MagicRenderer != null && RenderingService.MagicRenderer is ISpriteRenderer)
            {
                var p = e.GetPosition(null);
                ((ISpriteRenderer)RenderingService.MagicRenderer).AddSprite(p.X, p.Y, 0, 0.3d);
            }
        }

        private void grdTitle_PointerPressed(object sender, PointerRoutedEventArgs e)
        {
            if (ChangeViewState != null) ChangeViewState("StartExpandListOfPicsTitle", e);
        }

        private async void gvMain_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {

            if (e != null && e.AddedItems != null && e.AddedItems.Count > 0)
            {
                var item = e.AddedItems[0] as Favourite;

                //if (item is Promote) {

                //    var i1 = item as Promote;
                //}
                //else if (item is Favourite)
                //{
                //    var i2 = item as Favourite;
                //}

                

                ////DOWNLOAD ACTUAL IMAGE INTO PICTURES LIBRARY
                await DownloadService.Current.Downloader("1", item.MediaUrlMedium, string.Empty, item.AggregateId.Replace("-","") , 2, storageFolder: "ModernCSApp");


                //UPDATE D2D BACKGROUND WITH DOWNLOADED IMAGE
                if (RenderingService.BackgroundRenderer != null)
                {
                    var br = RenderingService.BackgroundRenderer;
                    string[] partsUrl = item.MediaUrlMedium.Split(".".ToCharArray());
                    br.ChangeBackground("ModernCSApp\\" + item.AggregateId.Replace("-", "") + "." + partsUrl[partsUrl.Length - 1], "PublicPicturesLibrary");
                }

                ////REQUEST TO MINIMIZE THIS LIST IN ITS PARENT
                //if (ChangeViewState != null)
                //{
                //    this._currentViewState = "Minimized";
                //    grdTitle.Opacity = 0.5;
                //    ChangeViewState("Minimized", null);
                //}

                //TELL PARENT PICTURE HAS CHANGED
                if (PictureChanged != null)
                {
                    PictureChanged(item, EventArgs.Empty);
                }

                ////DISABLE THE LIST TILL ITS NORMAL/MAXIMIZED
                //gvMain.IsEnabled = false;

            }



        }

    }
}
