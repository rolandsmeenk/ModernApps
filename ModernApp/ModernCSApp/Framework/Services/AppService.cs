
using SumoNinjaMonkey.Framework.Services;
using Windows.Networking.Connectivity;

namespace ModernCSApp.Services
{
    public class AppService
    {

        
        public static bool IsConnected()
        {
            if (NetworkInformation.GetInternetConnectionProfile() == null)
            {
                //NotificationService.Show("You're not connected to Internet.\nYou must connect to internet first to use this application.", "", true);
                return false;
            }
            return true;
        }
    }
}
