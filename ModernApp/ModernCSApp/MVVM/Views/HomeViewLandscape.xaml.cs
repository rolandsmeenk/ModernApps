
using ModernCSApp.Services;
using ModernCSApp.Views.Controls;
using GalaSoft.MvvmLight.Messaging;
using SharpDX;
using SharpDX.Direct3D11;
using SharpDX.Toolkit.Graphics;
using SumoNinjaMonkey.Framework.Controls;
using SumoNinjaMonkey.Framework.Controls.DrawingSurface;
using SumoNinjaMonkey.Framework.Controls.Innertia;
using SumoNinjaMonkey.Framework.Controls.Messages;
using SumoNinjaMonkey.Framework.Services;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Storage;
using Windows.UI;
using Windows.UI.Input;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Media.Animation;
using Windows.UI.Xaml.Navigation;
using ModernCSApp.Models;
using Windows.UI.ApplicationSettings;
using System.Threading.Tasks;
using Windows.ApplicationModel.Search;


namespace ModernCSApp.Views
{

    public sealed partial class HomeViewLandscape : ModernCSBasePage
    {

        public HomeViewModel _vm { get; set; }
        public FlickrViewModel _fvm { get; set; }



        public HomeViewLandscape()
        {
            this.InitializeComponent();

        }

        

        async void Current_DownloadCountChanged(object sender, EventArgs e)
        {
            int count = (int)sender;


            await Dispatcher.RunAsync(
                        Windows.UI.Core.CoreDispatcherPriority.High,
                        new Windows.UI.Core.DispatchedHandler(() =>
                        {
                            if (count > 0) { spLoading.Visibility = Visibility.Visible; pbMainLoading.IsActive = true; }
                            else { pbMainLoading.IsActive = false; spLoading.Visibility = Visibility.Collapsed; }
                        })
                    );

        }





        protected async override void OnNavigatedTo(NavigationEventArgs e)
        {
            PopupService.Init(layoutRoot);

            DownloadService.Current.DownloadCountChanged += Current_DownloadCountChanged;

            layoutRoot.Background = new SolidColorBrush(Colors.Black);

            LoggingService.LogInformation("Showing splash screeen", "Views.HomeView");

            _vm = new HomeViewModel();
            _vm.Load();
            this.DataContext = _vm;

            _fvm = new FlickrViewModel(Dispatcher);
            pbMainLoading.DataContext = _fvm;


            //_vm.ShowLoginCommand.Execute(null);

            Messenger.Default.Register<GeneralSystemWideMessage>(this, DoGeneralSystemWideMessageCallback);

            GestureService.OnGestureRaised += GestureService_OnGestureRaised;

            //AppDatabase.Current.DeleteProjects(SessionID);



            State.DrawingSurfaceWidth = Window.Current.Bounds.Width; // ccDrawingSurfaceBottom.ActualWidth;
            State.DrawingSurfaceHeight = Window.Current.Bounds.Height; //ccDrawingSurfaceBottom.ActualHeight;
            State.DefaultBackgroundUri = "\\Assets\\StartDemo\\Backgrounds\\green1.jpg";
            State.DefaultBackgroundFolder = string.Empty;


            flickrLoggedInUser.LogoutRequested += (obj, ea) => {
                
                _fvm.RequestLogout();
            };

            RenderingService.Init(State);



            sbLoadView.Completed += (obj, ea) =>
            {
                layoutRoot.Background = new SolidColorBrush(Colors.White);

                ccDrawingSurfaceBottom.Content = RenderingService.BackgroundSIS;
                ccDrawingSurfaceTop.Content = RenderingService.MagicSIS;
                RenderingService.Start();

                GestureService.Start(this);

                if (_fvm.IsFlickrLoginDetailsCached())
                {
                    _fvm.ViewInit();
                    _fvm.ChangeState += _fvm_ChangeState;
                    _fvm.GetLoggedInUserDetails(_fvm.AccessToken.UserId);

                    //RenderingService.BackgroundRenderer.ChangeBackground("\\Assets\\StartDemo\\Backgrounds\\green1.jpg", string.Empty);

                }


            };
            sbLoadView.Begin();



            SettingsPane.GetForCurrentView().CommandsRequested += _vm.onCommandsRequested;
            //SearchPane.GetForCurrentView().QuerySubmitted += _vm.onQuerySubmitted;

            //NotifyGCTotalMemory();
        }

        void GestureService_OnGestureRaised(object sender, EventArgs e)
        {
            CustomGestureArgs gestureArgs = (CustomGestureArgs)e;
            //NumberFramesToRender += 3;
            if (gestureArgs.ManipulationStartedArgs != null)
            {
            }
            else if (gestureArgs.ManipulationInertiaStartingArgs != null)
            {
            }
            else if (gestureArgs.ManipulationUpdatedArgs != null)
            {
            }
            else if (gestureArgs.ManipulationCompletedArgs != null)
            {
            }
            else if (gestureArgs.TappedEventArgs != null)
            {
            }
            else if (gestureArgs.PressedPointerRoutedEventArgs != null)
            {

            }
            else if (gestureArgs.MovedPointerRoutedEventArgs != null)
            {
                if (_drawLine)
                {
                    _lineEndPoint = gestureArgs.MovedPointerRoutedEventArgs.GetCurrentPoint(null).Position;
                    drawLine(_lineStartPoint, _lineEndPoint, ref lineMain1);
                }
            }
            else if (gestureArgs.ReleasedPointerRoutedEventArgs != null)
            {
                if (_drawLine)
                {
                    _drawLine = false;
                    drawLine(_lineStartPoint, _lineStartPoint, ref lineMain1);
                    performAction(_actionToDoOnRelease);
                }
            }
        }

        void _fvm_ChangeState(object sender, EventArgs e)
        {
            string state = (string)sender;

            switch (state)
            {
                case "UserInfoRetrieved":
                    flickrLoggedInUser.DataContext = _fvm.FlickrPerson;
                    if (_fvm.FlickrPerson != null
                        && !string.IsNullOrEmpty(_fvm.FlickrPerson.BuddyIconUrl)
                        && _fvm.FlickrPerson.BuddyIconUrl != _fvm.BuddyIconUrl)
                        Services.AppDatabase.Current.AddAppState("fp.BuddyIconUrl", _fvm.FlickrPerson.BuddyIconUrl);
                    flickrLoggedInUser.Visibility = Visibility.Visible;
                    break;
                case "UserPublicPhotosRetrieved":
                    flickrListOfPics.LoadPictures(_fvm.FlickrPersonPhotos, "Your Favourites");
                    flickrListOfPics.Visibility = Visibility.Visible;
                    break;
                case "PhotoInfoRetrieved":
                    flickrPictureDetails.LoadPicture(_fvm.SelectedPhotoInfo);
                    break;
                case "PhotoStreamPhotosRetrieved":
                    flickrPictureDetails.LoadPhotoStream(_fvm.FlickrPhotoStreamPhotos);
                    break;
                case "PhotoExifRetrieved":
                    flickrPictureExif.LoadInfo(_fvm.SelectedPhoto, _fvm.SelectedExifInfo);
                    break;
                case "PhotoFavourited":
                    CustomEventArgs arg1 = (CustomEventArgs)e;
                    SendInformationNotification("Favourite Added", 3, arg1.Photo.ThumbnailUrl);
                    _fvm.GetLoggedInFavourites(_fvm.FlickrPerson.UserId);
                    break;
                case "PhotoPromoted":
                    CustomEventArgs arg2 = (CustomEventArgs)e;
                    SendInformationNotification("Photo Promoted", 3, arg2.Photo.ThumbnailUrl);
                    break;
                case "PhotoCommentsRetrieved":
                    flickrPictureDetails.LoadComments(_fvm.SelectedPhotoComments);
                    break;

                case "AuthorPublicPhotosRetrieved":

                    flickrListOfPics.LoadPictures(_fvm.FlickrPersonPhotos, _fvm.SelectedPhoto.OwnerName + " Favourites");
                    flickrListOfPics.Visibility = Visibility.Visible;
                    ShowPicturesList();
                    break;
                case "LogoutComplete":

                    NavigationService.NavigateOnUI("FlickrLoginView");

                    break;
            }
        }



        protected override void OnNavigatedFrom(NavigationEventArgs e)
        {
            UnloadBase();
            _cleanUpAll();
            base.OnNavigatedFrom(e);
        }

        public override void Unload()
        {
            base.Unload();

            _cleanUpAll();
        }


        private void _cleanUpAll()
        {
            pbMainLoading.IsActive = false;

            ccDrawingSurfaceBottom.Content = null;
            ccDrawingSurfaceTop.Content = null;

            RenderingService.Unload();

            GestureService.Stop(this);

            SettingsPane.GetForCurrentView().CommandsRequested -= _vm.onCommandsRequested;
            GestureService.OnGestureRaised -= GestureService_OnGestureRaised;
            //SearchPane.GetForCurrentView().QuerySubmitted -= _vm.onQuerySubmitted;

            
            flickrListOfPics.UnloadControl();
            flickrLoggedInUser.UnloadControl();
            flickrPicture.UnloadControl();
            flickrPictureDetails.UnloadControl();
            //imgBackground.UnloadControl();
            flickrPictureExif.UnloadControl();
            flickrPictureToolbar.UnloadControl();



            _fvm.ChangeState -= _fvm_ChangeState;
            DownloadService.Current.DownloadCountChanged -= Current_DownloadCountChanged;

            Messenger.Default.Unregister<GeneralSystemWideMessage>(this, DoGeneralSystemWideMessageCallback);

            _fvm.Unload();

            _vm = null;
            _fvm = null;
        }

        private void layoutRoot_Loaded(object sender, RoutedEventArgs e)
        {

        }



        private void flickrListOfPics_PictureChanged(object sender, EventArgs e)
        {
            var p = (FlickrNet.Photo)sender;

            flickrPicture.LoadPicture(p);
            _fvm.GetPhotoInfo(p);
            _fvm.GetPhotoStream(p.UserId);

        }

        private void flickrPictureDetails_PictureChanged(object sender, EventArgs e)
        {
            var p = (FlickrNet.Photo)sender;

            flickrPicture.LoadPicture(p);
            _fvm.GetPhotoInfo(p);
            //_fvm.GetPhotoStream(p.UserId);

            sbQuickLoadPicture.Begin();
            ResetPictureToolbar();
        }




        private void ResetPictureToolbar()
        {
            flickrPictureToolbar.SetValue(Canvas.ZIndexProperty, 5);
            flickrPictureToolbar.UnloadToolbar();
        }

        private void performAction(string action)
        {
            var diffPtX = _lineEndPoint.X - _lineStartPoint.X;
            var diffPtY = _lineStartPoint.Y - _lineEndPoint.Y;

            switch (action)
            {
                case "ExpandPictureToolbar":

                    if (Math.Abs(diffPtX) > 50 || Math.Abs(diffPtY) > 50)
                    {
                        if (Math.Abs(diffPtX) > Math.Abs(diffPtY))
                        {
                            flickrPictureToolbar.LoadToolbar(Orientation.Horizontal);
                        }
                        else
                        {
                            flickrPictureToolbar.LoadToolbar(Orientation.Vertical);
                        }
                    }
                    else
                    {
                        ResetPictureToolbar();
                    }

                    break;
                case "ExpandUserStreamTitle":

                    if (Math.Abs(diffPtY) > 50)
                    {
                        if (diffPtY > 0)
                        {
                            flickrPictureDetails.MaximizeUserPictureStream();
                        }
                        else
                        {
                            flickrPictureDetails.MinimizeUserPictureStream();
                        }
                    }

                    break;

                case "ExpandListOfPicsTitle":

                    if (Math.Abs(diffPtY) > 50)
                    {
                        if (diffPtY > 0)
                        {
                            flickrListOfPics.Height = 550;
                        }
                        else
                        {
                            flickrListOfPics.Height = 320;

                        }
                    }

                    break;
            }
        }





        private void flickrPictureExif_ChangeViewState(object sender, EventArgs e)
        {
            switch ((string)sender)
            {
                case "Normal":
                    sbShowPictureExifInfo.Begin();
                    break;
                case "Minimized":
                    sbHidePictureExifInfo.Begin();
                    break;
            }
        }

        private void flickrPictureToolbar_ChangeViewState(object sender, PointerRoutedEventArgs e)
        {
            switch ((string)sender)
            {
                case "StartExpandToolbar":
                    _actionToDoOnRelease = "ExpandPictureToolbar";
                    flickrPictureToolbar.SetValue(Canvas.ZIndexProperty, 10);
                    _drawLine = true;
                    _lineStartPoint = e.GetCurrentPoint(null).Position;
                    drawLine(_lineStartPoint, _lineStartPoint, ref lineMain1);
                    break;

                case "AddFavourite":
                    MessageBox("Continue to Favourite this Photo?", "Yes", "YesFavourite", "HomeView", "No", "NoFavourite", "HomeView", imageIcon: _fvm.SelectedPhoto.SmallUrl);
                    break;
                case "PromoteIt":
                    MessageBox("Continue to Promote this Photo?", "Yes", "YesPromote", "HomeView", "No", "NoPromote", "HomeView", imageIcon: _fvm.SelectedPhoto.SmallUrl);
                    break;
                case "SendPicture": break;
                case "CreateBillboard": break;
                case "RetrieveExif":
                    _fvm.GetPhotoExif(_fvm.SelectedPhoto);
                    break;
                case "AddNote": break;
            }
        }

        private void flickrPictureDetails_ChangeViewState(object sender, PointerRoutedEventArgs e)
        {
            switch ((string)sender)
            {
                case "Minimized":
                    sbHidePictureDetails.Begin();
                    break;
                case "Normal":
                    sbShowPictureDetails.Begin();
                    break;
                case "Maximized": break;
                case "StartExpandUserStreamTitle":
                    _actionToDoOnRelease = "ExpandUserStreamTitle";
                    _drawLine = true;
                    _lineStartPoint = e.GetCurrentPoint(null).Position;
                    drawLine(_lineStartPoint, _lineStartPoint, ref lineMain1);
                    break;
                case "RequestShowComments":
                    _fvm.GetPhotoComments(_fvm.SelectedPhoto);
                    break;
            }
        }

        private void flickrPicture_ChangeViewState(object sender, EventArgs e)
        {
            switch ((string)sender)
            {
                case "Minimized":
                    sbHidePicture.Begin();
                    break;
                case "Normal":
                    sbShowPicture.Begin();
                    sbHidePictureExifInfo.Begin();
                    break;
                case "Maximized": break;
            }

        }

        private void flickrListOfPics_ChangeViewState(object sender, PointerRoutedEventArgs e)
        {
            switch ((string)sender)
            {
                case "Minimized":

                    sbHidePicturesList.Begin();
                    break;
                case "Normal":
                    ShowPicturesList();
                    break;
                case "Maximized": break;
                case "StartExpandListOfPicsTitle":
                    _actionToDoOnRelease = "ExpandListOfPicsTitle";
                    _drawLine = true;
                    _lineStartPoint = e.GetCurrentPoint(null).Position;
                    drawLine(_lineStartPoint, _lineStartPoint, ref lineMain1);
                    break;

            }
        }

        private void ShowPicturesList()
        {
            sbShowPicturesList.Begin();
            sbHidePicture.Begin();
            sbHidePictureDetails.Begin();
            sbHidePictureExifInfo.Begin();

            flickrPictureDetails.ClearAll();
            ResetPictureToolbar();

            flickrPictureDetails.Opacity = 1;

            var gsv = FindVisualChild<ScrollViewer>(flickrListOfPics);
            gsv.ScrollToHorizontalOffset(0);
            gsv.Focus(Windows.UI.Xaml.FocusState.Pointer);
        }



        private void DoGeneralSystemWideMessageCallback(GeneralSystemWideMessage message)
        {
            if (message.Identifier != "HomeView") return;

            switch (message.Action)
            {
                case "YesPromote":
                    _fvm.PromotePhoto(_fvm.SelectedPhoto, _fvm.SelectedPhotoInfo, _fvm.BuddyIconUrl);
                    MsgBoxService.Hide();
                    break;
                case "NoPromote":
                    MsgBoxService.Hide();
                    break;

                case "YesFavourite":
                    _fvm.FavouritePhoto(_fvm.SelectedPhoto, _fvm.SelectedPhotoInfo, _fvm.BuddyIconUrl);
                    MsgBoxService.Hide();
                    break;
                case "NoFavourite":
                    MsgBoxService.Hide();
                    break;

                case "ShowCommentUserPhotos":
                    _fvm.GetLoggedInFavourites(message.Content);
                    break;

                case "YesLoadAuthor":
                    MsgBoxService.Hide();
                    _fvm.GetAuthorFavourites(message.Content);

                    break;
                case "NoLoadAuthor":
                    MsgBoxService.Hide();
                    break;
            }
        }
    }
}
