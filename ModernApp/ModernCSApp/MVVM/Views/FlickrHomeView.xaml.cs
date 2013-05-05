
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

    public sealed partial class FlickrHomeView : BaseUserPage
    {

        


        public FlickrViewModel _vm { get; set; }


        public FlickrHomeView()
        {
            this.InitializeComponent();

            

            PopupService.Init(layoutRoot);
 

            LoggingService.LogInformation("Showing splash screeen", "Views.HomeView");
            _vm = new FlickrViewModel(Dispatcher);
            _vm.ChangeState += _vm_ChangeState;
            this.DataContext = _vm;

            //_vm.ShowLoginCommand.Execute(null);


            try
            {
                
                //Messenger.Default.Register<GeneralSystemWideMessage>(this, DoGeneralSystemWideMessageCallback);

                
            }
            catch { }


            //AppDatabase.Current.DeleteProjects(SessionID);


            

            //determine if there are already flickr credentials
            var found = Services.AppDatabase.Current.AppStates.Where(x => x.Name == "at.FullName").FirstOrDefault();
            if (found != null)
            {
                NavigationService.NavigateOnUI("HomeView");

                //at = new OAuthAccessToken();
                //found = Services.AppDatabase.Current.AppStates.Where(x => x.Name == "at.FullName").FirstOrDefault();
                //at.FullName = found.Value;
                //found = Services.AppDatabase.Current.AppStates.Where(x => x.Name == "at.ScreenName").FirstOrDefault();
                //at.ScreenName = found.Value;
                //found = Services.AppDatabase.Current.AppStates.Where(x => x.Name == "at.UserId").FirstOrDefault();
                //at.UserId = found.Value;
                //found = Services.AppDatabase.Current.AppStates.Where(x => x.Name == "at.Username").FirstOrDefault();
                //at.Username = found.Value;
                //found = Services.AppDatabase.Current.AppStates.Where(x => x.Name == "at.Token").FirstOrDefault();
                //at.Token = found.Value;
                //found = Services.AppDatabase.Current.AppStates.Where(x => x.Name == "at.TokenSecret").FirstOrDefault();
                //at.TokenSecret = found.Value;

                //State_LoggedIn();
                //GetLoggedInUserDetails(at.UserId);
            }
            


        }

        async void _vm_ChangeState(object sender, EventArgs e)
        {
            string state = (string)sender;
            switch (state)
            {
                case "RequestGiven": 

                    await Dispatcher.RunAsync(
                        Windows.UI.Core.CoreDispatcherPriority.High,
                        new Windows.UI.Core.DispatchedHandler(() =>
                        {

                            butLoginRequest.Visibility = Visibility.Collapsed;
                            butLoginConfirm.Visibility = Visibility.Visible;
                            grdWebView.Visibility = Visibility.Visible;
                            tbConfirmationCode.Visibility = Visibility.Visible;
                            wvLoginRequest.Source = new Uri(_vm.AuthorizationUrl);
                        })
                    );
                    break;

                case "ConfirmationComplete":

                    await Dispatcher.RunAsync(
                        Windows.UI.Core.CoreDispatcherPriority.High,
                        new Windows.UI.Core.DispatchedHandler(() =>
                        {
                            grdWebView.Visibility = Visibility.Collapsed;
                            tbConfirmationCode.Visibility = Visibility.Collapsed;
                            butLoginConfirm.Visibility = Visibility.Collapsed;
                            butLoginRequest.Visibility = Visibility.Collapsed;
                        })
                    );

                    NavigationService.NavigateOnUI("HomeView");

                    break;
            }
        }


       


        protected override void OnNavigatedTo(NavigationEventArgs e)
        {

            sbLoadView.Completed += (obj, ea) =>
            {



            };
            sbLoadView.Begin();


            try
            {

                //SettingsPane.GetForCurrentView().CommandsRequested += _vm.onCommandsRequested;
                //SearchPane.GetForCurrentView().QuerySubmitted += _vm.onQuerySubmitted;
                
            }
            catch { }
        }



        protected override void OnNavigatedFrom(NavigationEventArgs e)
        {
            base.OnNavigatedFrom(e);

            //SettingsPane.GetForCurrentView().CommandsRequested -= _vm.onCommandsRequested;
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
 

        private void butLoginRequest_Click(object sender, RoutedEventArgs e)
        {
            
            _vm.RequestAuthorization();
        }


        private void butLoginConfirm_Click(object sender, RoutedEventArgs e)
        {
            _vm.AuthorizationGiven(tbConfirmationCode.Text);
        }
    }
}
