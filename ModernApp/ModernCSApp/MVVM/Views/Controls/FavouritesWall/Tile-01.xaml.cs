using ModernCSApp.Services;
using ModernCSApp.Views;
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
using Windows.UI.Xaml.Media.Animation;
using Windows.UI.Xaml.Media.Imaging;
using Windows.UI.Xaml.Navigation;

namespace ModernCSApp.Views.Controls
{
    public sealed partial class Tile_01 : BaseUserControl
    {
        public Tile_01()
        {
            this.InitializeComponent();

            
        }

        public async Task LoadControl(int fontSize, int alignment, int deltaImageMove, int deltaTextMove, int animationDuration, string imagePath)
        {
            //style text
            title.FontSize = fontSize;
            

            //predefine animations
            DoubleAnimation daBkgImageX = (DoubleAnimation)sbPlay001.Children[0];
            DoubleAnimation daBkgImageY = (DoubleAnimation)sbPlay001.Children[1];
            DoubleAnimation daTitleX = (DoubleAnimation)sbPlay001.Children[2];
            DoubleAnimation daTitleY = (DoubleAnimation)sbPlay001.Children[3];

            daBkgImageX.Duration = TimeSpan.FromSeconds(animationDuration);
            daBkgImageY.Duration = TimeSpan.FromSeconds(animationDuration);
            daTitleX.Duration = TimeSpan.FromSeconds(animationDuration);
            daTitleY.Duration = TimeSpan.FromSeconds(animationDuration);

            switch (alignment)
            {
                case 0:
                    title.VerticalAlignment = Windows.UI.Xaml.VerticalAlignment.Top;
                    daBkgImageX.To = -deltaImageMove;
                    daBkgImageY.To = -deltaImageMove / 3;
                    daTitleX.To = deltaTextMove;
                    daTitleY.To = deltaTextMove / 3;
                    break;
                case 1:
                    title.VerticalAlignment = Windows.UI.Xaml.VerticalAlignment.Center;
                    daBkgImageY.To = -deltaImageMove / 3;
                    daTitleX.To = -deltaTextMove;
                    daTitleY.To = -deltaTextMove*8;
                    break;
            }
            
            //load image
            StorageFile file = await FileExists("ModernCSApp\\small", imagePath, type: 2);
            
            if (file != null)
            {
                using (var imgSource = await file.OpenAsync(FileAccessMode.Read))
                {
                    var bi = new BitmapImage();
                    await bi.SetSourceAsync(imgSource);

                    image.Source = (ImageSource)bi;

                    sbPlay001.Begin();
                }
                
            }

        }

        private void PLAY(object sender, PointerRoutedEventArgs e)
        {
            YoutubeDataItem ytdi = (YoutubeDataItem)this.DataContext;
            SendSystemWideMessage("VIDEOPANORAMA", "", action: "CHANGE VIDEO", text1: ytdi.localID);
        }

    }
}
