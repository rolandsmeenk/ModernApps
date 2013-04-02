

using System;
using Windows.ApplicationModel.Search;

namespace ModernCSApp.Models
{
    public partial class HomeViewModel : DefaultViewModel
    {
        //note: App.xaml.cs -> OnSearchActivated  <== wire up search from OS into this APP
        public void onQuerySubmitted(SearchPane sender, SearchPaneQuerySubmittedEventArgs args)
        {
            //THE SEARCHPANE CAN BE POPULATED WITH OUR OWN UI
        }

    }

}
