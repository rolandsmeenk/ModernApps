using FlickrNet;
using ModernCSApp.Services;
using ModernCSApp.Views;
using SumoNinjaMonkey.Framework.Controls.DrawingSurface;
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
    public sealed partial class PictureExif : BaseUserControl
    {
        public event PointerBasedEventHandler ChangeViewState;

        public PictureExif()
        {
            this.InitializeComponent();
        }

        public async void LoadInfo(FlickrNet.Photo photo, FlickrNet.ExifTagCollection exifInfo)
        {
            
            try
            {
                lbInfo.ItemsSource = exifInfo;
               
                if (ChangeViewState != null) ChangeViewState("Normal", null);
            }
            catch { 
            
            }
        }

        public async Task UnloadControl()
        {
            base.UnloadControl();

        }

        private void butClose_Tapped(object sender, TappedRoutedEventArgs e)
        {
            if (RenderingService.MagicRenderer != null && RenderingService.MagicRenderer is ISpriteRenderer)
            {
                var p = e.GetPosition(null);
                ((ISpriteRenderer)RenderingService.MagicRenderer).AddSprite(p.X + 15, p.Y + 15, 0, 0.3d);
            }

            if (ChangeViewState != null) ChangeViewState("Minimized",null);

        }


    }
}
