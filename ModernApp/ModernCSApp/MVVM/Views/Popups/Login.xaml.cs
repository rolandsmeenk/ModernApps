using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The User Control item template is documented at http://go.microsoft.com/fwlink/?LinkId=234236

namespace ModernCSApp.MVVM.Views.Popups
{
    public sealed partial class Login : UserControl
    {
        public Login()
        {
            this.InitializeComponent();
        }

        private void tbUserName_LostFocus(object sender, RoutedEventArgs e)
        {
            if (tbUserName.Text.Length > 0)
            {
                sbFoundUserName.Begin();
            }
            else
            {
                sbResetUserName.Begin();
            }
        }
    }
}
