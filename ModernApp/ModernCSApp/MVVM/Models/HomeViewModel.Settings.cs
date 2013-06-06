
using GalaSoft.MvvmLight.Command;
using ModernCSApp.MVVM.Views.Settings;
using Windows.ApplicationModel.Resources;
using Windows.Foundation;
using Windows.UI.ApplicationSettings;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
namespace ModernCSApp.Models
{
    public partial class HomeViewModel : DefaultViewModel
    {

        //public RelayCommand ReturnToSettingsCommand { get; set; }

        private Popup _settingsPopup;
        private double _settingsWidth = 346;
        private Rect _windowBounds;
        //private SettingsPane _settingsPane;

        public void onCommandsRequested(SettingsPane settingsPane, SettingsPaneCommandsRequestedEventArgs eventArgs)
        {
            //_settingsPane = settingsPane;

            //THE SETTINGS PANE CAN BE POPULATED WITH OUR OWN UI
            _windowBounds = Window.Current.CoreWindow.Bounds;
             //ResourceLoader rl = new ResourceLoader();
      
             SettingsCommand cmd = new SettingsCommand("mcsa_graphics", 
                 "Graphics", (x) =>
                 {
                     _settingsPopup = new Popup();
                     _settingsPopup.Closed += OnPopupClosed;
                     Window.Current.Activated += OnWindowActivated;
                     _settingsPopup.IsLightDismissEnabled = true;
                     _settingsPopup.Width = _settingsWidth;
                     _settingsPopup.Height = _windowBounds.Height;

                     Graphics mypane = new Graphics();
                     mypane.Width = _settingsWidth;                    
                     mypane.Height = _windowBounds.Height;

                     _settingsPopup.Child = mypane;
                     _settingsPopup.SetValue(Canvas.LeftProperty, _windowBounds.Width - _settingsWidth);
                     _settingsPopup.SetValue(Canvas.TopProperty, 0);
                     _settingsPopup.IsOpen = true;

                 });

             eventArgs.Request.ApplicationCommands.Add(cmd);


             SettingsCommand cmd2 = new SettingsCommand("mcsa_general",
                  "User", (x) =>
                  {
                      _settingsPopup = new Popup();
                      _settingsPopup.Closed += OnPopupClosed;
                      Window.Current.Activated += OnWindowActivated;
                      _settingsPopup.IsLightDismissEnabled = true;
                      _settingsPopup.Width = _settingsWidth;
                      _settingsPopup.Height = _windowBounds.Height;

                      User  mypane = new User();
                      mypane.Width = _settingsWidth;
                      mypane.Height = _windowBounds.Height;

                      _settingsPopup.Child = mypane;
                      _settingsPopup.SetValue(Canvas.LeftProperty, _windowBounds.Width - _settingsWidth);
                      _settingsPopup.SetValue(Canvas.TopProperty, 0);
                      _settingsPopup.IsOpen = true;

                  });

             eventArgs.Request.ApplicationCommands.Add(cmd2);

             SettingsCommand cmd3 = new SettingsCommand("mcsa_social",
                   "Social & Public", (x) =>
                   {
                       _settingsPopup = new Popup();
                       _settingsPopup.Closed += OnPopupClosed;
                       Window.Current.Activated += OnWindowActivated;
                       _settingsPopup.IsLightDismissEnabled = true;
                       _settingsPopup.Width = _settingsWidth;
                       _settingsPopup.Height = _windowBounds.Height;

                       PublicSocial mypane = new PublicSocial();
                       mypane.Width = _settingsWidth;
                       mypane.Height = _windowBounds.Height;

                       _settingsPopup.Child = mypane;
                       _settingsPopup.SetValue(Canvas.LeftProperty, _windowBounds.Width - _settingsWidth);
                       _settingsPopup.SetValue(Canvas.TopProperty, 0);
                       _settingsPopup.IsOpen = true;
                   });

             eventArgs.Request.ApplicationCommands.Add(cmd3);

             SettingsCommand cmd4 = new SettingsCommand("mcsa_about",
                    "About", (x) =>
                    {
                        _settingsPopup = new Popup();
                        _settingsPopup.Closed += OnPopupClosed;
                        Window.Current.Activated += OnWindowActivated;
                        _settingsPopup.IsLightDismissEnabled = true;
                        _settingsPopup.Width = _settingsWidth;
                        _settingsPopup.Height = _windowBounds.Height;

                        About mypane = new About();
                        mypane.Width = _settingsWidth;
                        mypane.Height = _windowBounds.Height;

                        _settingsPopup.Child = mypane;
                        _settingsPopup.SetValue(Canvas.LeftProperty, _windowBounds.Width - _settingsWidth);
                        _settingsPopup.SetValue(Canvas.TopProperty, 0);
                        _settingsPopup.IsOpen = true;
                    });

             eventArgs.Request.ApplicationCommands.Add(cmd4);
        }

        void OnPopupClosed(object sender, object e)
        {
            Window.Current.Activated -= OnWindowActivated;
            
        }


        private void OnWindowActivated(object sender, Windows.UI.Core.WindowActivatedEventArgs e)
        {
            if (e.WindowActivationState == Windows.UI.Core.CoreWindowActivationState.Deactivated)
            {
                _settingsPopup.IsOpen = false;
            }
            //else
            //{
            //    ReturnToSettingsCommand = new RelayCommand(() => ReturnToSettingsCommandAction());
            //}
        }

        //private void ReturnToSettingsCommandAction()
        //{
            
        //}

    }

}
