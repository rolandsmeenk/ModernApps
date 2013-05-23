
using ModernCSApp.Views;
using SumoNinjaMonkey.Framework.Controls.DrawingSurface;
using System;
using Windows.UI.Xaml.Input;



namespace ModernCSApp.Services
{
    public class RenderingService
    {
        private static CommonDX.DeviceManager _deviceManager;
        private static IRenderer _renderer;

        public static SumoNinjaMonkey.Framework.Controls.DrawingSurfaceSIS DrawingSIS;


        private static RenderingService Instance = new RenderingService();
        private static GlobalState _state;

        private static bool _isInitialized = false;

        


        public static IBackgroundRenderer BackgroundRenderer
        {
            get {
                if (_renderer != null && _renderer is IBackgroundRenderer)
                {
                    return (IBackgroundRenderer)_renderer;
                }
                else return null;
            }
        }

        private RenderingService()
        {
            _deviceManager = new CommonDX.DeviceManager();

        }

        public static void Init(GlobalState state)
        {
            if (_isInitialized) return;
            
            if(state!=null)_state = state;
            
            _renderer = new DxRenderer.BackgroundComposer() { State = _state };

            DrawingSIS = new SumoNinjaMonkey.Framework.Controls.DrawingSurfaceSIS(_renderer);

            _isInitialized = true;
        }

        public static void Start()
        {
            if (!_isInitialized) throw new Exception("Renderer needs to be initialized first");

            DrawingSIS.IsRunning = true;
        }

        public static void Stop()
        {
            DrawingSIS.IsRunning = false;
        }

        public static void Unload()
        {
           //need to do the disposing of the dx surfaces and pipeline here!
        }
    }
}
