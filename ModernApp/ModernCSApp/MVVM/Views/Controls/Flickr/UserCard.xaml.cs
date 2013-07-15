using FlickrNet;
using ModernCSApp.Services;
using ModernCSApp.Views;
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



    public sealed partial class UserCard : BaseUserControl
    {
        public event EventHandler ChangeViewState;


        public enum CardPosition
        {
            Left,
            Center,
            Right
        }

        public UserCard()
        {
            this.InitializeComponent();
        }

        public async void LoadDetails(string username, string userurl, CardPosition cardPosition)
        {

            tbName.Text = username;

            switch (cardPosition)
            {
                case CardPosition.Left: sbLeft.Begin(); break;
                case CardPosition.Center: sbNormal.Begin(); break;
                case CardPosition.Right: sbRight.Begin(); break;
            }


            if(userurl != string.Empty) imgMain.Source = new BitmapImage(new Uri(userurl));
            
            //var folder = await Windows.Storage.KnownFolders.PicturesLibrary.GetFolderAsync("ModernCSApp");
            //var file = await folder.GetFileAsync(photo.PhotoId + "_" + photo.Secret + ".jpg");

            //using (var stream = await file.OpenReadAsync())
            //{
            //    BitmapImage bi = new BitmapImage();
            //    bi.SetSource(stream);
            //    imgMain.Source = bi;
            //}
            
            
            //imgMain.Source = bi;
            if (ChangeViewState != null) ChangeViewState("Normal", EventArgs.Empty);
        }

        public async Task UnloadControl()
        {
            base.UnloadControl();

        }





    }
}
