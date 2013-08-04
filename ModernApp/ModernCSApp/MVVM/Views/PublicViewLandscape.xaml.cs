
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
using ModernCSApp.Views.Controls.Flickr;


namespace ModernCSApp.Views
{

    public sealed partial class PublicViewLandscape : PublicViewBasePage
    {
        private string _statefulFavouriteUser;
        private string _lastFavouriteUserIdRetrieved;
        private string _lastFavTypeRetrieved;
        private Favourite _selectedFav;
        

        public PublicViewLandscape()
        {
            this.InitializeComponent();

            
            
        }



        protected async override void OnNavigatedTo(NavigationEventArgs e)
        {
            OnNavigateToBase(Dispatcher);

            LoggingService.LogInformation("Public View OnNavigatedTo", "Views.PublicView");


            PopupService.Init(layoutRoot);
            DownloadService.Current.DownloadCountChanged += Current_DownloadCountChanged;


            //_vm = new HomeViewModel();
            //_vm.Load();
            this.DataContext = _vm;

            //_fvm = new FlickrViewModel(Dispatcher);
            pbMainLoading.DataContext = _fvm;

            //Messenger.Default.Register<GeneralSystemWideMessage>(this, DoGeneralSystemWideMessageCallback);
            
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
                ccDrawingSurfaceTop.Content = RenderingService.MagicSIS;
                
                
                RenderingService.Start();

                GestureService.Start(this);

                _fvm.ChangeState += _fvm_ChangeState;

                if (_fvm.IsFlickrLoginDetailsCached())
                {
                    _fvm.ViewInit();
                    //_fvm.ChangeState += _fvm_ChangeState;
                    _fvm.GetLoggedInUserDetailsTight(_fvm.AccessToken.UserId);

                }
                //flickrPictureToolbar.ChangeViewTo(PictureToolbar.ViewType.Exif);
                sbLoadView.Stop();
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
                    flickrPublicFavourites.LoadPictures(_fvm.PublicFavourites, "Public Favourites");
                    break;
                case "PublicPromotedRetrieved":
                    flickrPromoted.LoadPictures(_fvm.PublicPromoted, "Public Promoted");
                    break;
                case "UserInfoRetrieved":
                    flickrLoggedInUser.DataContext = _fvm.FlickrPerson;
                    if (_fvm.FlickrPerson != null
                        && !string.IsNullOrEmpty(_fvm.FlickrPerson.BuddyIconUrl)
                        && _fvm.FlickrPerson.BuddyIconUrl != _fvm.BuddyIconUrl)
                        Services.AppDatabase.Current.AddAppState("fp.BuddyIconUrl", _fvm.FlickrPerson.BuddyIconUrl);
                    flickrLoggedInUser.Visibility = Visibility.Visible;
                    break;
                case "FavouritePhotosRetrieved":
                    flickrPicture_ChangeViewState("Minimized", null);
                    flickrSmallList.LoadPictures(_fvm.FavouritePhotos, _statefulFavouriteUser);
                    //flickrSmallList.Visibility = Visibility.Visible;
                    sbShowSmallPicturesList.Begin();
                    break;
                case "PhotoFavourited":
                    CustomEventArgs arg1 = (CustomEventArgs)e;
                    SendInformationNotification("Favourite Added", 3, arg1.Photo.ThumbnailUrl);
                    //_fvm.GetLoggedInFavourites(_fvm.FlickrPerson.UserId);
                    break;
                
                default: break;
            }

        }

        

        private async void flickrListOfPics_PictureChanged(object sender, EventArgs e)
        {

            if (sender is string) {
                _selectedFav = Deserialize<Favourite>(sender as string);


                await flickrPicture.LoadPicture(_selectedFav, _fvm.FlickrPerson!=null? _fvm.FlickrPerson.UserId:null);

                if (_fvm.FlickrPerson != null)
                {
                    if (_selectedFav.UserAvatar.Contains(_fvm.FlickrPerson.UserId))
                    {
                        flickrPictureToolbar.ChangeViewTo(PictureToolbar.ViewType.PhotographerFavs | PictureToolbar.ViewType.UserFavs);
                    }
                    else
                    {
                        flickrPictureToolbar.ChangeViewTo(PictureToolbar.ViewType.PhotographerFavs | PictureToolbar.ViewType.UserFavs | PictureToolbar.ViewType.Fav);
                    }
                }
                
                //_fvm.GetPhotoInfo(p);
                //_fvm.GetPhotoStream(p.UserId);

            }
            
        }

        private async void flickrSmallList_PictureChanged(object sender, EventArgs e)
        {
            if (sender is string)
            {
                
                var selectedPhoto = Deserialize<FlickrNet.Photo>(sender as string);
                _fvm.SelectedPhoto = selectedPhoto;
                
                var newSelectedFav = _fvm.ConvertPhotoToFavourite(selectedPhoto, new FlickrNet.PhotoInfo(), "");
                if (_lastFavTypeRetrieved == "UserFavs")
                {
                    newSelectedFav.UserAvatar = _selectedFav.UserAvatar;
                }
                else if (_lastFavTypeRetrieved == "PhotographerFavs")
                {
                    newSelectedFav.MediaUserAvatar = _selectedFav.MediaUserAvatar;
                }
                _selectedFav = newSelectedFav;

                //DOWNLOAD ACTUAL IMAGE INTO PICTURES LIBRARY
                //todo: need to work out the best way to save and load these pics
                await DownloadService.Current.Downloader("1", _selectedFav.MediaUrlMedium, string.Empty, _selectedFav.AggregateId.Replace("-", ""), 2, storageFolder: "ModernCSApp");

                flickrPicture_ChangeViewState("Minimized", null);


                await flickrPicture.LoadPicture(_selectedFav, _fvm.FlickrPerson != null ? _fvm.FlickrPerson.UserId : null);
                

                sbHideSmallPicturesList.Begin();

                if (_fvm.FlickrPerson != null)
                {
                    if (_selectedFav.UserAvatar.Contains(_fvm.FlickrPerson.UserId))
                    {
                        flickrPictureToolbar.ChangeViewTo(PictureToolbar.ViewType.PhotographerFavs | PictureToolbar.ViewType.UserFavs);
                    }
                    else
                    {
                        flickrPictureToolbar.ChangeViewTo(PictureToolbar.ViewType.PhotographerFavs | PictureToolbar.ViewType.UserFavs | PictureToolbar.ViewType.Fav);
                    }
                }

                _fvm.GetPhotoInfo(selectedPhoto);
                
            }
        }


        private void flickrListOfPics_ChangeViewState(string action, Windows.Foundation.Point? point)
        {
            switch (action)
            {
                case "Minimized":

                    sbHidePicturesList.Begin();
                    flickrPromoted.ManuallyChangeViewState("Minimized");
                    flickrPublicFavourites.ManuallyChangeViewState("Minimized");
                    break;
                case "Normal":
                    ShowPicturesList();
                    break;
                case "Maximized": break;
                case "StartExpandListOfPicsTitle":
                    //_actionToDoOnRelease = "ExpandListOfPicsTitle";
                    //_drawLine = true;
                    //_lineStartPoint = e.GetCurrentPoint(null).Position;
                    //drawLine(_lineStartPoint, _lineStartPoint, ref lineMain1);
                    break;

            }
        }

        private void flickrSmallList_ChangeViewState(string action, Windows.Foundation.Point? point)
        {

        }


        private void flickrPicture_ChangeViewState(string action, Windows.Foundation.Point? point)
        {
            switch (action)
            {
                case "Minimized":
                    sbHidePicture.Begin();
                    sbHidePictureDetails.Begin();
                    break;
                case "Normal":
                    sbShowPicture.Begin();
                    if (_fvm.IsFlickrLoginDetailsCached())
                    {
                        sbShowPictureDetails.Begin();
                    }   
                    break;
                case "Maximized": break;
            }

        }

        private void flickrPictureToolbar_ChangeViewState(string action, Windows.Foundation.Point? point)
        {
            switch (action)
            {
                case "StartExpandToolbar":
                    _actionToDoOnRelease = "ExpandPictureToolbar";
                    flickrPictureToolbar.SetValue(Canvas.ZIndexProperty, 10);
                    _drawLine = true;
                    _lineStartPoint = point;
                    drawLine(_lineStartPoint, _lineStartPoint, ref lineMain1);
                    break;

                case "AddFavourite":
                    MessageBox("Continue to Favourite this Photo?", "Yes", "YesFavourite", "PublicView", "No", "NoFavourite", "PublicView", imageIcon: _selectedFav.MediaUrlSmall);
                    break;
                case "PromoteIt":
                    MessageBox("Continue to Promote this Photo?", "Yes", "YesPromote", "PublicView", "No", "NoPromote", "PublicView", imageIcon: _selectedFav.MediaUrlSmall);
                    break;
                //case "SendPicture": break;
                //case "CreateBillboard": break;
                //case "RetrieveExif":
                //    _fvm.GetPhotoExif(_fvm.SelectedPhoto);
                //    break;
                //case "AddNote": break;
                case "ShowUserFavs":
                    var parts = _selectedFav.UserAvatar.Split("/".ToCharArray());
                    var name = parts[parts.Length - 1];
                    name = name.Replace(".jpg", "");
                    _lastFavTypeRetrieved = "UserFavs";
                    if (_lastFavouriteUserIdRetrieved != name)
                    {
                        _statefulFavouriteUser = _selectedFav.UserName + "'s Favourites";
                        _lastFavouriteUserIdRetrieved = name;
                        _fvm.GetFavourites(name);
                    }
                    else
                    {
                        sbShowSmallPicturesList.Begin();
                    }
                    break;
                case "ShowPhotographerFavs":
                    var parts2 = _selectedFav.MediaUserAvatar.Split("/".ToCharArray());
                    var name2 = parts2[parts2.Length - 1];
                    name2 = name2.Replace(".jpg", "");
                    _lastFavTypeRetrieved = "PhotographerFavs";
                    if (_lastFavouriteUserIdRetrieved != name2){
                        _statefulFavouriteUser = _selectedFav.MediaUserName + "'s Favourites";
                        _lastFavouriteUserIdRetrieved = name2;
                        _fvm.GetFavourites(name2);
                    }
                    else
                    {
                        sbShowSmallPicturesList.Begin();
                    }
                    break;
            }
        }

        private void ShowPicturesList()
        {
            sbShowPicturesList.Begin();
            
            flickrPromoted.ManuallyChangeViewState("Normal");
            flickrPublicFavourites.ManuallyChangeViewState("Normal");
            //flickrSmallList.Visibility = Visibility.Collapsed;
            sbHideSmallPicturesList.Begin();


            sbHidePicture.Begin();
            sbHidePictureDetails.Begin();
            //sbHidePictureExifInfo.Begin();

            //flickrPictureDetails.ClearAll();
            ResetPictureToolbar();

            _selectedFav = null;
            _lastFavTypeRetrieved = "";


            //flickrPictureDetails.Opacity = 1;

            //var gsv = FindVisualChild<ScrollViewer>(flickrListOfPics);
            //gsv.ScrollToHorizontalOffset(0);
            //gsv.Focus(Windows.UI.Xaml.FocusState.Pointer);
        }
        protected override void OnNavigatedFrom(NavigationEventArgs e)
        {
            _cleanUpAll();
            UnloadBase();
            base.OnNavigatedFrom(e);
        }

        public override void Unload()
        {
            
            _cleanUpAll();
            UnloadBase();
            base.Unload();
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

            ccDrawingSurfaceBottom.Content = null;
            ccDrawingSurfaceTop.Content = null;

            RenderingService.Unload();

            GestureService.Stop(this);


            SettingsPane.GetForCurrentView().CommandsRequested -= _vm.onCommandsRequested;
            GestureService.OnGestureRaised -= GestureService_OnGestureRaised;
            //SearchPane.GetForCurrentView().QuerySubmitted -= _vm.onQuerySubmitted;

            flickrLoggedInUser.LogoutRequested -= flickrLoggedInUser_LogoutRequested;
            flickrLoggedInUser.UnloadControl();

            flickrPublicFavourites.UnloadControl();
            flickrPromoted.UnloadControl();

            flickrPicture.UnloadControl();
            flickrPictureToolbar.UnloadControl();

            flickrSmallList.UnloadControl();

            _fvm.ChangeState -= _fvm_ChangeState;
            DownloadService.Current.DownloadCountChanged -= Current_DownloadCountChanged;

            //Messenger.Default.Unregister<GeneralSystemWideMessage>(this, DoGeneralSystemWideMessageCallback);

            //_fvm.Unload();

            //_vm = null;
            //_fvm = null;
        }

        private void ResetPictureToolbar()
        {
            flickrPictureToolbar.SetValue(Canvas.ZIndexProperty, 5);
            flickrPictureToolbar.UnloadToolbar();
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

       

        private void performAction(string action)
        {
            var diffPtX = _lineEndPoint.Value.X - _lineStartPoint.Value.X;
            var diffPtY = _lineStartPoint.Value.Y - _lineEndPoint.Value.Y;

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
