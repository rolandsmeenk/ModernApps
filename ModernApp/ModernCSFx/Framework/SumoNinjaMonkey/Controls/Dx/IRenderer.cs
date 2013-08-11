

using CommonDX;
using SharpDX.Toolkit;
using System;
namespace SumoNinjaMonkey.Framework.Controls.DrawingSurface
{
    public interface IRenderer 
    {
        void Initialize(DeviceManager deviceManager);
        void InitializeUI(Windows.UI.Xaml.UIElement rootForPointerEvents, Windows.UI.Xaml.UIElement rootOfLayout);
        void Update(GameTime gameTime);
        void Render(TargetBase target);
        
        void LoadLocalAsset(string assetUri);
        void Unload();
        
    }
}
