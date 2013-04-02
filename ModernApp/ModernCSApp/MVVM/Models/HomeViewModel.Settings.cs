
using Windows.UI.ApplicationSettings;
namespace ModernCSApp.Models
{
    public partial class HomeViewModel : DefaultViewModel
    {

        public void onCommandsRequested(SettingsPane settingsPane, SettingsPaneCommandsRequestedEventArgs eventArgs)
        {
            //THE SETTINGS PANE CAN BE POPULATED WITH OUR OWN UI
        }

    }

}
