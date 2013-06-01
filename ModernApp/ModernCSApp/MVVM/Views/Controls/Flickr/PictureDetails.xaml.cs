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
        public event PointerBasedEventHandler ChangeViewState;
        public event EventHandler PictureChanged;

        private bool _isShowingComments = false;
        private bool _isShowingViews = false;
        private bool _isShowingNotes = false;

        public PictureDetails()
        {
            this.InitializeComponent();

            
        }

        public void LoadPicture(FlickrNet.PhotoInfo photoInfo)
        {
            this.DataContext = photoInfo;

            _isShowingComments = false;
            _isShowingNotes = false;
            _isShowingViews = false;

            if (photoInfo.Title == string.Empty || photoInfo.Title.Length == 0) grdTitle.Visibility = Windows.UI.Xaml.Visibility.Collapsed;
            else grdTitle.Visibility = Visibility.Visible;

            String resultDescription = Regex.Replace(photoInfo.Description, @"<[^>]*>", String.Empty);
            tbDescription.Text = resultDescription;

            string resultDisplayName = "by ";
            if (photoInfo.OwnerRealName != string.Empty) resultDisplayName += photoInfo.OwnerRealName;
            if (photoInfo.OwnerUserName != string.Empty) resultDisplayName += " (" + photoInfo.OwnerUserName + ")";
            tbOwnerDisplayName.Text = resultDisplayName;

            tbLicense.Text = "License : " + photoInfo.License;
            butViews.Content = "Views : " + photoInfo.ViewCount;
            butComments.Content = "Comments : " + photoInfo.CommentsCount;
            if(photoInfo.Notes!=null) butNotes.Content = "Notes : " +  photoInfo.Notes.Count ;

            if (ChangeViewState != null) ChangeViewState("Normal", null);

            //try to load photostream
            
            
            
        }

        public void LoadPhotoStream(PhotoCollection photos)
        {
            if (this.DataContext is PhotoInfo)
            {
                PhotoInfo dc = (PhotoInfo)this.DataContext;

                picsPhotoStream.LoadPictures(photos, dc.OwnerRealName + " photostream");
            }
        }

        public void LoadComments(PhotoCommentCollection comments)
        {
            var pc = new PictureComments();
            pc.LoadComments(comments, "Comments");
            grdSubWindow.Children.Add(pc);

            ShowSubWindow(-1.5, 40, 10);

        }

        public async Task UnloadControl()
        {
            base.UnloadControl();
            if (grdSubWindow.Children.Count > 1) grdSubWindow.Children.RemoveAt(1);
            ClearAll();

        }

        private void picsPhotoStream_ChangeViewState(object sender, PointerRoutedEventArgs e)
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

                case "StartExpandUserStreamTitle":
                    if (ChangeViewState != null) ChangeViewState("StartExpandUserStreamTitle", e);
                    break;
            }
        }

        public void ClearAll()
        {
            picsPhotoStream.ClearAll();
            MinimizeUserPictureStream();
            HideSubWindow();
        }

        

        private void picsPhotoStream_PictureChanged(object sender, EventArgs e)
        {
            if (PictureChanged != null) PictureChanged(sender, e);
        }

        public void MaximizeUserPictureStream()
        {
            svDescription.Visibility = Windows.UI.Xaml.Visibility.Collapsed;
            picsPhotoStream.Height = 410;
        }

        public void MinimizeUserPictureStream()
        {
            svDescription.Visibility = Windows.UI.Xaml.Visibility.Visible;
            picsPhotoStream.Height = 140;
        }

        private void butComments_Tapped(object sender, TappedRoutedEventArgs e)
        {
            var p = e.GetPosition(null);
            Bang(p);
            if (ChangeViewState != null) ChangeViewState("ShowComments", null);

            _isShowingComments = !_isShowingComments;
            if (_isShowingComments) { if (ChangeViewState != null) ChangeViewState("RequestShowComments", null); }
            else
            {
                sbHideSubWindow.Begin();
                grdSubWindow.Children.RemoveAt(1);
            }
            
        }

        private void butViews_Tapped(object sender, TappedRoutedEventArgs e)
        {
            var p = e.GetPosition(null);
            Bang(p);
            if (ChangeViewState != null) ChangeViewState("ShowViews", null);

            //_isShowingViews = !_isShowingViews;
            //if(_isShowingViews)ShowSubWindow(-0.5, 180, 10);
            //else sbHideSubWindow.Begin();
        }

        private void butNotes_Tapped(object sender, TappedRoutedEventArgs e)
        {
            var p = e.GetPosition(null);
            Bang(p);
            if (ChangeViewState != null) ChangeViewState("ShowNotes", null);

            //_isShowingNotes = !_isShowingNotes;
            //if (_isShowingNotes) ShowSubWindow(2.1, 310, 0);
            //else sbHideSubWindow.Begin();
        }

        private void HideSubWindow()
        {
            _isShowingComments = false;
            _isShowingNotes = false;
            _isShowingViews = false;
            if(grdSubWindow.Children.Count>1) grdSubWindow.Children.RemoveAt(1);
            sbHideSubWindow.Begin();
        }

        private void ShowSubWindow(double angle, double leftPoint, double topMargin)
        {
            ((CompositeTransform)grdSubWindow.RenderTransform).Rotation = angle;
            pthSubWindowPoint.Margin = new Thickness(leftPoint, 0, 0, -20);
            grdSubWindow.Margin = new Thickness(0, topMargin, 0, 80);
            sbShowSubWindow.Begin();
        }
    }
}
