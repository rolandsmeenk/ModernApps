
using System;
using System.Linq;
using System.Threading.Tasks;
using ModernCSApp.Services;
using SumoNinjaMonkey.Framework.Services;
using Windows.Data.Xml.Dom;
using Windows.UI.Notifications;
using System.Collections.Generic;
using GalaSoft.MvvmLight.Command;

namespace ModernCSApp.Models
{
    public class HomeViewModel : DefaultViewModel
    {

        public List<string> ListOfProjects { get; set; }

        public RelayCommand ChangeProjectCommand { get; set; }
        public RelayCommand AttemptLoginCommand { get; set; }
        public RelayCommand AttemptLogoutCommand { get; set; }




        private string _TitleTest;
        public string TitleTest
        {
            get { return this._TitleTest; }
            set { if (value != this._TitleTest) { this._TitleTest = value; this.RaisePropertyChanged("TitleTest"); } }
        }

        private bool _Menu1IsVisible;
        public bool Menu1IsVisible
        {
            get { return this._Menu1IsVisible; }
            set { if (value != this._Menu1IsVisible) { this._Menu1IsVisible = value; this.RaisePropertyChanged("Menu1IsVisible"); } }
        }

        private bool _Menu2IsVisible;
        public bool Menu2IsVisible
        {
            get { return this._Menu2IsVisible; }
            set { if (value != this._Menu2IsVisible) { this._Menu2IsVisible = value; this.RaisePropertyChanged("Menu2IsVisible"); } }
        }

        private bool _Menu3IsVisible;
        public bool Menu3IsVisible
        {
            get { return this._Menu3IsVisible; }
            set { if (value != this._Menu3IsVisible) { this._Menu3IsVisible = value; this.RaisePropertyChanged("Menu3IsVisible"); } }
        }


        public void Load()
        {
            Menu1IsVisible = true;
            Menu2IsVisible = true;
            Menu3IsVisible = false;

            TitleTest = "DataBound Title Test";
            
            ListOfProjects = new List<string>();

            for (int i = 0; i < 10; i++)
            {
                ListOfProjects.Add("Project " + i.ToString());
            }

            ChangeProjectCommand = new RelayCommand(() => ChangeProjectCommandAction());
            AttemptLoginCommand = new RelayCommand(() => AttemptLoginCommandAction());
            AttemptLogoutCommand = new RelayCommand(() => AttemptLogoutCommandAction());

        }


        private void ChangeProjectCommandAction()
        {
            //this.SendInformationNotification("Changed Project Clicked", 2);
            //this.MessageBox("MESSAGEBOX",  "Yes", "", "", "No", "", "");


            Menu1IsVisible = !Menu1IsVisible;
            Menu3IsVisible = !Menu3IsVisible;
        }


        private void AttemptLoginCommandAction()
        {
            if (PopupService.HasPopup)
                PopupService.CloseAll();
            else
                PopupService.Show(
                    new ModernCSApp.MVVM.Views.Popups.Login() { DataContext = this }
                    , null
                    , this.AccentColor
                    , this.AccentColorLightBy1Degree
                    , this.AccentColorLightBy2Degree
                    , this.BackgroundDarkBy1Color
                    , 999
                    , new Windows.UI.Xaml.Thickness(0)
                    , Windows.UI.Xaml.HorizontalAlignment.Center
                    , Windows.UI.Xaml.VerticalAlignment.Center
                    , width: 400
                    , height: 300
                    );
        }

        private void AttemptLogoutCommandAction()
        {

        }



    }
}
