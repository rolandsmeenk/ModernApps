using CommonDX;
using MiniCube;
using MiniShape;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
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

namespace ModernCSApp2
{

    public sealed partial class MainPage : Page
    {
        DeviceManager deviceManager;
        SwapChainPanelTarget target;
        CubeRenderer cubeRenderer;
        ShapeRenderer shapeRenderer;

        public MainPage()
        {
            this.InitializeComponent();

            this.layoutroot.SizeChanged += layoutroot_SizeChanged;
            Init();
            //ShowHide();
        }

        private void Init()
        {
            // Safely dispose any previous instance
            // Creates a new DeviceManager (Direct3D, Direct2D, DirectWrite, WIC)
            deviceManager = new DeviceManager();

            // New CubeRenderer
            cubeRenderer = new CubeRenderer();
            cubeRenderer.ShowCube = true;
            shapeRenderer = new ShapeRenderer();
            shapeRenderer.Show = false;
            shapeRenderer.EnableClear = false;


            // Use CoreWindowTarget as the rendering target (Initialize SwapChain, RenderTargetView, DepthStencilView, BitmapTarget)
            target = new SwapChainPanelTarget(scpMain);

            // Add Initializer to device manager
            deviceManager.OnInitialize += target.Initialize;
            deviceManager.OnInitialize += cubeRenderer.Initialize;
            deviceManager.OnInitialize += shapeRenderer.Initialize;

            // Render the cube within the CoreWindow
            target.OnRender += cubeRenderer.Render;
            target.OnRender += shapeRenderer.Render;

            // Initialize the device manager and all registered deviceManager.OnInitialize 
            deviceManager.Initialize(DisplayProperties.LogicalDpi);

            // Setup rendering callback
            CompositionTarget.Rendering += CompositionTarget_Rendering;

            // Callback on DpiChanged
            DisplayProperties.LogicalDpiChanged += DisplayProperties_LogicalDpiChanged;

            
        }

        void DisplayProperties_LogicalDpiChanged(object sender)
        {
            deviceManager.Dpi = DisplayProperties.LogicalDpi;
        }

        void CompositionTarget_Rendering(object sender, object e)
        {
            target.RenderAll();
            target.Present();
        }
        
        void ShowHide()
        {
            cubeRenderer.ShowCube = !cubeRenderer.ShowCube;
        }

        private void layoutroot_SizeChanged(object sender, SizeChangedEventArgs e)
        {
            scpMain.Width = e.NewSize.Width -50;
            scpMain.Height = e.NewSize.Height - 50;
            target.UpdateForSizeChange();
        }




    }
}
