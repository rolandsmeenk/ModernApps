
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

    public sealed partial class SuspendedView : Page
    {
        public SuspendedView()
        {
            this.InitializeComponent();

        }



        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            Window.Current.VisibilityChanged += Current_VisibilityChanged;
            //NotifyGCTotalMemory();
        }

        protected override void OnNavigatedFrom(NavigationEventArgs e)
        {
            Window.Current.VisibilityChanged -= Current_VisibilityChanged;
        }


        void Current_VisibilityChanged(object sender, Windows.UI.Core.VisibilityChangedEventArgs e)
        {
            if (e.Visible)
            {
                AppDatabase.Current.LoadInstances();
                //_startAll();

                NavigationService.NavigateOnUI("FlickrLoginView");
            }
            else
            {
                AppDatabase.Current.Unload();
                RenderingService.Unload();
                _stopAll();

                NavigationService.NavigateOnUI("SuspendedView");
            }

        }

        private void _stopAll()
        {
            LoggingService.Stop();
            AlertService.Stop();
            AppService.Stop();
            RenderingService.Stop();
            //GestureService.Stop(this);
        }

        private void _startAll()
        {
            LoggingService.Start();
            AlertService.Start();
            AppService.Start();
            RenderingService.Start();
            //GestureService.Start(this);
        }
    }
}
