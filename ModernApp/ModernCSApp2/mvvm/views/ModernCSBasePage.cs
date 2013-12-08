using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ModernCSApp.Services;
using SumoNinjaMonkey.Framework.Services;
using Windows.UI;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Media;
using GalaSoft.MvvmLight.Messaging;
using SumoNinjaMonkey.Framework.Controls.Messages;
using Windows.Storage;
using Windows.Storage.Search;
using Windows.UI.Xaml;
using System.IO;
using System.Runtime.Serialization.Json;


namespace ModernCSApp.Views
{
    public class ModernCSBasePage: BaseUserPage
    {
        internal bool _drawLine = false;
        internal Windows.Foundation.Point? _lineStartPoint;
        internal Windows.Foundation.Point? _lineEndPoint;
        internal string _actionToDoOnRelease = string.Empty;

        public ModernCSBasePage()
        {
            

            WindowLayoutService.OnWindowLayoutRaised += WindowLayoutService_OnWindowLayoutRaised;
            AppService.NetworkConnectionChanged += AppService_NetworkConnectionChanged;

            Application.Current.Suspending += Current_Suspending;
            Application.Current.Resuming += Current_Resuming;
            Window.Current.VisibilityChanged += Current_VisibilityChanged;
        }

        void Current_VisibilityChanged(object sender, Windows.UI.Core.VisibilityChangedEventArgs e)
        {
            if (e.Visible)
            {
                AppDatabase.Current.LoadInstances();
                _startAll();

                NavigationService.NavigateOnUI("FlickrLoginView");
            }
            else
            {
                AppDatabase.Current.Unload();
                RenderingService.Unload();
                _stopAll();

                NavigationService.NavigateOnUI("SuspendedView");
            }

        }

       

        void Current_Suspending(object sender, Windows.ApplicationModel.SuspendingEventArgs e)
        {

            _stopAll();
            AppDatabase.Current.Unload();
            RenderingService.Unload();

        }

        void Current_Resuming(object sender, object e)
        {
            AppDatabase.Current.LoadInstances();
            _startAll();
        }

        void WindowLayoutService_OnWindowLayoutRaised(object sender, EventArgs e)
        {
            WindowLayoutEventArgs args = (WindowLayoutEventArgs)e;
            NavigationService.NavigateBasedOnWindowsLayoutChange(args);
        }

        void AppService_NetworkConnectionChanged(object sender, EventArgs e)
        {

            bool isConnected = (bool)sender;
            //if (isConnected)
            //{
            Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.High, () =>
            {
                //NavigationService.Navigate("FlickrLoginView");
                NavigationService.NavigateBasedOnNetworkConnectivity(isConnected);
            });
            //}
        }


        internal void drawLine(Windows.Foundation.Point? startPoint, Windows.Foundation.Point? endPoint, ref Windows.UI.Xaml.Shapes.Line line)
        {
            if (startPoint!=null && endPoint != null && _drawLine)
            {
                line.X1 = startPoint.Value.X;
                line.Y1 = startPoint.Value.Y;
                line.X2 = endPoint.Value.X;
                line.Y2 = endPoint.Value.Y;
                line.Visibility = Windows.UI.Xaml.Visibility.Visible;
            }
            else
            {
                line.Visibility = Windows.UI.Xaml.Visibility.Collapsed;
            }

        }


        public void UnloadBase()
        {
            WindowLayoutService.OnWindowLayoutRaised -= WindowLayoutService_OnWindowLayoutRaised;
            AppService.NetworkConnectionChanged -= AppService_NetworkConnectionChanged;
            Application.Current.Suspending -= Current_Suspending;
            Application.Current.Resuming -= Current_Resuming;
            Window.Current.VisibilityChanged -= Current_VisibilityChanged;
        }


        private void _stopAll()
        {
            LoggingService.Stop();
            AlertService.Stop();
            AppService.Stop();
            RenderingService.Stop();
            GestureService.Stop(this);
        }

        private void _startAll()
        {
            LoggingService.Start();
            AlertService.Start();
            AppService.Start();
            RenderingService.Start();
            GestureService.Start(this);
        }


        public T Deserialize<T>(string json)
        {
            var _Bytes = Encoding.Unicode.GetBytes(json);
            using (MemoryStream _Stream = new MemoryStream(_Bytes))
            {
                var _Serializer = new DataContractJsonSerializer(typeof(T));
                return (T)_Serializer.ReadObject(_Stream);
            }
        }

        public string Serialize(object instance)
        {
            using (MemoryStream _Stream = new MemoryStream())
            {
                var _Serializer = new DataContractJsonSerializer(instance.GetType());
                _Serializer.WriteObject(_Stream, instance);
                _Stream.Position = 0;
                using (StreamReader _Reader = new StreamReader(_Stream))
                { return _Reader.ReadToEnd(); }
            }
        }

        


    }
}
