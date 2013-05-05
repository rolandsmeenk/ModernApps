
using System;
using System.Linq;
using System.Threading.Tasks;
using ModernCSApp.Services;
using SumoNinjaMonkey.Framework.Services;
using Windows.Data.Xml.Dom;
using Windows.UI.Notifications;
using System.Collections.Generic;
using GalaSoft.MvvmLight.Command;
using Windows.UI.Xaml.Controls;
using System.Collections.ObjectModel;
using FlickrNet;

namespace ModernCSApp.Models
{
    public partial class FlickrViewModel : DefaultViewModel
    {

        public event EventHandler ChangeState;

        const string apiKey = "102e389a942747faebb958c4db95c098";
        const string apiSecret = "774b263b4d3a2578";
        string frob = string.Empty;
        OAuthRequestToken rt;
        OAuthAccessToken at;

        Auth flickr_Auth;
        Person flickr_Person;
        PhotoCollection PersonPhotos;

        FlickrNet.Flickr _flickr = null;

        Windows.UI.Core.CoreDispatcher _dispatcher;
        public string AuthorizationUrl { get; set; }


        public FlickrViewModel(Windows.UI.Core.CoreDispatcher dispatcher)
        {
            _flickr = new FlickrNet.Flickr(apiKey, apiSecret);
            _dispatcher = dispatcher;
        }


        public async void RequestAuthorization()
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
            await _flickr.OAuthGetRequestTokenAsync("oob", async (x) =>  //{} new Action<FlickrResult<OAuthRequestToken>>(x =>
            {
                
                if (!x.HasError)
                {
                    rt = x.Result;
                    string url = _flickr.OAuthCalculateAuthorizationUrl(rt.Token, FlickrNet.AuthLevel.Write);
                    try
                    {
                        await _dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.High, () =>
                        {
                            ////await Windows.System.Launcher.LaunchUriAsync(new Uri(url), new Windows.System.LauncherOptions() { DisplayApplicationPicker = true });
                            //grdWebView.Visibility = Visibility.Visible;
                            //tbConfirmationCode.Visibility = Visibility.Visible;
                            //wvLoginRequest.Source = new Uri(url);

                        });


                        await _dispatcher.RunAsync(
                            Windows.UI.Core.CoreDispatcherPriority.High,
                            new Windows.UI.Core.DispatchedHandler(() =>
                            {
                                AuthorizationUrl = url;
                                if (ChangeState != null) ChangeState("RequestGiven", EventArgs.Empty);
                                
                            })
                        );
                    }
                    catch (Exception ex)
                    {
                        var m = ex.Message;
                    }
                };
            });


        }

        public async void AuthorizationGiven(string confirmationCode)
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
            if (confirmationCode.Length == 0) return;

            await _flickr.OAuthGetAccessTokenAsync(rt, confirmationCode, async (rat) => // new Action<FlickrResult<OAuthAccessToken>>(rat =>
            //await _flickr.OAuthGetAccessTokenAsync(rt, tbConfirmationCode.Text, new Action<FlickrResult<OAuthAccessToken>>(rat =>
            {

                if (!rat.HasError)
                {
                    at = rat.Result;


                    await _dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.High, () =>
                    {

                        Services.AppDatabase.Current.AddAppState("at.FullName", at.FullName);
                        Services.AppDatabase.Current.AddAppState("at.ScreenName", at.ScreenName);
                        Services.AppDatabase.Current.AddAppState("at.UserId", at.UserId);
                        Services.AppDatabase.Current.AddAppState("at.Username", at.Username);
                        Services.AppDatabase.Current.AddAppState("at.Token", at.Token);
                        Services.AppDatabase.Current.AddAppState("at.TokenSecret", at.TokenSecret);

                        var states = Services.AppDatabase.Current.RetrieveAppStates();

                    });


                    if (ChangeState != null) ChangeState("ConfirmationComplete", EventArgs.Empty);
                    





                    ////USE YOUR ACCESS TO START MAKING API CALLS
                    //GetLoggedInUserDetails(at.UserId);


                }
            });

        }


        public void GetLoggedInUserDetails(string userid)
        {
            //GET LOGGED IN USER DETAILS
            _flickr.PeopleGetInfoAsync(userid, (p)=> //new Action<FlickrResult<Person>>(p =>
            {
                if (!p.HasError)
                {
                    flickr_Person = p.Result;
                    _dispatcher.RunAsync(
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
            });


            //GET LOGGED IN USERS PUBLIC PICTURES
            _flickr.PeopleGetPublicPhotosAsync(userid,async (pc) => //new Action<FlickrResult<PhotoCollection>>(pc =>
            {
                if (!pc.HasError)
                {
                    PersonPhotos = pc.Result;


                    await _dispatcher.RunAsync(
                        Windows.UI.Core.CoreDispatcherPriority.High,
                        new Windows.UI.Core.DispatchedHandler(() =>
                        {
                            //lbPhotos.ItemsSource = PersonPhotos;
                        })
                    );


                }
            });

        }



    }


}
