using ModernCSApp.Services;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Storage;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;


namespace ks
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {

        public MainPage()
        {
            this.InitializeComponent();

            this.Init();

        }


        protected async override void OnNavigatedTo(NavigationEventArgs e)
        {
            progress.IsActive = true;

            if (!_HasPassport)
            {
                //await _attemptPassportLogin();
                await _attemptPassportLoginFake();
            }

            if (_HasPassport)
            {
                //await _loadData();
                await _loadDataFake();
            }

            progress.IsActive = false;
        }

        private async Task<bool> _loadData (){
            
            var userList = await ksWebServices.CallServices.GetCompanyList(_MemberAuthentication.MemberId, _LoggedInMember.RequestDTO.EntityTypeId,_MemberAuthentication.AvailableProjects.First().Id, string.Empty);

            foreach (var item in userList.Take(1000))
            {
                _Store.Collection.Add(new Item()
                {
                    Title = item.Name,
                    Content = item.Email,
                    Subtitle = item.Shortname,
                    Category = item.ABN
                });
            }

            List<GroupInfoList<object>> dataLetter = _Store.GetGroupsByLetter();
            cvs2.Source = dataLetter;
            (semanticZoom.ZoomedOutView as ListViewBase).ItemsSource = cvs2.View.CollectionGroups;

            return true;
        }

        private async Task<bool> _loadDataFake()
        {

            var jsonFile = await GetPackagedFile("Assets", "sample.json");

            var data = await FileIO.ReadTextAsync(jsonFile);

            var userList = JsonConvert.DeserializeObject<ksWebServices.srPortalPortalService.CompanyDTO1[]>(data);

            //_batchs = Batch<ksWebServices.srPortalPortalService.CompanyDTO1>(userList, 100).ToList();

            //await _processBatchs();

            foreach (var item in userList.Take(1000))
            {
                _Store.Collection.Add(new Item()
                {
                    Title = item.Name,
                    Content = item.Email,
                    Subtitle = item.Shortname,
                    Category = item.ABN
                });
            }

            //var jsonSerialized = JsonConvert.SerializeObject(userList);

            List<GroupInfoList<object>> dataLetter = _Store.GetGroupsByLetter();
            cvs2.Source = dataLetter;
            (semanticZoom.ZoomedOutView as ListViewBase).ItemsSource = cvs2.View.CollectionGroups;

            return true;
        }

        

    }


}
