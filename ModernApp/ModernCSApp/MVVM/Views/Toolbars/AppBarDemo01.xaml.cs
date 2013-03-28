using ModernCSApp.Views.Controls;
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


namespace ModernCSApp.Views.Toolbars
{
    public sealed partial class AppBarDemo01 : BaseUserControl, IToolbarUserControl
    {
        public AppBarDemo01()
        {
            this.InitializeComponent();
        }

        public void LoadControl(string aggregateId)
        {
            throw new NotImplementedException();
        }

        public bool EditingIsDisabled
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }

        
    }
}
