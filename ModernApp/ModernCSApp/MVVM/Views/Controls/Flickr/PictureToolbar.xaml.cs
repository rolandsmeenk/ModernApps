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
            if (ChangeViewState != null) ChangeViewState("StartExpandToolbar", e);
        }

        public void LoadToolbar(Orientation orientation)
        {
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
        }

        public void UnloadToolbar()
        {
            spToolBarItems.Visibility = Visibility.Collapsed;
        }

        private void butFav_Tapped(object sender, TappedRoutedEventArgs e)
        {
            var p = e.GetPosition(null);
            Bang(p);
        }

        private void butSend_Tapped(object sender, TappedRoutedEventArgs e)
        {
            var p = e.GetPosition(null);
            Bang(p);
        }

        private void butBillboard_Tapped(object sender, TappedRoutedEventArgs e)
        {
            var p = e.GetPosition(null);
            Bang(p);
        }

        private void Bang(Point p)
        {
            if (p != null && RenderingService.MagicRenderer != null && RenderingService.MagicRenderer is ISpriteRenderer)
            {
                ((ISpriteRenderer)RenderingService.MagicRenderer).AddSprite(p.X, p.Y, 0, 0.15d);
            }
        }

    }

    public delegate void PointerBasedEventHandler(object sender, PointerRoutedEventArgs e);
}
