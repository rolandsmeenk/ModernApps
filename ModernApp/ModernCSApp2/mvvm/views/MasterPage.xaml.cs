using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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


namespace ModernCSApp
{
    
    public sealed partial class MasterPage : Page
    {
        public MasterPage(bool goToSearch = false)
        {
            this.InitializeComponent();

            NavigationServiceBase.Init(this.MainFrame);
            NotificationService.Init(this.NotificationDisplay);
            MsgBoxService.Init(this.MessageBoxDisplay);
            PopupService.Init(this.PopupDisplay);


            if (goToSearch)
            {
                //this.MainFrame.Navigate(typeof(SearchResultsView));
                NavigationService.Navigate("SearchResultsView");
            }
            else
            {
                NavigationService.Navigate("SplashScreenView");

            }

        }

        /// <summary>
        /// Invoked when this page is about to be displayed in a Frame.
        /// </summary>
        /// <param name="e">Event data that describes how this page was reached.  The Parameter
        /// property is typically used to configure the page.</param>
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
        }
    }
}
