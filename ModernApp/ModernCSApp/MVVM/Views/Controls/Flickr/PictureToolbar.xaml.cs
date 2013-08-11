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
    public sealed partial class PictureToolbar : BaseUserControl
    {
        

        public event PointerBasedEventHandler ChangeViewState;

        public bool IsExpanded = false;
        private Orientation _previousOrientation = Orientation.Horizontal;
        public PictureToolbar()
        {
            this.InitializeComponent();
        }

        public async Task UnloadControl()
        {
            base.UnloadControl();

        }

        private void elLauncher_PointerPressed(object sender, PointerRoutedEventArgs e)
        {
            if (ChangeViewState != null) ChangeViewState("StartExpandToolbar", e.GetCurrentPoint(null).Position);
        }

        public void LoadToolbar(Orientation orientation)
        {
            _previousOrientation = orientation;
            spToolBarItems.Orientation = orientation;
            if (orientation == Orientation.Horizontal)
            {
                spToolBarItems.Margin = new Thickness(0, 0, 60, 0);
            }
            else
            {
                spToolBarItems.Margin = new Thickness(0, 0, 0, 60);
            }
            spToolBarItems.Visibility = Visibility.Visible;
            IsExpanded = true;
        }

        public void UnloadToolbar()
        {
            spToolBarItems.Visibility = Visibility.Collapsed;
            IsExpanded = false;
        }

        public void ToogleToolbar()
        {
            if (IsExpanded)
            {
                UnloadToolbar();
            }
            else
            {
                LoadToolbar(_previousOrientation);
            }
        }

        private void butFav_Tapped(object sender, TappedRoutedEventArgs e)
        {
            var p = e.GetPosition(null);
            Bang(p);
            
            if (ChangeViewState != null) ChangeViewState("AddFavourite", null);
        }

        private void butPromote_Tapped(object sender, TappedRoutedEventArgs e)
        {
            var p = e.GetPosition(null);
            Bang(p);

            if (ChangeViewState != null) ChangeViewState("PromoteIt", null);
        }

        private void butSend_Tapped(object sender, TappedRoutedEventArgs e)
        {
            var p = e.GetPosition(null);
            Bang(p);
            if (ChangeViewState != null) ChangeViewState("SendPicture", null);
        }

        private void butBillboard_Tapped(object sender, TappedRoutedEventArgs e)
        {
            var p = e.GetPosition(null);
            Bang(p);
            if (ChangeViewState != null) ChangeViewState("CreateBillboard", null);
        }

        private void butExif_Tapped(object sender, TappedRoutedEventArgs e)
        {
            var p = e.GetPosition(null);
            Bang(p);
            if (ChangeViewState != null) ChangeViewState("RetrieveExif", null);
        }

        private void butNote_Tapped(object sender, TappedRoutedEventArgs e)
        {
            var p = e.GetPosition(null);
            Bang(p);
            if (ChangeViewState != null) ChangeViewState("AddNote", null);
        }

        private void butComments_Tapped(object sender, TappedRoutedEventArgs e)
        {
            var p = e.GetPosition(null);
            Bang(p);
            if (ChangeViewState != null) ChangeViewState("ShowComments", null);
        }

        private void butUserFavs_Tapped(object sender, TappedRoutedEventArgs e)
        {
            var p = e.GetPosition(null);
            Bang(p);
            if (ChangeViewState != null) ChangeViewState("ShowUserFavs", null);
        }

        private void butPhotographerFavs_Tapped(object sender, TappedRoutedEventArgs e)
        {
            var p = e.GetPosition(null);
            Bang(p);
            if (ChangeViewState != null) ChangeViewState("ShowPhotographerFavs", null);
        }


        public enum ViewType
        {
            PhotographerFavs = 1,
            UserFavs =2,
            Exif = 4,
            Fav = 8,
            Promote = 16
        }

        public void ChangeViewTo(ViewType viewType)
        {

            butPhotographerFavs.Visibility = Visibility.Collapsed;
        
            butUserFavs.Visibility = Visibility.Collapsed;
   
            butExif.Visibility = Visibility.Collapsed;
 
            butFav.Visibility = Visibility.Collapsed;
    
            butPromote.Visibility = Visibility.Collapsed;
            




             if ((viewType & ViewType.PhotographerFavs) == ViewType.PhotographerFavs ) //Home
             {
                 butPhotographerFavs.Visibility = Visibility.Visible;
             }
             if ((viewType & ViewType.UserFavs) == ViewType.UserFavs ) //Home
             {
                 butUserFavs.Visibility = Visibility.Visible;
             }
             if ((viewType & ViewType.Exif) == ViewType.Exif ) //Public
             {
                 butExif.Visibility = Visibility.Visible;
             }
             if ((viewType & ViewType.Fav) == ViewType.Fav ) //hide fav & promote
            {
                butFav.Visibility = Visibility.Visible;
            }
             if ((viewType & ViewType.Promote) == ViewType.Promote ) //hide fav & promote
            {
                butPromote.Visibility = Visibility.Visible;
            }
        }
    }

    


    //public delegate void PointerBasedEventHandler(object sender, PointerRoutedEventArgs e);
    public delegate void PointerBasedEventHandler(string action, Windows.Foundation.Point? point);
}
