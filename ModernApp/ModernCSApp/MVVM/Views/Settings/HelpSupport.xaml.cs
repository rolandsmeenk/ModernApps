using ModernCSApp.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.ApplicationSettings;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

namespace ModernCSApp.MVVM.Views.Settings
{
    public sealed partial class HelpSupport : UserControl
    {
        public SettingsViewModel _vm { get; set; }

        public HelpSupport()
        {
            this.InitializeComponent();

            _vm = new SettingsViewModel();
            this.DataContext = _vm;
        }

        private void grdBack_PointerPressed(object sender, PointerRoutedEventArgs e)
        {
            if (this.Parent.GetType() == typeof(Popup))
            {
                ((Popup)this.Parent).IsOpen = false;
            }

            SettingsPane.Show();

        }
    }
}
