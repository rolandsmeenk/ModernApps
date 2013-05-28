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
    public sealed partial class PictureComments : BaseUserControl
    {
        
        public event PointerBasedEventHandler ChangeViewState;
        
        private string _currentViewState = "Normal";

        public PictureComments()
        {
            this.InitializeComponent();

            
        }

        public void ClearAll()
        {
            tbTitle.Text = string.Empty;
            gvMain.ItemsSource = null;
        }

        public void LoadComments(PhotoCommentCollection comments, string title)
        {
            tbTitle.Text = title;
            gvMain.ItemsSource = comments;
            if (ChangeViewState != null) ChangeViewState("Normal", null);
        }

        public async Task UnloadControl()
        {
            base.UnloadControl();

        }

        private async void gvMain_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (e != null && e.AddedItems != null && e.AddedItems.Count > 0)
            {
                var item  = (PhotoComment)e.AddedItems[0];

                SendSystemWideMessage("HomeView", item.AuthorUserId, action: "ShowCommentUserPhotos");
            }
        }

        private void layoutRoot_PointerReleased(object sender, PointerRoutedEventArgs e)
        {
            if (this._currentViewState == "Minimized")
            {
                if (ChangeViewState != null) ChangeViewState("Normal", e);

                gvMain.IsEnabled = true;
                grdTitle.Opacity = 1;
            }
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
            if (ChangeViewState != null) ChangeViewState("StartExpandUserStreamTitle", e);
        }
    }
}
