using System;
//using ModernCSApp.Views;
using SumoNinjaMonkey.Framework.Services;
using Windows.UI.Xaml.Controls;
using ModernCSApp.Views;
namespace ModernCSApp.Services
{
    public class NavigationServiceBase
    {
        public static Frame _mainFrame = null;
        public static NavigationServiceBase Instance = new NavigationServiceBase();

        public NavigationServiceBase()
        {
        }


        public static void Init(Frame mainFrame)
        {

            //NavigationServiceBase._mainFrame = mainFrame;
            _mainFrame = mainFrame;
        }


        


        public static void NavigateBase(string viewName, object parameter = null)
        {
            //if (!string.IsNullOrEmpty(viewName)))
            //{
            //    _mainFrame.Navigate(typeof(HomeView), parameter);
            //}
        }


        public static void GoBack()
        {
            //ShareManager.Instance.Clear();


            if (_mainFrame.CanGoBack)
            {
                LoggingService.LogInformation("navigating back", "NavigationServiceBase.GoBack");
                _mainFrame.GoBack();
                return;
            }

        }
    }
}
