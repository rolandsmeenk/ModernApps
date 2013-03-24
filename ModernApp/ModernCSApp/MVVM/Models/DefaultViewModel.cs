
using GalaSoft.MvvmLight;

using System;
using System.Linq.Expressions;
using System.Reflection;

using Windows.UI.Notifications;
using Windows.Data.Xml.Dom;
using ModernCSApp.Services;
using GalaSoft.MvvmLight.Command;

namespace ModernCSApp.Models
{
    public class DefaultViewModel : ViewModelBase
    {
        private bool _isBusy;
        private bool _canShare = true;
        public bool IsBusy
        {
            get
            {
                return this._isBusy;
            }
            set
            {
                if (value != this._isBusy)
                {
                    this._isBusy = value;
                    this.RaisePropertyChanged("IsBusy");
                }
            }
        }
        public RelayCommand BackCommand
        {
            get;
            set;
        }
        public RelayCommand ShareCommand
        {
            get;
            set;
        }
        public virtual bool CanShare
        {
            get
            {
                return this._canShare;
            }
            set
            {
                this._canShare = value;
                this.RaisePropertyChanged("CanShare");
            }
        }
        public DefaultViewModel()
        {
            this.BackCommand = new RelayCommand(delegate
            {
                this.OnBackPressed();
                NavigationService.GoBack();
            }
            );
            this.ShareCommand = new RelayCommand(delegate
            {
                this.Share();
            }
            , () => this.CanShare);
        }
        protected virtual void OnBackPressed()
        {
        }
        public virtual void Share()
        {
        }
        public virtual void OnNavigatedTo(object parameters)
        {
        }
        public virtual void OnNavigatedFrom(object parameters)
        {
        }




        public void ClearTileNotification()
        {
            try
            {
                if (AppService.IsConnected())
                {
                    TileUpdateManager.CreateTileUpdaterForApplication().Clear();
                }
            }
            catch (Exception ex)
            {
            }
        }

        public void SendTileTextNotification(string imageUrl = "ms-appx:///Assets/MainTiles/AlphaPad.jpg")
        {
            try
            {
                if (AppService.IsConnected())
                {
                    //+ TEMPLATE
                    XmlDocument templateContent = TileUpdateManager.GetTemplateContent(TileTemplateType.TileSquarePeekImageAndText01);
                    templateContent.GetXml().ToString();

                    //  TEMPLATE + TITLE
                    XmlNodeList elementsByTagName = templateContent.GetElementsByTagName("text");
                    elementsByTagName[0].AppendChild(templateContent.CreateTextNode("Title 01"));

                    //  TEMPLATE + IMAGE
                    XmlNodeList elementsByTagName2 = templateContent.GetElementsByTagName("image");
                    XmlElement xmlElement = (XmlElement)elementsByTagName2.Item(0u);
                    xmlElement.SetAttribute("src", imageUrl);
                    xmlElement.SetAttribute("alt", "Sample SharpDx/XAML/C# apps");

                    //+ NOTIFICATION
                    //  NOTIFICATION + TEMPLATE
                    TileNotification tileNotification = new TileNotification(templateContent);
                    tileNotification.ExpirationTime = new DateTimeOffset?(DateTimeOffset.Now.AddMinutes(1.0));
                    tileNotification.Tag = "Tag 01";

                    //UPDATE APP
                    // -> NOTIFICATION
                    TileUpdateManager.CreateTileUpdaterForApplication().EnableNotificationQueue(true);
                    TileUpdateManager.CreateTileUpdaterForApplication().Update(tileNotification);
                }
            }
            catch (Exception)
            {
            }
        }


    }
}
