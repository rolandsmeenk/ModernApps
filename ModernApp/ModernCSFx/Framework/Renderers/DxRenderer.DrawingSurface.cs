using System;
using System.Diagnostics;

using SharpDX;
using SharpDX.Toolkit;
using SharpDX.Toolkit.Graphics;

namespace ModernCSApp.DxRenderer
{

    public class DrawingSurface : Game
    {
        private readonly Stopwatch fpsClock;
        private GraphicsDeviceManager graphicsDeviceManager;
        private SpriteBatch spriteBatch;
        private SpriteFont arial16BMFont;
        private Texture2D ballsTexture;
        private int frameCount;
        private string fpsText;


        public DrawingSurface()
        {
            // Creates a graphics manager. This is mandatory.
            graphicsDeviceManager = new GraphicsDeviceManager(this);

            // Force no vsync and use real timestep to print actual FPS
            graphicsDeviceManager.SynchronizeWithVerticalRetrace = false;
            IsFixedTimeStep = false;

            // Setup the relative directory to the executable directory
            // for loading contents with the ContentManager
            Content.RootDirectory = "Assets";

            // Variable used for FPS
            fpsClock = new Stopwatch();
            fpsText = string.Empty;
           
        }


        protected override void LoadContent()
        {
            // Loads the balls texture (32 textures (32x32) stored vertically => 32 x 1024 ).
            ballsTexture = Content.Load<Texture2D>("balls.dds");

            // SpriteFont supports the following font file format:
            // - DirectX Toolkit MakeSpriteFont or SharpDX Toolkit tkfont
            // - BMFont from Angelcode http://www.angelcode.com/products/bmfont/
            arial16BMFont = Content.Load<SpriteFont>("Arial16.tkfnt");

            // Instantiate a SpriteBatch
            spriteBatch = new SpriteBatch(GraphicsDevice);
        }

        protected override void BeginRun()
        {
            // Starts the FPS clock
            fpsClock.Start();
        }


        protected override void Initialize()
        {
            Window.Title = "SpriteBatch and Font demo";
            base.Initialize();
        }


        protected override void Draw(GameTime gameTime)
        {
            // Clears the screen with the Color.CornflowerBlue
            GraphicsDevice.Clear(GraphicsDevice.BackBuffer, Color.CornflowerBlue);

            // Precalculate some constants
            int textureHalfSize = ballsTexture.Width / 2;
            int spriteSceneWidth = GraphicsDevice.BackBuffer.Width / 2;
            int spriteSceneHeight = GraphicsDevice.BackBuffer.Height / 2;
            int spriteSceneRadiusWidth = GraphicsDevice.BackBuffer.Width / 2 - textureHalfSize;
            int spriteSceneRadiusHeight = GraphicsDevice.BackBuffer.Height / 2 - textureHalfSize;

            // Time used to animate the balls
            var time = (float)gameTime.TotalGameTime.TotalSeconds;

            // Draw sprites on the screen
            var random = new Random(0);
            const int SpriteCount = 5000;
            spriteBatch.Begin(SpriteSortMode.Deferred, GraphicsDevice.BlendStates.NonPremultiplied);  // Use NonPremultiplied, as this sprite texture is not premultiplied

            for (int i = 0; i < SpriteCount; i++)
            {
                var angleOffset = (float)random.NextDouble() * Math.PI * 2.0f;
                var radiusOffset = (float)random.NextDouble() * 0.8f + 0.2f;
                var spriteSpeed = (float)random.NextDouble() + 0.1f;

                var position = new Vector2
                {
                    X = spriteSceneWidth + spriteSceneRadiusWidth * radiusOffset * (float)Math.Cos(time * spriteSpeed + angleOffset),
                    Y = spriteSceneHeight + spriteSceneRadiusHeight * radiusOffset * (float)Math.Sin(time * spriteSpeed + angleOffset)
                };

                var sourceRectangle = new Rectangle(0, (int)((float)random.NextDouble() * 31) * 32, 32, 32);
                spriteBatch.Draw(ballsTexture, position, sourceRectangle, Color.White, 0.0f, new Vector2(textureHalfSize, textureHalfSize), Vector2.One, SpriteEffects.None, 0f);
            }
            spriteBatch.End();

            // Update the FPS text
            frameCount++;
            if (fpsClock.ElapsedMilliseconds > 1000.0f)
            {
                fpsText = string.Format("{0:F2} FPS", (float)frameCount * 1000 / fpsClock.ElapsedMilliseconds);
                frameCount = 0;
                fpsClock.Restart();
            }

            // Render the text
            spriteBatch.Begin();
            spriteBatch.DrawString(arial16BMFont, "  " + SpriteCount + "\nSprites", new Vector2(spriteSceneWidth - 32, spriteSceneHeight - 24), Color.White);
            spriteBatch.DrawString(arial16BMFont, fpsText, new Vector2(0, 32), Color.White);
            spriteBatch.End();

            // Handle base.Draw
            base.Draw(gameTime);
        }
    }

}
