using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using ModernCSApp.Services;
using SumoNinjaMonkey.Framework.Services;
using Windows.ApplicationModel;
using Windows.ApplicationModel.Activation;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;
using ModernCSApp;

namespace ModernCSApp
{
    /// <summary>
    /// Provides application-specific behavior to supplement the default Application class.
    /// </summary>
    sealed partial class App : Application
    {
        /// <summary>
        /// Initializes the singleton application object.  This is the first line of authored code
        /// executed, and as such is the logical equivalent of main() or WinMain().
        /// </summary>
        public App()
        {
            this.InitializeComponent();
            this.Suspending += OnSuspending;
            this.Resuming += OnResuming;
        }

        /// <summary>
        /// Invoked when the application is launched normally by the end user.  Other entry points
        /// will be used when the application is launched to open a specific file, to display
        /// search results, and so forth.
        /// </summary>
        /// <param name="args">Details about the launch request and process.</param>
        protected override void OnLaunched(LaunchActivatedEventArgs args)
        {
            // Do not repeat app initialization when already running, just ensure that
            // the window is active
            if (args.PreviousExecutionState == ApplicationExecutionState.Running)
            {
                Window.Current.Activate();
                return;
            }

            if (args.PreviousExecutionState == ApplicationExecutionState.Terminated)
            {
                //TODO: Load state from previously suspended application
            }

            //// Create a Frame to act navigation context and navigate to the first page
            //var rootFrame = new Frame();
            //if (!rootFrame.Navigate(typeof(MainPage)))
            //{
            //    throw new Exception("Failed to create initial page");
            //}

            LoggingService.Init(AppDatabase.Current);
            LoggingService.Start();
            LoggingService.LogInformation("launching app...", "App.OnLaunched");

            AlertService.Init(AppDatabase.Current);
            AlertService.Start();
            LoggingService.LogInformation("initialized alerts...", "App.OnLaunched");

            GestureService.Init();
            LoggingService.LogInformation("initialized gensture manager...", "App.OnLaunched");


            // Place the frame in the current Window and ensure that it is active
            Window.Current.Content = new MasterPage(false); //rootFrame;
            Window.Current.Activate();
        }

        /// <summary>
        /// Invoked when application execution is being suspended.  Application state is saved
        /// without knowing whether the application will be terminated or resumed with the contents
        /// of memory still intact.
        /// </summary>
        /// <param name="sender">The source of the suspend request.</param>
        /// <param name="e">Details about the suspend request.</param>
        private void OnSuspending(object sender, SuspendingEventArgs e)
        {
            LoggingService.Stop();
            AlertService.Stop();

            var deferral = e.SuspendingOperation.GetDeferral();
            //TODO: Save application state and stop any background activity
            deferral.Complete();
        }

        void OnResuming(object sender, object e)
        {

            LoggingService.Start();
            LoggingService.LogInformation("resuming app...", "App.OnResuming");
            AlertService.Start();
            LoggingService.LogInformation("restarting alerts...", "App.OnResuming");
            //YouTubeService.Current.Init();
            //LoggingService.LogInformation("initialized youtube...", "App.OnResuming");
        }


        protected override void OnSearchActivated(SearchActivatedEventArgs args)
        {


        }

    }
}
