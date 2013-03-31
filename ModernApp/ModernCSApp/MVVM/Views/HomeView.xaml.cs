
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

namespace ModernCSApp.Views
{

    public sealed partial class HomeView : BaseUserPage
    {
        private CommonDX.DeviceManager deviceManager;
        private IRenderer renderer;
        private SumoNinjaMonkey.Framework.Controls.DrawingSurfaceSIS dsSIS;

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


       

        private async void DoGeneralSystemWideMessageCallback(GeneralSystemWideMessage msg)
        {

            if (msg.Identifier == "HOMEVIEW")
            {
                if (msg.Action == "CHANGE BACKGROUND")
                {
                    if (msg.Url1 != string.Empty && msg.Url1.Length > 0)
                    {

                        Random rnd = new Random();

                        await imgBackground.UnloadControl();
                        try
                        {
                            await imgBackground.LoadControl(
                                rnd.Next(56, 86),
                                rnd.Next(0, 2),
                                rnd.Next(0, 100),
                                rnd.Next(0, 30),
                                rnd.Next(15, 30),
                                msg.Url1);

                        }
                        catch { 
                            //normally if we got here its because the image were trying to use is of zero size which means
                            //it did not fully download from the web
                        
                        }


                        //StorageFile file = await FileExists("ModernCSApp\\large", msg.Text1, type: 2);
                        //if (file != null)
                        //{

                        //    SendSystemWideMessage("SHELL RENDERER", "", action: "UPDATE BACKGROUND ASSET", url1: file.Path);

                        //}
                    }

                }
            }
            else if (msg.Identifier == "AGGREGATE")
            {
                if (msg.Action == "UPDATED")
                {
                
                }
                else if (msg.Action == "GROUPING UPDATED")
                {

                }
                else if (msg.Action == "DELETED")
                {

                }
            }
            else if (msg.Identifier == "DASHBOARD")
            {
                if (msg.Action == "SEND INFORMATION NOTIFICATION")
                {
                    SendInformationNotification(msg.Text1, msg.Int1);
                }
            }
            

        }


        protected async override void OnNavigatedTo(NavigationEventArgs e)
        {
            try
            {

                sbLoadView.Completed += (obj, ea) => {


                    deviceManager = new CommonDX.DeviceManager();
                    State.DrawingSurfaceWidth = ccDrawingSurfaceBottom.ActualWidth;
                    State.DrawingSurfaceHeight = ccDrawingSurfaceBottom.ActualHeight;
                    renderer = new DxRenderer.BackgroundComposer() { State = State };

                    dsSIS = new SumoNinjaMonkey.Framework.Controls.DrawingSurfaceSIS(renderer);
                    ////ccDrawingSurfaceTop.Content = dsSIS;
                    ccDrawingSurfaceBottom.Content = dsSIS;
                    dsSIS.IsRunning = true;    


                };
                sbLoadView.Begin();


                SettingsPane.GetForCurrentView().CommandsRequested += _vm.onCommandsRequested;

                GestureService.Start(this);

            }
            catch { }
        }

        protected override void OnNavigatedFrom(NavigationEventArgs e)
        {
            base.OnNavigatedFrom(e);

            SettingsPane.GetForCurrentView().CommandsRequested -= _vm.onCommandsRequested;

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
