using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234238

namespace ModernCSApp3
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        public MainPage()
        {
            this.InitializeComponent();
        }

        private void butStart_Click(object sender, Windows.UI.Xaml.RoutedEventArgs e)
        {
            Random rnd = new Random();
            int startMilliseconds = rnd.Next(10, 600);
            ctlFukingAmazingTile1.StartAnimation(new SolidColorBrush(Colors.Green), startMilliseconds, ModernTile.eAnimationType.CenterDot);
            startMilliseconds = rnd.Next(10, 200);
            ctlFukingAmazingTile2.StartAnimation(new SolidColorBrush(Colors.Red), startMilliseconds, ModernTile.eAnimationType.CenterDot);
            startMilliseconds = rnd.Next(10, 200);
            ctlFukingAmazingTile3.StartAnimation(new SolidColorBrush(Colors.Pink), startMilliseconds, ModernTile.eAnimationType.CenterDot);
            startMilliseconds = rnd.Next(10, 200);
            ctlFukingAmazingTile4.StartAnimation(new SolidColorBrush(Colors.Yellow), startMilliseconds, ModernTile.eAnimationType.CenterDot);
            startMilliseconds = rnd.Next(10, 200);
            ctlFukingAmazingTile5.StartAnimation(new SolidColorBrush(Colors.Orange), startMilliseconds, ModernTile.eAnimationType.CenterDot);
            startMilliseconds = rnd.Next(10, 200);
            ctlFukingAmazingTile6.StartAnimation(new SolidColorBrush(Colors.Purple), startMilliseconds, ModernTile.eAnimationType.CenterDot);
            startMilliseconds = rnd.Next(10, 200);
            ctlFukingAmazingTile7.StartAnimation(new SolidColorBrush(Colors.Brown), startMilliseconds, ModernTile.eAnimationType.CenterDot);
            startMilliseconds = rnd.Next(10, 200);
            ctlFukingAmazingTile8.StartAnimation(new SolidColorBrush(Colors.Blue), startMilliseconds, ModernTile.eAnimationType.CenterDot);
            startMilliseconds = rnd.Next(10, 200);
            ctlFukingAmazingTile9.StartAnimation(new SolidColorBrush(Colors.LightCyan), startMilliseconds, ModernTile.eAnimationType.CenterDot);
        }
    }
}
