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

    public sealed partial class NoConnectionView : BaseUserPage
    {
        public NoConnectionView()
        {
            this.InitializeComponent();

            
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
            AppService.NetworkConnectionChanged += AppService_NetworkConnectionChanged;
        }

        protected override void OnNavigatedFrom(NavigationEventArgs e)
        {
            AppService.NetworkConnectionChanged -= AppService_NetworkConnectionChanged;
        }
    }
}
