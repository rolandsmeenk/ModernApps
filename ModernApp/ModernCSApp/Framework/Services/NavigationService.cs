using System;
//using ModernCSApp.Views;
using SumoNinjaMonkey.Framework.Services;
using Windows.UI.Xaml.Controls;
using ModernCSApp.Views;
namespace ModernCSApp.Services
{
    public class NavigationService : NavigationServiceBase
    {
        //private static Frame _mainFrame = null;
        //private static NavigationService Instance = new NavigationService();

        public NavigationService()
        {

        }
        //public static void Init(Frame mainFrame)
        //{
        //    NavigationServiceBase.Init(mainFrame);
        //    //NavigationService._mainFrame = mainFrame;
        //}


        

        public static void Navigate(string viewName, object parameter = null)
        {
            

            //ShareManager.Instance.Clear();

            if (viewName != null)
            {
                
                if (viewName == "SplashScreenView")
                {
                    _mainFrame.Navigate(typeof(SplashScreenView), parameter);
                    return;
                }
                
                else if (viewName == "FlickrLoginView")
                {
                    NavigationService._mainFrame.Navigate(typeof(FlickrLoginView), parameter);
                    return;
                }
                //else if (viewName == "HomeView")
                //{
                //    _mainFrame.Navigate(typeof(HomeView), parameter);
                //    return;
                //}
                else if (viewName == "HomeViewSnapped")
                {
                    _mainFrame.Navigate(typeof(HomeViewSnapped), parameter);
                    return;
                }
                else if (viewName == "HomeViewPortrait")
                {
                    _mainFrame.Navigate(typeof(HomeViewPortrait), parameter);
                    return;
                }
                else if (viewName == "HomeViewLandscape")
                {
                    _mainFrame.Navigate(typeof(HomeViewLandscape), parameter);
                    return;
                }
                else if (viewName == "EffectGraphHomeView")
                {
                    _mainFrame.Navigate(typeof(EffectGraphHomeView), parameter);
                    return;
                }
                else if (viewName == "NoConnectionView")
                {
                    _mainFrame.Navigate(typeof(NoConnectionView), parameter);
                    return;
                }
                
               

                NavigateBase(viewName, parameter);


            }
            throw new ArgumentException("There is no view associated with the name : " + viewName);
        }

        public async static void NavigateOnUI(string viewName, object parameter = null)
        {
            Windows.UI.Core.DispatchedHandler invokedHandler = new Windows.UI.Core.DispatchedHandler(() =>
            {
                LoggingService.LogInformation("navigating to " + viewName, "NavigationService.NavigateOnUI");

                Navigate(viewName, parameter);
            });

            await _mainFrame.Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal, invokedHandler);
        }


        public static void NavigateBasedOnWindowsLayoutChange(WindowLayoutEventArgs args)
        {
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
                NavigationService.Navigate("HomeViewLandscape");
            }
        }

        public static void NavigateBasedOnNetworkConnectivity(bool isConnected)
        {
            if (!isConnected)
            {
                NavigationService.Navigate("NoConnectionView");
            }
        }
    }
}
