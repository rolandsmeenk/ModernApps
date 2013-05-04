using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using ModernCSApp.Models;
using ModernCSApp.Services;
using SumoNinjaMonkey.Framework.Services;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

namespace ModernCSApp.Views
{

    public sealed partial class SplashScreenView : Page
    {
        SplashScreenViewModel _vm;

        public SplashScreenView()
        {
            this.InitializeComponent();

            LoggingService.LogInformation("Showing splash screeen", "Views.SplashScreenView");
            _vm = new SplashScreenViewModel();
            base.DataContext = _vm;
            _vm.OnBegin += vm_OnBegin;
            _vm.OnCompleted += vm_OnCompleted;
            _vm.Load();
        }

        void vm_OnBegin(object sender, EventArgs e)
        {
            _vm.OnBegin -= vm_OnBegin;

            Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.High, () =>
            {
                sbLoadingBegin.Begin();
            });
            
        }

        private async void vm_OnCompleted(object sender, EventArgs e)
        {
            _vm.OnCompleted -= vm_OnCompleted;

            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.High, () =>
            {
                sbLoadingDone.Completed += sbLoadingDone_Completed;
                sbLoadingDone.Begin();
            });
        }

        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
        }

        void sbLoadingDone_Completed(object sender, object e)
        {
            sbLoadingDone.Completed -= sbLoadingDone_Completed;
            NavigationService.NavigateOnUI("FlickrHomeView");
        }
    }
}
