

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
        private SharpDX.Direct2D1.DeviceContext _d2dContext ;

        private bool _doClear { get; set; }

        public bool Show { get; set; }


        private UIElement _root;
        private DependencyObject _rootParent;
        private Stopwatch clock;

        private float _appWidth;
        private float _appHeight;

  
        
        //VisualTree to hold UI elements to render
        private List<RenderDTO> _renderTree;
        private List<HitTestRect> _layoutTree;

        private Rectangle _selectedRect;

        public int IndexOfEffectToRender { get; set; }
        public int NumberFramesToRender { get; set; }

        //NEED TO WORK OUT HOW TO NOT MAKE THIS GLOBAL VARIABLES!!! (used from LoadViaStorageFileAsset)
        SharpDX.WIC.FormatConverter _backgroundImageFormatConverter;
        Size2 _backgroundImageSize;

        private bool _isInertialTranslationStaging { get; set; }
        private Vector3 _globalCameraTranslationStaging { get; set; }
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
        
        private bool _useStagingBitmap = false;

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
            _layoutTree = new List<HitTestRect>();

            //clock = new Stopwatch();


            _updateBackgroundTweener(1.0f, 1.0f, 1.2f);

        }


        public void Initialize(CommonDX.DeviceManager deviceManager)
        {

            _deviceManager = deviceManager;
            _d2dContext = deviceManager.ContextDirect2D;

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
            _appWidth = (float)_layoutDetail.Width;
            _appHeight = (float)_layoutDetail.Height;

            _updateScaleTranslate(1.0f);

            _drawTiles();

            

            GestureService.OnGestureRaised += (o,a) => {
                CustomGestureArgs gestureArgs = (CustomGestureArgs)a;
                //NumberFramesToRender += 3;
                if (gestureArgs.ManipulationStartedArgs != null)
                {
                    _isInertialTranslationStaging = false;
                    _globalCameraTranslationStaging = _globalCameraTranslation;
                }
                else if (gestureArgs.ManipulationInertiaStartingArgs != null)
                {
                    _isInertialTranslationStaging = true;
                    _globalCameraTranslationStaging = _globalCameraTranslation;
                }
                else if (gestureArgs.ManipulationUpdatedArgs != null)
                {
                    if(_isInertialTranslationStaging)
                        _updateCameraTranslationStaging((float)gestureArgs.ManipulationUpdatedArgs.Velocities.Linear.X);
                    else
                        _updateCameraTranslationStaging((float)gestureArgs.ManipulationUpdatedArgs.Cumulative.Translation.X);
                }
                else if (gestureArgs.ManipulationCompletedArgs != null)
                {
                    if (gestureArgs.ManipulationCompletedArgs.Cumulative.Scale < 1)
                    {
                        if (_globalScale.X != 0.9f) { _updateBackgroundTweener(1.0f, 0.9f, 1.2f); SendInformationNotification("zoom level at 90%", 3); }
                        //_updateScaleTranslate(0.9f);
                    }
                    else if (gestureArgs.ManipulationCompletedArgs.Cumulative.Scale > 1)
                    {
                        if (_globalScale.X != 1.0f) { _updateBackgroundTweener(0.9f, 1.0f, 1.2f); SendInformationNotification("zoom level at 100%", 3); }
                        //_updateScaleTranslate(1.0f);
                    }

                    _globalCameraTranslation = _globalCameraTranslation + _globalCameraTranslationStaging;
                    _globalCameraTranslationStaging = Vector3.Zero;
                    _isInertialTranslationStaging = false;

                }
                else if (gestureArgs.TappedEventArgs != null)
                {
                    var x = gestureArgs.TappedEventArgs.Position.X - _globalCameraTranslation.X;
                    var y = gestureArgs.TappedEventArgs.Position.Y - _globalCameraTranslation.Y;

                    var found = _doTilesHitTest((float)x, (float)y);
                    if (found != null && found.Count > 0)
                    {
                        _selectedRect = found[0].Rectangle;
                    }
                    else _selectedRect = Rectangle.Empty;
                }
            };


            WindowLayoutService.OnWindowLayoutRaised += (o, e) => {

                WindowLayoutEventArgs ea = (WindowLayoutEventArgs)e;

                _updateDimensions(ea.Size.Width, ea.Size.Height);
                _updateScaleTranslate(1.0f);
                _drawTiles();
            
            };


        }

        private List<HitTestRect> _doTilesHitTest(float x, float y)
        {
            
            for (int i=0;i< _layoutTree.Count(); i++)
            {
                var htr = _layoutTree[i];
                if (htr.Rectangle.Contains(x, y)) htr.IsHit = true;
                else htr.IsHit = false;
            }


            return _layoutTree.Where(i => i.IsHit).ToList();
            
        }


        private void _drawTiles()
        {

            //clean up the renderTree
            foreach (var ri in _renderTree)
            {
                if (ri.Type == eRenderType.Effect)
                {
                    ri.EffectDTO.Effect.Dispose();
                    ri.EffectDTO.Effect = null;
                    ri.EffectDTO = null;
                }
            }
            _renderTree.Clear();
            _layoutTree.Clear();

            //_createTile(200, 200, 420, 200, "\\Assets\\StartDemo\\Backgrounds\\green1.jpg", "\\Assets\\StartDemo\\Icons\\Playing Cards.png", Color.White, 1.2f, "Games", false);

            _createTile(100, 100, 100, 100, "\\Assets\\StartDemo\\Backgrounds\\blue1.jpg", "\\Assets\\StartDemo\\Icons\\Windows 8.png", Color.White, 0.7f, "Windows 8", false);
            _createTile(100, 100, 210, 100, "\\Assets\\StartDemo\\Backgrounds\\yellow1.jpg", "\\Assets\\StartDemo\\Icons\\Bowl.png", Color.White, 0.7f, "Food", false);
            _createTile(210, 210, 320, 100, "\\Assets\\StartDemo\\Backgrounds\\green1.jpg", "\\Assets\\StartDemo\\Icons\\Playing Cards.png", Color.White, 1.2f, "Games", false);
            _createTile(210, 100, 540, 100, "\\Assets\\StartDemo\\Backgrounds\\white1.jpg", "\\Assets\\StartDemo\\Icons\\Race Car.png", Color.Black, 0.7f, "Car Watcher", false);
            _createTile(100, 100, 760, 100, "\\Assets\\StartDemo\\Backgrounds\\yellow2.jpg", "\\Assets\\StartDemo\\Icons\\Dynamics CRM.png", Color.White, 0.7f, "CRM", false);

            _createTile(210, 210, 100, 210, "\\Assets\\StartDemo\\Backgrounds\\purple1.jpg", "\\Assets\\StartDemo\\Icons\\Internet Explorer.png", Color.White, 1.3f, "Internet Explorer 10", false);
            _createTile(210, 100, 320, 320, "\\Assets\\StartDemo\\Backgrounds\\blue2.jpg", "\\Assets\\StartDemo\\Icons\\Microsoft Office.png", Color.White, 0.7f, "Office 365", false);
            _createTile(100, 100, 540, 210, "\\Assets\\StartDemo\\Backgrounds\\white3.jpg", "\\Assets\\StartDemo\\Icons\\Office 2013.png", Color.White, 0.7f, "Office 2013", false);
            _createTile(100, 100, 540, 320, "\\Assets\\StartDemo\\Backgrounds\\red1.jpg", "\\Assets\\StartDemo\\Icons\\SharePoint.png", Color.White, 0.7f, "Sharepoint", false);
            _createTile(210, 210, 650, 210, "\\Assets\\StartDemo\\Backgrounds\\green2.jpg", "\\Assets\\StartDemo\\Icons\\Visual Studio.png", Color.White, 1.3f, "Visual Studio 2013", false);

            _createTile(100, 100, 100, 430, "\\Assets\\StartDemo\\Backgrounds\\yellow3.jpg", "\\Assets\\StartDemo\\Icons\\Graph2.png", Color.White, 0.7f, "Graphs", false);
            _createTile(210, 100, 210, 430, "\\Assets\\StartDemo\\Backgrounds\\yellow4.jpg", "\\Assets\\StartDemo\\Icons\\Plug.png", Color.White, 0.7f, "Power", false);
            _createTile(210, 100, 430, 430, "\\Assets\\StartDemo\\Backgrounds\\red2.jpg", "\\Assets\\StartDemo\\Icons\\Google Chrome.png", Color.White, 0.7f, "Chrome", false);
            _createTile(100, 100, 650, 430, "\\Assets\\StartDemo\\Backgrounds\\white2.jpg", "\\Assets\\StartDemo\\Icons\\Firefox.png", Color.White, 0.7f, "Firefox", false);
            _createTile(100, 100, 760, 430, "\\Assets\\StartDemo\\Backgrounds\\white3.jpg", "\\Assets\\StartDemo\\Icons\\Cloud-Upload.png", Color.White, 0.7f, "Cloud", false);


        }



        private void _updateScaleTranslate(float zoomFactor)
        {
            _globalScale = new Vector3(zoomFactor, zoomFactor, 1f);
            _globalTranslation = 
                new Vector3(
                    (float)((_appWidth * (1f - zoomFactor)) / 2), //(float)((this.State.DrawingSurfaceWidth * (1f - zoomFactor)) / 2),
                    (float)((_appHeight * (1f - zoomFactor)) / 2), //(float)((this.State.DrawingSurfaceHeight * (1f - zoomFactor)) / 2),
                    0
                ) 
                + _globalCameraTranslation 
                + _globalCameraTranslationStaging;
        }

        private void _updateCameraTranslation(float x)
        {
            _globalCameraTranslation = new Vector3(
                _globalCameraTranslation.Y + x, 
                _globalCameraTranslation.Y, 
                _globalCameraTranslation.Z);

            _updateScaleTranslate(_globalScale.X);
        }

        private void _updateCameraTranslationStaging(float x)
        {
            _globalCameraTranslationStaging = new Vector3(
                _globalCameraTranslationStaging.Y + x, 
                _globalCameraTranslationStaging.Y, 
                _globalCameraTranslationStaging.Z);

            _updateScaleTranslate(_globalScale.X);
        }



        public void InitializeUI(Windows.UI.Xaml.UIElement rootForPointerEvents, Windows.UI.Xaml.UIElement rootOfLayout)
        {
            _root = rootForPointerEvents;
            _rootParent = rootOfLayout;


            _updateDimensions(((FrameworkElement)_root).ActualWidth, ((FrameworkElement)_root).ActualHeight);


            _pathD2DConverter = new SumoNinjaMonkey.Framework.Lib.PathToD2DPathGeometryConverter();
        }

        private void _updateDimensions(double width, double height)
        {
            _appWidth = (float)width;
            _appHeight = (float)height;

            if (_stagingTexture2D != null) _stagingTexture2D.Dispose();
            if (_stagingBitmap != null) _stagingBitmap.Dispose();
            if (_stagingBitmapSourceEffect != null) _stagingBitmapSourceEffect.Dispose();

            _stagingTexture2D = AllocateTextureReturnSurface((int)_appWidth, (int)_appHeight);
            _stagingBitmap = new SharpDX.Direct2D1.Bitmap1(_deviceManager.ContextDirect2D, _stagingTexture2D.QueryInterface<SharpDX.DXGI.Surface>());
            _stagingBitmapSourceEffect = new SharpDX.Direct2D1.Effects.BitmapSourceEffect(_deviceManager.ContextDirect2D);


        }


       

        public void Update(GameTime gameTime)
        {
            var d2dContext = _d2dContext; //target.DeviceManager.ContextDirect2D;

            _gt = gameTime;

            if(_tweener!=null) _tweener.Update(gameTime);




        }

        public void Render(CommonDX.TargetBase target)
        {
            var d2dContext = _d2dContext; //target.DeviceManager.ContextDirect2D;
            var d2dDevice = target.DeviceManager.DeviceDirect2D;

            var d3dContext = target.DeviceManager.ContextDirect3D;
            var d3dDevice = target.DeviceManager.DeviceDirect3D;




            if (NumberFramesToRender > 0)
            {
                //TurnOffRenderingBecauseThereAreRenderableEffects();

                _useStagingBitmap = false;


                var _tempTarget = d2dContext.Target;
                d2dContext.Target = _stagingBitmap;

                d2dContext.BeginDraw();

                //if (_doClear) {
                d2dContext.Clear(Color.White);
                // d2dContext.Clear( new Color4(0, 0, 0, 0)); 
                //    _doClear = false; 
                //}


                foreach (var renderTree in _renderTree.OrderBy(x => x.Order))
                {

                    if (renderTree.Type == eRenderType.Effect && renderTree.EffectDTO.IsRenderable && !renderTree.HasLinkedEffects) //effects
                    {
                        if (renderTree.EffectDTO.Effect != null)
                        {
                            d2dContext.Transform =
                                //Matrix.Identity
                                Matrix.Scaling(renderTree.EffectDTO.MainScale)
                                * Matrix.Translation(renderTree.EffectDTO.MainTranslation)

                                //* Matrix.Scaling(_globalScale)
                                //* Matrix.Translation(_globalTranslation)
                                ;
                            d2dContext.DrawImage(renderTree.EffectDTO.Effect);
                        }
                    }
                    else if (renderTree.Type == eRenderType.Text && renderTree.TextDTO.IsRenderable) //text
                    {
                        d2dContext.Transform =
                            Matrix.Scaling(renderTree.TextDTO.MainScale)
                            * Matrix.Translation(renderTree.TextDTO.MainTranslation)

                            //* Matrix.Scaling(_globalScale)
                            //* Matrix.Translation(_globalTranslation)
                            ;

                        d2dContext.DrawText(renderTree.TextDTO.Text, renderTree.TextDTO.TextFormat, renderTree.TextDTO.LayoutRect, renderTree.TextDTO.Brush);
                    }
                    else if (renderTree.Type == eRenderType.Media && renderTree.MediaDTO.IsRenderable) //video/audio
                    {

                    }
                    else if (renderTree.Type == eRenderType.Shape && renderTree.ShapeDTO.IsRenderable) //Geometry
                    {

                        d2dContext.Transform =
                            //Matrix.Identity
                            Matrix.Scaling(renderTree.ShapeDTO.MainScale)
                            * Matrix.Translation(renderTree.ShapeDTO.MainTranslation)

                            //* Matrix.Scaling(_globalScale)
                            //* Matrix.Translation(_globalTranslation)
                            ;



                        if (renderTree.ShapeDTO.Type == 2)
                            d2dContext.FillGeometry(renderTree.ShapeDTO.Shape, renderTree.ShapeDTO.Brush);
                        else
                            d2dContext.DrawGeometry(
                                renderTree.ShapeDTO.Shape,
                                renderTree.ShapeDTO.Brush,
                                renderTree.ShapeDTO.StrokeWidth,
                                new SharpDX.Direct2D1.StrokeStyle(
                                    _deviceManager.FactoryDirect2D, //target.DeviceManager.FactoryDirect2D,
                                    new SharpDX.Direct2D1.StrokeStyleProperties()
                                    {
                                        DashStyle = (SharpDX.Direct2D1.DashStyle)renderTree.ShapeDTO.DashStyleIndex,
                                        DashOffset = renderTree.ShapeDTO.DashOffset,
                                        StartCap = SharpDX.Direct2D1.CapStyle.Square,
                                        EndCap = SharpDX.Direct2D1.CapStyle.Square,
                                        DashCap = SharpDX.Direct2D1.CapStyle.Square,
                                        MiterLimit = renderTree.ShapeDTO.MiterLimit
                                    }));


                    }
                    else if (renderTree.Type == eRenderType.ShapePath && renderTree.ShapePathDTO.IsRenderable) //ShapePath Geometry
                    {
                        d2dContext.Transform =
                            //Matrix.Identity
                            Matrix.Scaling(renderTree.ShapePathDTO.MainScale)
                            * Matrix.RotationX(renderTree.ShapePathDTO.MainRotation.X)
                            * Matrix.RotationY(renderTree.ShapePathDTO.MainRotation.Y)
                            * Matrix.RotationZ(renderTree.ShapePathDTO.MainRotation.Z)
                            * Matrix.Translation(renderTree.ShapePathDTO.MainTranslation)

                            //* Matrix.Scaling(_globalScale)
                            //* Matrix.Translation(_globalTranslation)
                            ;


                        d2dContext.DrawGeometry(
                         renderTree.ShapePathDTO.Shapes[0],
                         renderTree.ShapePathDTO.Brush,
                         renderTree.ShapePathDTO.StrokeWidth,
                         new SharpDX.Direct2D1.StrokeStyle(
                             _deviceManager.FactoryDirect2D,//target.DeviceManager.FactoryDirect2D,
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


                d2dContext.Target = _tempTarget;


                d2dContext.EndDraw();

                NumberFramesToRender--;
            }
            else
            {
                _useStagingBitmap = true;
            }
            

            d2dContext.BeginDraw();

            d2dContext.Clear(Color.White);
            
            if (_useStagingBitmap)
            {
                
                d2dContext.Transform =
                    Matrix.Scaling(_globalScale)
                    * Matrix.Translation(_globalTranslation);

                d2dContext.DrawImage(_stagingBitmap);

               
            }

            if (_selectedRect != Rectangle.Empty)
            {
                d2dContext.DrawRectangle(
                    new RectangleF(_selectedRect.X, _selectedRect.Y, _selectedRect.Width, _selectedRect.Height),
                    new SharpDX.Direct2D1.SolidColorBrush(_deviceManager.ContextDirect2D, Color.Red ), 
                    2);
            }



            //DESIGNER SURFACE REGION
            _drawDesktopOutline(d2dContext);

            //DEBUGGING INFO
            _drawDebuggingInfo(d2dContext);

            d2dContext.EndDraw();

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



        private async void _createTile(float width, float height, float left, float top, string backgroundUrl, string iconUrl, Color fontColor, float iconScale = 1.0f, string label = "", bool isPressed = false)
        {
            //===============
            //CREATE LAYOUT ITEM USED FOR HITTESTING
            //===============
            _layoutTree.Add( new HitTestRect(){ IsHit= false, Rectangle = new Rectangle((int)left, (int)top, (int)width, (int)height)});



            //===============
            //TILE 
            //===============
            var _bs = new UIElementState()
                {
                    IsRenderable = false, //is effect rendered/visible
                    AggregateId = Guid.NewGuid().ToString(),
                    Grouping1 = string.Empty,
                    udfString1 = backgroundUrl
                };

            var _ebs = await CreateRenderItemWithUIElement_Effect(
                _bs,
                "SharpDX.Direct2D1.Effects.BitmapSourceEffect",
                null);
            _ebs.EffectDTO.MainTranslation = new Vector3(left, top, 0);



            //determine the scale to use to scale the image to the app dimension
            double _scaleRatio = 1;
            var yRatio = 1.0f / (height / _bs.Height);
            var xRatio = 1.0f / (width / _bs.Width);
            var xyRatio = Math.Min(xRatio, yRatio);
            _scaleRatio = 1.0d / xyRatio;



            //create effect - scale
            var _escale = await CreateRenderItemWithUIElement_Effect(
                new UIElementState()
                {
                    IsRenderable = false, //is effect rendered/visible
                    AggregateId = Guid.NewGuid().ToString(),
                    Grouping1 = string.Empty,
                    udfDouble1 = _scaleRatio, // scale x
                    udfDouble2 = _scaleRatio, // scale y
                    udfDouble3 = 0.5f, // centerpoint x
                    udfDouble4 = 0.5f  // centerpoint y 
                },
                "SharpDX.Direct2D1.Effects.Scale",
                _ebs //linked parent effect
                );



            //create effect - crop
            var _ecrop = await CreateRenderItemWithUIElement_Effect(
                new UIElementState()
                {
                    IsRenderable = true, //is effect rendered/visible
                    AggregateId = Guid.NewGuid().ToString(),
                    Grouping1 = string.Empty,
                    udfDouble1 = 0,
                    udfDouble2 = 0,
                    udfDouble3 = width,
                    udfDouble4 = height
                },
                "SharpDX.Direct2D1.Effects.Crop",
                _escale  //linked parent effect
                );
            _ecrop.Order = 9;



            //===============
            //INNER GLOW
            //===============
            var rect_fade = await AddUpdateUIElementState_Rectangle(
                new UIElementState()
                {
                    IsRenderable = isPressed ? false : true,
                    AggregateId = Guid.NewGuid().ToString(),
                    Grouping1 = string.Empty,
                    Width = width,
                    Height = height,
                    udfInt1 = 2, //not fill = 1, fill = 2
                    udfString1 = "Rectangle",
                    udfDouble3 = 0, //stroke width
                    udfInt2 = 1, // 1 = 2 point gradient, 2= solid
                    udfString2 = "255|255|255|0", //gradient 1 
                    udfDouble1 = 70d, // color position 1
                    udfString3 = "0|0|0|255", //gradient 2
                    udfDouble2 = 100d, // color position 2
                    Left = left,
                    Top = top,
                    Scale = 1d
                },
                null);
            rect_fade.Order = 10;



            //===============
            //OUTER SHADOW
            //===============
            if (!isPressed)
            {
                var _eshadow = await CreateRenderItemWithUIElement_Effect(
                    new UIElementState()
                    {
                        IsRenderable = true,
                        AggregateId = Guid.NewGuid().ToString(),
                        Grouping1 = string.Empty,
                        udfDouble1 = 5.0d,
                    },
                    "SharpDX.Direct2D1.Effects.Shadow",
                    _ecrop
                    );
                _eshadow.Order = 5;
            }




            //===============
            //ICON
            //===============
            if (iconUrl.Length > 0)
            {
                //bitmap source
                var _bsicon = new UIElementState()
                {
                    IsRenderable = true,
                    AggregateId = Guid.NewGuid().ToString(),
                    Grouping1 = string.Empty,
                    udfString1 = iconUrl
                };

                //bitmap effect
                var _ebsicon = await CreateRenderItemWithUIElement_Effect(
                   _bsicon,
                   "SharpDX.Direct2D1.Effects.BitmapSourceEffect",
                   null);

                double iconX = (width - (_bsicon.Width * iconScale)) / 2;
                double iconY = (height - (_bsicon.Height * iconScale)) / 2;

                _ebsicon.EffectDTO.MainTranslation = new Vector3(left + (float)iconX, top + (float)iconY, 0);
                _ebsicon.EffectDTO.MainScale = new Vector3(iconScale);
                _ebsicon.Order = 20;


                //outer glow
                var _ebsiconshadow = await CreateRenderItemWithUIElement_Effect(
                new UIElementState()
                {
                    IsRenderable = isPressed ? false : true,
                    AggregateId = Guid.NewGuid().ToString(),
                    Grouping1 = string.Empty,
                    udfDouble1 = 2.0d,
                },
                "SharpDX.Direct2D1.Effects.Shadow",
                _ebsicon
                );
                _ebsiconshadow.Order = 19;

            }


            //===============
            //LABEL
            //===============
            if (label.Length > 0)
            {
                //outer glow
                var _txtLabel = await AddUpdateUIElementState_Text(
                new UIElementState()
                {
                    IsRenderable = true,
                    AggregateId = Guid.NewGuid().ToString(),
                    Grouping1 = string.Empty,
                    udfString1 = label,
                    udfString2 = "Segoe UI",
                    udfDouble1 = 18d,
                    Left = left,
                    Top = top + height - 25,
                    Scale = 1,
                    Width = width,
                    Height = height
                }
                , null
                , fontColor
                );

                _txtLabel.Order = 25;
            }




            if (NumberFramesToRender < 1) NumberFramesToRender = 1;
        }

      

        private void _updateBackgroundTweener(float start, float end, float duration)
        {
            //methodinfo.createdelegate
            //http://msdn.microsoft.com/en-us/library/windows/apps/hh194376.aspx
            if (_tweener == null)
            {
                _tweener = new Tweener(start, end, TimeSpan.FromSeconds(duration), (TweeningFunction)Cubic.EaseIn);
                _tweener.PositionChanged += (newVal) => { _updateScaleTranslate((float)newVal); };
                _tweener.Ended += () => { _tweener.Pause(); };
            }
            else
            {
                _tweener.Reset(start, end, duration);
                _tweener.Play();

            }
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


    public class HitTestRect 
    {
        public Rectangle Rectangle { get; set; }
        public bool IsHit { get; set; }
    }


}
