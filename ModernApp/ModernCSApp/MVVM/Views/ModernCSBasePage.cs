using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ModernCSApp.Services;
using SumoNinjaMonkey.Framework.Services;
using Windows.UI;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Media;
using GalaSoft.MvvmLight.Messaging;
using SumoNinjaMonkey.Framework.Controls.Messages;
using Windows.Storage;
using Windows.Storage.Search;
using Windows.UI.Xaml;


namespace ModernCSApp.Views
{
    public class ModernCSBasePage: BaseUserPage
    {
        public ModernCSBasePage()
        {
            

            WindowLayoutService.OnWindowLayoutRaised += WindowLayoutService_OnWindowLayoutRaised;
            AppService.NetworkConnectionChanged += AppService_NetworkConnectionChanged;


        }

        void WindowLayoutService_OnWindowLayoutRaised(object sender, EventArgs e)
        {
            WindowLayoutEventArgs args = (WindowLayoutEventArgs)e;
            NavigationService.NavigateBasedOnWindowsLayoutChange(args);
        }

        void AppService_NetworkConnectionChanged(object sender, EventArgs e)
        {

            bool isConnected = (bool)sender;
            //if (isConnected)
            //{
            Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.High, () =>
            {
                //NavigationService.Navigate("FlickrLoginView");
                NavigationService.NavigateBasedOnNetworkConnectivity(isConnected);
            });
            //}
        }


        public void UnloadBase()
        {
            WindowLayoutService.OnWindowLayoutRaised -= WindowLayoutService_OnWindowLayoutRaised;
            AppService.NetworkConnectionChanged -= AppService_NetworkConnectionChanged;

        }

    }
}
