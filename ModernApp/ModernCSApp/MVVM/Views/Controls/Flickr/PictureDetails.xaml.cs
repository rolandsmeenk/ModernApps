using FlickrNet;
using ModernCSApp.Services;
using ModernCSApp.Views;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
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
    public sealed partial class PictureDetails : BaseUserControl
    {
        public event EventHandler ChangeViewState;
        public event EventHandler PictureChanged;

        public PictureDetails()
        {
            this.InitializeComponent();

            
        }

        public void LoadPicture(FlickrNet.PhotoInfo photoInfo)
        {
            this.DataContext = photoInfo;

            if (photoInfo.Title == string.Empty || photoInfo.Title.Length == 0) grdTitle.Visibility = Windows.UI.Xaml.Visibility.Collapsed;
            else grdTitle.Visibility = Visibility.Visible;

            String resultDescription = Regex.Replace(photoInfo.Description, @"<[^>]*>", String.Empty);
            tbDescription.Text = resultDescription;

            string resultDisplayName = "by ";
            if (photoInfo.OwnerRealName != string.Empty) resultDisplayName += photoInfo.OwnerRealName;
            if (photoInfo.OwnerUserName != string.Empty) resultDisplayName += " (" + photoInfo.OwnerUserName + ")";
            tbOwnerDisplayName.Text = resultDisplayName;

            tbLicense.Text = "License : " + photoInfo.License;
            tbViews.Text = "Views : " + photoInfo.ViewCount;

            if (ChangeViewState != null) ChangeViewState("Normal", EventArgs.Empty);

            //try to load photostream
            
            
            
        }

        public void LoadPhotoStream(PhotoCollection photos)
        {
            PhotoInfo dc = (PhotoInfo)this.DataContext;

            picsPhotoStream.LoadPictures(photos, dc.OwnerRealName + " photostream");

        }

        public async Task UnloadControl()
        {
            base.UnloadControl();

        }

        private void picsPhotoStream_ChangeViewState(object sender, EventArgs e)
        {
            
            switch ((string)sender)
            {
                case "Minimized":
                    picsPhotoStream.Visibility = Visibility.Collapsed;
                    break;
                case "Normal":
                    picsPhotoStream.Visibility = Visibility.Visible;
                    break;

                case "Maximized": break;
            }
        }

        public void ClearAll()
        {
            picsPhotoStream.ClearAll();
        }

        private void picsPhotoStream_PictureChanged(object sender, EventArgs e)
        {
            if (PictureChanged != null) PictureChanged(sender, e);
        }
    }
}
