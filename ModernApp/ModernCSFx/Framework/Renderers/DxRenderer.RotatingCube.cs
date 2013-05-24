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

    public partial class RotatingCube : BaseRenderer, IRenderer, ISpriteRenderer
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



        private SharpDX.Direct3D11.Buffer constantBuffer;
        private InputLayout layout;
        private VertexBufferBinding vertexBufferBinding;
        private VertexShader vertexShader;
        private PixelShader pixelShader;
        private ShaderResourceView textureView;
        private SamplerState sampler;


        public RotatingCube()
        {

            Scale = 1.0f;
            ShowCube = true;
            EnableClear = true;




            clock = new Stopwatch();

        }



        public bool ShowCube { get; set; }


        public float Scale { get; set; }


        public void Initialize(DeviceManager deviceManager)
        {
            _deviceManager = deviceManager;


            // Remove previous buffer
            //SafeDispose(ref constantBuffer);


            // Setup local variables
            var d3dDevice = deviceManager.DeviceDirect3D;
            var d3dContext = deviceManager.ContextDirect3D;


            var path = Windows.ApplicationModel.Package.Current.InstalledLocation.Path;


            // Loads vertex shader bytecode
            var vertexShaderByteCode = NativeFile.ReadAllBytes(path + "\\Assets\\MiniCubeTexture_VS.fxo");
            vertexShader = new VertexShader(d3dDevice, vertexShaderByteCode);


            // Loads pixel shader bytecode
            pixelShader = new PixelShader(d3dDevice, NativeFile.ReadAllBytes(path + "\\Assets\\MiniCubeTexture_PS.fxo"));


            // Layout from VertexShader input signature
            layout = new InputLayout(d3dDevice, vertexShaderByteCode, new[]
                    {
                        new InputElement("POSITION", 0, Format.R32G32B32A32_Float, 0, 0),
                        new InputElement("TEXCOORD", 0, Format.R32G32_Float, 16, 0)
                    });


            // Instantiate Vertex buffer from vertex data
            var vertices = SharpDX.Direct3D11.Buffer.Create(d3dDevice, BindFlags.VertexBuffer, new[]
                                  {
                                      
                                      // 3D coordinates              UV Texture coordinates
                                      -1.0f, -1.0f, -1.0f, 1.0f,     0.0f, 1.0f, // Front
                                      -1.0f,  1.0f, -1.0f, 1.0f,     0.0f, 0.0f,
                                       1.0f,  1.0f, -1.0f, 1.0f,     1.0f, 0.0f,
                                      -1.0f, -1.0f, -1.0f, 1.0f,     0.0f, 1.0f,
                                       1.0f,  1.0f, -1.0f, 1.0f,     1.0f, 0.0f,
                                       1.0f, -1.0f, -1.0f, 1.0f,     1.0f, 1.0f,


                                      -1.0f, -1.0f,  1.0f, 1.0f,     0.0f, 1.0f, // BACK
                                       1.0f,  1.0f,  1.0f, 1.0f,     0.0f, 0.0f,
                                      -1.0f,  1.0f,  1.0f, 1.0f,     1.0f, 0.0f,
                                      -1.0f, -1.0f,  1.0f, 1.0f,     0.0f, 1.0f,
                                       1.0f, -1.0f,  1.0f, 1.0f,     1.0f, 0.0f,
                                       1.0f,  1.0f,  1.0f, 1.0f,     1.0f, 1.0f,


                                      -1.0f, 1.0f, -1.0f,  1.0f,     0.0f, 1.0f, // Top
                                      -1.0f, 1.0f,  1.0f,  1.0f,     0.0f, 0.0f,
                                       1.0f, 1.0f,  1.0f,  1.0f,     1.0f, 0.0f,
                                      -1.0f, 1.0f, -1.0f,  1.0f,     0.0f, 1.0f,
                                       1.0f, 1.0f,  1.0f,  1.0f,     1.0f, 0.0f,
                                       1.0f, 1.0f, -1.0f,  1.0f,     1.0f, 1.0f,


                                      -1.0f,-1.0f, -1.0f,  1.0f,     0.0f, 1.0f, // Bottom
                                       1.0f,-1.0f,  1.0f,  1.0f,     0.0f, 0.0f,
                                      -1.0f,-1.0f,  1.0f,  1.0f,     1.0f, 0.0f,
                                      -1.0f,-1.0f, -1.0f,  1.0f,     0.0f, 1.0f,
                                       1.0f,-1.0f, -1.0f,  1.0f,     1.0f, 0.0f,
                                       1.0f,-1.0f,  1.0f,  1.0f,     1.0f, 1.0f,


                                      -1.0f, -1.0f, -1.0f, 1.0f,     0.0f, 1.0f, // Left
                                      -1.0f, -1.0f,  1.0f, 1.0f,     0.0f, 0.0f,
                                      -1.0f,  1.0f,  1.0f, 1.0f,     1.0f, 0.0f,
                                      -1.0f, -1.0f, -1.0f, 1.0f,     0.0f, 1.0f,
                                      -1.0f,  1.0f,  1.0f, 1.0f,     1.0f, 0.0f,
                                      -1.0f,  1.0f, -1.0f, 1.0f,     1.0f, 1.0f,


                                       1.0f, -1.0f, -1.0f, 1.0f,     0.0f, 1.0f, // Right
                                       1.0f,  1.0f,  1.0f, 1.0f,     0.0f, 0.0f,
                                       1.0f, -1.0f,  1.0f, 1.0f,     1.0f, 0.0f,
                                       1.0f, -1.0f, -1.0f, 1.0f,     0.0f, 1.0f,
                                       1.0f,  1.0f, -1.0f, 1.0f,     1.0f, 0.0f,
                                       1.0f,  1.0f,  1.0f, 1.0f,     1.0f, 1.0f,
                            });


            //vertexBufferBinding = new VertexBufferBinding(vertices, Utilities.SizeOf<Vector4>() * 2, 0);
            vertexBufferBinding = new VertexBufferBinding(vertices, sizeof(float) * 6, 0);


            // Create Constant Buffer
            constantBuffer = ToDispose(new SharpDX.Direct3D11.Buffer(d3dDevice, Utilities.SizeOf<Matrix>(), ResourceUsage.Default, BindFlags.ConstantBuffer, CpuAccessFlags.None, ResourceOptionFlags.None, 0));


            // Load texture and create sampler
            using (var bitmap = TextureLoader.LoadBitmap(deviceManager.WICFactory, "Assets\\dot.jpg"))
            using (var texture2D = TextureLoader.CreateTexture2DFromBitmap(d3dDevice, bitmap))
                textureView = new ShaderResourceView(d3dDevice, texture2D);


            sampler = new SamplerState(d3dDevice, new SamplerStateDescription()
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


            float width = (float)target.RenderTargetSize.Width;
            float height = (float)target.RenderTargetSize.Height;


            // Prepare matrices
            var view = Matrix.LookAtLH(new Vector3(0, 0, -5), new Vector3(0, 0, 0), Vector3.UnitY);
            var proj = Matrix.PerspectiveFovLH((float)Math.PI / 4.0f, width / (float)height, 0.1f, 100.0f);
            var viewProj = Matrix.Multiply(view, proj);


            var time = (float)(clock.ElapsedMilliseconds / 1000.0);




            // Set targets (This is mandatory in the loop)
            d3dContext.OutputMerger.SetTargets(target.DepthStencilView, target.RenderTargetView);


            // Clear the views
            d3dContext.ClearDepthStencilView(target.DepthStencilView, DepthStencilClearFlags.Depth, 1.0f, 0);
            if (EnableClear)
            {
                d3dContext.ClearRenderTargetView(target.RenderTargetView, new Color4(0.0f, 0.0f, 0.0f, 0.0f));
            }


            if (ShowCube)
            {
                // Calculate WorldViewProj
                var worldViewProj = Matrix.Scaling(Scale) * Matrix.RotationX(time) * Matrix.RotationY(time * 2.0f) * Matrix.RotationZ(time * .7f) * viewProj;
                worldViewProj.Transpose();


                // Setup the pipeline
                d3dContext.InputAssembler.SetVertexBuffers(0, vertexBufferBinding);
                d3dContext.InputAssembler.InputLayout = layout;
                d3dContext.InputAssembler.PrimitiveTopology = PrimitiveTopology.TriangleList;
                d3dContext.VertexShader.SetConstantBuffer(0, constantBuffer);
                d3dContext.VertexShader.Set(vertexShader);
                d3dContext.PixelShader.SetShaderResource(0, textureView);
                d3dContext.PixelShader.SetSampler(0, sampler);
                d3dContext.PixelShader.Set(pixelShader);






                // Update Constant Buffer
                d3dContext.UpdateSubresource(ref worldViewProj, constantBuffer, 0);


                // Draw the cube
                d3dContext.Draw(36, 0);
            }

           
        }

        public void LoadLocalAsset(string assetUri)
        {
            throw new NotImplementedException();
        }

        public void AddSprite(double x, double y, double z, double duration )
        {
            throw new NotImplementedException();
        }

       

    }





}
