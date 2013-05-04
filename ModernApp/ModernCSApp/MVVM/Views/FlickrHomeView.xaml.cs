
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
using FlickrNet;

namespace ModernCSApp.Views
{

    public sealed partial class FlickrHomeView : BaseUserPage
    {

        const string apiKey = "102e389a942747faebb958c4db95c098";
        const string apiSecret = "774b263b4d3a2578";
        string frob = string.Empty;
        OAuthRequestToken rt;
        OAuthAccessToken at;

        Auth flickr_Auth;
        Person flickr_Person;
        PhotoCollection PersonPhotos;

        FlickrNet.Flickr _flickr = null;


        public HomeViewModel _vm { get; set; }


        public FlickrHomeView()
        {
            this.InitializeComponent();

            _flickr = new FlickrNet.Flickr(apiKey, apiSecret);

            PopupService.Init(layoutRoot);
 

            LoggingService.LogInformation("Showing splash screeen", "Views.HomeView");
            _vm = new HomeViewModel();
            _vm.Load();
            this.DataContext = _vm;

            //_vm.ShowLoginCommand.Execute(null);


            try
            {
                
                //Messenger.Default.Register<GeneralSystemWideMessage>(this, DoGeneralSystemWideMessageCallback);

                
            }
            catch { }


            //AppDatabase.Current.DeleteProjects(SessionID);


        }


       


        protected async override void OnNavigatedTo(NavigationEventArgs e)
        {

            sbLoadView.Completed += (obj, ea) =>
            {



            };
            sbLoadView.Begin();


            try
            {

                SettingsPane.GetForCurrentView().CommandsRequested += _vm.onCommandsRequested;
                //SearchPane.GetForCurrentView().QuerySubmitted += _vm.onQuerySubmitted;
                
            }
            catch { }
        }



        protected override void OnNavigatedFrom(NavigationEventArgs e)
        {
            base.OnNavigatedFrom(e);

            SettingsPane.GetForCurrentView().CommandsRequested -= _vm.onCommandsRequested;
            //SearchPane.GetForCurrentView().QuerySubmitted -= _vm.onQuerySubmitted;

        }


        public override void Unload()
        {
            base.Unload();

            //Messenger.Default.Unregister<GeneralSystemWideMessage>(this, DoGeneralSystemWideMessageCallback);

        }


        private void layoutRoot_Loaded(object sender, RoutedEventArgs e)
        {
            
        }

        private void butRequestAuthorizationClick(object sender, RoutedEventArgs e)
        {
            ////GET FROB
            //flickr.AuthGetFrobAsync(new Action<FlickrNet.FlickrResult<string>>(x=>{

            //    if (x.Result != null)
            //    {
            //        frob = x.Result;

            //        //USE FROB TO GET URL FOR USER AUTHENTICATION
            //        string url = flickr.AuthCalcUrl(frob, FlickrNet.AuthLevel.Write);
            //        Windows.System.Launcher.LaunchDefaultProgram(new Uri(url));

            //        Dispatcher.Invoke(Windows.UI.Core.CoreDispatcherPriority.High, new Windows.UI.Core.InvokedHandler((r,a) => {
            //            butRequestAuthorization.IsEnabled = false;
            //            butAuthorizationGiven.IsEnabled = true;
            //        }), this, null);

            //    }
            //}));


            //1. GET THE OAUTH REQUEST TOKEN
            //2. CONSTRUCT A URL & LAUNCH IT TO GET AN "AUTHORIZATION" TOKEN
            _flickr.OAuthGetRequestTokenAsync("oob", new Action<FlickrResult<OAuthRequestToken>>(x =>
            {

                if (!x.HasError)
                {
                    rt = x.Result;
                    string url = _flickr.OAuthCalculateAuthorizationUrl(rt.Token, FlickrNet.AuthLevel.Write);
                    try
                    {
                        Windows.System.Launcher.LaunchUriAsync(new Uri(url));

                        Dispatcher.RunAsync(
                            Windows.UI.Core.CoreDispatcherPriority.High, 
                            new Windows.UI.Core.DispatchedHandler(() =>
                                {
                                    //butRequestAuthorization.IsEnabled = false;
                                    //butAuthorizationGiven.IsEnabled = true;
                                    //txtOAuthVerificationCode.IsEnabled = true;
                                })
                            );
                    }
                    catch (Exception ex)
                    {
                        var m = ex.Message;
                    }
                };
            }));


        }

        private void butAuthorizationGivenClick(object sender, RoutedEventArgs e)
        {
            ////ONCE USER GIVES AUTHORIZATION IN FLICKRWEB GET THAT VERIFICATION FOR THE APP
            //flickr.AuthGetTokenAsync(frob, new Action<FlickrNet.FlickrResult<Auth>>(auth =>
            //{
            //    if (!auth.HasError)
            //    {
            //        flickr_Auth = auth.Result;

            //        Dispatcher.Invoke(Windows.UI.Core.CoreDispatcherPriority.High, new Windows.UI.Core.InvokedHandler((r, a) =>
            //        {
            //            butAuthorizationGiven.IsEnabled = false;
            //        }), this, null);


            //        GetLoggedInUserDetails(flickr_Auth.User);
            //    }
            //}));


            //3. COPY THE VERIFICATION CODE FROM THE FLICKR PAGE AND USE IT TO GET AN "ACCESS" TOKEN
            string OAuthVerificationCode = ""; //txtOAuthVerificationCode.Text
            if (OAuthVerificationCode.Length == 0) return;
            _flickr.OAuthGetAccessTokenAsync(rt, OAuthVerificationCode, new Action<FlickrResult<OAuthAccessToken>>(rat =>
            {

                if (!rat.HasError)
                {
                    at = rat.Result;

                    //USE YOUR ACCESS TO START MAKING API CALLS
                    GetLoggedInUserDetails(at.UserId);
                }
            }));

        }


        private void GetLoggedInUserDetails(string userid)
        {
            //GET LOGGED IN USER DETAILS
            _flickr.PeopleGetInfoAsync(userid, new Action<FlickrResult<Person>>(p =>
            {
                if (!p.HasError)
                {
                    flickr_Person = p.Result;
                    Dispatcher.RunAsync(
                        Windows.UI.Core.CoreDispatcherPriority.High,
                        new Windows.UI.Core.DispatchedHandler(() =>
                        {
                            //imgUser.Source = new BitmapImage(new Uri(p.Result.BuddyIconUrl));
                            //brdAvatar.Opacity = 1;

                            //lblName.Text = p.Result.UserName;

                            //spLogin.Visibility = Visibility.Collapsed;
                            //spLoggedIn.Visibility = Visibility.Visible;

                            //lblProject.Visibility = Visibility.Visible;
                        })
                        );
                }
            }));


            //GET LOGGED IN USERS PUBLIC PICTURES
            _flickr.PeopleGetPublicPhotosAsync(userid, new Action<FlickrResult<PhotoCollection>>(pc =>
            {
                if (!pc.HasError)
                {
                    PersonPhotos = pc.Result;


                    Dispatcher.RunAsync(
                        Windows.UI.Core.CoreDispatcherPriority.High,
                        new Windows.UI.Core.DispatchedHandler(() =>
                        {
                            //lbPhotos.ItemsSource = PersonPhotos;
                        })
                    );


                }
            }));

        }

    }
}
