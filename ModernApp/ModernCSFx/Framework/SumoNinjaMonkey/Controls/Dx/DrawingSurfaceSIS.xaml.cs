using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using CommonDX;
using SumoNinjaMonkey.Framework.Controls;
using SumoNinjaMonkey.Framework.Controls.DrawingSurface;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Graphics.Display;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;
using SharpDX.Toolkit;
using SharpDX;

namespace SumoNinjaMonkey.Framework.Controls
{
    public sealed partial class DrawingSurfaceSIS : UserControl
    {
        private DeviceManager _deviceManager;

        
        private SurfaceImageSourceTarget _sisTarget1;
        private ImageBrush _ibTarget1 { get; set; }

        private bool _hasEffectRenderer = false;
        private IRenderer _effectRenderer;

        public int FrameCountPerRender { get; set; } //number of frames per render (default = 1);

        private readonly GameTime gameTime;
        private readonly TimerTick timer;
        private readonly int[] lastUpdateCount;
        private TimeSpan totalGameTime;
        private TimeSpan inactiveSleepTime;
        private TimeSpan maximumElapsedTime;
        private TimeSpan accumulatedElapsedGameTime;
        private TimeSpan lastFrameElapsedGameTime;
        public bool IsFixedTimeStep { get; set; }
        public TimeSpan TargetElapsedTime { get; set; }
        private int nextLastUpdateCountIndex;
        private readonly float updateCountAverageSlowLimit;
        private bool forceElapsedTimeToZero;
        private bool drawRunningSlowly;
        private bool suppressDraw;
        private bool isExiting;
        private bool _hasInitializedSurface = false;



        private bool _isRunning = false;
        public bool IsRunning { 
            get { return _isRunning; } 
            set { 
                _isRunning = value;

                if (_isRunning)
                {
                    CompositionTarget.Rendering += CompositionTarget_Rendering;
                }
                else {
                    CompositionTarget.Rendering -= CompositionTarget_Rendering;
                }
                    
            } 
        }

        



        public DrawingSurfaceSIS(IRenderer renderer, DeviceManager deviceManager)
        {
            _deviceManager = deviceManager;
            
            gameTime = new GameTime();
            totalGameTime = new TimeSpan();
            timer = new TimerTick();
            IsFixedTimeStep = true;
            maximumElapsedTime = TimeSpan.FromMilliseconds(500.0);
            TargetElapsedTime = TimeSpan.FromTicks(10000000 / 60); // target elapsed time is by default 60Hz
            lastUpdateCount = new int[4];
            nextLastUpdateCountIndex = 0;

            // Calculate the updateCountAverageSlowLimit (assuming moving average is >=3 )
            // Example for a moving average of 4:
            // updateCountAverageSlowLimit = (2 * 2 + (4 - 2)) / 4 = 1.5f
            const int BadUpdateCountTime = 2; // number of bad frame (a bad frame is a frame that has at least 2 updates)
            var maxLastCount = 2 * Math.Min(BadUpdateCountTime, lastUpdateCount.Length);
            updateCountAverageSlowLimit = (float)(maxLastCount + (lastUpdateCount.Length - maxLastCount)) / lastUpdateCount.Length;

            timer.Reset();
            gameTime.Update(totalGameTime, TimeSpan.Zero, false);
            
            //gameTime.FrameCount = 0;

            //this.FrameCountPerRender = 1; //by default every frame results in a dxsurface render
            this.InitializeComponent();

            _effectRenderer = renderer;
            _hasEffectRenderer = true;
        }



        /// <summary>
        /// Resets the elapsed time counter.
        /// </summary>
        public void ResetElapsedTime()
        {
            //forceElapsedTimeToZero = true;
            //drawRunningSlowly = false;
            Array.Clear(lastUpdateCount, 0, lastUpdateCount.Length);
            nextLastUpdateCountIndex = 0;
        }


        ~DrawingSurfaceSIS()
        {

        }
       
        


        void CompositionTarget_Rendering(object sender, object e)
        {
            if (_sisTarget1 == null) return;

            Tick();

            if (_hasEffectRenderer) _effectRenderer.Update(gameTime);

            _sisTarget1.RenderAll();


        }

        public void Tick()
        {
            if (timer == null) return;

            // Update the timer
            timer.Tick();

            var elapsedAdjustedTime = timer.ElapsedAdjustedTime;

            if (forceElapsedTimeToZero)
            {
                elapsedAdjustedTime = TimeSpan.Zero;
                forceElapsedTimeToZero = false;
            }

            if (elapsedAdjustedTime > maximumElapsedTime)
            {
                elapsedAdjustedTime = maximumElapsedTime;
            }

            bool suppressNextDraw = true;
            int updateCount = 1;
            var singleFrameElapsedTime = elapsedAdjustedTime;

            if (IsFixedTimeStep)
            {

                // If the rounded TargetElapsedTime is equivalent to current ElapsedAdjustedTime
                // then make ElapsedAdjustedTime = TargetElapsedTime. We take the same internal rules as XNA 
                if (Math.Abs(elapsedAdjustedTime.Ticks - TargetElapsedTime.Ticks) < (TargetElapsedTime.Ticks >> 6))
                {
                    elapsedAdjustedTime = TargetElapsedTime;
                }

                // Update the accumulated time
                accumulatedElapsedGameTime += elapsedAdjustedTime;

                // Calculate the number of update to issue
                updateCount = (int)(accumulatedElapsedGameTime.Ticks / TargetElapsedTime.Ticks);

                // If there is no need for update, then exit
                if (updateCount == 0)
                {
                    return;
                }

                // Calculate a moving average on updateCount
                lastUpdateCount[nextLastUpdateCountIndex] = updateCount;
                float updateCountMean = 0;
                for (int i = 0; i < lastUpdateCount.Length; i++)
                {
                    updateCountMean += lastUpdateCount[i];
                }

                updateCountMean /= lastUpdateCount.Length;
                nextLastUpdateCountIndex = (nextLastUpdateCountIndex + 1) % lastUpdateCount.Length;

                // Test when we are running slowly
                drawRunningSlowly = updateCountMean > updateCountAverageSlowLimit;

                // We are going to call Update updateCount times, so we can substract this from accumulated elapsed game time
                accumulatedElapsedGameTime = new TimeSpan(accumulatedElapsedGameTime.Ticks - (updateCount * TargetElapsedTime.Ticks));
                singleFrameElapsedTime = TargetElapsedTime;
            }
            else
            {
                Array.Clear(lastUpdateCount, 0, lastUpdateCount.Length);
                nextLastUpdateCountIndex = 0;
                drawRunningSlowly = false;
            }

            // Reset the time of the next frame
            for (lastFrameElapsedGameTime = TimeSpan.Zero; updateCount > 0 && !isExiting; updateCount--)
            {
                gameTime.Update(totalGameTime, singleFrameElapsedTime, drawRunningSlowly);

                try
                {
                    //Update(gameTime);

                    // If there is no exception, then we can draw the frame
                    suppressNextDraw &= suppressDraw;
                    suppressDraw = false;
                }
                finally
                {
                    lastFrameElapsedGameTime += singleFrameElapsedTime;
                    totalGameTime += singleFrameElapsedTime;
                }
            }

            if (!suppressNextDraw)
            {
                //DrawFrame();
                gameTime.FrameCount++;
            }


        }

        private void mainGrid_Loaded(object sender, RoutedEventArgs e)
        {
            if (!_hasInitializedSurface)
            {
                _ibTarget1 = new ImageBrush();

                d2dRectangleBottom.Opacity = 1.0f;
                d2dRectangleBottom.Fill = _ibTarget1;
                
                //_deviceManager = new DeviceManager();


                int pixelWidth = (int)(d2dRectangleBottom.ActualWidth * DisplayProperties.LogicalDpi / 96.0);
                int pixelHeight = (int)(d2dRectangleBottom.ActualHeight * DisplayProperties.LogicalDpi / 96.0);

                _sisTarget1 = new SurfaceImageSourceTarget(pixelWidth, pixelHeight);

                _ibTarget1.ImageSource = _sisTarget1.ImageSource;

                _sisTarget1.OnRender += _effectRenderer.Render;

                _deviceManager.OnInitialize += _sisTarget1.Initialize;
                _deviceManager.OnInitialize += _effectRenderer.Initialize;


                _deviceManager.Initialize(DisplayProperties.LogicalDpi);
                _effectRenderer.InitializeUI(root, d2dRectangleBottom);


                //var fpsRenderer = new FpsRenderer();
                //fpsRenderer.Initialize(deviceManager);
                //d2dTarget.OnRender += fpsRenderer.Render;


                if (_assetUri != null && _assetUri != string.Empty) _effectRenderer.LoadLocalAsset(_assetUri);

                //this.Unloaded += DrawingSurfaceSIS_Unloaded;


                _hasInitializedSurface = true;
            }

            
        }

        private string _assetUri;
        public void LoadImage(string assetUri)
        {
            _assetUri = assetUri;
            if (_effectRenderer == null) return;
            _effectRenderer.LoadLocalAsset(_assetUri);
        }

        //public SharpDX.Direct2D1.Bitmap1 CreateBitmapTarget()
        //{
        //    return d2dTarget.CreateNewBitmapTarget();
        //}

        //void DrawingSurfaceSIS_Unloaded(object sender, RoutedEventArgs e)
        //{

        //    Unload();
    

        //}


        public void Unload()
        {
            
            if (_effectRenderer != null && _sisTarget1!=null ) _sisTarget1.OnRender -= _effectRenderer.Render;
            CompositionTarget.Rendering -= CompositionTarget_Rendering;
            //this.Unloaded -= DrawingSurfaceSIS_Unloaded;


            if(_deviceManager!=null && _sisTarget1!=null) { _deviceManager.OnInitialize -= _sisTarget1.Initialize; }
            if(_deviceManager!=null && _effectRenderer!=null) { _deviceManager.OnInitialize -= _effectRenderer.Initialize; }

            //_deviceManager.Dispose();
            //_deviceManager = null;

            _effectRenderer.Unload();
            _effectRenderer = null;

            if (_sisTarget1 != null)
            {
                _sisTarget1.Dispose();
                _sisTarget1 = null;
            }
            _hasInitializedSurface = false;

            _deviceManager = null;

            d2dRectangleBottom.Fill = null;

            if (_ibTarget1 != null) { 
                _ibTarget1.ImageSource = null;
                _ibTarget1 = null;
            }
        }

    }
}
