
using ModernCSApp.Services;
using ModernCSApp.Views;
using GalaSoft.MvvmLight.Messaging;
using SharpDX;
using SharpDX.Direct3D11;
using SumoNinjaMonkey.Framework.Controls.Messages;
using SumoNinjaMonkey.Framework.Services;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ModernCSApp.DxRenderer
{
    public class BaseRenderer : Component
    {
        public Color4 AccentColor { get; set; }
        public Color4 AccentColorLightBy1Degree { get; set; }
        public Color4 AccentColorLightBy2Degree { get; set; }

        public Color4 BackgroundColor { get; set; }
        public Color4 BackgroundDarkBy1Color { get; set; }
        public Color4 BackgroundDarkBy2Color { get; set; }


        public string SessionID { get; set; }
        public GlobalState State { get; set; }

        //Cacheing the assets for reuse later
        Dictionary<string, Tuple<SharpDX.WIC.FormatConverter, Size2>> _listOfAssets;

        public BaseRenderer()
        {

            _listOfAssets = new Dictionary<string, Tuple<SharpDX.WIC.FormatConverter, Size2>>();

            try
            {
                FillSessionDataFromDB();
            }
            catch
            {
                AppDatabase.Current.RecreateSystemData();
                FillSessionDataFromDB();
            }
        }

        private void FillSessionDataFromDB()
        {
            string[] pac = AppDatabase.Current.RetrieveInstanceAppState(ModernCSApp.Services.AppDatabase.AppSystemDataEnums.PrimaryAccentColor).Value.ToString().Split(",".ToCharArray());
            AccentColor = new Color() { R = Byte.Parse(pac[0]), G = Byte.Parse(pac[1]), B = Byte.Parse(pac[2]), A = Byte.Parse(pac[3]) };
            
            pac = AppDatabase.Current.RetrieveInstanceAppState(ModernCSApp.Services.AppDatabase.AppSystemDataEnums.SecondaryAccentColor).Value.ToString().Split(",".ToCharArray());
            AccentColorLightBy1Degree = new Color() { R = Byte.Parse(pac[0]), G = Byte.Parse(pac[1]), B = Byte.Parse(pac[2]), A = Byte.Parse(pac[3]) };

            pac = AppDatabase.Current.RetrieveInstanceAppState(ModernCSApp.Services.AppDatabase.AppSystemDataEnums.ThirdAccentColor).Value.ToString().Split(",".ToCharArray());
            AccentColorLightBy2Degree = new Color() { R = Byte.Parse(pac[0]), G = Byte.Parse(pac[1]), B = Byte.Parse(pac[2]), A = Byte.Parse(pac[3]) };



            pac = AppDatabase.Current.RetrieveInstanceAppState(ModernCSApp.Services.AppDatabase.AppSystemDataEnums.PrimaryBackgroundColor).Value.ToString().Split(",".ToCharArray());
            BackgroundColor = new Color() { R = Byte.Parse(pac[0]), G = Byte.Parse(pac[1]), B = Byte.Parse(pac[2]), A = Byte.Parse(pac[3]) };

            pac = AppDatabase.Current.RetrieveInstanceAppState(ModernCSApp.Services.AppDatabase.AppSystemDataEnums.SecondaryBackgroundColor).Value.ToString().Split(",".ToCharArray());
            BackgroundDarkBy1Color = new Color() { R = Byte.Parse(pac[0]), G = Byte.Parse(pac[1]), B = Byte.Parse(pac[2]), A = Byte.Parse(pac[3]) };

            pac = AppDatabase.Current.RetrieveInstanceAppState(ModernCSApp.Services.AppDatabase.AppSystemDataEnums.ThirdBackgroundColor).Value.ToString().Split(",".ToCharArray());
            BackgroundDarkBy2Color = new Color() { R = Byte.Parse(pac[0]), G = Byte.Parse(pac[1]), B = Byte.Parse(pac[2]), A = Byte.Parse(pac[3]) };

            SessionID = AppDatabase.Current.RetrieveInstanceAppState(ModernCSApp.Services.AppDatabase.AppSystemDataEnums.UserSessionID).Value;


        }

        public void SendSystemWideMessage(string identifier, string content, string sourceId = "", string action = "", string url1 = "", string aggregateId = "", string text1 = "")
        {
            LoggingService.LogInformation("system message ... " + content, "BaseUserControl.SendSystemWideMessage");
            Messenger.Default.Send<GeneralSystemWideMessage>(new GeneralSystemWideMessage(content) { Identifier = identifier, SourceId = sourceId, Url1 = url1, Action = action, AggregateId = aggregateId, Text1 = text1 });
        }

        public void SendInformationNotification(string msg, double duration)
        {

            LoggingService.LogInformation(msg, "BaseUserControl.SendInformationNotification");

            NotificationService.Show(
                msg,
                "",
                new Windows.UI.Xaml.Media.SolidColorBrush(new Windows.UI.Color() { A = (byte)(255 * AccentColor.Alpha), R = (byte)(255 * AccentColor.Red), G = (byte)(255 * AccentColor.Green), B = (byte)(255 * AccentColor.Blue) }),
                new Windows.UI.Xaml.Media.SolidColorBrush(Windows.UI.Colors.White),
                new Windows.UI.Xaml.Media.SolidColorBrush(new Windows.UI.Color() { A = (byte)(255 * AccentColorLightBy1Degree.Alpha), R = (byte)(255 * AccentColorLightBy1Degree.Red), G = (byte)(255 * AccentColorLightBy1Degree.Green), B = (byte)(255 * AccentColorLightBy1Degree.Blue) }),
                duration,
                height: 90,
                width: 350,
                autoHide: true,
                metroIcon: "Information",
                scaleIcon: 1.5
                );
        }






        internal Texture2D AllocateTextureReturnSurface(Device device,  Size2F drawingSize)
        {
            var desc = new SharpDX.Direct3D11.Texture2DDescription()
            {
                Format = SharpDX.DXGI.Format.B8G8R8A8_UNorm, //  D24_UNorm_S8_UInt,
                ArraySize = 1,
                MipLevels = 1,
                Width = (int)drawingSize.Width,
                Height = (int)drawingSize.Height,
                Usage = ResourceUsage.Default,
                SampleDescription = new SharpDX.DXGI.SampleDescription(1, 0),
                BindFlags = SharpDX.Direct3D11.BindFlags.RenderTarget | SharpDX.Direct3D11.BindFlags.ShaderResource,
            };

            desc.Usage = ResourceUsage.Default;
            var tex2D = new Texture2D(device, desc);
            return tex2D;
        }


        //6 Sided VERTEX BUFFER
        internal SharpDX.Direct3D11.Buffer GenerateVertexBuffer6Sided(SharpDX.Direct3D11.Device1 d3dDevice, float thicknessToUse)
        {
            return SharpDX.Direct3D11.Buffer.Create(d3dDevice, BindFlags.VertexBuffer, new[]
                                  {
                                      
                                      // 3D coordinates              UV Texture coordinates
                                      -1.0f, -1.0f, -thicknessToUse, 1.0f,     0.0f, 1.0f, // Front
                                      -1.0f,  1.0f, -thicknessToUse, 1.0f,     0.0f, 0.0f,
                                       1.0f,  1.0f, -thicknessToUse, 1.0f,     1.0f, 0.0f,
                                      -1.0f, -1.0f, -thicknessToUse, 1.0f,     0.0f, 1.0f,
                                       1.0f,  1.0f, -thicknessToUse, 1.0f,     1.0f, 0.0f,
                                       1.0f, -1.0f, -thicknessToUse, 1.0f,     1.0f, 1.0f,

                                      -1.0f, -1.0f,  0.0f           , 1.0f,     0.0f, 1.0f, // BACK
                                       1.0f,  1.0f,  0.0f           , 1.0f,     1.0f, 0.0f,
                                      -1.0f,  1.0f,  0.0f           , 1.0f,     0.0f, 0.0f,
                                      -1.0f, -1.0f,  0.0f           , 1.0f,     0.0f, 1.0f,
                                       1.0f, -1.0f,  0.0f           , 1.0f,     1.0f, 1.0f,
                                       1.0f,  1.0f,  0.0f           , 1.0f,     1.0f, 0.0f,

                                      -1.0f, 1.0f, -thicknessToUse  , 1.0f,     0.0f, thicknessToUse, // Top
                                      -1.0f, 1.0f,  0.0f            , 1.0f,     0.0f, 0.0f,
                                       1.0f, 1.0f,  0.0f            , 1.0f,     1.0f, 0.0f,
                                      -1.0f, 1.0f, -thicknessToUse  , 1.0f,     0.0f, thicknessToUse,
                                       1.0f, 1.0f,  0.0f            , 1.0f,     1.0f, 0.0f,
                                       1.0f, 1.0f, -thicknessToUse  , 1.0f,     1.0f, thicknessToUse,

                                      -1.0f,-1.0f, -thicknessToUse,  1.0f,      0.0f, thicknessToUse, // Bottom
                                       1.0f,-1.0f,  0.0f,  1.0f,                1.0f, 0.0f,
                                      -1.0f,-1.0f,  0.0f,  1.0f,                0.0f, 0.0f,
                                      -1.0f,-1.0f, -thicknessToUse,  1.0f,      0.0f, thicknessToUse,
                                       1.0f,-1.0f, -thicknessToUse,  1.0f,      1.0f, thicknessToUse,
                                       1.0f,-1.0f,  0.0f,  1.0f,                1.0f, 0.0f,

                                      -1.0f, -1.0f, -thicknessToUse, 1.0f,      0.0f, thicknessToUse, // Left
                                      -1.0f, -1.0f,  0.0f          , 1.0f,      0.0f, 0.0f,
                                      -1.0f,  1.0f,  0.0f,           1.0f,      1.0f, 0.0f,
                                      -1.0f, -1.0f, -thicknessToUse, 1.0f,      0.0f, thicknessToUse,
                                      -1.0f,  1.0f,  0.0f,           1.0f,      1.0f, 0.0f,
                                      -1.0f,  1.0f, -thicknessToUse, 1.0f,      1.0f, thicknessToUse,

                                       1.0f, -1.0f, -thicknessToUse, 1.0f,      0.0f, thicknessToUse, // Right
                                       1.0f,  1.0f,  0.0f,           1.0f,      1.0f, 0.0f,
                                       1.0f, -1.0f,  0.0f,           1.0f,      0.0f, 0.0f,
                                       1.0f, -1.0f, -thicknessToUse, 1.0f,      0.0f, thicknessToUse,
                                       1.0f,  1.0f, -thicknessToUse, 1.0f,      1.0f, thicknessToUse,
                                       1.0f,  1.0f,  0.0f,           1.0f,      1.0f, 0.0f,
                            });
        }

        //2 Sided VERTEX BUFFER
        internal SharpDX.Direct3D11.Buffer GenerateVertexBuffer2Sided(SharpDX.Direct3D11.Device1 d3dDevice)
        {
            float thicknessToUse = 0;

            return SharpDX.Direct3D11.Buffer.Create(d3dDevice, BindFlags.VertexBuffer, new[]
                                  {
                                      
                                      // 3D coordinates              UV Texture coordinates
                                      -1.0f, -1.0f, -thicknessToUse , 1.0f,     0.0f, 1.0f, // Front
                                      -1.0f,  1.0f, -thicknessToUse , 1.0f,     0.0f, 0.0f,
                                       1.0f,  1.0f, -thicknessToUse , 1.0f,     1.0f, 0.0f,
                                      -1.0f, -1.0f, -thicknessToUse , 1.0f,     0.0f, 1.0f,
                                       1.0f,  1.0f, -thicknessToUse , 1.0f,     1.0f, 0.0f,
                                       1.0f, -1.0f, -thicknessToUse , 1.0f,     1.0f, 1.0f,

                                      -1.0f, -1.0f,  0.0f           , 1.0f,     0.0f, 1.0f, // BACK
                                       1.0f,  1.0f,  0.0f           , 1.0f,     1.0f, 0.0f,
                                      -1.0f,  1.0f,  0.0f           , 1.0f,     0.0f, 0.0f,
                                      -1.0f, -1.0f,  0.0f           , 1.0f,     0.0f, 1.0f,
                                       1.0f, -1.0f,  0.0f           , 1.0f,     1.0f, 1.0f,
                                       1.0f,  1.0f,  0.0f           , 1.0f,     1.0f, 0.0f,

                            });
        }

        //1 Sided VERTEX BUFFER
        internal SharpDX.Direct3D11.Buffer GenerateVertexBuffer1Sided(SharpDX.Direct3D11.Device1 d3dDevice, float thicknessToUse)
        {
            return SharpDX.Direct3D11.Buffer.Create(d3dDevice, BindFlags.VertexBuffer, new[]
                                  {
                                      
                                      // 3D coordinates              UV Texture coordinates
                                      -1.0f, -1.0f, -thicknessToUse, 1.0f,     0.0f, 1.0f, // Front
                                      -1.0f,  1.0f, -thicknessToUse, 1.0f,     0.0f, 0.0f,
                                       1.0f,  1.0f, -thicknessToUse, 1.0f,     1.0f, 0.0f,
                                      -1.0f, -1.0f, -thicknessToUse, 1.0f,     0.0f, 1.0f,
                                       1.0f,  1.0f, -thicknessToUse, 1.0f,     1.0f, 0.0f,
                                       1.0f, -1.0f, -thicknessToUse, 1.0f,     1.0f, 1.0f,

                            });
        }




        ///// <summary>
        ///// 
        ///// </summary>
        ///// <param name="assetUri"></param>
        ///// <param name="backgroundImageFormatConverter"></param>
        ///// <param name="backgroundImageSize"></param>
        //public void LoadAsset(
        //    SharpDX.WIC.ImagingFactory2 wicFactory, 
        //    string assetUri, 
        //    out SharpDX.WIC.FormatConverter backgroundImageFormatConverter, 
        //    out DrawingSize backgroundImageSize)
        //{
            
        //    //var path = Windows.ApplicationModel.Package.Current.InstalledLocation.Path;

        //    SharpDX.WIC.BitmapDecoder bitmapDecoder = new SharpDX.WIC.BitmapDecoder(
        //                                                                                wicFactory,
        //                                                                                assetUri,
        //                                                                                SharpDX.IO.NativeFileAccess.Read,
        //                                                                                SharpDX.WIC.DecodeOptions.CacheOnDemand
        //                                                                            );

        //    SharpDX.WIC.BitmapFrameDecode bitmapFrameDecode = bitmapDecoder.GetFrame(0);

        //    SharpDX.WIC.BitmapSource bitmapSource = new SharpDX.WIC.BitmapSource(bitmapFrameDecode.NativePointer);

        //    SharpDX.WIC.FormatConverter formatConverter = new SharpDX.WIC.FormatConverter(wicFactory);
        //    //formatConverter.Initialize( bitmapSource, SharpDX.WIC.PixelFormat.Format32bppBGRA);
        //    formatConverter.Initialize(
        //        bitmapSource,
        //        SharpDX.WIC.PixelFormat.Format32bppBGRA,
        //        SharpDX.WIC.BitmapDitherType.None,
        //        null,
        //        0.0f,
        //        SharpDX.WIC.BitmapPaletteType.Custom
        //        );

        //    backgroundImageSize = formatConverter.Size;

        //    backgroundImageFormatConverter = formatConverter;
        //}


        /// <summary>
        /// Loads bitmap asynchronously and injects into global variables. I need to work out how to NOT make them global
        /// </summary>
        /// <param name="assetNativeUri"></param>
        /// <returns></returns>
        public async Task<Tuple<SharpDX.WIC.FormatConverter, Size2>> LoadAssetAsync(
            SharpDX.WIC.ImagingFactory2 wicFactory, 
            string assetNativeUri,
            string cacheId,
            string path = ""
            )
        {

            if (_listOfAssets.ContainsKey(cacheId)) return _listOfAssets[cacheId];


            SharpDX.WIC.FormatConverter _backgroundImageFormatConverter = null;
            Size2 _backgroundImageSize = new Size2(0, 0);

            Windows.Storage.StorageFile storageFile = null;

            if(path == string.Empty) {
                path = Windows.ApplicationModel.Package.Current.InstalledLocation.Path;
                storageFile = await Windows.Storage.StorageFile.GetFileFromPathAsync(path + assetNativeUri);
            }
            else if (path == "PicturesLibrary")
            {

                var assetNativeUriParts = assetNativeUri.Split("\\".ToCharArray());

                var foundFolder = await Windows.Storage.KnownFolders.PicturesLibrary.GetFolderAsync(assetNativeUriParts[0]);
                storageFile = await foundFolder.GetFileAsync(assetNativeUriParts[1]);
            }

            if (storageFile == null) return null;

            Stream ms = await storageFile.OpenStreamForReadAsync();  //ras.GetResults().AsStreamForRead())
            //var data = SharpDX.IO.NativeFile.ReadAllBytes(assetNativeUri);
            //using (System.IO.MemoryStream ms = new System.IO.MemoryStream(data))
            {
                if (ms != null)
                {

                    SharpDX.WIC.BitmapDecoder bitmapDecoder = new SharpDX.WIC.BitmapDecoder(
                                                                                                wicFactory,
                                                                                                ms,
                                                                                                SharpDX.WIC.DecodeOptions.CacheOnDemand
                                                                                            );
                    {


                        SharpDX.WIC.BitmapFrameDecode bitmapFrameDecode = bitmapDecoder.GetFrame(0);
                        {

                            SharpDX.WIC.BitmapSource bitmapSource = new SharpDX.WIC.BitmapSource(bitmapFrameDecode.NativePointer);
                            {

                                SharpDX.WIC.FormatConverter formatConverter = new SharpDX.WIC.FormatConverter(wicFactory);
                                //formatConverter.Initialize( bitmapSource, SharpDX.WIC.PixelFormat.Format32bppBGRA);
                                formatConverter.Initialize(
                                    bitmapSource,
                                    SharpDX.WIC.PixelFormat.Format32bppBGRA,
                                    SharpDX.WIC.BitmapDitherType.None,
                                    null,
                                    0.0f,
                                    SharpDX.WIC.BitmapPaletteType.Custom
                                    );

                                _backgroundImageSize = formatConverter.Size;
                                _backgroundImageFormatConverter = formatConverter;


                                //return Tuple.Create<SharpDX.WIC.FormatConverter, Size2>(_backgroundImageFormatConverter, _backgroundImageSize);
                            }

                        }

                    }

                }
            }

            //ras.Close();

            var ret = Tuple.Create<SharpDX.WIC.FormatConverter, Size2>(_backgroundImageFormatConverter, _backgroundImageSize);

            _listOfAssets.Add(cacheId, ret);

            return ret;

        }
        
    }
}
