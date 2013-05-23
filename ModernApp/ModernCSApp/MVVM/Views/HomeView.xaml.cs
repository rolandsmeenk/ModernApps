
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
        //private CommonDX.DeviceManager deviceManager;
        //private IRenderer renderer;
        //private SumoNinjaMonkey.Framework.Controls.DrawingSurfaceSIS dsSIS;

        public HomeViewModel _vm { get; set; }
        public FlickrViewModel _fvm { get; set; }

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

                ccDrawingSurfaceBottom.Content = RenderingService.DrawingSIS;
                //ccDrawingSurfaceTop.Content = RenderingService.DrawingSIS;


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
        }


        public override void Unload()
        {
            base.Unload();

            //Messenger.Default.Unregister<GeneralSystemWideMessage>(this, DoGeneralSystemWideMessageCallback);

        }


        private void layoutRoot_Loaded(object sender, RoutedEventArgs e)
        {
            
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
                    flickrPictureDetails.ClearAll();
                    break;
                case "Maximized": break;
                
            }
        }

        private void flickrListOfPics_PictureChanged(object sender, EventArgs e)
        {
            var p = (FlickrNet.Photo)sender;

            flickrPicture.LoadPicture(p);
            _fvm.GetPhotoInfo(p);
            _fvm.GetPhotoStream(p.UserId);

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
                    break;
                case "Maximized": break;
            }
            
        }

        private void flickrPictureDetails_ChangeViewState(object sender, EventArgs e)
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
            }
        }

        private void flickrPictureDetails_PictureChanged(object sender, EventArgs e)
        {
            var p = (FlickrNet.Photo)sender;

            flickrPicture.LoadPicture(p);
            _fvm.GetPhotoInfo(p);
            //_fvm.GetPhotoStream(p.UserId);

            sbQuickLoadPicture.Begin();
        }


    }
}
