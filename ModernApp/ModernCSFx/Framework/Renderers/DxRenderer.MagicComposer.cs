using System;
using System.Diagnostics;

using SharpDX;

using SumoNinjaMonkey.Framework.Controls.DrawingSurface;
using CommonDX;
using SharpDX.Direct3D11;
using Windows.UI.Xaml;
using SharpDX.IO;
using SharpDX.DXGI;
using SharpDX.Direct3D;
using System.Collections.Generic;
using ModernCSApp.Services;
using Sandbox.DxRenderer;

namespace ModernCSApp.DxRenderer
{

    public partial class MagicComposer : BaseRenderer, IRenderer, ISpriteRenderer
    {
        private DeviceManager _deviceManager;

        private SpriteBatch spriteBatch;


        public bool EnableClear { get; set; }


        public bool Show { get; set; }

        private UIElement _root;
        private DependencyObject _rootParent;
        private Stopwatch clock;


        private float _appWidth;
        private float _appHeight;


        public SumoNinjaMonkey.Framework.Controls.DrawingSurfaceSIS DrawingSurface;

        private Vector2 _currentPointerPosition = new Vector2(0, 0);


        private Texture2D _textureStar;

        private bool _moveBurst = false;

        public float Scale { get; set; }
        
        public MagicComposer()
        {
            Scale = 1.0f;
            EnableClear = true;
            clock = new Stopwatch();
            _moveBurst = false;
            _currentPointerPosition = new Vector2(0, 0);

            spriteBatch = new SpriteBatch();

        }




        public void Initialize(DeviceManager deviceManager)
        {
            
            _deviceManager = deviceManager;


            // Remove previous buffer
            //SafeDispose(ref constantBuffer);


            // Setup local variables
            var d3dDevice = deviceManager.DeviceDirect3D;
            var d3dContext = deviceManager.ContextDirect3D;




            spriteBatch.Initialize(d3dDevice, d3dContext, 5000);




            //// Load texture and create sampler
            using (var bitmap = TextureLoader.LoadBitmap(deviceManager.WICFactory, "Assets\\DotPink.png"))
                _textureStar = TextureLoader.CreateTexture2DFromBitmap(d3dDevice, bitmap);


            spriteBatch.AddTexture(_textureStar);




            GestureService.OnGestureRaised += (o, a) =>
            {
                CustomGestureArgs gestureArgs = (CustomGestureArgs)a;
                
                if (gestureArgs.ManipulationStartedArgs != null)
                {
                    
                }
                else if (gestureArgs.ManipulationInertiaStartingArgs != null)
                {
                    
                }
                else if (gestureArgs.ManipulationUpdatedArgs != null)
                {
                    
                }
                else if (gestureArgs.ManipulationCompletedArgs != null)
                {
                    

                }
                else if (gestureArgs.TappedEventArgs != null)
                {
                    
                }
                else if (gestureArgs.PressedPointerRoutedEventArgs != null)
                {
                    //spriteBatch.IsEnabled = true;
                    //moveDot(gestureArgs.PressedPointerRoutedEventArgs.GetCurrentPoint(null).Position);
                }
                else if (gestureArgs.MovedPointerRoutedEventArgs != null)
                {
                    //moveDot(gestureArgs.MovedPointerRoutedEventArgs.GetCurrentPoint(null).Position);
                }
                else if (gestureArgs.ReleasedPointerRoutedEventArgs != null)
                {
                    //spriteBatch.IsEnabled = false;
                    //moveDot(gestureArgs.ReleasedPointerRoutedEventArgs.GetCurrentPoint(null).Position);
                }



            };




            clock = new Stopwatch();
            clock.Start();


        }

        public void InitializeUI(UIElement rootForPointerEvents, UIElement rootOfLayout)
        {
            _root = rootForPointerEvents;
            _rootParent = rootOfLayout;


            _appWidth = (float)((FrameworkElement)_root).ActualWidth;
            _appHeight = (float)((FrameworkElement)_root).ActualHeight;

        }

        public void Update(SharpDX.Toolkit.GameTime gameTime)
        {
            
        }

        public void Render(TargetBase target)
        {
            var d3dContext = target.DeviceManager.ContextDirect3D;
            var d2dContext = target.DeviceManager.ContextDirect2D;


            // Set targets (This is mandatory in the loop)
            d3dContext.OutputMerger.SetTargets(target.DepthStencilView, target.RenderTargetView);


            // Clear the views
            d3dContext.ClearDepthStencilView(target.DepthStencilView, DepthStencilClearFlags.Depth, 1.0f, 0);
            if (EnableClear)
            {
                d3dContext.ClearRenderTargetView(target.RenderTargetView, new Color4(0.0f, 0.0f, 0.0f, 0.0f));
            }

            spriteBatch.Begin(target);


            for (int i = 0; i < 50; i++)
            {
                spriteBatch.Draw(_textureStar, _currentPointerPosition * new Vector2(1, -1));
            }



            spriteBatch.End();

           
        }

        public void LoadLocalAsset(string assetUri)
        {
            throw new NotImplementedException();
        }

        public void AddSprite(double x, double y, double z, double duration)
        {
            DispatcherTimer dt = new DispatcherTimer();
            dt.Tick += (o,e) => {
                spriteBatch.IsEnabled = false;
                dt.Stop();
            };
            dt.Interval = TimeSpan.FromSeconds(duration);
            dt.Start();

            spriteBatch.IsEnabled = true;
            moveDot(new Windows.Foundation.Point(x, y));
            
        }

        private void moveDot(Windows.Foundation.Point newPosition)
        {
            
            Vector2 origin = spriteBatch.CalculatePointerPosition(
                new Vector2((float)newPosition.X, (float)newPosition.Y),
                PositionUnits.Pixels);


            //TODO : Need to work out how to calculate this 35/28 factor
            Vector2 offset = new Vector2(63.0f, 35.0f) * origin;

            _currentPointerPosition.X = offset.X;
            _currentPointerPosition.Y = offset.Y;
        }


    }





}
