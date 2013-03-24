
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

        public bool Menu1IsVisible { get; set; }
        public bool Menu2IsVisible { get; set; }
        public bool Menu3IsVisible { get; set; }

        private string _TitleTest;

        public string TitleTest
        {
            get
            {
                return this._TitleTest;
            }
            set
            {
                if (value != this._TitleTest)
                {
                    this._TitleTest = value;
                    this.RaisePropertyChanged("TitleTest");
                }
            }
        }


        public void Load()
        {
            Menu1IsVisible = false;
            Menu2IsVisible = false;
            Menu3IsVisible = false;

            TitleTest = "DataBound Title Test";
            

            ListOfProjects = new List<string>();


            for (int i = 0; i < 10; i++)
            {
                ListOfProjects.Add("Project " + i.ToString());
            }



            ChangeProjectCommand = new RelayCommand(() => ChangeProjectCommandAction());


            ChangeProjectCommandAction();

        }


        private void ChangeProjectCommandAction()
        {
            
        }




    }
}
