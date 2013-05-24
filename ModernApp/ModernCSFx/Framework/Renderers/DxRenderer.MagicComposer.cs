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

namespace ModernCSApp.DxRenderer
{

    public partial class MagicComposer : BaseRenderer, IRenderer, ISpriteRenderer
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


        private static double _diameter = 0.1f;
        private static int _numberOfSprites = 140;
        private Vector2 _spriteSize = new Vector2((float)_diameter, (float)_diameter);
        private List<Particle2> _particles = new List<Particle2>();
        private Random _rand = new Random();
        private Vector2 _spriteStartPosition = new Vector2(0, 0);
        //private Windows.UI.Color _spriteColor;

        private SharpDX.Direct3D11.Buffer constantBufferVS;
        private SharpDX.Direct3D11.Buffer constantBufferPS;
        private InputLayout layout;
        private VertexBufferBinding vertexBufferBinding;
        private VertexShader vertexShader;
        private PixelShader pixelShader;
        private ShaderResourceView textureView;
        private SamplerState sampler;
        private BlendState1 m_blendStateAlpha; //cruicial to ensure the sprites are blended nicely over each other

        private Matrix _view; // The view or camera transform
        private Matrix _projection; // The projection transform to convert 3D space to 2D screen space
        private Matrix _viewProj;


        private bool _moveBurst = false;
        private bool _showBurst = false;

        public MagicComposer()
        {
            Scale = 1.0f;
            EnableClear = true;
            clock = new Stopwatch();
            _moveBurst = false;

            _spriteStartPosition = new Vector2(0, 0);
        }

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
            //var vertexShaderByteCode = NativeFile.ReadAllBytes(path + "\\Assets\\MiniCubeTexture_VS.fxo");
            var vertexShaderByteCode = NativeFile.ReadAllBytes(path + "\\Assets\\SimpleSpriteBatch.vs.cso");
            vertexShader = new VertexShader(d3dDevice, vertexShaderByteCode);

            // Loads pixel shader bytecode
            //pixelShader = new PixelShader(d3dDevice, NativeFile.ReadAllBytes(path + "\\Assets\\MiniCubeTexture_PS.fxo"));
            pixelShader = new PixelShader(d3dDevice, NativeFile.ReadAllBytes(path + "\\Assets\\SimpleSpriteBatch.ps.cso"));

            // Layout from VertexShader input signature
            layout = new InputLayout(d3dDevice, vertexShaderByteCode, new[]
                    {
                        new InputElement("POSITION", 0, Format.R32G32B32A32_Float, 0, 0),
                        new InputElement("TEXCOORD", 0, Format.R32G32_Float, 16, 0),
                        new InputElement("COLOR", 0, Format.R32G32B32A32_Float, 24, 0),
                    });


            // Create Constant Buffer
            constantBufferVS = ToDispose(new SharpDX.Direct3D11.Buffer(d3dDevice, Utilities.SizeOf<Matrix>(), ResourceUsage.Default, BindFlags.ConstantBuffer, CpuAccessFlags.None, ResourceOptionFlags.None, 0));
            constantBufferPS = ToDispose(new SharpDX.Direct3D11.Buffer(d3dDevice, Utilities.SizeOf<Matrix>(), ResourceUsage.Default, BindFlags.ConstantBuffer, CpuAccessFlags.None, ResourceOptionFlags.None, 0));

            // Load texture and create sampler
            using (var bitmap = TextureLoader.LoadBitmap(deviceManager.WICFactory, "Assets\\dot.png"))
            using (var texture2D = TextureLoader.CreateTexture2DFromBitmap(d3dDevice, bitmap))
                textureView = new ShaderResourceView(d3dDevice, texture2D);


            sampler = new SamplerState(d3dDevice, new SamplerStateDescription()
            {
                Filter = Filter.MinMagMipLinear,
                AddressU = TextureAddressMode.Clamp,
                AddressV = TextureAddressMode.Clamp,
                AddressW = TextureAddressMode.Clamp,
                BorderColor = Color.Transparent,
                ComparisonFunction = Comparison.Never,
                MaximumAnisotropy = 16,
                MipLodBias = 0,
                MinimumLod = 0,
                MaximumLod = 16,
            });




            // Setup the pipeline
            vertexBufferBinding = BuildVertexBufferBinding(_deviceManager.DeviceDirect3D, 1.0f);

            d3dContext.InputAssembler.SetVertexBuffers(0, vertexBufferBinding);
            d3dContext.InputAssembler.InputLayout = layout;
            d3dContext.InputAssembler.PrimitiveTopology = PrimitiveTopology.TriangleList;

            d3dContext.VertexShader.SetConstantBuffer(0, constantBufferVS);
            d3dContext.VertexShader.Set(vertexShader);

            d3dContext.PixelShader.SetConstantBuffer(0, constantBufferPS);
            d3dContext.PixelShader.SetShaderResource(0, textureView);
            d3dContext.PixelShader.SetSampler(0, sampler);
            d3dContext.PixelShader.Set(pixelShader);



            //BLENDSTATE
            BlendStateDescription1 blendDesc = new BlendStateDescription1();
            blendDesc.AlphaToCoverageEnable = true;  //set to true to get nice blending betweent sprites
            blendDesc.IndependentBlendEnable = false;
            blendDesc.RenderTarget[0].IsBlendEnabled = true;
            blendDesc.RenderTarget[0].IsLogicOperationEnabled = false;
            blendDesc.RenderTarget[0].SourceBlend = BlendOption.SourceAlpha;
            blendDesc.RenderTarget[0].DestinationBlend = BlendOption.InverseSourceAlpha;
            blendDesc.RenderTarget[0].BlendOperation = BlendOperation.Add;
            blendDesc.RenderTarget[0].SourceAlphaBlend = BlendOption.One;
            blendDesc.RenderTarget[0].DestinationAlphaBlend = BlendOption.Zero;
            blendDesc.RenderTarget[0].AlphaBlendOperation = BlendOperation.Add; // set to maximum to blend 2 sprites nicely over each other
            blendDesc.RenderTarget[0].RenderTargetWriteMask = ColorWriteMaskFlags.All;




            d3dContext.OutputMerger.BlendState = m_blendStateAlpha; // m_blendStateAlpha, m_blendStateAdditive;





            GestureService.OnGestureRaised += (o, a) =>
            {
                CustomGestureArgs gestureArgs = (CustomGestureArgs)a;
                //NumberFramesToRender += 3;
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
                    _showBurst = true;
                    moveDot(gestureArgs.TappedEventArgs.Position);
                }
            };




            clock = new Stopwatch();
            clock.Start();
        }

        private VertexBufferBinding BuildVertexBufferBinding(SharpDX.Direct3D11.Device1 d3dDevice, float opacity)
        {

            // Instantiate Vertex buffer from vertex data
            var vertices = SharpDX.Direct3D11.Buffer.Create(d3dDevice, BindFlags.VertexBuffer, new[]
                                  {
                                      // 3D coordinates              UV Texture coordinates

                                      // FRONT
                                      -1.0f, -1.0f,  0.0f, 0.9f,     0.0f, 1.0f,    //TOP TRIANGLE
                                      -1.0f,  1.0f,  0.0f, 0.9f,     0.0f, 0.0f,    
                                       1.0f,  1.0f,  0.0f, 0.9f,     1.0f, 0.0f,   

                                      -1.0f, -1.0f,  0.0f, 0.9f,     0.0f, 1.0f,    //BOTTOM TRIANGLE
                                       1.0f,  1.0f,  0.0f, 0.9f,     1.0f, 0.0f,    
                                       1.0f, -1.0f,  0.0f, 0.9f,     1.0f, 1.0f,   


                                       // BACK
                                      -1.0f, -1.0f,  0.0f, 0.9f,     0.0f, 1.0f,    //TOP TRIANGLE
                                       1.0f,  1.0f,  0.0f, 0.9f,     1.0f, 0.0f,   
                                      -1.0f,  1.0f,  0.0f, 0.9f,     0.0f, 0.0f,   

                                      -1.0f, -1.0f,  0.0f, 0.9f,     0.0f, 1.0f,    //BOTTOM TRIANGLE
                                       1.0f, -1.0f,  0.0f, 0.9f,     1.0f, 1.0f,   
                                       1.0f,  1.0f,  0.0f, 0.9f,     1.0f, 0.0f,   

                            });


            //vertexBufferBinding = new VertexBufferBinding(vertices, Utilities.SizeOf<Vector4>() * 2, 0);
            return new VertexBufferBinding(vertices, sizeof(float) * 6, 0);
        }


        public void InitializeUI(Windows.UI.Xaml.UIElement rootForPointerEvents, Windows.UI.Xaml.UIElement rootOfLayout)
        {

            _root = rootForPointerEvents;
            _rootParent = rootOfLayout;

            _appWidth = (float)((FrameworkElement)_root).ActualWidth;
            _appHeight = (float)((FrameworkElement)_root).ActualHeight;


            ////WIRE UP : POINTER EVENTS
            //_root.PointerMoved += _root_PointerMoved;
            //_root.PointerPressed += _root_PointerPressed;
            //_root.PointerReleased += _root_PointerReleased;



            _view = Matrix.LookAtLH(new Vector3(0, 0, -10), new Vector3(0, 0, 0), Vector3.UnitY);
            _projection = Matrix.PerspectiveFovLH((float)Math.PI / 4.0f, _appWidth / (float)_appHeight, 0.1f, 100.0f);
            _viewProj = Matrix.Multiply(_view, _projection);

        }

        public void Update(SharpDX.Toolkit.GameTime gameTime)
        {
            
        }



        private int debugBackEvery60Frames = 0;

        public void Render(TargetBase target)
        {
            var d3dContext = target.DeviceManager.ContextDirect3D;
            var d2dContext = target.DeviceManager.ContextDirect2D;


            float width = (float)target.RenderTargetSize.Width;
            float height = (float)target.RenderTargetSize.Height;



            //// Prepare matrices
            //var view = Matrix.LookAtLH(new Vector3(0, 0, -5), new Vector3(0, 0, 0), Vector3.UnitY);
            //var proj = Matrix.PerspectiveFovLH((float)Math.PI / 4.0f, width / (float)height, 0.1f, 100.0f);
            //var viewProj = Matrix.Multiply(view, proj);

            var time = (float)(clock.ElapsedMilliseconds / 1000.0);


            // Set targets (This is mandatory in the loop)
            d3dContext.OutputMerger.SetTargets(target.DepthStencilView, target.RenderTargetView);

            //// Clear the views
            d3dContext.ClearDepthStencilView(target.DepthStencilView, DepthStencilClearFlags.Depth, 1.0f, 0);
            if (EnableClear)
            {
                d3dContext.ClearRenderTargetView(target.RenderTargetView, new Color4(0.0f, 0.0f, 0.0f, 0.0f));
            }



            RenderSprites(target);
            //lastElapsedMilliseconds = clock.ElapsedMilliseconds;




            ////DEBUGGER
            //if (debugBackEvery60Frames == 10)
            //{
            //    Messenger.Default.Send(new DebuggingMessage("Sprites to render : " + _particles.Count().ToString()) { Identifier = "BOC2" });

            //    debugBackEvery60Frames = 0;
            //}
            debugBackEvery60Frames++;
        }

        public void LoadLocalAsset(string assetUri)
        {
            
        }

        public void AddSprite(double x, double y, double z)
        {
            
        }




        //DateTime lastRenderFrame = DateTime.Now;

        //int iCounter = 0;
        //bool isRendering = false;
        public virtual void RenderSprites(TargetBase render)
        {
            //if (isRendering) return;
            //isRendering = true;

            var d3dContext = render.DeviceManager.ContextDirect3D;

            var time = (float)(clock.ElapsedMilliseconds / 1000.0);


            //d3dContext.OutputMerger.BlendState = m_blendStateAlpha; // m_blendStateAlpha, m_blendStateAdditive;

            // draw the TextureSprite
            if (_particles.Count < _numberOfSprites)
            {
                if (_showBurst) AddParticle();
            }


            //double elapsed = clock.Elapsed.TotalSeconds;

            int pc = _particles.Count;
            //foreach(var par in _particles.Where(x=>x.IsAlive).Reverse()){
            //    par.Position += par.Velocity;
            //    par.Opacity = Microsoft.Xna.Framework.MathHelper.Lerp(1, 0, (float)(par.Elapsed / par.TimeToLive));
            //    par.Elapsed += 15;
            //    if (par.Elapsed > par.TimeToLive)
            //    {
            //        par.IsAlive = false;
            //    }
            //    else
            //    {
            //        DrawParticle(_viewProj, par.Position, par.Size, (float)par.Opacity, d3dContext);
            //    }
            //}

            //_particles.RemoveAll(x=>x.IsAlive == false);



            for (int i = pc - 1; i >= 0; i--)
            {
                Particle2 p = _particles[i];

                p.Position += p.Velocity;
                p.Opacity = Lerp(1, 0, (float)(p.Elapsed / p.TimeToLive));
                p.Elapsed += 15;


                if (p.Elapsed > p.TimeToLive)
                {
                    p.IsAlive = false;
                }
                else
                {
                    DrawParticle(_viewProj, p.Position, p.Size, (float)p.Opacity, d3dContext);
                }

                if (p.Opacity <= 0.1d) p.IsAlive = false;

            }

            _particles.RemoveAll(x => x.IsAlive == false);
            //isRendering = false;
        }


        Particle2 AddParticle()
        {
            Particle2 p = new Particle2()
            {
                Position = _spriteStartPosition,
                Elapsed = 0,
                TimeToLive = (_rand.NextDouble() + _rand.Next(0, 1) + 0.2d) * 1000,
                Velocity = Vector2.Zero,
                Size = _spriteSize,
                IsAlive = true
            };

            float angle = _rand.Next((int)(Math.PI * 2 * 1000)) / 1000f;
            float size = (float)(_rand.NextDouble() * (_spriteSize.X * 3));
            p.Velocity = new Vector2((float)Math.Cos(angle), (float)Math.Sin(angle)) * size;

            _particles.Add(p);
            return p;
        }


        float Lerp(float value1, float value2, float amount)
        {
            return value1 + (value2 - value1) * amount;
        }


        void DrawParticle(Matrix viewProjection, Vector2 pos, Vector2 size, float opacity, DeviceContext1 d3dContext)
        {



            // update TextureSprite transform
            Matrix position = Matrix.Translation(pos.X, -pos.Y, 0); // origin
            Matrix scale = Matrix.Scaling(size.X, size.Y, 1); // no scale modifier        

            // calculate the final transform to pass to the shader
            Matrix worldViewProjection = position * scale * viewProjection;


            worldViewProjection.Transpose();


            // Update Constant Buffer
            d3dContext.UpdateSubresource(ref worldViewProjection, constantBufferVS, 0);
            d3dContext.UpdateSubresource(ref opacity, constantBufferPS, 0);


            // Draw the cube
            d3dContext.Draw(12, 0);


        }




        //private void _root_PointerReleased(object sender, Windows.UI.Xaml.Input.PointerRoutedEventArgs e)
        //{
        //    _moveBurst = false;
        //    _showBurst = false;
        //}

        //private void _root_PointerPressed(object sender, Windows.UI.Xaml.Input.PointerRoutedEventArgs e)
        //{
        //    _moveBurst = true;
        //    _showBurst = true;

        //    var newPosition = e.GetCurrentPoint(_root);
        //    moveDot(newPosition);
        //}

        //private void _root_PointerMoved(object sender, Windows.UI.Xaml.Input.PointerRoutedEventArgs e)
        //{
        //    var newPosition = e.GetCurrentPoint(_root);
        //    moveDot(newPosition);
        //}


        private void moveDot(Windows.Foundation.Point newPosition)
        {
            //if (!_moveBurst) return;

            _spriteStartPosition.X = (float)((newPosition.X - (_appWidth / 2)) * _diameter);
            _spriteStartPosition.Y = (float)((newPosition.Y - (_appHeight / 2)) * _diameter);
        }
    }






    public class Particle2
    {
        public double Opacity;
        public Vector2 Position;
        public Vector2 Velocity;
        public Vector2 Size;
        public double TimeToLive;
        public double Elapsed;
        public bool IsAlive;

    }
}
