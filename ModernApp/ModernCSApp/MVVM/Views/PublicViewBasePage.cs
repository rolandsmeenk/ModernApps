
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
using ModernCSApp.Views.Controls.Flickr;


namespace ModernCSApp.Views
{
    public partial class PublicViewBasePage : ModernCSBasePage
    {
        public HomeViewModel _vm { get; set; }
        public FlickrViewModel _fvm { get; set; }


        internal void OnNavigateToBase(Windows.UI.Core.CoreDispatcher dispatcher)
        {
            _vm = new HomeViewModel();
            _vm.Load();

            _fvm = new FlickrViewModel(Dispatcher);

            Messenger.Default.Register<GeneralSystemWideMessage>(this, DoGeneralSystemWideMessageCallback);

        }

        internal void UnloadBase()
        {
            Messenger.Default.Unregister<GeneralSystemWideMessage>(this, DoGeneralSystemWideMessageCallback);

            _fvm.Unload();

            _vm = null;
            _fvm = null;
        }

        public void DoGeneralSystemWideMessageCallback(GeneralSystemWideMessage message)
        {
            if (message.Identifier != "PublicView") return;

            switch (message.Action)
            {
                case "YesPromote":
                    MsgBoxService.Hide();
                    break;
                case "NoPromote":
                    MsgBoxService.Hide();
                    break;

                case "YesFavourite":
                    MsgBoxService.Hide();
                    break;
                case "NoFavourite":
                    MsgBoxService.Hide();
                    break;


            }
        }

    }
}
