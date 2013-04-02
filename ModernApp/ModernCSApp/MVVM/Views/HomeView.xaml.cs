
using ModernCSApp.Services;
using ModernCSApp.Views.Controls;
using GalaSoft.MvvmLight.Messaging;
using SharpDX;
using SharpDX.Direct3D11;
using SharpDX.Toolkit.Graphics;
using SumoNinjaMonkey.Framework.Controls;
using SumoNinjaMonkey.Framework.Controls.DrawingSurface;
using SumoNinjaMonkey.Framework.Controls.Innertia;
using SumoNinjaMonkey.Framework.Controls.Messages;
using SumoNinjaMonkey.Framework.Services;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Storage;
using Windows.UI;
using Windows.UI.Input;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Media.Animation;
using Windows.UI.Xaml.Navigation;
using ModernCSApp.Models;
using Windows.UI.ApplicationSettings;
using System.Threading.Tasks;
using Windows.ApplicationModel.Search;

namespace ModernCSApp.Views
{

    public sealed partial class HomeView : BaseUserPage
    {
        //private CommonDX.DeviceManager deviceManager;
        //private IRenderer renderer;
        //private SumoNinjaMonkey.Framework.Controls.DrawingSurfaceSIS dsSIS;

        public HomeViewModel _vm { get; set; }


        public HomeView()
        {
            this.InitializeComponent();

            PopupService.Init(layoutRoot);
 

            LoggingService.LogInformation("Showing splash screeen", "Views.HomeView");
            _vm = new HomeViewModel();
            _vm.Load();
            this.DataContext = _vm;

            _vm.ShowLoginCommand.Execute(null);


            try
            {
                
                //Messenger.Default.Register<GeneralSystemWideMessage>(this, DoGeneralSystemWideMessageCallback);

                
            }
            catch { }


            //AppDatabase.Current.DeleteProjects(SessionID);



        }


       


        protected async override void OnNavigatedTo(NavigationEventArgs e)
        {
            try
            {

                sbLoadView.Completed += (obj, ea) => {


                    State.DrawingSurfaceWidth = ccDrawingSurfaceBottom.ActualWidth;
                    State.DrawingSurfaceHeight = ccDrawingSurfaceBottom.ActualHeight;
                    RenderingService.Init(State);

                    ccDrawingSurfaceBottom.Content = RenderingService.DrawingSIS;
                    RenderingService.Start();

                };
                sbLoadView.Begin();


                SettingsPane.GetForCurrentView().CommandsRequested += _vm.onCommandsRequested;
                SearchPane.GetForCurrentView().QuerySubmitted += _vm.onQuerySubmitted;
                


                GestureService.Start(this);

            }
            catch { }
        }



        protected override void OnNavigatedFrom(NavigationEventArgs e)
        {
            base.OnNavigatedFrom(e);

            SettingsPane.GetForCurrentView().CommandsRequested -= _vm.onCommandsRequested;
            SearchPane.GetForCurrentView().QuerySubmitted -= _vm.onQuerySubmitted;

            RenderingService.Stop();
            GestureService.Stop(this);
        }


        public override void Unload()
        {
            base.Unload();

            //Messenger.Default.Unregister<GeneralSystemWideMessage>(this, DoGeneralSystemWideMessageCallback);

        }


        private void layoutRoot_Loaded(object sender, RoutedEventArgs e)
        {
            
        }


    }
}
