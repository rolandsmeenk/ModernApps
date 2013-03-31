
using System;
using System.Linq;
using System.Threading.Tasks;
using ModernCSApp.Services;
using SumoNinjaMonkey.Framework.Services;
using Windows.Data.Xml.Dom;
using Windows.UI.Notifications;
using System.Collections.Generic;
using GalaSoft.MvvmLight.Command;
using Windows.UI.Xaml.Controls;
using System.Collections.ObjectModel;

namespace ModernCSApp.Models
{
    public partial class HomeViewModel : DefaultViewModel
    {

        public RelayCommand ShowLoginCommand { get; set; }
        public RelayCommand HideLoginCommand { get; set; }
        public RelayCommand AttemptLoginCommand { get; set; }
        public RelayCommand AttemptLogoutCommand { get; set; }


        private string _LoginUserFullName;
        public string LoginUserFullName
        {
            get { return this._LoginUserFullName; }
            set { if (value != this._LoginUserFullName) { this._LoginUserFullName = value; this.RaisePropertyChanged("LoginUserFullName"); _determinIfCanLogin(); } }
        }

        private string _LoginUserName;
        public string LoginUserName
        {
            get { return this._LoginUserName; }
            set { if (value != this._LoginUserName) { this._LoginUserName = value; this.RaisePropertyChanged("LoginUserName"); _determinIfCanLogin(); } }
        }

        private string _LoginPassword;
        public string LoginPassword
        {
            get { return this._LoginPassword; }
            set { if (value != this._LoginPassword) { this._LoginPassword = value; this.RaisePropertyChanged("LoginPassword"); _determinIfCanLogin(); } }
        }


        private string _LoginButtonLabel;
        public string LoginButtonLabel
        {
            get { return this._LoginButtonLabel; }
            set { if (value != this._LoginButtonLabel) { this._LoginButtonLabel = value; this.RaisePropertyChanged("LoginButtonLabel"); } }
        }


        private bool _IsAttemptingLogin;
        public bool IsAttemptingLogin
        {
            get { return this._IsAttemptingLogin; }
            set { if (value != this._IsAttemptingLogin) { this._IsAttemptingLogin = value; this.RaisePropertyChanged("IsAttemptingLogin"); } }
        }

        private bool _LoginButtonEnabled;
        public bool LoginButtonEnabled
        {
            get { return this._LoginButtonEnabled; }
            set { if (value != this._LoginButtonEnabled) { this._LoginButtonEnabled = value; this.RaisePropertyChanged("LoginButtonEnabled"); } }
        }

        private bool _LoginUserNameEnabled;
        public bool LoginUserNameEnabled
        {
            get { return this._LoginUserNameEnabled; }
            set { if (value != this._LoginUserNameEnabled) { this._LoginUserNameEnabled = value; this.RaisePropertyChanged("LoginUserNameEnabled"); } }
        }

        private bool _LoginPasswordEnabled;
        public bool LoginPasswordEnabled
        {
            get { return this._LoginPasswordEnabled; }
            set { if (value != this._LoginPasswordEnabled) { this._LoginPasswordEnabled = value; this.RaisePropertyChanged("LoginPasswordEnabled"); } }
        }



        public void _LoadLoginLogout()
        {
            
            LoginUserFullName = "Jose Fajardo";
            LoginButtonLabel = "Login";
            LoginUserNameEnabled = true;
            LoginPasswordEnabled = true;

   
            ShowLoginCommand = new RelayCommand(() => ShowLoginCommandAction());
            HideLoginCommand = new RelayCommand(() => HideLoginCommandAction());
            AttemptLoginCommand = new RelayCommand(() => AttemptLoginCommandAction());
            AttemptLogoutCommand = new RelayCommand(() => AttemptLogoutCommandAction());

        }

      



        private void _determinIfCanLogin()
        {
            if (LoginUserName !=null 
                && LoginUserName.Length > 0
                && LoginPassword != null
                && LoginPassword.Length > 0)
            {
                LoginButtonEnabled = true;
            }
            else LoginButtonEnabled = false;
        }

      


        private void ShowLoginCommandAction()
        {
            if (!PopupService.HasPopup)
                PopupService.Show(
                    new ModernCSApp.MVVM.Views.Popups.Login() { DataContext = this }
                    , null
                    , new Windows.UI.Xaml.Media.SolidColorBrush(Windows.UI.Colors.Black)
                    , new Windows.UI.Xaml.Media.SolidColorBrush(Windows.UI.Colors.Transparent)
                    , new Windows.UI.Xaml.Media.SolidColorBrush(Windows.UI.Colors.Transparent)
                    , new Windows.UI.Xaml.Media.SolidColorBrush(Windows.UI.Colors.White)
                    , 999
                    , new Windows.UI.Xaml.Thickness(0)
                    , Windows.UI.Xaml.HorizontalAlignment.Center
                    , Windows.UI.Xaml.VerticalAlignment.Center
                    , width: 400
                    , height: 300
                    , showPopupInnerBorder:false
                    );
        }

        private void HideLoginCommandAction()
        {

            this.TopAppBarUserControl = new ModernCSApp.Views.Toolbars.AppBarDemo01() { } ;
            this.TopAppBarIsVisible = true;
            this.BottomAppBarUserControl = null;
            this.BottomAppBarIsVisible = false;

            if (PopupService.HasPopup)
                PopupService.CloseAll();
        }

        private void AttemptLoginCommandAction()
        {
            LoginButtonLabel = "Logging in ...";
            IsAttemptingLogin = true;
            LoginUserNameEnabled = false;
            LoginPasswordEnabled = false;


            Windows.UI.Xaml.DispatcherTimer dtDummyLoginAttempt = new Windows.UI.Xaml.DispatcherTimer();
            dtDummyLoginAttempt.Interval = TimeSpan.FromSeconds(3);
            dtDummyLoginAttempt.Tick += (o,e) => {

                dtDummyLoginAttempt.Stop();
                LoginButtonLabel = "Success";
                IsAttemptingLogin = false;

                HideLoginCommand.Execute(null);
            };
            dtDummyLoginAttempt.Start();
            
        }

        private void AttemptLogoutCommandAction()
        {

        }



    }

}
