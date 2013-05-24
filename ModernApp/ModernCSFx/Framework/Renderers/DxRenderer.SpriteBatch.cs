using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CommonDX;
using GalaSoft.MvvmLight.Messaging;

using SharpDX;
using SharpDX.Direct3D11;
using SharpDX.IO;

namespace Sandbox.DxRenderer
{
    public partial class SpriteBatch : Component
    {
        int m_capacity;
        Device1 m_d3dDevice;
        DeviceContext1 m_d3dContext;
        Dictionary<Texture2D, TextureMapElement> m_textureMap;
        //List<SpriteRunInfo> m_spriteRuns;
        VertexBufferBinding m_vertexBufferBinding;
        Vector2 m_renderTargetSize;
        float m_dpi;
        float m_width;
        float m_height;
        VertexShader m_vertexShader;
        PixelShader m_pixelShader;
        SharpDX.Direct3D11.Buffer m_constantBufferVS;
        SharpDX.Direct3D11.Buffer m_constantBufferPS;
        SharpDX.Direct3D11.Buffer m_vertices;
        InputLayout m_layout;
        SamplerState m_sampler;
        BlendState1 m_blendStateAlpha; //cruicial to ensure the sprites are blended nicely over each other
        List<SpriteBatchParticle> m_particles = new List<SpriteBatchParticle>();
        Matrix m_view; // The view or camera transform
        Matrix m_projection; // The projection transform to convert 3D space to 2D screen space
        Matrix m_viewProj;

        private static double _diameter = 0.015f;
        //private static int _numberOfSprites = 4000;
        private Vector2 _spriteSize = new Vector2((float)_diameter, (float)_diameter);
        Random _rand = new Random();


        public bool IsEnabled { get; set; }


        public List<SpriteBatchParticle> Particles { get { return m_particles; } }

        public SpriteBatch()
        {
            m_textureMap = new Dictionary<Texture2D, TextureMapElement>();
            //m_spriteRuns = new List<SpriteRunInfo>();
        }



        public void AddTexture(string assetUri, SharpDX.WIC.ImagingFactory2 wicfactory)
        {

            using (var bitmap = LoadBitmap(wicfactory, assetUri))
            using (var texture2D = TextureLoader.CreateTexture2DFromBitmap(m_d3dDevice, bitmap))
            {
                AddTexture(texture2D);
            }
        }

        public void AddTexture(SharpDX.Direct3D11.Texture2D texture)
        {
            using (texture)
            {
                var srv = new ShaderResourceView(m_d3dDevice, texture);
                TextureMapElement tme = new TextureMapElement();
                tme.srv = srv;
                tme.size = new Vector2((float)texture.Description.Width, (float)texture.Description.Height);

                m_textureMap.Add(texture, tme);

            }
        }

        public void RemoveTexture(Texture2D texture)
        {
            if (m_textureMap.ContainsKey(texture))
            {
                m_textureMap.Remove(texture);
            }
        }


        public void Initialize(Device1 d3dDevice, DeviceContext1 d3dContext, int capacity = 1024)
        {
            m_d3dDevice = d3dDevice;
            m_d3dContext = d3dContext;

            m_capacity = capacity;


            var path = Windows.ApplicationModel.Package.Current.InstalledLocation.Path;

            var vertexShaderByteCode = NativeFile.ReadAllBytes(path + "\\Assets\\SpriteBatch.vs.cso");
            m_vertexShader = new VertexShader(m_d3dDevice, vertexShaderByteCode);

            m_pixelShader = new PixelShader(d3dDevice, NativeFile.ReadAllBytes(path + "\\Assets\\SpriteBatch.ps.cso"));

            // Layout from VertexShader input signature
            m_layout = new InputLayout(d3dDevice, vertexShaderByteCode, new[]
                    {
                        new InputElement("POSITION", 0, SharpDX.DXGI.Format.R32G32B32A32_Float, 0, 0),
                        new InputElement("TEXCOORD", 0, SharpDX.DXGI.Format.R32G32_Float, 16, 0),
                        new InputElement("COLOR", 0, SharpDX.DXGI.Format.R32G32B32A32_Float, 24, 0),
                    });


            m_sampler = new SamplerState(d3dDevice, new SamplerStateDescription()
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


            BlendStateDescription1 blendDesc = new BlendStateDescription1();
            blendDesc.AlphaToCoverageEnable = true;  //set to true to get nice blending betweent sprites
            blendDesc.IndependentBlendEnable = false;
            blendDesc.RenderTarget[0].IsBlendEnabled = true;
            blendDesc.RenderTarget[0].IsLogicOperationEnabled = false;
            blendDesc.RenderTarget[0].SourceBlend = BlendOption.SourceAlpha;
            blendDesc.RenderTarget[0].DestinationBlend = BlendOption.SourceAlphaSaturate;
            blendDesc.RenderTarget[0].BlendOperation = BlendOperation.Add;
            blendDesc.RenderTarget[0].SourceAlphaBlend = BlendOption.One;
            blendDesc.RenderTarget[0].DestinationAlphaBlend = BlendOption.One;
            blendDesc.RenderTarget[0].AlphaBlendOperation = BlendOperation.Maximum; // set to maximum to blend 2 sprites nicely over each other
            blendDesc.RenderTarget[0].RenderTargetWriteMask = ColorWriteMaskFlags.All;
            m_blendStateAlpha = new BlendState1(d3dDevice, blendDesc);



            m_constantBufferVS = ToDispose(new SharpDX.Direct3D11.Buffer(d3dDevice, Utilities.SizeOf<Matrix>(), ResourceUsage.Default, BindFlags.ConstantBuffer, CpuAccessFlags.None, ResourceOptionFlags.None, 0));
            m_constantBufferPS = ToDispose(new SharpDX.Direct3D11.Buffer(d3dDevice, Utilities.SizeOf<Matrix>(), ResourceUsage.Default, BindFlags.ConstantBuffer, CpuAccessFlags.None, ResourceOptionFlags.None, 0));


            //=======================
            // Setup the pipeline
            //=======================
            m_vertices = ToDispose(BuildVerticesBuffer(d3dDevice, 1.0f, new Vector2(0, 1), new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)));
            m_vertexBufferBinding = new VertexBufferBinding(m_vertices, sizeof(float) * 10, 0);
            d3dContext.InputAssembler.SetVertexBuffers(0, m_vertexBufferBinding);

            d3dContext.InputAssembler.InputLayout = m_layout;
            d3dContext.InputAssembler.PrimitiveTopology = SharpDX.Direct3D.PrimitiveTopology.TriangleList;

            d3dContext.VertexShader.SetConstantBuffer(0, m_constantBufferVS);
            d3dContext.VertexShader.Set(m_vertexShader);

            d3dContext.PixelShader.SetConstantBuffer(0, m_constantBufferPS);
            d3dContext.PixelShader.SetSampler(0, m_sampler);
            d3dContext.PixelShader.Set(m_pixelShader);

            d3dContext.OutputMerger.BlendState = m_blendStateAlpha; // m_blendStateAlpha, m_blendStateAdditive;

        }


        private float[] BuildVertices(float opacity, Vector2 uvbl, Vector2 uvtl, Vector2 uvtr, Vector2 uvbr)
        {
            return new[]
                                  {
                                      // 3D coordinates              UV Texture coordinates     Color

                                      // FRONT
                                      -1.0f, -1.0f,  0.0f, 1.0f,     uvbl.X, uvbl.Y,                1.0f, 1.0f, 1.0f, 1.0f,  //TOP TRIANGLE
                                      -1.0f,  1.0f,  0.0f, 1.0f,     uvtl.X, uvtl.Y,                1.0f, 1.0f, 1.0f, 1.0f,      
                                       1.0f,  1.0f,  0.0f, 1.0f,     uvtr.X, uvtr.Y,                1.0f, 1.0f, 1.0f, 1.0f,     

                                      -1.0f, -1.0f,  0.0f, 1.0f,     uvbl.X, uvbl.Y,                1.0f, 1.0f, 1.0f, 1.0f,  //BOTTOM TRIANGLE
                                       1.0f,  1.0f,  0.0f, 1.0f,     uvtr.X, uvtr.Y,                1.0f, 1.0f, 1.0f, 1.0f,      
                                       1.0f, -1.0f,  0.0f, 1.0f,     uvbr.X, uvbr.Y,                1.0f, 1.0f, 1.0f, 1.0f,     



                                      // BACK
                                      -1.0f, -1.0f,  0.0f, 1.0f,     uvbl.X, uvbl.Y,                1.0f, 1.0f, 1.0f, 1.0f,  //TOP TRIANGLE
                                       1.0f,  1.0f,  0.0f, 1.0f,     uvtr.X, uvtr.Y,                1.0f, 1.0f, 1.0f, 1.0f,     
                                      -1.0f,  1.0f,  0.0f, 1.0f,     uvtl.X, uvtl.Y,                1.0f, 1.0f, 1.0f, 1.0f,      
                                      

                                      -1.0f, -1.0f,  0.0f, 1.0f,     uvbl.X, uvbl.Y,                1.0f, 1.0f, 1.0f, 1.0f,  //BOTTOM TRIANGLE
                                       1.0f, -1.0f,  0.0f, 1.0f,     uvbr.X, uvbr.Y,                1.0f, 1.0f, 1.0f, 1.0f,     
                                       1.0f,  1.0f,  0.0f, 1.0f,     uvtr.X, uvtr.Y,                1.0f, 1.0f, 1.0f, 1.0f,      
                                      
  

                            };

        }



        private SharpDX.Direct3D11.Buffer BuildVerticesBuffer(SharpDX.Direct3D11.Device1 d3dDevice, float opacity, Vector2 uvbl, Vector2 uvtl, Vector2 uvtr, Vector2 uvbr)
        {

            // Instantiate Vertex buffer from vertex data
            var vertices = SharpDX.Direct3D11.Buffer.Create(d3dDevice, BindFlags.VertexBuffer, BuildVertices(opacity, uvbl, uvtl, uvtr, uvbr));


            //vertexBufferBinding = new VertexBufferBinding(vertices, Utilities.SizeOf<Vector4>() * 2, 0);
            return vertices;
        }


        public void Begin(TargetBase render)
        {
            //var d3dContext = render.DeviceManager.ContextDirect3D;
            //var d2dContext = render.DeviceManager.ContextDirect2D;
            //m_d3dContext = d3dContext;

            m_renderTargetSize = new Vector2((float)render.RenderTargetSize.Width, (float)render.RenderTargetSize.Height);

            m_width = (float)render.RenderTargetSize.Width;
            m_height = (float)render.RenderTargetSize.Height;

            m_dpi = Windows.Graphics.Display.DisplayProperties.LogicalDpi;


            m_view = Matrix.LookAtLH(new Vector3(0, 0, -1), new Vector3(0, 0, 0), Vector3.UnitY);
            m_projection = Matrix.PerspectiveFovLH((float)Math.PI / 4.0f, m_width / (float)m_height, 0.1f, 2.0f);
            m_viewProj = Matrix.Multiply(m_view, m_projection);
        }

        public void Draw(Texture2D textureToUse, Vector2 startPosition)
        {
            if (m_particles.Count < m_capacity)
            {
                if (IsEnabled) DrawParticle(m_textureMap[textureToUse].srv, startPosition, _spriteSize, 1.0f, RectangleF.Empty, CalculateRandomBurstVelocity(_spriteSize), CalculateRandomTimeToLive(), null, 0);
            }

        }

        public void Draw(Texture2D textureToUse, Vector2 startPosition, Vector2 spriteSize, RectangleF textureDrawRegion)
        {
            if (m_particles.Count < m_capacity)
            {
                if (IsEnabled) DrawParticle(m_textureMap[textureToUse].srv, startPosition, spriteSize, 1.0f, textureDrawRegion, CalculateRandomBurstVelocity(spriteSize), CalculateRandomTimeToLive(), null, 0);
            }

        }


        public void Draw(Texture2D textureToUse, Vector2 startPosition, Vector2 spriteSize, RectangleF textureDrawRegion, Vector2 velocity, double rotationVelocity, double timeToLive, int extraInt1)
        {
            if (m_particles.Count < m_capacity)
            {
                if (IsEnabled) DrawParticle(m_textureMap[textureToUse].srv, startPosition, spriteSize, 1.0f, textureDrawRegion, velocity, timeToLive, extraInt1, rotationVelocity);
            }

        }


        private double CalculateRandomTimeToLive()
        {
            return (_rand.NextDouble() + _rand.Next(0, 1) + 0.2d) * 1000;
        }

        private Vector2 CalculateRandomBurstVelocity(Vector2 spriteSize)
        {
            var factor = _spriteSize.X / spriteSize.X;
            float angle = _rand.Next((int)(Math.PI * 2 * 1000)) / 1000f;
            float size = (float)(_rand.NextDouble() * (_spriteSize.X * 30));
            Vector2 velocity = new Vector2((float)Math.Cos(angle), (float)Math.Sin(angle)) * size * factor;

            return velocity;
        }

        void DrawParticle(ShaderResourceView shaderResourceToUse, Vector2 startPosition, Vector2 spriteSize, float uvOffset, RectangleF textureRegionToDraw, Vector2 velocity, double timeToLive, int? extraInt1, double rotationVelocity)
        {
            var factor = _spriteSize.X / spriteSize.X;

            SpriteBatchParticle p = new SpriteBatchParticle()
            {
                Position = startPosition * factor,
                Elapsed = 0,
                TimeToLive = timeToLive,
                Velocity = velocity,
                Size = spriteSize,
                IsAlive = true,
                TextureView = shaderResourceToUse,
                RotationVelocity = rotationVelocity,
                TextureRegionToDraw = textureRegionToDraw,
                ExtraInt1 = extraInt1.HasValue ? (int)extraInt1 : 0
            };


            m_particles.Add(p);
            //return p;
        }




        //int frameToDoRemove_60 = 0;  //only call the remove every 60 frames

        int debugBackEvery60Frames = 0;

        public void End()
        {

            int pc = m_particles.Count;

            for (int i = pc - 1; i >= 0; i--)
            {
                SpriteBatchParticle p = m_particles[i];

                if (p.IsAlive)
                {
                    p.Position += p.Velocity;
                    p.Elapsed += 15;
                    //p.RotationVelocity += 0.1;


                    if (double.IsNaN(p.TimeToLive))
                    {
                        //Sprite doesnt die and hence TimToLive is NAN and Opacity = 1
                        p.Opacity = 1.0;
                        RenderParticle(m_viewProj, p.Position, p.Size, (float)p.Opacity, m_d3dContext, p.TextureView, (float)p.RotationVelocity, p.TextureRegionToDraw);
                    }
                    else
                    {
                        //These sprites will eventually die (TimeToLive) 
                        p.Opacity = Lerp(1, 0, (float)(p.Elapsed / p.TimeToLive));

                        if (p.Elapsed > p.TimeToLive)
                        {
                            p.IsAlive = false;
                        }
                        else
                        {
                            RenderParticle(m_viewProj, p.Position, p.Size, (float)p.Opacity, m_d3dContext, p.TextureView, (float)p.RotationVelocity, p.TextureRegionToDraw);
                        }
                        if (p.Opacity <= 0.1d) p.IsAlive = false;
                    }


                }
            }


            //Do this expensive remove every 60 frames only
            //frameToDoRemove_60++;
            //if (frameToDoRemove_60 == 60)
            //{
            m_particles.RemoveAll(x => x.IsAlive == false);
            //    frameToDoRemove_60 = 0;
            //}



            ////DEBUGGER
            //if (debugBackEvery60Frames == 10)
            //{

            //    Messenger.Default.Send(new DebuggingRendererMessage("",
            //        "Sprites to render : " + m_particles.Where(x => x.IsAlive).Count().ToString(),
            //        string.Empty,
            //        string.Empty
            //        ) { Identifier = "SB1" });

            //    debugBackEvery60Frames = 0;
            //}
            debugBackEvery60Frames++;

        }

        private void RenderParticle(Matrix viewProjection, Vector2 pos, Vector2 size, float opacity, DeviceContext1 d3dContext, ShaderResourceView srv, float rotationVelocity, RectangleF textureRegionToDraw)
        {


            // update TextureSprite transform
            Matrix position = Matrix.Translation(pos.X, -pos.Y, 0); // origin
            Matrix scale = Matrix.Scaling(size.X, size.Y, 1); // no scale modifier        
            //Matrix rotation = Matrix.RotationX(rotationVelocity);


            Matrix worldViewProjection = position;
            //if (rotationVelocity != 0) worldViewProjection = rotation * position ;
            //else worldViewProjection = position;
            worldViewProjection = worldViewProjection * scale * viewProjection;
            //worldViewProjection = worldViewProjection * viewProjection;
            worldViewProjection.Transpose();


            // Update VS/GS/PS
            d3dContext.PixelShader.SetShaderResource(0, srv);


            // Update Constant Buffer
            d3dContext.UpdateSubresource(ref worldViewProjection, m_constantBufferVS, 0);
            d3dContext.UpdateSubresource(ref opacity, m_constantBufferPS, 0);

            if (textureRegionToDraw != RectangleF.Empty) d3dContext.UpdateSubresource<float>(BuildVertices(1.0f, new Vector2(textureRegionToDraw.Left, textureRegionToDraw.Bottom), new Vector2(textureRegionToDraw.Left, textureRegionToDraw.Top), new Vector2(textureRegionToDraw.Right, textureRegionToDraw.Top), new Vector2(textureRegionToDraw.Right, textureRegionToDraw.Bottom)), m_vertices);

            // Draw
            d3dContext.Draw(12, 0);
            //d3dContext.DrawInstanced(12, 1, 0, 0);
            //d3dContext.DrawInstanced(12, m_particles.Count, 0, 0);
            //d3dContext.DrawInstanced(12, 200, 0, 0);


        }


        private SharpDX.WIC.BitmapSource LoadBitmap(SharpDX.WIC.ImagingFactory2 factory, string filename)
        {
            var bitmapDecoder = new SharpDX.WIC.BitmapDecoder(
                factory,
                filename,
                SharpDX.WIC.DecodeOptions.CacheOnDemand
                );

            var formatConverter = new SharpDX.WIC.FormatConverter(factory);

            formatConverter.Initialize(
                bitmapDecoder.GetFrame(0),
                SharpDX.WIC.PixelFormat.Format32bppPRGBA,
                SharpDX.WIC.BitmapDitherType.None,
                null,
                0.0,
                SharpDX.WIC.BitmapPaletteType.Custom);

            return formatConverter;
        }


        private struct TextureMapElement
        {
            public ShaderResourceView srv;
            public Vector2 size;
        };


        //private struct SpriteRunInfo
        //{
        //    public ShaderResourceView textureView;
        //    public BlendState1 blendState;
        //    public int numSprites;
        //};


        public Vector2 CalculatePointerPosition(Vector2 position, PositionUnits positionUnits)
        {
            return StandardOrigin(position, positionUnits, m_renderTargetSize, m_dpi);
        }


        private Vector2 StandardOrigin(Vector2 position, PositionUnits positionUnits, Vector2 renderTargetSize, float dpi)
        {
            Vector2 origin = new Vector2();
            if (positionUnits == PositionUnits.Pixels)
            {
                origin.X = (position.X / renderTargetSize.X) * 2.0f - 1.0f;
                origin.Y = 1.0f - (position.Y / renderTargetSize.Y) * 2.0f;
            }
            else if (positionUnits == PositionUnits.DIPs)
            {
                origin.X = ((position.X * dpi / 96.0f) / renderTargetSize.X) * 2.0f - 1.0f;
                origin.Y = 1.0f - ((position.Y * dpi / 96.0f) / renderTargetSize.Y) * 2.0f;
            }
            else if (positionUnits == PositionUnits.Normalized)
            {
                origin.X = position.X * 2.0f - 1.0f;
                origin.Y = 1.0f - position.Y * 2.0f;
            }
            else if (positionUnits == PositionUnits.UniformWidth)
            {
                origin.X = position.X * 2.0f - 1.0f;
                origin.Y = 1.0f - position.Y * (renderTargetSize.X / renderTargetSize.Y) * 2.0f;
            }
            else if (positionUnits == PositionUnits.UniformHeight)
            {
                origin.X = position.X * (renderTargetSize.Y / renderTargetSize.X) * 2.0f - 1.0f;
                origin.Y = 1.0f - position.Y * 2.0f;
            }
            return origin;
        }

        private Vector2 StandardOffset(Vector2 size, SizeUnits sizeUnits, Vector2 spriteSize, float dpi)
        {
            Vector2 offset = new Vector2();
            if (sizeUnits == SizeUnits.Pixels)
            {
                offset = size;
            }
            else if (sizeUnits == SizeUnits.DIPs)
            {
                offset = size * dpi / 96.0f;
            }
            else if (sizeUnits == SizeUnits.Normalized)
            {

                offset = spriteSize * size;
            }
            return offset;
        }

        float Lerp(float value1, float value2, float amount)
        {
            return value1 + (value2 - value1) * amount;
        }

        public class SpriteBatchParticle
        {
            public double Opacity;
            public Vector2 Position;
            public Vector2 Velocity;
            public Vector2 Size;
            public double TimeToLive;
            public double Elapsed;
            public bool IsAlive;
            public double RotationVelocity;
            public ShaderResourceView TextureView;
            public RectangleF TextureRegionToDraw;
            public int ExtraInt1 = 0;
        }



    }

    public enum PositionUnits
    {
        DIPs,         // Interpret position as device-independent pixel values.
        Pixels,       // Interpret position as pixel values.
        Normalized,   // Interpret position as a fraction of the render target dimensions.
        UniformWidth, // Interpret position as a fraction of the render target width.
        UniformHeight // Interpret position as a fraction of the render target height.
    };

    public enum SizeUnits
    {
        DIPs,      // Interpret size as device-independent pixel values.
        Pixels,    // Interpret size as pixel values.
        Normalized // Interpret size as a multiplier of the pixel size of the sprite.
    };


    public enum BlendMode
    {
        Alpha,   // Use alpha blending (out = old * (1 - new.a) + new * new.a).
        Additive // Use additive blending (out = old + new * new.a).
    };
}
