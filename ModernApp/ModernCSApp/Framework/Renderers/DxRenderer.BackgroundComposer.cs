

using System;
using System.Collections.Generic;
using System.Diagnostics;
using CommonDX;
using GalaSoft.MvvmLight.Messaging;
using SharpDX;
using SumoNinjaMonkey.Framework.Controls.DrawingSurface;
using SumoNinjaMonkey.Framework.Controls.Messages;
using Windows.UI.Xaml;
using System.Linq;
using System.IO;
using System.Threading.Tasks;
using ModernCSApp.Services;
using SharpDX.Toolkit;
using XNATweener;
using System.Reflection;

namespace ModernCSApp.DxRenderer
{
    public partial class BackgroundComposer : BaseRenderer, IRenderer
    {
        private DeviceManager _deviceManager;


        private bool _doClear { get; set; }

        public bool Show { get; set; }


        private UIElement _root;
        private DependencyObject _rootParent;
        private Stopwatch clock;

        private float _appWidth;
        private float _appHeight;

        //public SumoNinjaMonkey.Framework.Controls.DrawingSurfaceSIS DrawingSurface;

        
        //Effects -         
        //private List<EffectDTO> _effects;
        private List<RenderDTO> _renderTree;

        public int IndexOfEffectToRender { get; set; }
        public int NumberFramesToRender { get; set; }

        //NEED TO WORK OUT HOW TO NOT MAKE THIS GLOBAL VARIABLES!!! (used from LoadViaStorageFileAsset)
        SharpDX.WIC.FormatConverter _backgroundImageFormatConverter;
        Size2 _backgroundImageSize;

        private Vector3 _globalCameraTranslation { get; set; }
        private Vector3 _globalTranslation { get; set; }
        private Vector3 _globalScale { get; set; }

        private string _sessionID { get; set; }

        private bool _drawDesignerLayout { get; set; }
        private LayoutDetail _layoutDetail { get; set; }
        private RectangleF _layoutDeviceScreenSize { get; set; }
        private RectangleF _layoutViewableArea { get; set; }

        SharpDX.Direct3D11.Texture2D _stagingTexture2D;
        SharpDX.Direct2D1.Bitmap1 _stagingBitmap;
        SharpDX.Direct2D1.Effects.BitmapSourceEffect _stagingBitmapSourceEffect;


        RectangleF _debugLine1 = new RectangleF(100, 80, 300, 40);
        RectangleF _debugLine2 = new RectangleF(100, 110, 300, 40);
        RectangleF _debugLine3 = new RectangleF(100, 140, 300, 40);
        RectangleF _debugLine4 = new RectangleF(100, 170, 300, 40);
        RectangleF _debugLine5 = new RectangleF(100, 200, 300, 40);


        SharpDX.Direct2D1.SolidColorBrush _generalGrayColor ;
        SharpDX.Direct2D1.SolidColorBrush _generalRedColor;
        SharpDX.Direct2D1.SolidColorBrush _generalLightGrayColor ;
        SharpDX.Direct2D1.SolidColorBrush _generalLightWhiteColor;
        SharpDX.DirectWrite.TextFormat _generalTextFormat;
        SharpDX.DirectWrite.TextFormat _debugTextFormat;

        GameTime _gt;
        Tweener _tweener;


        public BackgroundComposer()
        {
            _doClear = false;

            Show = true;
            NumberFramesToRender = 0;
            IndexOfEffectToRender = 0;

            _globalScale = new Vector3(1f, 1f, 1f);
            _globalTranslation = new Vector3(0, 0, 0);
            _globalCameraTranslation = new Vector3(0, 0, 0);
            _sessionID = AppDatabase.Current.RetrieveInstanceAppState(AppDatabase.AppSystemDataEnums.UserSessionID).Value;


            //_effects = new List<EffectDTO>();
            _renderTree = new List<RenderDTO>();

            //clock = new Stopwatch();


            _initSampleTweener();

        }


        public void Initialize(CommonDX.DeviceManager deviceManager)
        {

            _deviceManager = deviceManager;

            _generalGrayColor = new SharpDX.Direct2D1.SolidColorBrush(_deviceManager.ContextDirect2D, Color.Gray);
            _generalRedColor = new SharpDX.Direct2D1.SolidColorBrush(_deviceManager.ContextDirect2D, Color.Red);
            _generalLightGrayColor = new SharpDX.Direct2D1.SolidColorBrush(_deviceManager.ContextDirect2D, Color.LightGray);
            _generalLightWhiteColor = new SharpDX.Direct2D1.SolidColorBrush(_deviceManager.ContextDirect2D, Color.White);

            _generalTextFormat = new SharpDX.DirectWrite.TextFormat(
                _deviceManager.FactoryDirectWrite,
                "Segoe UI",
                SharpDX.DirectWrite.FontWeight.Light,
                SharpDX.DirectWrite.FontStyle.Normal,
                SharpDX.DirectWrite.FontStretch.Normal,
                16f);

            _debugTextFormat = new SharpDX.DirectWrite.TextFormat(
                _deviceManager.FactoryDirectWrite,
                "Segoe UI",
                SharpDX.DirectWrite.FontWeight.Light,
                SharpDX.DirectWrite.FontStyle.Normal,
                SharpDX.DirectWrite.FontStretch.Normal,
                20f);

            _layoutDetail = new LayoutDetail() { Width = this.State.DrawingSurfaceWidth, Height = this.State.DrawingSurfaceHeight };
            _layoutDeviceScreenSize = new RectangleF(0, 0, (float)_layoutDetail.Width, (float)_layoutDetail.Height);


            _scaleTranslate(1.0f);

            _sampleEffectGraph();

            NumberFramesToRender = 3;

        }


        private void _scaleTranslate(float zoomFactor)
        {
            _globalScale = new Vector3(zoomFactor, zoomFactor, 1f);
            _globalTranslation = new Vector3(
                (float)((this.State.DrawingSurfaceWidth * (1f - zoomFactor)) / 2),
                (float)((this.State.DrawingSurfaceHeight * (1f - zoomFactor)) / 2),
                0) + _globalCameraTranslation;
        }


        public void InitializeUI(Windows.UI.Xaml.UIElement rootForPointerEvents, Windows.UI.Xaml.UIElement rootOfLayout)
        {
            _root = rootForPointerEvents;
            _rootParent = rootOfLayout;

            _appWidth = (float)((FrameworkElement)_root).ActualWidth;
            _appHeight = (float)((FrameworkElement)_root).ActualHeight;

            _stagingTexture2D = AllocateTextureReturnSurface((int)_appWidth, (int)_appHeight);
            _stagingBitmap = new SharpDX.Direct2D1.Bitmap1(_deviceManager.ContextDirect2D, _stagingTexture2D.QueryInterface<SharpDX.DXGI.Surface>());
            _stagingBitmapSourceEffect = new SharpDX.Direct2D1.Effects.BitmapSourceEffect(_deviceManager.ContextDirect2D);

            _pathD2DConverter = new SumoNinjaMonkey.Framework.Lib.PathToD2DPathGeometryConverter();
        }


       

        public void Update(GameTime gameTime)
        {
            _gt = gameTime;

            if(_tweener!=null) _tweener.Update(gameTime);
        }

        public void Render(CommonDX.TargetBase target)
        {
            //if (NumberFramesToRender == 0)
            //{
            //    TurnOffRenderingBecauseThereAreRenderableEffects();
            //    return;
            //}

            var d2dContext = target.DeviceManager.ContextDirect2D;
            var d2dDevice = target.DeviceManager.DeviceDirect2D;

            var d3dContext = target.DeviceManager.ContextDirect3D;
            var d3dDevice = target.DeviceManager.DeviceDirect3D;


            d2dContext.BeginDraw();

            //if (_doClear) {
                d2dContext.Clear(Color.White); 
               // d2dContext.Clear( new Color4(0, 0, 0, 0)); 
            //    _doClear = false; 
            //}



            
            foreach (var renderTree in _renderTree.OrderBy(x=>x.Order))
            {
                if (renderTree.Type ==  eRenderType.Effect && renderTree.EffectDTO.IsRenderable && !renderTree.HasLinkedEffects) //effects
                {
                    if (renderTree.EffectDTO.Effect != null)
                    {
                        d2dContext.Transform = Matrix.Scaling(renderTree.EffectDTO.MainScale) * Matrix.Translation(renderTree.EffectDTO.MainTranslation) * Matrix.Translation(_globalTranslation) * Matrix.Scaling(_globalScale);
                        d2dContext.DrawImage(renderTree.EffectDTO.Effect);
                    }
                }
                else if (renderTree.Type == eRenderType.Text && renderTree.TextDTO.IsRenderable) //text
                {
                    d2dContext.Transform = Matrix.Scaling(renderTree.TextDTO.MainScale) * Matrix.Translation(renderTree.TextDTO.MainTranslation) * Matrix.Translation(_globalTranslation) * Matrix.Scaling(_globalScale);
                    d2dContext.DrawText(renderTree.TextDTO.Text, renderTree.TextDTO.TextFormat, renderTree.TextDTO.LayoutRect, renderTree.TextDTO.Brush);
                }
                else if (renderTree.Type == eRenderType.Media && renderTree.MediaDTO.IsRenderable) //video/audio
                {

                }
                else if (renderTree.Type == eRenderType.Shape && renderTree.ShapeDTO.IsRenderable) //Geometry
                {
                    //We should do this on a staging texture, draw all these shapes on the texture run 
                    //neccessary effects then push this staging texture onto D2D/D3D surface
                    // ## _stagingImage/_stagingBitmap has been created to do just this!
                    var previousBitmap = d2dContext.Target;

                    d2dContext.Target = _stagingBitmap;
                    d2dContext.Clear(Color.Transparent);


                    if (renderTree.ShapeDTO.Type == 2)
                        d2dContext.FillGeometry(renderTree.ShapeDTO.Shape, renderTree.ShapeDTO.Brush);
                    else
                        d2dContext.DrawGeometry(
                            renderTree.ShapeDTO.Shape,
                            renderTree.ShapeDTO.Brush,
                            renderTree.ShapeDTO.StrokeWidth,
                            new SharpDX.Direct2D1.StrokeStyle(
                                target.DeviceManager.FactoryDirect2D,
                                new SharpDX.Direct2D1.StrokeStyleProperties()
                                {
                                    DashStyle = (SharpDX.Direct2D1.DashStyle)renderTree.ShapeDTO.DashStyleIndex,
                                    DashOffset = renderTree.ShapeDTO.DashOffset,
                                    StartCap = SharpDX.Direct2D1.CapStyle.Square,
                                    EndCap = SharpDX.Direct2D1.CapStyle.Square,
                                    DashCap = SharpDX.Direct2D1.CapStyle.Square,
                                    MiterLimit = renderTree.ShapeDTO.MiterLimit
                                }));


                    d2dContext.Target = previousBitmap;
                    
                    
                    //WORKS
                    //d2dContext.Transform = Matrix.Identity;


                    d2dContext.Transform =
                        Matrix.Identity
                        * Matrix.Scaling(renderTree.ShapeDTO.MainScale)
                        //* Matrix.Scaling(_globalScale)

                        * Matrix.RotationX(renderTree.ShapeDTO.MainRotation.X)
                        * Matrix.RotationY(renderTree.ShapeDTO.MainRotation.Y)
                        * Matrix.RotationZ(renderTree.ShapeDTO.MainRotation.Z)

                        * Matrix.Translation(renderTree.ShapeDTO.MainTranslation)
                        //* Matrix.Translation(_globalTranslation)
                        ;

                    d2dContext.DrawImage(_stagingBitmap);
                    


                }
                else if (renderTree.Type == eRenderType.ShapePath && renderTree.ShapePathDTO.IsRenderable) //ShapePath Geometry
                {
                    d2dContext.Transform =

                        Matrix.Translation(_globalTranslation)
                        * Matrix.Translation(renderTree.ShapePathDTO.MainTranslation)
                        
                        * Matrix.RotationX(renderTree.ShapePathDTO.MainRotation.X)
                        * Matrix.RotationY(renderTree.ShapePathDTO.MainRotation.Y)
                        * Matrix.RotationZ(renderTree.ShapePathDTO.MainRotation.Z)

                        * Matrix.Scaling(_globalScale)
                        * Matrix.Scaling(renderTree.ShapePathDTO.MainScale)

                        ;


                    d2dContext.DrawGeometry(
                     renderTree.ShapePathDTO.Shapes[0],
                     renderTree.ShapePathDTO.Brush,
                     renderTree.ShapePathDTO.StrokeWidth,
                     new SharpDX.Direct2D1.StrokeStyle(
                         target.DeviceManager.FactoryDirect2D,
                         new SharpDX.Direct2D1.StrokeStyleProperties()
                         {
                             DashStyle = (SharpDX.Direct2D1.DashStyle)renderTree.ShapePathDTO.DashStyleIndex,
                             DashOffset = renderTree.ShapePathDTO.DashOffset,
                             StartCap = SharpDX.Direct2D1.CapStyle.Square,
                             EndCap = SharpDX.Direct2D1.CapStyle.Square,
                             DashCap = SharpDX.Direct2D1.CapStyle.Square,
                             MiterLimit = renderTree.ShapePathDTO.MiterLimit
                         }));

                }
            }


            //DESIGNER SURFACE REGION
            _drawDesktopOutline(d2dContext);

            //DEBUGGING INFO
            _drawDebuggingInfo(d2dContext);


            d2dContext.EndDraw();

            NumberFramesToRender--;
        }


        
        private void _drawDebuggingInfo(SharpDX.Direct2D1.DeviceContext d2dContext)
        {
            if (_gt != null)
            {
                d2dContext.Transform = Matrix.Identity;
                d2dContext.DrawText("TotalGameTime (s) : " + _gt.TotalGameTime.TotalSeconds.ToString(), _debugTextFormat, _debugLine1, _generalRedColor);
                d2dContext.DrawText("FrameCount : " + _gt.FrameCount.ToString(), _debugTextFormat, _debugLine2, _generalRedColor);
                d2dContext.DrawText("ElapsedGameTime (s) : " + _gt.ElapsedGameTime.TotalSeconds.ToString(), _debugTextFormat, _debugLine3, _generalRedColor);
                d2dContext.DrawText("IsRunningSlowly : " + _gt.IsRunningSlowly.ToString(), _debugTextFormat, _debugLine4, _generalRedColor);
                d2dContext.DrawText("FPS : " + (_gt.FrameCount / _gt.TotalGameTime.TotalSeconds).ToString(), _debugTextFormat, _debugLine5, _generalRedColor);
            }
        }

        private void _drawDesktopOutline( SharpDX.Direct2D1.DeviceContext d2dContext)
        {
            
 

            //BORDER
            d2dContext.Transform = Matrix.Translation(_globalTranslation) * Matrix.Scaling(_globalScale);
            d2dContext.DrawRectangle(
                _layoutDeviceScreenSize,
                _generalLightGrayColor,
                3
                );

            //WIDTH
            d2dContext.Transform =  Matrix.Translation(_globalTranslation) * Matrix.Scaling(_globalScale);
            d2dContext.FillRectangle(
                new RectangleF(0, -30, 100, 30),
                _generalLightGrayColor
                );
            d2dContext.Transform = Matrix.Translation(10, 0, 0) * Matrix.Translation(_globalTranslation) * Matrix.Scaling(_globalScale);
            d2dContext.DrawText(_layoutDetail.Width.ToString(), _generalTextFormat, new RectangleF(0, -30, 100, 30), _generalLightWhiteColor);

            ////HEIGHT
            double angleRadians = 90 * Math.PI / 180; //90 degrees
            d2dContext.Transform = Matrix.RotationZ((float)angleRadians)  * Matrix.Identity * Matrix.Translation(_globalTranslation) * Matrix.Scaling(_globalScale);
            d2dContext.FillRectangle(
                new RectangleF(0, 0, 100, 30),
                _generalLightGrayColor
            );
            d2dContext.Transform = Matrix.RotationZ((float)angleRadians) * Matrix.Translation(0, 10, 0) *  Matrix.Translation(_globalTranslation) * Matrix.Scaling(_globalScale);
            d2dContext.DrawText(_layoutDetail.Height.ToString(), _generalTextFormat, new RectangleF(0, 0, 100, 30), _generalLightWhiteColor);

            
        }

        private async void _sampleEffectGraph()
        {
            var effect_BitmapSource = await CreateRenderItemWithUIElement_Effect(
                new UIElementState()
                {
                    IsRenderable = false, //is effect rendered/visible
                    AggregateId = Guid.NewGuid().ToString(),
                    Grouping1 = string.Empty,
                    udfString1 = "\\Assets\\BackgroundDefault001.jpg"
                },
                "SharpDX.Direct2D1.Effects.BitmapSourceEffect",
                null);

            var effect_Scale = await CreateRenderItemWithUIElement_Effect(
                new UIElementState()
                {
                    IsRenderable = false, //is effect rendered/visible
                    AggregateId = Guid.NewGuid().ToString(),
                    Grouping1 = string.Empty,
                    udfDouble1 = 2.3f, // scale x
                    udfDouble2 = 2.3f, // scale y
                    udfDouble3 = 0.5f, // centerpoint x
                    udfDouble4 = 0.5f  // centerpoint y 
                },
                "SharpDX.Direct2D1.Effects.Scale",
                effect_BitmapSource //linked parent effect
                );

            var effect_Crop = await CreateRenderItemWithUIElement_Effect(
                new UIElementState()
                {
                    IsRenderable = true, //is effect rendered/visible
                    AggregateId = Guid.NewGuid().ToString(),
                    Grouping1 = string.Empty,
                    udfDouble1 = 0,
                    udfDouble2 = 0,
                    udfDouble3 = _appWidth,
                    udfDouble4 = _appHeight,
                },
                "SharpDX.Direct2D1.Effects.Crop",
                effect_Scale  //linked parent effect
                );


            var rect_fade = await AddUpdateUIElementState_Rectangle(
                new UIElementState() {
                    IsRenderable = true, //is effect rendered/visible
                    AggregateId = Guid.NewGuid().ToString(),
                    Grouping1 = string.Empty,
                    Width = _appWidth,
                    Height = _appHeight,
                    udfInt1 = 2, //not fill = 1, fill = 2
                    udfString1 = "Rectangle",
                    udfDouble3 = 0, //stroke width
                    udfInt2 = 1, // 1 = 2 point gradient, 2= solid
                    udfString2 = "255|255|255|0", //gradient 1 
                    udfDouble1 = 70d, // color position 1
                    udfString3 = "0|0|0|255", //gradient 2
                    udfDouble2 = 100d, // color position 2
                    Left = 0,
                    Top = 0,
                    Scale = 1d  
                },
                null);



        }

        private async void _sampleShadows()
        {

        }

        private void _initSampleTweener()
        {
            //methodinfo.createdelegate
            //http://msdn.microsoft.com/en-us/library/windows/apps/hh194376.aspx

            _tweener = new Tweener(1.0f, 0.9f, TimeSpan.FromSeconds(1.2d), (TweeningFunction)Cubic.EaseIn);
            _tweener.PositionChanged += (newVal) => { _scaleTranslate((float)newVal); };

        }

        


        

        /// <summary>
        /// Called from parent when it closes to ensure this asset closes properly and leaves
        /// not possible memory leaks
        /// </summary>
        public void Unload()
        {

            _stagingBitmap.Dispose();
            _stagingBitmap = null;

            _stagingBitmapSourceEffect.Dispose();
            _stagingBitmapSourceEffect = null;

            _stagingTexture2D.Dispose();
            _stagingTexture2D = null;

            _pathD2DConverter = null;

            //_graphicsDevice.Dispose();
            //_graphicsDevice = null;

        }






    }

}
