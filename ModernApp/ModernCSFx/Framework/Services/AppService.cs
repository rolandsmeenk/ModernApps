
using GalaSoft.MvvmLight.Messaging;
using SumoNinjaMonkey.Framework.Controls.Messages;
using SumoNinjaMonkey.Framework.Services;
using System;
using Windows.Networking.Connectivity;

namespace ModernCSApp.Services
{
    public class AppService
    {
        private static bool _isEnabled = false;

        public static event EventHandler NetworkConnectionChanged;
        
        public static bool IsConnected()
        {
            try
            {
                if (NetworkInformation.GetInternetConnectionProfile() == null)
                {
                    return false;
                }
                else
                {
                    var nc = NetworkInformation.GetInternetConnectionProfile().GetNetworkConnectivityLevel();
                    if (nc == null) return false;
                    if (nc == NetworkConnectivityLevel.None) return false;
                    if (nc == NetworkConnectivityLevel.LocalAccess) return false;
                    if (nc == NetworkConnectivityLevel.ConstrainedInternetAccess ||
                        nc == NetworkConnectivityLevel.InternetAccess) return true;

                    return false;
                }
            }
            catch(Exception ex) { 
            
            }
            return true;
        }

        public static void Init()
        {
            
        }

        private static void NetworkInformation_NetworkStatusChanged(object sender)
        {
            if (NetworkConnectionChanged != null) NetworkConnectionChanged(IsConnected(), EventArgs.Empty);
        }

        public static void Start()
        {
            if (_isEnabled) return;
                
            NetworkInformation.NetworkStatusChanged += NetworkInformation_NetworkStatusChanged;

            _isEnabled = true;
        }

        public static void Stop()
        {
            NetworkInformation.NetworkStatusChanged -= NetworkInformation_NetworkStatusChanged;

            _isEnabled = false;
        }

    }
}
