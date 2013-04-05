using ModernCSApp.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ks
{
    public partial class MainPage
    {
        private KeystoneStore _Store { get; set; }
        
        private WindowLayoutEventArgs _CurrentWindowLayout { get; set; }

        void Init()
        {
            _Store = new KeystoneStore();
            WindowLayoutService.OnWindowLayoutRaised += OnWindowLayoutRaised;
            
        }

        void UnInit()
        {
            WindowLayoutService.OnWindowLayoutRaised -= OnWindowLayoutRaised;
        }


        void OnWindowLayoutRaised(object sender, EventArgs e)
        {
            WindowLayoutEventArgs wlea = (WindowLayoutEventArgs)e;
            _CurrentWindowLayout = wlea;




        }


    }

}
