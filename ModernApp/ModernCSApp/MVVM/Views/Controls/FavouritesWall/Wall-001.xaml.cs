using ModernCSApp.Services;
using ModernCSApp.Views;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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


namespace ModernCSApp.Views.Controls
{
    public sealed partial class Wall_001 : BaseUserControl
    {
        public Wall_001()
        {
            this.InitializeComponent();
        }


        public async void LoadData(int totalItemsToLoad)
        {
            Random rnd = new Random();

            var items = await YouTubeService.Current.GetRandomFromHistory("your_favourites", totalItemsToLoad);

            int i = 0;
            foreach(var item in items)
            {
                var parts = item.ImagePath.Split(".".ToCharArray());
                string fileNameToUse = item.Uid.Replace("\"", "").Replace(" ", "").Replace("'", "").Replace(".", "");



                Tile_01 tile = new Tile_01();
                tile.HorizontalAlignment = Windows.UI.Xaml.HorizontalAlignment.Stretch;
                tile.VerticalAlignment = Windows.UI.Xaml.VerticalAlignment.Stretch;
                tile.Width = 350;
                tile.Height = 120;
                tile.SetValue(Grid.RowProperty, i);
                tile.BackgroundColor = this.AccentColor;
                tile.DataContext = item;
                spList.Children.Add(tile);
                await tile.LoadControl(
                    rnd.Next(56, 86),
                    rnd.Next(0, 2), 
                    rnd.Next(0, 100),
                    rnd.Next(0, 30),
                    rnd.Next(15, 30),
                    fileNameToUse + "." + parts[parts.Length - 1]
                    );
                i++;
            }
        }
    }
}
