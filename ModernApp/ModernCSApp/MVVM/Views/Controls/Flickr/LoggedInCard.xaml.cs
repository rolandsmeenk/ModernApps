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
            sbHideMenu.Begin();
        }

        private void butSettings_Click(object sender, RoutedEventArgs e)
        {
            sbHideMenu.Begin();

            SettingsPane.Show();
        }

    }
}
