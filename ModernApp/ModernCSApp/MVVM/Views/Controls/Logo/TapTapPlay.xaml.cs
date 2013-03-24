using ModernCSApp.Views;
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


namespace ModernCSApp.Views.Controls.Logo
{
    public sealed partial class TapTapPlay : BaseUserControl
    {
        public TapTapPlay()
        {
            this.InitializeComponent();

            
            this.DataContext = this;
            
        }
    }
}
