﻿
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

    public sealed partial class HomeViewSnapped : BaseUserPage
    {
        public HomeViewSnapped()
        {
            this.InitializeComponent();

            
            AppService.NetworkConnectionChanged += AppService_NetworkConnectionChanged;
        }


        void AppService_NetworkConnectionChanged(object sender, EventArgs e)
        {

            bool isConnected = (bool)sender;
            if (isConnected)
            {
                AppService.NetworkConnectionChanged -= AppService_NetworkConnectionChanged;

                Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.High, () => {
                    NavigationService.Navigate("FlickrLoginView");
                });

                
            }
        }

        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            WindowLayoutService.OnWindowLayoutRaised += WindowLayoutService_OnWindowLayoutRaised;
        }

        protected override void OnNavigatedFrom(NavigationEventArgs e)
        {
            WindowLayoutService.OnWindowLayoutRaised -= WindowLayoutService_OnWindowLayoutRaised;
        }

        void WindowLayoutService_OnWindowLayoutRaised(object sender, EventArgs e)
        {
            WindowLayoutEventArgs args = (WindowLayoutEventArgs)e;
            if (args.ViewState == Windows.UI.ViewManagement.ApplicationViewState.Snapped)
            {
                NavigationService.Navigate("HomeViewSnapped");
            }
            else if (args.ViewState == Windows.UI.ViewManagement.ApplicationViewState.FullScreenPortrait)
            {
                NavigationService.Navigate("HomeViewPortrait");
            }
            else if (args.ViewState == Windows.UI.ViewManagement.ApplicationViewState.FullScreenLandscape)
            {
                NavigationService.Navigate("HomeView");
            }
        }

    }
}
