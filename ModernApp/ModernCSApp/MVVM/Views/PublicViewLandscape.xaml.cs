
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

    public sealed partial class PublicViewLandscape : ModernCSBasePage
    {
        public HomeViewModel _vm { get; set; }
        public FlickrViewModel _fvm { get; set; }



        public PublicViewLandscape()
        {
            this.InitializeComponent();

            
            
        }



        protected async override void OnNavigatedTo(NavigationEventArgs e)
        {
            LoggingService.LogInformation("Public View OnNavigatedTo", "Views.PublicView");


            PopupService.Init(layoutRoot);
            DownloadService.Current.DownloadCountChanged += Current_DownloadCountChanged;


            _vm = new HomeViewModel();
            _vm.Load();
            this.DataContext = _vm;

            _fvm = new FlickrViewModel(Dispatcher);
            pbMainLoading.DataContext = _fvm;
            
            
            GestureService.OnGestureRaised += GestureService_OnGestureRaised;

            layoutRoot.Background = new SolidColorBrush(Colors.Black);


            State.DrawingSurfaceWidth = Window.Current.Bounds.Width; 
            State.DrawingSurfaceHeight = Window.Current.Bounds.Height;  
            State.DefaultBackgroundUri = "\\Assets\\StartDemo\\Backgrounds\\yellow4.jpg";
            State.DefaultBackgroundFolder = string.Empty;


            flickrLoggedInUser.LogoutRequested += flickrLoggedInUser_LogoutRequested;

            RenderingService.Init(State);



            sbLoadView.Completed += (obj, ea) =>
            {
    
                layoutRoot.Background = new SolidColorBrush(Colors.White);

                ccDrawingSurfaceBottom.Content = RenderingService.BackgroundSIS;
                //ccDrawingSurfaceTop.Content = RenderingService.MagicSIS;
                
                
                RenderingService.Start();

                GestureService.Start(this);

                if (_fvm.IsFlickrLoginDetailsCached())
                {
                    _fvm.ViewInit();
                    _fvm.ChangeState += _fvm_ChangeState;
                    _fvm.GetLoggedInUserDetailsTight(_fvm.AccessToken.UserId);

                }

                
            };

            
            sbLoadView.Begin();

            await _fvm.GetPublicFavouritesAsync();

            await _fvm.GetPublicPromotedAsync();

            SettingsPane.GetForCurrentView().CommandsRequested += _vm.onCommandsRequested;
            //SearchPane.GetForCurrentView().QuerySubmitted += _vm.onQuerySubmitted;

            //NotifyGCTotalMemory();
        }

        void flickrLoggedInUser_LogoutRequested(object sender, EventArgs e)
        {
            _fvm.RequestLogout();
        }

        void _fvm_ChangeState(object sender, EventArgs e)
        {
            string state = (string)sender;

            switch (state)
            {
                case "PublicFavouritesRetrieved":
                    flckrPublicFavourites.LoadPictures(_fvm.PublicFavourites, "Favourites");
                    break;
                case "PublicPromotedRetrieved":
                    flckrPromoted.LoadPictures(_fvm.PublicPromoted, "Promoted");
                    break;
                case "UserInfoRetrieved":
                    flickrLoggedInUser.DataContext = _fvm.FlickrPerson;
                    if (_fvm.FlickrPerson != null
                        && !string.IsNullOrEmpty(_fvm.FlickrPerson.BuddyIconUrl)
                        && _fvm.FlickrPerson.BuddyIconUrl != _fvm.BuddyIconUrl)
                        Services.AppDatabase.Current.AddAppState("fp.BuddyIconUrl", _fvm.FlickrPerson.BuddyIconUrl);
                    flickrLoggedInUser.Visibility = Visibility.Visible;
                    break;
                default: break;
            }

        }


        protected override void OnNavigatedFrom(NavigationEventArgs e)
        {
            UnloadBase();


            _cleanUpAll();
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

        private void _cleanUpAll()
        {
            pbMainLoading.IsActive = false;

            RenderingService.Stop();

            ccDrawingSurfaceBottom.Content = null;
            ccDrawingSurfaceTop.Content = null;

            RenderingService.Unload();

            GestureService.Stop(this);


            SettingsPane.GetForCurrentView().CommandsRequested -= _vm.onCommandsRequested;
            GestureService.OnGestureRaised -= GestureService_OnGestureRaised;
            //SearchPane.GetForCurrentView().QuerySubmitted -= _vm.onQuerySubmitted;

            flickrLoggedInUser.LogoutRequested -= flickrLoggedInUser_LogoutRequested;
            flickrLoggedInUser.UnloadControl();
            


            
            

            _fvm.ChangeState -= _fvm_ChangeState;
            DownloadService.Current.DownloadCountChanged -= Current_DownloadCountChanged;

            //Messenger.Default.Unregister<GeneralSystemWideMessage>(this, DoGeneralSystemWideMessageCallback);


            _fvm.Unload();

            _vm = null;
            _fvm = null;
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
                    performAction(_actionToDo);
                }
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
                            //flickrPictureToolbar.LoadToolbar(Orientation.Horizontal);
                        }
                        else
                        {
                            //flickrPictureToolbar.LoadToolbar(Orientation.Vertical);
                        }
                    }
                    else
                    {
                        //ResetPictureToolbar();
                    }

                    break;
                case "ExpandUserStreamTitle":

                    if (Math.Abs(diffPtY) > 50)
                    {
                        if (diffPtY > 0)
                        {
                            //flickrPictureDetails.MaximizeUserPictureStream();
                        }
                        else
                        {
                            //flickrPictureDetails.MinimizeUserPictureStream();
                        }
                    }

                    break;

                case "ExpandListOfPicsTitle":

                    if (Math.Abs(diffPtY) > 50)
                    {
                        if (diffPtY > 0)
                        {
                            //flickrListOfPics.Height = 550;
                        }
                        else
                        {
                            //flickrListOfPics.Height = 320;

                        }
                    }

                    break;
            }
        }


    }
}
