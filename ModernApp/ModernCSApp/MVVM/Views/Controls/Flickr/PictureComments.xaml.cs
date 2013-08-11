using FlickrNet;
using ModernCSApp.Services;
using ModernCSApp.Views;
using SumoNinjaMonkey.Framework.Controls.DrawingSurface;
using SumoNinjaMonkey.Framework.Controls.Messages;
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

    

        private void layoutRoot_PointerReleased(object sender, PointerRoutedEventArgs e)
        {
            if (this._currentViewState == "Minimized")
            {
                if (ChangeViewState != null) ChangeViewState("Normal", e.GetCurrentPoint(null).Position);

                gvMain.IsEnabled = true;
                grdTitle.Opacity = 1;
            }
        }

        

        private void grdTitle_PointerPressed(object sender, PointerRoutedEventArgs e)
        {
            if (ChangeViewState != null) ChangeViewState("StartExpandUserStreamTitle", e.GetCurrentPoint(null).Position);
        }

        private void gvMain_SingleTapped(object sender, TappedRoutedEventArgs e)
        {
            var pt = e.GetPosition(null);

            var item = (PhotoComment)gvMain.SelectedItem;

            GeneralSystemWideMessage msg = new GeneralSystemWideMessage(item.AuthorUserId);
            MessageBox("Load this users Favourites?", "Yes", "YesLoadAuthor", "HomeView", "No", "NoLoadAuthor", "HomeView", imageIcon: item.AuthorBuddyIcon, msgToPassAlong: msg);

            if (RenderingService.MagicRenderer != null && RenderingService.MagicRenderer is ISpriteRenderer)
            {
                ((ISpriteRenderer)RenderingService.MagicRenderer).AddSprite(pt.X, pt.Y, 0, 0.3d);
            }
        }

        private void gvMain_DoubleTapped(object sender, DoubleTappedRoutedEventArgs e)
        {
            //var pt = e.GetPosition(null);

            //var item = (PhotoComment)gvMain.SelectedItem;

            //GeneralSystemWideMessage msg = new GeneralSystemWideMessage(item.AuthorUserId); 
            //MessageBox("Load this users Favourites?", "Yes", "YesLoadAuthor", "HomeView", "No", "NoLoadAuthor", "HomeView", imageIcon: item.AuthorBuddyIcon, msgToPassAlong:msg  );
            
            //if (RenderingService.MagicRenderer != null && RenderingService.MagicRenderer is ISpriteRenderer)
            //{
            //    ((ISpriteRenderer)RenderingService.MagicRenderer).AddSprite(pt.X, pt.Y, 0, 0.3d);
            //}

            ////SendSystemWideMessage("HomeView", item.AuthorUserId, action: "ShowCommentUserPhotos");

        }
    }
}
