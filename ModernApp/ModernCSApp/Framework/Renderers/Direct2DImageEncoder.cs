using SharpDX.Direct2D1;
using SharpDX.WIC;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModernCSApp.Renderers
{


      public class Direct2DImageEncoder
      {
        private readonly Direct2DFactoryManager factoryManager;
        private readonly SharpDX.WIC.Bitmap wicBitmap;
        private readonly WicRenderTarget renderTarget;

        private readonly int imageWidth, imageHeight;

        public Direct2DImageEncoder(int imageWidth, int imageHeight, int imageDpi)
        {
          this.imageWidth = imageWidth;
          this.imageHeight = imageHeight;      

          factoryManager = new Direct2DFactoryManager();

          wicBitmap = new SharpDX.WIC.Bitmap(factoryManager.WicFactory, imageWidth, imageHeight, SharpDX.WIC.PixelFormat.Format32bppBGR, BitmapCreateCacheOption.CacheOnLoad);
          var renderTargetProperties = new RenderTargetProperties(RenderTargetType.Default, new SharpDX.Direct2D1.PixelFormat(SharpDX.DXGI.Format.Unknown, AlphaMode.Unknown), imageDpi, imageDpi, RenderTargetUsage.None, FeatureLevel.Level_DEFAULT);
          renderTarget = new WicRenderTarget(factoryManager.D2DFactory, wicBitmap, renderTargetProperties);
          renderTarget.BeginDraw();
          renderTarget.Clear(SharpDX.Color.Yellow);
        
        }

        public void Save(Stream systemStream, Direct2DImageFormat format)
        {
          renderTarget.EndDraw();

          var stream = new WICStream(factoryManager.WicFactory, systemStream);
          var encoder = new BitmapEncoder(factoryManager.WicFactory, Direct2DConverter.ConvertImageFormat(format));
          encoder.Initialize(stream);

          var bitmapFrameEncode = new BitmapFrameEncode(encoder);
          bitmapFrameEncode.Initialize();
          bitmapFrameEncode.SetSize(imageWidth, imageHeight);

          Guid fdc = SharpDX.WIC.PixelFormat.FormatDontCare;
          //fdc = Direct2DConverter.ConvertImageFormat(Direct2DImageFormat.Gif);
          bitmapFrameEncode.SetPixelFormat(ref fdc);
          bitmapFrameEncode.WriteSource(wicBitmap);

          bitmapFrameEncode.Commit();
          try
          {
              encoder.Commit();
          }catch(Exception ex){

              var f = ex.Message;
          }
          bitmapFrameEncode.Dispose();
          encoder.Dispose();
          stream.Dispose();      



        }   
      }

      public class Direct2DFactoryManager
      {
        private readonly SharpDX.WIC.ImagingFactory wicFactory;
        private readonly SharpDX.Direct2D1.Factory d2DFactory;
        private readonly SharpDX.DirectWrite.Factory dwFactory;

        public Direct2DFactoryManager()
        {
          wicFactory = new SharpDX.WIC.ImagingFactory();
          d2DFactory = new SharpDX.Direct2D1.Factory();
          dwFactory = new SharpDX.DirectWrite.Factory();
        }

        public SharpDX.WIC.ImagingFactory WicFactory
        {
          get
          {
            return wicFactory;
          }
        }

        public SharpDX.Direct2D1.Factory D2DFactory
        {
          get
          {
            return d2DFactory;
          }
        }

        public SharpDX.DirectWrite.Factory DwFactory
        {
          get
          {
            return dwFactory;
          }
        }
      }

      public enum Direct2DImageFormat
      {
        Png, Gif, Ico, Jpeg, Wmp, Tiff, Bmp
      }

      public class Direct2DConverter
      {
        public static Guid ConvertImageFormat(Direct2DImageFormat format)
        {
          switch (format)
          {
            case Direct2DImageFormat.Bmp:
              return ContainerFormatGuids.Bmp;
            case Direct2DImageFormat.Ico:
              return ContainerFormatGuids.Ico;
            case Direct2DImageFormat.Gif:
              return ContainerFormatGuids.Gif;
            case Direct2DImageFormat.Jpeg:
              return ContainerFormatGuids.Jpeg;
            case Direct2DImageFormat.Png:
              return ContainerFormatGuids.Png;
            case Direct2DImageFormat.Tiff:
              return ContainerFormatGuids.Tiff;
            case Direct2DImageFormat.Wmp:
              return ContainerFormatGuids.Wmp;
          }
          throw new NotSupportedException();
        }

      }


}
