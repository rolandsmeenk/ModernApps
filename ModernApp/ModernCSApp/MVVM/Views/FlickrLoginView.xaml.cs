
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
using Windows.UI.ViewManagement;


namespace ModernCSApp.Views
{

    public sealed partial class FlickrLoginView : BaseUserPage
    {

        


        public FlickrViewModel _vm { get; set; }


        public FlickrLoginView()
        {
            this.InitializeComponent();

        }


        void AppService_NetworkConnectionChanged(object sender, EventArgs e)
        {

            bool isConnected = (bool)sender;
            if (!isConnected)
            {
                Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.High, () =>
                {
                    NavigationService.NavigateBasedOnNetworkConnectivity(isConnected);
                });


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

                    NavigationService.NavigateOnUI("HomeViewLandscape");

                    break;
            }
        }


       


        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            AppService.NetworkConnectionChanged += AppService_NetworkConnectionChanged;

            PopupService.Init(layoutRoot);

            LoggingService.LogInformation("Showing splash screeen", "Views.HomeView");
            _vm = new FlickrViewModel(Dispatcher);
            _vm.ChangeState += _vm_ChangeState;
            this.DataContext = _vm;

            //_vm.ShowLoginCommand.Execute(null);

            //AppDatabase.Current.DeleteProjects(SessionID);


            if (_vm.IsFlickrLoginDetailsCached())
            {
                //NavigationService.NavigateOnUI("HomeView");
                _vm.ViewInit();
                ucLoginOrLoggedIn.LoadDetails(_vm.FullName, _vm.BuddyIconUrl, Controls.Flickr.UserCard.CardPosition.Left);
                butLoginRequest.Tag = "Loggedin";
            }
            else
            {
                ucLoginOrLoggedIn.LoadDetails("Login", "ms-appx:///Assets/FlickrLogin.PNG", Controls.Flickr.UserCard.CardPosition.Left);
                butLoginRequest.Tag = "Login";
            }

            ucPublic.LoadDetails("Public", "ms-appx:///Assets/FlickrPublic.PNG", Controls.Flickr.UserCard.CardPosition.Right);

            sbShowCards.Begin();

            sbLoadView.Begin();

            //NotifyGCTotalMemory();
            
        }



        protected override void OnNavigatedFrom(NavigationEventArgs e)
        {
            base.OnNavigatedFrom(e);

            //SettingsPane.GetForCurrentView().CommandsRequested -= _vm.onCommandsRequested;
            //SearchPane.GetForCurrentView().QuerySubmitted -= _vm.onQuerySubmitted;

            _vm.ChangeState -= _vm_ChangeState;
            AppService.NetworkConnectionChanged -= AppService_NetworkConnectionChanged;
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
            if((string)butLoginRequest.Tag == "Login")
                _vm.RequestAuthorization();
            else
                NavigationService.NavigateOnUI("HomeViewLandscape");
        }

        private void butLoginRequestPublic_Click(object sender, RoutedEventArgs e)
        {
            NavigationService.NavigateOnUI("PublicViewLandscape");
        }

        private void butLoginConfirm_Click(object sender, RoutedEventArgs e)
        {
            _vm.AuthorizationGiven(tbConfirmationCode.Text);
        }
    }
}
