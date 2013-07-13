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
        internal bool _drawLine = false;
        internal Windows.Foundation.Point _lineStartPoint;
        internal Windows.Foundation.Point _lineEndPoint;
        internal string _actionToDoOnRelease = string.Empty;

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


        internal void drawLine(Windows.Foundation.Point startPoint, Windows.Foundation.Point endPoint, ref Windows.UI.Xaml.Shapes.Line line)
        {
            if (_drawLine)
            {
                line.X1 = startPoint.X;
                line.Y1 = startPoint.Y;
                line.X2 = endPoint.X;
                line.Y2 = endPoint.Y;
                line.Visibility = Windows.UI.Xaml.Visibility.Visible;
            }
            else
            {
                line.Visibility = Windows.UI.Xaml.Visibility.Collapsed;
            }

        }


        public void UnloadBase()
        {
            WindowLayoutService.OnWindowLayoutRaised -= WindowLayoutService_OnWindowLayoutRaised;
            AppService.NetworkConnectionChanged -= AppService_NetworkConnectionChanged;

        }

    }
}
