

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

        private Vector3 _globalTranslation { get; set; }
        private Vector3 _globalScale { get; set; }

        private string _sessionID { get; set; }

        private bool _drawDesignerLayout { get; set; }
        private LayoutDetail _layoutDetail { get; set; }
        private RectangleF _layoutDeviceScreenSize { get; set; }
        private RectangleF _layoutViewableArea { get; set; }


        public BackgroundComposer()
        {
            _doClear = false;
            
            Show = true;
            NumberFramesToRender = 0;
            IndexOfEffectToRender = 0;

            _globalScale = new Vector3(1f, 1f, 1f);
            _globalTranslation = new Vector3(0, 0, 0);
            _sessionID = AppDatabase.Current.RetrieveInstanceAppState(AppDatabase.AppSystemDataEnums.UserSessionID).Value;


            //_effects = new List<EffectDTO>();
            _renderTree = new List<RenderDTO>();

            clock = new Stopwatch();

        }


        SharpDX.Direct2D1.SolidColorBrush _generalGrayColor ;
        SharpDX.Direct2D1.SolidColorBrush _generalLightGrayColor ;
        SharpDX.Direct2D1.SolidColorBrush _generalLightWhiteColor;


        public void Initialize(CommonDX.DeviceManager deviceManager)
        {

            _deviceManager = deviceManager;

            _generalGrayColor = new SharpDX.Direct2D1.SolidColorBrush(_deviceManager.ContextDirect2D, Color.Gray);
            _generalLightGrayColor = new SharpDX.Direct2D1.SolidColorBrush(_deviceManager.ContextDirect2D, Color.LightGray);
            _generalLightWhiteColor = new SharpDX.Direct2D1.SolidColorBrush(_deviceManager.ContextDirect2D, Color.White);


            //_effectToRender = CreateDropShadowEffectGraph();

            _layoutDetail = new LayoutDetail() { Width = this.State.DrawingSurfaceWidth, Height = this.State.DrawingSurfaceHeight };
            _layoutDeviceScreenSize = new RectangleF(0, 0, (float)_layoutDetail.Width, (float)_layoutDetail.Height);


            float zoomFactor = 0.9f;
            _globalScale = new Vector3(zoomFactor, zoomFactor, 1f);
            _globalTranslation = new Vector3(
                (float)((this.State.DrawingSurfaceWidth * (1f - zoomFactor)) / 2),
                (float)((this.State.DrawingSurfaceHeight * (1f - zoomFactor)) / 2), 
                0);

            _dummyData();

            NumberFramesToRender = 3;

        }




        SharpDX.Direct3D11.Texture2D _stagingTexture2D;
        SharpDX.Direct2D1.Bitmap1 _stagingBitmap;
        SharpDX.Direct2D1.Effects.BitmapSourceEffect _stagingBitmapSourceEffect;

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

        private SharpDX.Direct3D11.Texture2D AllocateTextureReturnSurface(int drawingSizeWidth, int drawingSizeHeight)
        {
            // Setup local variables
            var d3dDevice = _deviceManager.DeviceDirect3D;
            var d3dContext = _deviceManager.ContextDirect3D;
            var d2dDevice = _deviceManager.DeviceDirect2D;
            var d2dContext = _deviceManager.ContextDirect2D;

            var desc = new SharpDX.Direct3D11.Texture2DDescription()
            {
                Format = SharpDX.DXGI.Format.B8G8R8A8_UNorm, //  D24_UNorm_S8_UInt,
                ArraySize = 1,
                MipLevels = 1,
                Width = drawingSizeWidth,
                Height = drawingSizeHeight,
                Usage = SharpDX.Direct3D11.ResourceUsage.Default,
                SampleDescription = new SharpDX.DXGI.SampleDescription(1, 0),
                BindFlags = SharpDX.Direct3D11.BindFlags.RenderTarget | SharpDX.Direct3D11.BindFlags.ShaderResource,
            };

            desc.Usage = SharpDX.Direct3D11.ResourceUsage.Default;
            var tex2D = new SharpDX.Direct3D11.Texture2D(d3dDevice, desc);
            return tex2D;


        }


        public void Render(CommonDX.TargetBase target)
        {
            if (NumberFramesToRender == 0)
            {
                TurnOffRenderingBecauseThereAreRenderableEffects();
                return;
            }

            var d2dContext = target.DeviceManager.ContextDirect2D;
            var d2dDevice = target.DeviceManager.DeviceDirect2D;

            var d3dContext = target.DeviceManager.ContextDirect3D;
            var d3dDevice = target.DeviceManager.DeviceDirect3D;

            

            d2dContext.BeginDraw();

            //if (_doClear) {
                //d2dContext.Clear(Color.White); 
                d2dContext.Clear(new Color4(0, 0, 0, 0)); 
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

                    d2dContext.Transform =
                        Matrix.Scaling(renderTree.ShapeDTO.MainScale)
                        * Matrix.Scaling(_globalScale)

                        * Matrix.RotationX(renderTree.ShapeDTO.MainRotation.X)
                        * Matrix.RotationY(renderTree.ShapeDTO.MainRotation.Y)
                        * Matrix.RotationZ(renderTree.ShapeDTO.MainRotation.Z)

                        * Matrix.Translation(renderTree.ShapeDTO.MainTranslation)
                        * Matrix.Translation(_globalTranslation);



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
                    d2dContext.DrawImage(_stagingBitmap);
                    
                    //DOESNT WORK
                    //var bitmapDecoder  = new SharpDX.WIC.BmpBitmapDecoder(_deviceManager.WICFactory);
                    //bitmapDecoder.Initialize(null, SharpDX.WIC.DecodeOptions.CacheOnDemand);
                    //bitmapDecoder.GetFrame(0);
                    //SharpDX.Direct2D1.Image img = _stagingBitmap;
                    //SharpDX.Direct2D1.Bitmap bmp = _stagingBitmap;

                    
                    //var dr = _stagingBitmap.Map(SharpDX.Direct2D1.MapOptions.None);
                    //SharpDX.WIC.Bitmap bm = new SharpDX.WIC.Bitmap(_deviceManager.WICFactory, (int)_stagingBitmap.Size.Width, (int)_stagingBitmap.Size.Height, SharpDX.WIC.PixelFormat.Format32bppRGBA, dr);

                    //DataStream dataStream = new DataStream( (int)_appWidth * (int)_appHeight, true, true);
                    
                    //_stagingBitmapSourceEffect.WicBitmapSource.CopyPixels((int)_appWidth * sizeof(uint), dataStream);

                    //_stagingBitmapSourceEffect.AlphaMode = SharpDX.Direct2D1.AlphaMode.Premultiplied;
                    //_stagingBitmapSourceEffect.SetInput(0, _stagingBitmap, false);
                     
                        
                    //d2dContext.Transform = Matrix.Identity;
                    //d2dContext.DrawImage(_stagingBitmapSourceEffect);

                }
                else if (renderTree.Type == eRenderType.ShapePath && renderTree.ShapePathDTO.IsRenderable) //ShapePath Geometry
                {
                    d2dContext.Transform =
                        Matrix.Scaling(renderTree.ShapePathDTO.MainScale)
                        * Matrix.Scaling(_globalScale)

                        * Matrix.RotationX(renderTree.ShapePathDTO.MainRotation.X)
                        * Matrix.RotationY(renderTree.ShapePathDTO.MainRotation.Y)
                        * Matrix.RotationZ(renderTree.ShapePathDTO.MainRotation.Z)

                        * Matrix.Translation(renderTree.ShapePathDTO.MainTranslation)
                        * Matrix.Translation(_globalTranslation);


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


            //DRAW DESIGNER SURFACE REGION
            _drawDesktopOutline(d2dContext);
            
            d2dContext.EndDraw();

            NumberFramesToRender--;
        }

        private void _drawDesktopOutline( SharpDX.Direct2D1.DeviceContext d2dContext)
        {
            
            
            SharpDX.DirectWrite.TextFormat _generalTextFormat = new SharpDX.DirectWrite.TextFormat(
                _deviceManager.FactoryDirectWrite,
                "Segoe UI",
                SharpDX.DirectWrite.FontWeight.Light,
                SharpDX.DirectWrite.FontStyle.Normal,
                SharpDX.DirectWrite.FontStretch.Normal,
                16f);


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

        private async void _dummyData()
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

        }

        public void LoadLocalAsset(string assetUri)
        {

        }



        /// <summary>
        /// Used to turn on rendering if it finds effects to render
        /// </summary>
        private void TurnOnRenderingBecauseThereAreRenderableEffects()
        {
            if (NumberFramesToRender > 0) //_effects.Where(x => x.IsRenderable).Count() > 0 && 
            {
                Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "DASHBOARD", Action = "TURN ON DRAWING SURFACE" });
            }
        }

        /// <summary>
        /// Used to turn on rendering if it finds effects to render
        /// </summary>
        private void ForcedTurnOnRenderingBecauseThereAreRenderableEffects()
        {
            
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "DASHBOARD", Action = "TURN ON DRAWING SURFACE" });
            
        }

        /// <summary>
        /// Used to turn on rendering if it finds effects to render
        /// </summary>
        private void TurnOffRenderingBecauseThereAreRenderableEffects()
        {
            if (NumberFramesToRender==0)
            {
                //Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage("") { Identifier = "DASHBOARD", Action = "TURN OFF DRAWING SURFACE" });
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

}
