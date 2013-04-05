using ModernCSApp.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Storage;

namespace ks
{
    public partial class MainPage
    {
        private ksWebServices.srKeystoneInstanceReadOnlyService.MemberAuthenticationDTO _MemberAuthentication;
        private ksWebServices.srKeystoneInstanceReadOnlyService.LoggedInMemberDTO _LoggedInMember;

        private bool _HasPassport = false; 

        private async Task<bool> _attemptPassportLogin()
        {
            var loggedIn = await ksWebServices.CallServices.AttemptLogin("aca.incite", "Password1");

            _MemberAuthentication = loggedIn.Item1;
            _LoggedInMember = loggedIn.Item3;

            _HasPassport = true;
            return _HasPassport;

        }

        private async Task<bool> _attemptPassportLoginFake()
        {

            _HasPassport = true;
            return _HasPassport;

        }
    }

}
