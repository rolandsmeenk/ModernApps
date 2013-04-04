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
        private DeviceManager deviceManager;

        //private ImageBrush _d2dBrush;
        private SurfaceImageSourceTarget d2dTarget;



        public ImageBrush D2DBrush { get; set; }
        //public ImageBrush D2DBrush { get { return _d2dBrush; } }

        private bool _hasEffectRenderer = false;
        private IRenderer effectRenderer;

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


        private bool _isRunning = false;
        public bool IsRunning { 
            get { return _isRunning; } 
            set { 
                _isRunning = value;

                if (_isRunning)
                {
                    CompositionTarget.Rendering += CompositionTarget_Rendering;
                    
                }
                else
                    CompositionTarget.Rendering -= CompositionTarget_Rendering;
            } 
        }

        private int _rows = 0;
        private int _cols = 0;


        public DrawingSurfaceSIS(IRenderer renderer, int rows, int cols)
        {
            _rows = rows;
            _cols = cols;


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
            gameTime.FrameCount = 0;



            Init(renderer);
        }

        



        public DrawingSurfaceSIS(IRenderer renderer)
        {
            _rows = 0;
            _cols = 0;



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



            Init(renderer);
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


        private void Init(IRenderer renderer)
        {
            //this.FrameCountPerRender = 1; //by default every frame results in a dxsurface render
            this.InitializeComponent();

            effectRenderer = renderer;
            _hasEffectRenderer = true;



        }


        ~DrawingSurfaceSIS()
        {

        }
       
        bool hasInitializedSurface = false;

        //int iCounter = 0;
        void CompositionTarget_Rendering(object sender, object e)
        {
            if (d2dTarget == null) return;
            //iCounter++;
            //if (iCounter == FrameCountPerRender) //we need to increase this fcr when mixing xaml/dx at times
            //{

            Tick();

            if (_hasEffectRenderer) effectRenderer.Update(gameTime);
            d2dTarget.RenderAll();
            //    iCounter = 0;
            //}
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
            if (!hasInitializedSurface)
            {
                for (int i = 0; i < _rows; i++)
                {
                    mainGrid.RowDefinitions.Add(new RowDefinition() { Height = new GridLength(1, GridUnitType.Star) });
                }
                for (int i = 0; i < _cols; i++)
                {
                    mainGrid.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(1, GridUnitType.Star) });
                }

                D2DBrush = new ImageBrush();
                d2dRectangle.Fill = D2DBrush;


                if (_rows == 0 && _cols == 0)
                {
                    d2dRectangle.Opacity = 1.0f;

                    d2dRectangle.Fill = D2DBrush;


                }
                else { 
                    
                    d2dRectangle.Opacity = 0.1f;
                    d2dRectangle.Fill = D2DBrush;


                    for (int row = 0; row < _rows; row++)
                    {
                        for (int col = 0; col < _cols; col++)
                        {
                            Windows.UI.Xaml.Shapes.Rectangle rec = new Windows.UI.Xaml.Shapes.Rectangle();
                            rec.SetValue(Grid.RowProperty, row);
                            rec.SetValue(Grid.ColumnProperty, col);
                            rec.HorizontalAlignment = Windows.UI.Xaml.HorizontalAlignment.Stretch;
                            rec.VerticalAlignment = Windows.UI.Xaml.VerticalAlignment.Stretch;
                            rec.Fill = D2DBrush;
                            mainGrid.Children.Add(rec);
                            //rec.UpdateLayout();

                            //if(row==0 && col == 0)d2dRectangle = rec;
                        }
                    }
                }


                //effectRenderer = new EffectRenderer();

                deviceManager = new DeviceManager();




                int pixelWidth = (int)(d2dRectangle.ActualWidth * DisplayProperties.LogicalDpi / 96.0);
                int pixelHeight = (int)(d2dRectangle.ActualHeight * DisplayProperties.LogicalDpi / 96.0);

                d2dTarget = new SurfaceImageSourceTarget(pixelWidth, pixelHeight);
                D2DBrush.ImageSource = d2dTarget.ImageSource;
                d2dTarget.OnRender += effectRenderer.Render;


                deviceManager.OnInitialize += d2dTarget.Initialize;
                deviceManager.OnInitialize += effectRenderer.Initialize;
                deviceManager.Initialize(DisplayProperties.LogicalDpi);

                effectRenderer.InitializeUI(root, d2dRectangle);

                //var fpsRenderer = new FpsRenderer();
                //fpsRenderer.Initialize(deviceManager);
                //d2dTarget.OnRender += fpsRenderer.Render;


                if (_assetUri != null && _assetUri != string.Empty) effectRenderer.LoadLocalAsset(_assetUri);


                hasInitializedSurface = true;
            }

            this.Unloaded += DrawingSurfaceSIS_Unloaded;
        }

        private string _assetUri;
        public void LoadImage(string assetUri)
        {
            _assetUri = assetUri;
            if (effectRenderer == null) return;
            effectRenderer.LoadLocalAsset(_assetUri);
        }

        //public SharpDX.Direct2D1.Bitmap1 CreateBitmapTarget()
        //{
        //    return d2dTarget.CreateNewBitmapTarget();
        //}

        void DrawingSurfaceSIS_Unloaded(object sender, RoutedEventArgs e)
        {
            CompositionTarget.Rendering -= CompositionTarget_Rendering;

            deviceManager.OnInitialize -= d2dTarget.Initialize;
            deviceManager.OnInitialize -= effectRenderer.Initialize;
            deviceManager.Dispose();
            deviceManager = null;

            d2dTarget.OnRender -= effectRenderer.Render;
            d2dTarget.Dispose();
            d2dTarget = null;

            hasInitializedSurface = false;

            this.Unloaded -= DrawingSurfaceSIS_Unloaded;
        }




    }
}
