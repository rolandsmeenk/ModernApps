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

        public PictureDetails()
        {
            this.InitializeComponent();

            
        }

        public void LoadPicture(FlickrNet.PhotoInfo photoInfo)
        {
            this.DataContext = photoInfo;

            String resultDescription = Regex.Replace(photoInfo.Description, @"<[^>]*>", String.Empty);
            tbDescription.Text = resultDescription;

            string resultDisplayName = "by ";
            if (photoInfo.OwnerRealName != string.Empty) resultDisplayName += photoInfo.OwnerRealName;
            if (photoInfo.OwnerUserName != string.Empty) resultDisplayName += "(" + photoInfo.OwnerUserName + ")";
            tbOwnerDisplayName.Text = resultDisplayName;

            //imgMain.Source = bi;
            if (ChangeViewState != null) ChangeViewState("Normal", EventArgs.Empty);
        }

        public async Task UnloadControl()
        {
            base.UnloadControl();

        }


    }
}
