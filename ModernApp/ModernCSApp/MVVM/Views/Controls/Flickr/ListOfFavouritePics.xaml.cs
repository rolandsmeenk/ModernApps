using ModernCSApp.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
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
        public ListOfFavouritePics()
        {
            this.InitializeComponent();
        }


        public void LoadPictures(List<Favourite> col, string title)
        {
            grdTitle1.Visibility = Visibility.Visible;
            tbTitle1.Text = title;
            gvPublicFavourites.ItemsSource = col;
        }
        public void LoadPictures(List<Promote> col, string title)
        {
            grdTitle1.Visibility = Visibility.Visible;
            tbTitle1.Text = title;
            gvPublicFavourites.ItemsSource = col;
        }
    }
}
