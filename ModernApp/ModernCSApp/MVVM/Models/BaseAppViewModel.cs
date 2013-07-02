
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
using FlickrNet;

namespace ModernCSApp.Models
{
    public partial class BaseAppViewModel : DefaultViewModel
    {
        public OAuthAccessToken _at;
        public FlickrNet.Flickr _flickr = null;
        const string apiKey = "102e389a942747faebb958c4db95c098";
        const string apiSecret = "774b263b4d3a2578";

        public Person FlickrPerson { get; set; }
        


        public string FullName { get { return _at.FullName; } }
        public string ScreenName { get { return _at.ScreenName; } }
        public string Username { get { return _at.Username; } }
        public string BuddyIconUrl { get; set; }



        public BaseAppViewModel()
        {
            _flickr = new FlickrNet.Flickr(apiKey, apiSecret);
        }



        public void ViewInit()
        {
            if (IsFlickrLoginDetailsCached())
            {
                _at = new OAuthAccessToken();
                var found = Services.AppDatabase.Current.AppStates.Where(x => x.Name == "at.FullName").FirstOrDefault();
                _at.FullName = found.Value;
                found = Services.AppDatabase.Current.AppStates.Where(x => x.Name == "at.ScreenName").FirstOrDefault();
                _at.ScreenName = found.Value;
                found = Services.AppDatabase.Current.AppStates.Where(x => x.Name == "at.UserId").FirstOrDefault();
                _at.UserId = found.Value;
                found = Services.AppDatabase.Current.AppStates.Where(x => x.Name == "at.Username").FirstOrDefault();
                _at.Username = found.Value;
                found = Services.AppDatabase.Current.AppStates.Where(x => x.Name == "at.Token").FirstOrDefault();
                _at.Token = found.Value;
                found = Services.AppDatabase.Current.AppStates.Where(x => x.Name == "at.TokenSecret").FirstOrDefault();
                _at.TokenSecret = found.Value;
                found = Services.AppDatabase.Current.AppStates.Where(x => x.Name == "fp.BuddyIconUrl").FirstOrDefault();
                BuddyIconUrl = found != null ? found.Value : string.Empty;

                _flickr.OAuthAccessToken = _at.Token;
                _flickr.OAuthAccessTokenSecret = _at.TokenSecret;

            }
        }


        public bool IsFlickrLoginDetailsCached()
        {
            var found = Services.AppDatabase.Current.AppStates.Where(x => x.Name == "at.FullName").FirstOrDefault();
            if (found != null)
            {
                return true;
            }

            return false;
        }


    }


}
