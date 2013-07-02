
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
    public partial class SettingsViewModel : BaseAppViewModel
    {

        public ObservableCollection<ProjectListItem> ListOfProjects { get; set; }

        public RelayCommand ResetFlickrLoginCommand { get; set; }
        public RelayCommand SendWhatsWrongCommand { get; set; }


        private string _Status;
        public string Status
        {
            get { return this._Status; }
            set { if (value != this._Status) { this._Status = value; this.RaisePropertyChanged("Status"); } }
        }

        private string _WhatsWrong;
        public string WhatsWrong
        {
            get { return this._WhatsWrong; }
            set { if (value != this._WhatsWrong) { this._WhatsWrong = value; this.RaisePropertyChanged("WhatsWrong"); } }
        }


        public SettingsViewModel()
        {
            _Load();
        }

        private void _Load()
        {
            
            Status = "";


            ResetFlickrLoginCommand = new RelayCommand(() => ResetFlickrLoginCommandAction());
            SendWhatsWrongCommand = new RelayCommand(() => SendWhatsWrongCommandAction());

            ViewInit();

        }




        private void ResetFlickrLoginCommandAction()
        {
            var found = Services.AppDatabase.Current.AppStates.Where(x => x.Name == "at.FullName").FirstOrDefault();
            if (found != null)
            {
                Services.AppDatabase.Current.DeleteAppStates();
                Services.AppDatabase.Current.LoadInstances();
            }

        }


        private void SendWhatsWrongCommandAction()
        {
            var t = WhatsWrong;
        }


    }


}
