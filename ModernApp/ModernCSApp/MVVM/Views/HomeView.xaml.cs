
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

    public sealed partial class HomeView : BaseUserPage
    {

        public HomeViewModel _vm { get; set; }
        public FlickrViewModel _fvm { get; set; }


        private bool _drawLine = false;
        private Windows.Foundation.Point _lineStartPoint;
        private Windows.Foundation.Point _lineEndPoint;

        private string _actionToDo = string.Empty;

        public HomeView()
        {
            this.InitializeComponent();

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

            

            try
            {
                
                //Messenger.Default.Register<GeneralSystemWideMessage>(this, DoGeneralSystemWideMessageCallback);

                
            }
            catch { }


            GestureService.OnGestureRaised += (o, a) => {
                CustomGestureArgs gestureArgs = (CustomGestureArgs)a;
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
                        drawLine(_lineStartPoint, _lineEndPoint);
                    }
                }
                else if (gestureArgs.ReleasedPointerRoutedEventArgs != null)
                {
                    if (_drawLine)
                    {
                        _drawLine = false;
                        drawLine(_lineStartPoint, _lineStartPoint);
                        performAction(_actionToDo);
                    }
                }
            };

            //AppDatabase.Current.DeleteProjects(SessionID);


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

            sbLoadView.Completed += (obj, ea) =>
            {

                State.DrawingSurfaceWidth = ccDrawingSurfaceBottom.ActualWidth;
                State.DrawingSurfaceHeight = ccDrawingSurfaceBottom.ActualHeight;

                layoutRoot.Background = new SolidColorBrush(Colors.White);

                RenderingService.Init(State);

                ccDrawingSurfaceBottom.Content = RenderingService.BackgroundSIS;
                ccDrawingSurfaceTop.Content = RenderingService.MagicSIS;


                RenderingService.Start();

                GestureService.Start(this);


                if (_fvm.IsFlickrLoginDetailsCached())
                {
                    _fvm.ViewInit();
                    _fvm.ChangeState += _fvm_ChangeState;
                    _fvm.GetLoggedInUserDetails(_fvm.AccessToken.UserId);
                }


            };
            sbLoadView.Begin();


            try
            {

                SettingsPane.GetForCurrentView().CommandsRequested += _vm.onCommandsRequested;
                //SearchPane.GetForCurrentView().QuerySubmitted += _vm.onQuerySubmitted;
                
            }
            catch { }
        }

        void _fvm_ChangeState(object sender, EventArgs e)
        {
            string state = (string)sender;

            switch (state)
            {
                case "UserInfoRetrieved":
                    flickrLoggedInUser.DataContext = _fvm.FlickrPerson;
                    if(_fvm.FlickrPerson!=null 
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
            }
        }



        protected override void OnNavigatedFrom(NavigationEventArgs e)
        {
            base.OnNavigatedFrom(e);

            SettingsPane.GetForCurrentView().CommandsRequested -= _vm.onCommandsRequested;
            //SearchPane.GetForCurrentView().QuerySubmitted -= _vm.onQuerySubmitted;

            RenderingService.Stop();
            GestureService.Stop(this);

            _fvm.ChangeState -= _fvm_ChangeState;
            DownloadService.Current.DownloadCountChanged -= Current_DownloadCountChanged;
        }


        public override void Unload()
        {
            base.Unload();

            //Messenger.Default.Unregister<GeneralSystemWideMessage>(this, DoGeneralSystemWideMessageCallback);

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

        private void drawLine(Windows.Foundation.Point startPoint, Windows.Foundation.Point endPoint)
        {
            if (_drawLine)
            {
                lineMain1.X1 = startPoint.X;
                lineMain1.Y1 = startPoint.Y;
                lineMain1.X2 = endPoint.X;
                lineMain1.Y2 = endPoint.Y;
                lineMain1.Visibility = Windows.UI.Xaml.Visibility.Visible;
            }
            else
            {
                lineMain1.Visibility = Windows.UI.Xaml.Visibility.Collapsed;
            }

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
                    _actionToDo = "ExpandPictureToolbar";
                    flickrPictureToolbar.SetValue(Canvas.ZIndexProperty, 10);
                    _drawLine = true;
                    _lineStartPoint = e.GetCurrentPoint(null).Position;
                    drawLine(_lineStartPoint, _lineStartPoint);
                    break;

                case "AddFavourite":

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
                    _actionToDo = "ExpandUserStreamTitle";
                    _drawLine = true;
                    _lineStartPoint = e.GetCurrentPoint(null).Position;
                    drawLine(_lineStartPoint, _lineStartPoint);
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

        private void flickrListOfPics_ChangeViewState(object sender, EventArgs e)
        {
            switch ((string)sender)
            {
                case "Minimized":
                    sbHidePicturesList.Begin();
                    break;
                case "Normal":
                    sbShowPicturesList.Begin();
                    sbHidePicture.Begin();
                    sbHidePictureDetails.Begin();
                    sbHidePictureExifInfo.Begin();

                    flickrPictureDetails.ClearAll();
                    ResetPictureToolbar();
                    break;
                case "Maximized": break;

            }
        }
    }
}
