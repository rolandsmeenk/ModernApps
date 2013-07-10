using ModernCSApp.Services;
using ModernCSApp.Views;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Storage;
using Windows.UI.ApplicationSettings;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Media.Animation;
using Windows.UI.Xaml.Media.Imaging;
using Windows.UI.Xaml.Navigation;

namespace ModernCSApp.Views.Controls.Flickr
{
    public sealed partial class LoggedInCard : BaseUserControl
    {
        public event EventHandler LogoutRequested;


        public enum CardState
        {
            PublicFavourites,
            FlickrHome
        }

        public LoggedInCard()
        {
            this.InitializeComponent();

            
        }

        public async Task UnloadControl()
        {
            base.UnloadControl();

        }

        private void spIDCard_PointerReleased(object sender, PointerRoutedEventArgs e)
        {
            if (spMenu.Visibility == Windows.UI.Xaml.Visibility.Visible)
            {
                sbHideMenu.Begin();
            }
            else
            {
                sbShowMenu.Begin();
            }
        }


        private void butLogout_Click(object sender, RoutedEventArgs e)
        {
            if (LogoutRequested != null) LogoutRequested(null, EventArgs.Empty);
            sbHideMenu.Begin();
        }

        private void butPublic_Click(object sender, RoutedEventArgs e)
        {
            NavigationService.Navigate("PublicViewLandscape");
            sbHideMenu.Begin();
        }

        private void butYourFavourites_Click(object sender, RoutedEventArgs e)
        {
            //NavigationService.Navigate("PublicViewPortrait");
            NavigationService.Navigate("HomeViewLandscape");
            sbHideMenu.Begin();
        }


        private void butSettings_Click(object sender, RoutedEventArgs e)
        {
            sbHideMenu.Begin();

            SettingsPane.Show();
        }



        public CardState CardViewState
        {
            get { return (CardState)GetValue(CardViewStateProperty); }
            set { SetValue(CardViewStateProperty, value); }
        }

        public static readonly DependencyProperty CardViewStateProperty =
            DependencyProperty.Register("CardViewState", typeof(CardState), typeof(LoggedInCard), new PropertyMetadata(CardState.FlickrHome, CardViewStatePropertyChanged));

        private static void CardViewStatePropertyChanged(DependencyObject obj, DependencyPropertyChangedEventArgs args)
        {
            if (args.NewValue != null) { 
                LoggedInCard ctl = (LoggedInCard)obj;
                var state = (CardState) args.NewValue;
                switch(state){
                    case CardState.PublicFavourites:
                        ctl.butPublic.Visibility = Visibility.Collapsed;
                        break;
                    case CardState.FlickrHome:
                        ctl.butYourFavourites.Visibility = Visibility.Collapsed;
                        break;
                    default:break;
                }
            }
        
        }

    }
}
