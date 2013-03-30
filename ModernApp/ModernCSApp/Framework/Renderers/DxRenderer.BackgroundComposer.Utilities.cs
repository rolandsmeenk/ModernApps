

namespace ModernCSApp.DxRenderer
{
    public partial class BackgroundComposer
    {


        public void LoadLocalAsset(string assetUri)
        {

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

    }
}
