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
            grdTitle1.Visibility = Visibility.Visible;
            tbTitle1.Text = title;
            gvMain.ItemsSource = col;
        }
        public void LoadPictures(List<Promote> col, string title)
        {
            grdTitle1.Visibility = Visibility.Visible;
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
    }
}
