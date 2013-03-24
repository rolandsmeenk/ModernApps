using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using ModernCSApp.Views.Controls;
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
    public sealed partial class SettingsEditorToolbar : BaseUserControl, IPopupUserControl
    {
        public SettingsEditorToolbar()
        {
            this.InitializeComponent();

            butEditColors.LoadMetroIcon("Pallete1", scale: 1);
            butEditColors.UpdateBackgroundColor(AccentColor);
            butEditColors.ClickIdentifier = "SETED";
            butEditColors.ClickCode = "OPEN COLOR SETTINGS";

            butChangeLayout.LoadMetroIcon("Layout1", scale: 1);
            butChangeLayout.UpdateBackgroundColor(AccentColor);
            butChangeLayout.ClickIdentifier = "SETED";
            butChangeLayout.ClickCode = "CHANGE LAYOUT";

            butOneToOne.LoadMetroIcon("OneToOne", scale: 1);
            butOneToOne.UpdateBackgroundColor(AccentColor);
            butOneToOne.ClickIdentifier = "SETED";
            butOneToOne.ClickCode = "REVERT TO FULL LAYOUT";

            butToggleIsRenderable.ClickIdentifier = "SETED";
            butToggleIsRenderable.ClickCode = "TOGGLE ISRENDERABLE";
            butToggleIsRenderable.LoadMetroIcon("Eye1", rotation: 0);
            butToggleIsRenderable.UpdateBackgroundColor(AccentColor);

        }

        public void UnloadControl()
        {
            
        }


        public bool EditingIsDisabled {get;set;}


        public void LoadControl(string aggregateId)
        {
            throw new NotImplementedException();
        }
    }
}
