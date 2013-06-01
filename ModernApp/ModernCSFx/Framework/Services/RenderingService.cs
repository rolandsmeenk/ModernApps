
using ModernCSApp.Views;
using SumoNinjaMonkey.Framework.Controls.DrawingSurface;
using System;
using Windows.UI.Xaml.Input;



namespace ModernCSApp.Services
{
    public class RenderingService
    {
        private static CommonDX.DeviceManager _deviceManager1;
        private static CommonDX.DeviceManager _deviceManager2;

        private static IRenderer _renderer1;
        private static IRenderer _renderer2;

        public static SumoNinjaMonkey.Framework.Controls.DrawingSurfaceSIS BackgroundSIS;
        public static SumoNinjaMonkey.Framework.Controls.DrawingSurfaceSIS MagicSIS;


        private static RenderingService Instance = new RenderingService();
        private static GlobalState _state;

        private static bool _isInitialized = false;

        


        public static IBackgroundRenderer BackgroundRenderer
        {
            get {
                if (_renderer1 != null && _renderer1 is IBackgroundRenderer)
                {
                    return (IBackgroundRenderer)_renderer1;
                }
                else return null;
            }
        }

        public static ISpriteRenderer MagicRenderer
        {
            get
            {
                if (_renderer2 != null && _renderer2 is ISpriteRenderer)
                {
                    return (ISpriteRenderer)_renderer2;
                }
                else return null;
            }
        }


        private RenderingService()
        {
            _deviceManager1 = new CommonDX.DeviceManager();
            _deviceManager2 = new CommonDX.DeviceManager();

        }

        public static void Init(GlobalState state)
        {
            if (_isInitialized) return;
            
            if(state!=null)_state = state;

            _renderer1 = new DxRenderer.BackgroundComposer() { State = _state };
            BackgroundSIS = new SumoNinjaMonkey.Framework.Controls.DrawingSurfaceSIS(_renderer1, _deviceManager1);


            //_renderer2 = new DxRenderer.MagicComposer() { State = _state };
            //MagicSIS = new SumoNinjaMonkey.Framework.Controls.DrawingSurfaceSIS(_renderer2, _deviceManager2);

            _isInitialized = true;
        }

        public static void Start()
        {
            if (!_isInitialized) throw new Exception("Renderer needs to be initialized first");

            if (BackgroundSIS != null) BackgroundSIS.IsRunning = true;
            if (MagicSIS != null) MagicSIS.IsRunning = true;
        }

        public static void Stop()
        {
            if(BackgroundSIS!=null)BackgroundSIS.IsRunning = false;
            if(MagicSIS!=null)MagicSIS.IsRunning = false;
        }

        public static void Unload()
        {
            _deviceManager1.Dispose();
            _deviceManager1 = null;

            _deviceManager2.Dispose();
            _deviceManager2 = null;

           //need to do the disposing of the dx surfaces and pipeline here!
        }
    }
}
