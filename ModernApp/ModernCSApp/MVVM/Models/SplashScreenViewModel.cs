
using System;
using System.Linq;
using System.Threading.Tasks;
using ModernCSApp.Services;
using SumoNinjaMonkey.Framework.Services;
using Windows.Data.Xml.Dom;
using Windows.UI.Notifications;

namespace ModernCSApp.Models
{
    public class SplashScreenViewModel : DefaultViewModel
    {
        public event EventHandler OnCompleted;
        public event EventHandler OnBegin;

        public void Load()
        {
            Task.Factory.StartNew(delegate
            {
                LoggingService.LogInformation("Splash Screen Loading", "SplashScreenViewModel.Load");

                if (this.OnBegin != null)
                {
                    this.OnBegin(this, EventArgs.Empty);
                }

                AppContext.Current.Load();
                
                LoggingService.LogInformation("Clearing Tile Notifications", "SplashScreenViewModel.Load.ClearTileNotification");
                this.ClearTileNotification();
                
                LoggingService.LogInformation("Sending Tile Notification", "SplashScreenViewModel.Load.SendTileTextNotification");
                this.SendTileTextNotification(null);

                //FirstTime - fill data
                LoggingService.LogInformation("Getting System Data (AppState)", "SplashScreenViewModel.Load -> AppDatabase.LoadInstances");
                AppDatabase.Current.LoadInstances();


                if (AppDatabase.Current.AppStates == null || AppDatabase.Current.AppStates.Count() == 0)
                {
                    LoggingService.LogInformation("Getting System Data (AppState)", "SplashScreenViewModel.Load -> AppDatabase.RecreateSystemData");
                    AppDatabase.Current.RecreateSystemData();
                    LoggingService.LogInformation("Getting System Data (AppState)", "SplashScreenViewModel.Load -> AppDatabase.LoadInstances");
                    AppDatabase.Current.LoadInstances();
                }


                
            }
            ).ContinueWith(delegate(Task t)
            {
                if (t.Exception != null)
                {
                    Exception ex = t.Exception.InnerExceptions[0];
                    while (ex.InnerException != null)
                    {
                        ex = ex.InnerException;
                    }
                    //new ErrorService().HandleException(ex.Message, ex);
                    return;
                }
                if (this.OnCompleted != null)
                {
                    this.OnCompleted(this, EventArgs.Empty);
                }
            }
            );
        }

    }
}
