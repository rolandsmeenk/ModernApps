
using ModernCSApp.Views;
using SumoNinjaMonkey.Framework.Controls.DrawingSurface;
using System;
using Windows.UI.Xaml.Input;
using ModernCSApp.DxRenderer;


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


        public static RenderingService Instance = new RenderingService();
        private static GlobalState _state;

        public static bool IsInitialized = false;



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
            

        }

        public static void Init(GlobalState state)
        {
            if (state != null) { 
                _state = state;
                BaseRenderer.UpdateState((BaseRenderer)BackgroundRenderer, state);
                BaseRenderer.UpdateState((BaseRenderer)MagicRenderer, state);
            }

            if (IsInitialized) return;

            _deviceManager1 = new CommonDX.DeviceManager();
            _deviceManager2 = new CommonDX.DeviceManager();

            _renderer1 = new DxRenderer.BackgroundComposer() { State = _state };
            _renderer2 = new DxRenderer.MagicComposer() { State = _state };


            BackgroundSIS = new SumoNinjaMonkey.Framework.Controls.DrawingSurfaceSIS(_renderer1, _deviceManager1);
            MagicSIS = new SumoNinjaMonkey.Framework.Controls.DrawingSurfaceSIS(_renderer2, _deviceManager2);


            IsInitialized = true;

        }


        public static void Start()
        {
            if (!IsInitialized) throw new Exception("Renderer needs to be initialized first");

            if (BackgroundSIS != null) BackgroundSIS.IsRunning = true;
            if (MagicSIS != null) MagicSIS.IsRunning = true;
        }

        public static void Stop()
        {
            if (BackgroundSIS != null) BackgroundSIS.IsRunning = false;
            if (MagicSIS != null) MagicSIS.IsRunning = false;
        }

        public static void Unload()
        {
            Stop();

            BackgroundSIS.Unload();
            BackgroundSIS = null;

            MagicSIS.Unload();
            MagicSIS = null;

            _renderer1.Unload();
            _renderer1 = null;

            _renderer2.Unload();
            _renderer2 = null;

            _deviceManager1.Dispose();
            _deviceManager1 = null;

            _deviceManager2.Dispose();
            _deviceManager2 = null;

            IsInitialized = false;



           //need to do the disposing of the dx surfaces and pipeline here!
        }
    }
}
