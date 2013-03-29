using System;

using System.Collections.Generic;

using System.Diagnostics;

using System.Linq;

using System.Text;

using System.Threading.Tasks;

using CommonDX;
using SumoNinjaMonkey.Framework.Lib;
using SharpDX;
using SharpDX.Direct3D;
using SharpDX.Direct3D11;
using SharpDX.DXGI;
using SharpDX.IO;
using SumoNinjaMonkey.Framework.Controls.DrawingSurface;
using Windows.UI.Xaml;
using GalaSoft.MvvmLight.Messaging;
using SumoNinjaMonkey.Framework.Controls.Messages;
using ModernCSApp.Services;
using ModernCSApp;





namespace ModernCSApp.DxRenderer
{
    public class Shell : BaseRenderer, IRenderer
    {
        private DeviceManager _deviceManager;
        public bool EnableClear { get; set; }
        public bool Show { get; set; }
        private UIElement _root;
        private DependencyObject _rootParent;
        private Stopwatch clock;

        private float _appWidth;
        private float _appHeight;

        public SumoNinjaMonkey.Framework.Controls.DrawingSurfaceSIS DrawingSurface;

        private string _sessionID { get; set; }
        private Solution _solution { get; set; }

        //private float _globalScaleX = 1;
        //private float _globalScaleY = 1;
        //private float _globalRotationX = 0;
        //private float _globalRotationY = 0;
        //private float _globalTranslationX = 0;
        //private float _globalTranslationY = 0;
        //private float _globalTranslationZ = 0;
        //private float _globalThicknessX = 10;



        //Effects -         
        private List<RenderDTO> _renderTree;
        public static Project _project { get; set; }

        private class RenderDTO
        {
            public int Type { get; set; }
            public D3DPrimitiveDTO D3DPrimitiveDTO { get; set; }
            public int Order { get; set; }
            public bool HasLinkedEffects { get; set; }
        }



        private class D3DPrimitiveDTO
        {
            public bool IsSelected { get; set; }

            public Project Project
            {
                get { return _project; }
            }



            public SharpDX.Direct3D11.Buffer ConstantBuffer; // { get; set; }
            public InputLayout Layout; //{ get; set; }
            public SharpDX.Direct3D11.Buffer VertexBuffer;
            public int VertexCount;
            public VertexBufferBinding VertexBufferBinding;
            public VertexShader VertexShader; // { get; set; }
            public PixelShader PixelShader; // { get; set; }
            public Texture2D Texture2D;
            public ShaderResourceView TextureView; // { get; set; }
            public SamplerState Sampler; // { get; set; }
            public BlendState1 BlendState;



            public void Unload()
            {

                PixelShader.Dispose();
                VertexShader.Dispose();
                TextureView.Dispose();
                Sampler.Dispose();
                BlendState.Dispose();
                Texture2D.Dispose();
                VertexBufferBinding.Buffer.Dispose();
                VertexBuffer.Dispose();
                Layout.Dispose();
                ConstantBuffer.Dispose();



                this.PixelShader = null;
                this.VertexShader = null;
                this.TextureView = null;
                this.Sampler = null;
                this.BlendState = null;
                this.Texture2D = null;
                this.VertexBufferBinding.Buffer = null;
                this.VertexBuffer = null;
                this.Layout = null;
                this.ConstantBuffer = null;

            }

        }





        public Shell()
        {
            //RenderOn = true;
            EnableClear = true;
            _renderTree = new List<RenderDTO>();
            
            clock = new Stopwatch();


            _sessionID = AppDatabase.Current.RetrieveInstanceAppState(ModernCSApp.Services.AppDatabase.AppSystemDataEnums.UserSessionID).Value;
            _project = new Project();
            _project.ScaleX = 1.0f;
            _project.ScaleY = 1.0f;
            _project.ScaleZ = 1.0f;
            _project.IsRenderable = true;

            Messenger.Default.Register<GeneralSystemWideMessage>(this, DoGeneralSystemWideMessageCallback);
        }





        public bool RenderOn { get; set; }


        Texture2D _tempTextureStar;

        public virtual void Initialize(DeviceManager devices)
        {

            _deviceManager = devices;







            //RETRIEVE EXISTING SOLUTIONS

            //var foundSolution = AppDatabase.Current.RetrieveSolutionsByGrouping(_sessionID);

            _solution = new Solution();
            _solution.ScaleX = 1;
            _solution.ScaleY = 1;



            //if (foundSolution != null)
            //{

            //    _solution = foundSolution;
            //    //_globalTranslationX = _solution.TranslationX;
            //    //_globalTranslationY = _solution.TranslationY;
            //    //_globalTranslationZ = _solution.TranslationZ;
            //    //_globalRotationX = _solution.RotationX;
            //    //_globalRotationY = _solution.RotationY;
            //    //_globalScaleX = _solution.ScaleX;
            //    //_globalScaleY = _solution.ScaleY;

            //    ////RETRIEVE EXISTING PROJECTS
            //    //var found = AppDatabase.Current.RetrieveProjectsByGrouping(_solution.AggregateId);
            //    //if (found != null && found.Count > 0)
            //    //{
            //    //    foreach (Project p in found)
            //    //    {
            //    //        CreateD3DDto(p);
            //    //    }
            //    //}

            //    //CreateD3DDto("\\Assets\\BackgroundDefault001.jpg");
            //}

            clock = new Stopwatch();
            clock.Start();

        }


        private void DoGeneralSystemWideMessageCallback(GeneralSystemWideMessage msg)
        {
            if (msg.Identifier == "SHELL RENDERER")
            {
                if (msg.Action == "RENDER ON")
                {
                    RenderOn = true;
                }
                else if (msg.Action == "RENDER OFF")
                {
                    RenderOn = false;
                }
                else if (msg.Action == "CREATE BACKGROUND ASSET")
                {
                    CreateD3D_rDto(msg.Url1);//"\\Assets\\BackgroundDefault001.jpg");
                    RenderOn = true;
                }
                else if (msg.Action == "UPDATE BACKGROUND ASSET")
                {
                    CreateD3D_rDto(msg.Url1);//"\\Assets\\BackgroundDefault001.jpg");
                    RenderOn = true;
                }
            }


        }



        public void DrawText()
        {
            //var sceneColorBrush = new SolidColorBrush(deviceManager.ContextDirect2D, Color.White);
            var textFormat = new SharpDX.DirectWrite.TextFormat(_deviceManager.FactoryDirectWrite, "Calibri", 20) { TextAlignment = SharpDX.DirectWrite.TextAlignment.Leading, ParagraphAlignment = SharpDX.DirectWrite.ParagraphAlignment.Center };
        }



        public virtual void Render(TargetBase render)
        {
            if (!RenderOn) return;

            var d3dContext = render.DeviceManager.ContextDirect3D;
            var d3dDevice = render.DeviceManager.DeviceDirect3D;

            float width = (float)render.RenderTargetSize.Width;
            float height = (float)render.RenderTargetSize.Height;



            // Prepare matrices
            //var view = Matrix.LookAtLH(new Vector3(0, 0, -5), new Vector3(0, 0, 0), Vector3.UnitY);
            //var proj = Matrix.PerspectiveFovLH((float)Math.PI / 4.0f, width / (float)height, 0.1f, 100.0f);
            var view = Matrix.LookAtLH(new Vector3(0, 0, -3), new Vector3(0, 0, 0), Vector3.UnitY);
            var proj = Matrix.PerspectiveFovLH(0.925f, 1.0f, 0.1f, 100.0f);
            var viewProj = Matrix.Multiply(view, proj);
            var time = (float)(clock.ElapsedMilliseconds / 1000.0);





            // Set targets (This is mandatory in the loop)
            d3dContext.OutputMerger.SetTargets(render.DepthStencilView, render.RenderTargetView);


            // Clear the views
            d3dContext.ClearDepthStencilView(render.DepthStencilView, DepthStencilClearFlags.Depth, 1.0f, 0);

            if (EnableClear)
            {
                d3dContext.ClearRenderTargetView(render.RenderTargetView, new Color4(0.0f, 0.0f, 0.0f, 0.0f));
            }





            //if (RenderOn)
            //{

                foreach (var rDto in _renderTree.Where(x => x.D3DPrimitiveDTO.Project.IsRenderable))
                {

                    // Calculate WorldViewProj

                    //var worldViewProj = Matrix.Scaling(Scale) * Matrix.RotationX(time) * Matrix.RotationY(time * 2.0f) * Matrix.RotationZ(time * .7f) * viewProj;

                    var worldViewProj =
                        
                        Matrix.Scaling(rDto.D3DPrimitiveDTO.Project.ScaleX, rDto.D3DPrimitiveDTO.Project.ScaleY, rDto.D3DPrimitiveDTO.Project.ScaleZ)
                        * Matrix.RotationX(rDto.D3DPrimitiveDTO.Project.RotationX)
                        * Matrix.RotationY(rDto.D3DPrimitiveDTO.Project.RotationY)
                        * Matrix.Translation(rDto.D3DPrimitiveDTO.Project.TranslationX, rDto.D3DPrimitiveDTO.Project.TranslationY, rDto.D3DPrimitiveDTO.Project.TranslationZ)

                        //* Matrix.Scaling(_globalScaleX, _globalScaleY, 1)
                        //* Matrix.RotationX(_globalRotationX)
                        //* Matrix.RotationY(_globalRotationY)
                        //* Matrix.Translation(_globalTranslationX, _globalTranslationY, _globalTranslationZ)

                        * viewProj;



                    worldViewProj.Transpose();



                    // Setup the pipeline

                    d3dContext.InputAssembler.SetVertexBuffers(0, rDto.D3DPrimitiveDTO.VertexBufferBinding);
                    d3dContext.InputAssembler.InputLayout = rDto.D3DPrimitiveDTO.Layout;
                    d3dContext.InputAssembler.PrimitiveTopology = PrimitiveTopology.TriangleList;

                    d3dContext.VertexShader.SetConstantBuffer(0, rDto.D3DPrimitiveDTO.ConstantBuffer);
                    d3dContext.VertexShader.Set(rDto.D3DPrimitiveDTO.VertexShader);
                    d3dContext.PixelShader.SetShaderResource(0, rDto.D3DPrimitiveDTO.TextureView);
                    d3dContext.PixelShader.SetSampler(0, rDto.D3DPrimitiveDTO.Sampler);
                    d3dContext.PixelShader.Set(rDto.D3DPrimitiveDTO.PixelShader);



                    // Update Buffers
                    d3dContext.UpdateSubresource(ref worldViewProj, rDto.D3DPrimitiveDTO.ConstantBuffer, 0);
                    d3dContext.OutputMerger.BlendState = rDto.D3DPrimitiveDTO.BlendState;


                    // Draw the cube
                    d3dContext.Draw(rDto.D3DPrimitiveDTO.VertexCount, 0);


                    
                    
                }



            //}


        }





        public void InitializeUI(Windows.UI.Xaml.UIElement rootForPointerEvents, Windows.UI.Xaml.UIElement rootOfLayout)
        {

            _root = rootForPointerEvents;
            _rootParent = rootOfLayout;

            _appWidth = (float)((FrameworkElement)_root).ActualWidth;
            _appHeight = (float)((FrameworkElement)_root).ActualHeight;

        }





        private void CreateD3D_rDto(string assetUrl)
        {
            RenderDTO rDto = new RenderDTO();

            rDto.D3DPrimitiveDTO = new D3DPrimitiveDTO();

            //SafeDispose(ref rDto.D3DPrimitiveDTO.VertexBuffer);
            //rDto.D3DPrimitiveDTO.IsRenderable = true;
            // Remove previous buffer
            //SafeDispose(ref rDto.D3DPrimitiveDTO.ConstantBuffer);

            // Setup local variables
            var d3dDevice = _deviceManager.DeviceDirect3D;
            var d3dContext = _deviceManager.ContextDirect3D;
            var d2dDevice = _deviceManager.DeviceDirect2D;
            var d2dContext = _deviceManager.ContextDirect2D;

            var path = Windows.ApplicationModel.Package.Current.InstalledLocation.Path;

            // Loads vertex shader bytecode
            var vertexShaderByteCode = NativeFile.ReadAllBytes(path + "\\Assets\\MiniCubeTexture_VS.fxo");

            rDto.D3DPrimitiveDTO.VertexShader = new VertexShader(d3dDevice, vertexShaderByteCode);

            // Loads pixel shader bytecode
            rDto.D3DPrimitiveDTO.PixelShader = new PixelShader(d3dDevice, NativeFile.ReadAllBytes(path + "\\Assets\\MiniCubeTexture_PS.fxo"));

            // Layout from VertexShader input signature
            rDto.D3DPrimitiveDTO.Layout = new InputLayout(d3dDevice, vertexShaderByteCode, new[]
                    {
                        new InputElement("POSITION", 0, Format.R32G32B32A32_Float, 0, 0),
                        new InputElement("TEXCOORD", 0, Format.R32G32_Float, 16, 0)
                    });


            // Instantiate Vertex buffer from vertex data
            float thicknessToUse = 0.15f;
            thicknessToUse = 1.0f; //project.Thickness;

            rDto.D3DPrimitiveDTO.VertexCount = 36; //6 * 6
            rDto.D3DPrimitiveDTO.VertexBuffer = ToDispose(new SharpDX.Direct3D11.Buffer(d3dDevice, sizeof(float) * 6, ResourceUsage.Default, BindFlags.VertexBuffer, CpuAccessFlags.None, ResourceOptionFlags.None, 0));
            rDto.D3DPrimitiveDTO.VertexBuffer = GenerateVertexBuffer6Sided(d3dDevice, thicknessToUse);

            //vertexBufferBinding = new VertexBufferBinding(vertices, Utilities.SizeOf<Vector4>() * 2, 0);
            rDto.D3DPrimitiveDTO.VertexBufferBinding = new VertexBufferBinding(rDto.D3DPrimitiveDTO.VertexBuffer, sizeof(float) * 6, 0);

            // Create Constant Buffer
            rDto.D3DPrimitiveDTO.ConstantBuffer = ToDispose(new SharpDX.Direct3D11.Buffer(d3dDevice, Utilities.SizeOf<Matrix>(), ResourceUsage.Default, BindFlags.ConstantBuffer, CpuAccessFlags.None, ResourceOptionFlags.None, 0));

            //TextureView
            RenderD3DDto(assetUrl, rDto);

            rDto.D3DPrimitiveDTO.Sampler = new SamplerState(d3dDevice, new SamplerStateDescription()
            {
                Filter = Filter.MinMagMipLinear,
                AddressU = TextureAddressMode.Wrap,
                AddressV = TextureAddressMode.Wrap,
                AddressW = TextureAddressMode.Wrap,
                BorderColor = Color.Black,
                ComparisonFunction = Comparison.Never,
                MaximumAnisotropy = 16,
                MipLodBias = 0,
                MinimumLod = 0,
                MaximumLod = 16,
            });

            BlendStateDescription1 blendDesc = new BlendStateDescription1();
            blendDesc.AlphaToCoverageEnable = true;  //set to true to get nice blending betweent sprites
            blendDesc.IndependentBlendEnable = false;
            blendDesc.RenderTarget[0].IsBlendEnabled = false;
            blendDesc.RenderTarget[0].IsLogicOperationEnabled = false;
            blendDesc.RenderTarget[0].SourceBlend = BlendOption.SourceAlpha;
            blendDesc.RenderTarget[0].DestinationBlend = BlendOption.SourceAlphaSaturate;
            blendDesc.RenderTarget[0].BlendOperation = BlendOperation.Maximum;
            blendDesc.RenderTarget[0].SourceAlphaBlend = BlendOption.One;
            blendDesc.RenderTarget[0].DestinationAlphaBlend = BlendOption.One;
            blendDesc.RenderTarget[0].AlphaBlendOperation = BlendOperation.Maximum; // set to maximum to blend 2 sprites nicely over each other
            blendDesc.RenderTarget[0].RenderTargetWriteMask = ColorWriteMaskFlags.All;
            rDto.D3DPrimitiveDTO.BlendState = new BlendState1(d3dDevice, blendDesc);

            _renderTree.Add(rDto);

        }

        private async void RenderD3DDto(string assetUrl, RenderDTO rDto)
        {
            if (rDto == null) return;

            if (string.IsNullOrEmpty(assetUrl)) return;

            // Setup local variables
            var d3dDevice = _deviceManager.DeviceDirect3D;
            var d3dContext = _deviceManager.ContextDirect3D;
            var d2dDevice = _deviceManager.DeviceDirect2D;
            var d2dContext = _deviceManager.ContextDirect2D;



            // Load texture and create sampler
            //using (var bitmap = TextureLoader.LoadBitmap(_deviceManager.WICFactory, string.IsNullOrEmpty(project.AssetUrl)?"Assets\\Textures\\5.jpg": project.AssetUrl  ))
            //using (var texture2D = TextureLoader.CreateTexture2DFromBitmap(d3dDevice, bitmap))
            //    rDto.D3DPrimitiveDTO.TextureView = new ShaderResourceView(d3dDevice, texture2D);



            //Fill D2D THEN push D2D -> D3D
            var fc  = await this.LoadAssetAsync(_deviceManager.WICFactory, assetUrl);



            //using (SharpDX.WIC.BitmapSource bitmap = TextureLoader.LoadBitmap(_deviceManager.WICFactory, assetUrl))
            using (SharpDX.WIC.BitmapSource bitmap = (SharpDX.WIC.BitmapSource)fc.Item1)
            {
                d2dContext.Transform = Matrix.Identity;

                rDto.D3DPrimitiveDTO.Texture2D = AllocateTextureReturnSurface(d3dDevice, new Size2F(bitmap.Size.Width, bitmap.Size.Height));
                d2dContext.Target = new SharpDX.Direct2D1.Bitmap1(d2dContext, rDto.D3DPrimitiveDTO.Texture2D.QueryInterface<SharpDX.DXGI.Surface>());
                rDto.D3DPrimitiveDTO.TextureView = new ShaderResourceView(d3dDevice, rDto.D3DPrimitiveDTO.Texture2D);

                d2dContext.BeginDraw();
                SharpDX.Direct2D1.Effects.BitmapSourceEffect effectBitmapSource = new SharpDX.Direct2D1.Effects.BitmapSourceEffect(d2dContext);

                effectBitmapSource.WicBitmapSource = bitmap;



                //SharpDX.Direct2D1.Effects.Shadow shadowEffect = new SharpDX.Direct2D1.Effects.Shadow(d2dContext);
                //shadowEffect.SetInputEffect(0, effectBitmapSource, true);
                //shadowEffect.BlurStandardDeviation = 10.0f;
                //d2dContext.DrawImage(shadowEffect);

                d2dContext.DrawImage(effectBitmapSource);
                //d2dContext.FillRectangle(new RectangleF(0, bitmap.Size.Height - 90, bitmap.Size.Width, bitmap.Size.Height), new SharpDX.Direct2D1.SolidColorBrush(d2dContext, this.AccentColorLightBy2Degree));



                //if (project.Title != null)
                //{
                //    SharpDX.DirectWrite.TextFormat tf = new SharpDX.DirectWrite.TextFormat(_deviceManager.FactoryDirectWrite, "segoe ui", 28.0f);
                //    d2dContext.DrawText(project.Title, tf, new RectangleF(10, bitmap.Size.Height - 90 + 10, bitmap.Size.Width, bitmap.Size.Height), new SharpDX.Direct2D1.SolidColorBrush(d2dContext, Color.White));
                //}

                //if (project.Description != null)
                //{
                //    SharpDX.DirectWrite.TextFormat tf = new SharpDX.DirectWrite.TextFormat(_deviceManager.FactoryDirectWrite, "segoe ui", 21.0f);
                //    d2dContext.DrawText(project.Description, tf, new RectangleF(10, bitmap.Size.Height - 90 + 40, bitmap.Size.Width, bitmap.Size.Height), new SharpDX.Direct2D1.SolidColorBrush(d2dContext, Color.White));
                //}

                //PathToD2DPathGeometryConverter pathConverter = new PathToD2DPathGeometryConverter();

                //if (!string.IsNullOrEmpty(project.PathResource))
                //{
                //    var resourceFound = App.Current.Resources[project.PathResource];
                //    var pathGeometryCreated = pathConverter.parse((string)resourceFound, _deviceManager.FactoryDirect2D);
                //    var pathGeometryCreatedSize = pathGeometryCreated.GetBounds();
                //    d2dContext.FillRectangle(
                //        new RectangleF(bitmap.Size.Width - pathGeometryCreatedSize.Width - 20, 0, bitmap.Size.Width, pathGeometryCreatedSize.Height + 20)
                //        , new SharpDX.Direct2D1.SolidColorBrush(d2dContext, this.AccentColor)
                //        );
                //    d2dContext.Transform = Matrix.Translation(bitmap.Size.Width - pathGeometryCreatedSize.Width - 10, 10, 0);
                //    //d2dContext.StrokeWidth = 2.0f;
                //    d2dContext.FillGeometry(pathGeometryCreated, new SharpDX.Direct2D1.SolidColorBrush(d2dContext, this.AccentColorLightBy2Degree));
                //    //d2dContext.DrawGeometry(pathGeometryCreated, new SharpDX.Direct2D1.SolidColorBrush(d2dContext, this.AccentColor));
                //}

                d2dContext.EndDraw();

            }



        }

        public void LoadLocalAsset(string assetUri)
        {
            throw new NotImplementedException();

        }





        /// <summary>

        /// Called from parent when it closes to ensure this asset closes properly and leaves

        /// not possible memory leaks

        /// </summary>

        public void Unload()
        {

            Messenger.Default.Unregister<GeneralSystemWideMessage>(this, DoGeneralSystemWideMessageCallback);

            _tempTextureStar.Dispose();

            foreach (var item in _renderTree)
            {
                item.D3DPrimitiveDTO.Unload();
            }

            _renderTree.Clear();
            _renderTree = null;

            _tempTextureStar = null;

        }



        public void Update(SharpDX.Toolkit.GameTime gameTime)
        {
            
        }
    }



}
