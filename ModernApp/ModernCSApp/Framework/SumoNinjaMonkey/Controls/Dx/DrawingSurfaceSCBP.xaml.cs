using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using CommonDX;
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


namespace JF.Studio.Controls
{
    public sealed partial class DrawingSurfaceSCBP : SwapChainBackgroundPanel
    {
        private DeviceManager deviceManager;

        private SwapChainBackgroundPanelTarget d2dTarget;

        private IRenderer effectRenderer;

        bool hasInitializedSurface = false;

        public int FrameCountPerRender { get; set; } //number of frames per render (default = 1);


        public DrawingSurfaceSCBP(IRenderer renderer)
        {
            this.FrameCountPerRender = 1;

            //this.InitializeComponent();

            //if (!hasInitializedSurface)
            //{
            //    //effectRenderer = new EffectRenderer();

            //    var fpsRenderer = new FpsRenderer();

            //    d2dTarget = new SwapChainBackgroundPanelTarget(root);
            //    d2dTarget.OnRender += effectRenderer.Render;
            //    d2dTarget.OnRender += fpsRenderer.Render;

            //    deviceManager = new DeviceManager();
            //    deviceManager.OnInitialize += d2dTarget.Initialize;
            //    deviceManager.OnInitialize += effectRenderer.Initialize;
            //    deviceManager.OnInitialize += fpsRenderer.Initialize;

            //    deviceManager.Initialize(DisplayProperties.LogicalDpi);
            //    effectRenderer.InitializeUI(root, root);

            //    // Setup rendering callback
            //    CompositionTarget.Rendering += CompositionTarget_Rendering;

            //    if (_assetUri != string.Empty) effectRenderer.LoadLocalAsset(_assetUri);
            //}
        }

        private string _assetUri;
        public void LoadImage(string assetUri)
        {
            _assetUri = assetUri;
            if (effectRenderer == null) return;
            effectRenderer.LoadLocalAsset(_assetUri);
        }

        int iCounter = 0;
        void CompositionTarget_Rendering(object sender, object e)
        {

            iCounter++;
            if (iCounter == FrameCountPerRender) //we need to increase this fcr when mixing xaml/dx at times
            {
                d2dTarget.RenderAll();
                d2dTarget.Present();
                iCounter = 0;
            }


        }
    }
}
