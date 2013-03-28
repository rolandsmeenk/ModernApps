using System;
using System.Collections.Generic;
using System.Diagnostics;
using CommonDX;
using GalaSoft.MvvmLight.Messaging;
using SharpDX;
using SumoNinjaMonkey.Framework.Controls.DrawingSurface;
using SumoNinjaMonkey.Framework.Controls.Messages;
using Windows.UI.Xaml;
using System.Linq;
using System.IO;
using System.Threading.Tasks;
using ModernCSApp.Services;

namespace ModernCSApp.DxRenderer
{
    public partial class BackgroundComposer
    {

        private void DoGeneralSystemWideMessageCallbackImage(GeneralSystemWideMessage msg)
        {

            if (msg.Identifier == "COMPOSER")
            {
                if (msg.Action == "ADD IMAGE")
                {
                    AddImageByUri(msg.Url1, msg.AggregateId);
                }
                else if (msg.Action == "UPDATE IMAGE")
                {
                    var uistate = AppDatabase.Current.RetrieveUIElementState(msg.AggregateId);
                    if (uistate != null && uistate.Count() > 0)
                    {
                        var layoutDetail = AppDatabase.Current.GetLayoutDetail(uistate[0].LayoutStyle);
                        UpdateImageByUri(uistate[0], layoutDetail);
                    }
                }
               
            }


        }


        private void DoAggregateUpdatedForImage(List<UIElementState> uistate, GeneralSystemWideMessage msg)
        {
            DoAggregateUpdatedForImage(uistate[0]);
        }

        private void DoAggregateUpdatedForImage(UIElementState uistate, bool resetTransforms = true)
        {
            //we only care about images that are the root parent, effects that are children are handled in the Effect class
            RenderDTO found = _renderTree.Where(
                x => x.Type == 1
                    && x.EffectDTO.AggregateId == uistate.AggregateId
                    && string.IsNullOrEmpty(x.EffectDTO.Grouping1)
                    ).FirstOrDefault();

            if (found != null)
            {
                found.EffectDTO.IsRenderable = uistate.IsRenderable;
                found.EffectDTO.MainTranslation = new Vector3((float)uistate.Left, (float)uistate.Top, (float)0);
                found.EffectDTO.MainScale = new Vector3((float)uistate.Scale, (float)uistate.Scale, 0);


                //update linked effects (parent got changed so update the children where applicable)
                if (found.HasLinkedEffects)
                {
                    var linkedRenderTreeItems = _renderTree.Where(x => x.Type == 1 && x.EffectDTO.Grouping1 == uistate.AggregateId);
                    foreach (var linkedRenderTreeItem in linkedRenderTreeItems)
                    {
                        linkedRenderTreeItem.EffectDTO.MainScale = found.EffectDTO.MainScale;
                        linkedRenderTreeItem.EffectDTO.MainTranslation = found.EffectDTO.MainTranslation;
                        //linkedRenderTreeItem.EffectDTO.IsRenderable = found.EffectDTO.IsRenderable;
                    }
                }

                //udfBool1 is used to trigger an update of the image
                if (!string.IsNullOrEmpty(uistate.udfString1) && uistate.udfBool1)
                {
                    var layoutDetail = AppDatabase.Current.GetLayoutDetail(uistate.LayoutStyle);
                    UpdateImageByUri(uistate, layoutDetail, resetTransforms);

                }


            }
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="assetUri"></param>
        /// <param name="backgroundImageFormatConverter"></param>
        /// <param name="backgroundImageSize"></param>
        public void LoadAsset(string assetUri, out SharpDX.WIC.FormatConverter backgroundImageFormatConverter, out Size2 backgroundImageSize)
        {
            SharpDX.WIC.ImagingFactory2 wicFactory = null;
            if (_deviceManager == null) wicFactory = new SharpDX.WIC.ImagingFactory2();
            else if (_deviceManager.WICFactory == null) wicFactory = new SharpDX.WIC.ImagingFactory2();
            else wicFactory = _deviceManager.WICFactory;

            var path = Windows.ApplicationModel.Package.Current.InstalledLocation.Path;

            SharpDX.WIC.BitmapDecoder bitmapDecoder = new SharpDX.WIC.BitmapDecoder(
                                                                                        wicFactory,
                                                                                        assetUri,
                                                                                        SharpDX.IO.NativeFileAccess.Read,
                                                                                        SharpDX.WIC.DecodeOptions.CacheOnDemand
                                                                                    );

            SharpDX.WIC.BitmapFrameDecode bitmapFrameDecode = bitmapDecoder.GetFrame(0);

            SharpDX.WIC.BitmapSource bitmapSource = new SharpDX.WIC.BitmapSource(bitmapFrameDecode.NativePointer);

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

            backgroundImageSize = formatConverter.Size;

            backgroundImageFormatConverter = formatConverter;
        }



        /// <summary>
        /// This doesnt work! SharpDX errors when trying to open a local system file (not relative)
        /// </summary>
        /// <param name="assetNativeUri"></param>
        /// <param name="backgroundImageFormatConverter"></param>
        /// <param name="backgroundImageSize"></param>
        public void LoadNativeAsset(string assetNativeUri, out SharpDX.WIC.FormatConverter backgroundImageFormatConverter, out Size2 backgroundImageSize)
        {
            var path = Windows.ApplicationModel.Package.Current.InstalledLocation.Path;


            var nativeFileStream = new SharpDX.IO.NativeFileStream(
                assetNativeUri,
                SharpDX.IO.NativeFileMode.Open,
                SharpDX.IO.NativeFileAccess.Read,
                SharpDX.IO.NativeFileShare.Read);


            var r = SharpDX.IO.NativeFile.ReadAllBytes(assetNativeUri);

            var data = SharpDX.IO.NativeFile.ReadAllBytes(assetNativeUri);

            using (System.IO.MemoryStream ms = new System.IO.MemoryStream(data))
            {
                if (ms != null)
                {

                    using (SharpDX.WIC.BitmapDecoder bitmapDecoder = new SharpDX.WIC.BitmapDecoder(
                                                                                                _deviceManager.WICFactory,
                                                                                                ms,
                                                                                                SharpDX.WIC.DecodeOptions.CacheOnDemand
                                                                                            ))
                    {


                        using (SharpDX.WIC.BitmapFrameDecode bitmapFrameDecode = bitmapDecoder.GetFrame(0))
                        {

                            using (SharpDX.WIC.BitmapSource bitmapSource = new SharpDX.WIC.BitmapSource(bitmapFrameDecode.NativePointer))
                            {

                                SharpDX.WIC.FormatConverter formatConverter = new SharpDX.WIC.FormatConverter(_deviceManager.WICFactory);
                                //formatConverter.Initialize( bitmapSource, SharpDX.WIC.PixelFormat.Format32bppBGRA);
                                formatConverter.Initialize(
                                    bitmapSource,
                                    SharpDX.WIC.PixelFormat.Format32bppBGRA,
                                    SharpDX.WIC.BitmapDitherType.None,
                                    null,
                                    0.0f,
                                    SharpDX.WIC.BitmapPaletteType.Custom
                                    );

                                backgroundImageSize = formatConverter.Size;

                                backgroundImageFormatConverter = formatConverter;

                            }




                        }



                    }



                }
            }

            backgroundImageFormatConverter = null;
            backgroundImageSize = new Size2(0, 0);

        }




        /// <summary>
        /// Loads bitmap asynchronously and injects into global variables. I need to work out how to NOT make them global
        /// </summary>
        /// <param name="assetNativeUri"></param>
        /// <returns></returns>
        public async Task<bool> LoadAssetAsync(string assetNativeUri)
        {
            var path = Windows.ApplicationModel.Package.Current.InstalledLocation.Path;

            var storageFile = await Windows.Storage.StorageFile.GetFileFromPathAsync(assetNativeUri);

            Stream ms = await storageFile.OpenStreamForReadAsync();  //ras.GetResults().AsStreamForRead())
            //var data = SharpDX.IO.NativeFile.ReadAllBytes(assetNativeUri);
            //using (System.IO.MemoryStream ms = new System.IO.MemoryStream(data))
            {
                if (ms != null)
                {

                    SharpDX.WIC.BitmapDecoder bitmapDecoder = new SharpDX.WIC.BitmapDecoder(
                                                                                                _deviceManager.WICFactory,
                                                                                                ms,
                                                                                                SharpDX.WIC.DecodeOptions.CacheOnDemand
                                                                                            );
                    {


                        SharpDX.WIC.BitmapFrameDecode bitmapFrameDecode = bitmapDecoder.GetFrame(0);
                        {

                            SharpDX.WIC.BitmapSource bitmapSource = new SharpDX.WIC.BitmapSource(bitmapFrameDecode.NativePointer);
                            {

                                SharpDX.WIC.FormatConverter formatConverter = new SharpDX.WIC.FormatConverter(_deviceManager.WICFactory);
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

                                return true;
                            }

                        }

                    }

                }
            }

            //ras.Close();

            _backgroundImageFormatConverter = null;
            _backgroundImageSize = new Size2(0, 0);

            return false;
        }



        /// <summary>
        /// Used to update an existing bitmap effect with a new image
        /// </summary>
        /// <param name="assetUri"></param>
        /// <param name="aggregateId"></param>
        private async void UpdateImageByUri(UIElementState uistate, LayoutDetail layoutDetail, bool resetTransforms = true)
        {
            try
            {
                //string assetUri, string aggregateId
                var found = _renderTree.Where(x => x.Type == 1 && x.EffectDTO.AggregateId == uistate.AggregateId).FirstOrDefault();
                if (found != null)
                {
                    var ret = await LoadAssetAsync(uistate.udfString1);
                    //LoadLocalNativeAsset(assetUri, out backgroundImageFormatConverter, out backgroundImageSize);

                    if (ret)
                    {
                        found.EffectDTO.Effect.SetValueByName("WicBitmapSource", _backgroundImageFormatConverter);
                        _backgroundImageFormatConverter.Dispose();
                        _backgroundImageFormatConverter = null;


                        //double newRatio = (_backgroundImageSize.Width > Window.Current.Bounds.Width) ? (Window.Current.Bounds.Width/_backgroundImageSize.Width) : 1d;
                        double newRatio = (_backgroundImageSize.Width > layoutDetail.Width) ? (layoutDetail.Width / _backgroundImageSize.Width) : 1d;

                        AppDatabase.Current.UpdateUIElementStateField(uistate.AggregateId, "udfBool1", false, sendAggregateUpdateMessage: false);

                        if (resetTransforms) AppDatabase.Current.AddUpdateUIElementState(uistate.AggregateId, State.SelectedScene.AggregateId, 0, 0, _backgroundImageSize.Width, _backgroundImageSize.Height, newRatio, true, null, null, false);
                        else AppDatabase.Current.AddUpdateUIElementState(uistate.AggregateId, State.SelectedScene.AggregateId, uistate.Left, uistate.Top, _backgroundImageSize.Width, _backgroundImageSize.Height, uistate.Scale, true, null, null, false);


                        NumberFramesToRender = 3;

                    }
                }

                TurnOnRenderingBecauseThereAreRenderableEffects();
            }
            catch (Exception ex) { 
            
            }
        }

        /// <summary>
        /// Create a new Bitmap Effect 
        /// </summary>
        /// <param name="assetUri"></param>
        /// <param name="aggregateId"></param>
        private void AddImageByUri(string assetUri, string aggregateId)
        {

            var uistate = AppDatabase.Current.RetrieveUIElementState(aggregateId);
            if (uistate != null && uistate.Count() > 0)
            {
                //Background Image
                Size2 backgroundImageSize;
                SharpDX.WIC.FormatConverter backgroundImageFormatConverter = null;

                using (backgroundImageFormatConverter)
                {
                    LoadAsset(assetUri, out backgroundImageFormatConverter, out backgroundImageSize);

                    EffectDTO edto = new EffectDTO();
                    edto.Effect = new SharpDX.Direct2D1.Effects.BitmapSourceEffect(_deviceManager.ContextDirect2D);
                    edto.IsRenderable = uistate[0].IsRenderable; //false;
                    edto.AggregateId = aggregateId;
                    edto.Effect.SetValueByName("WicBitmapSource", backgroundImageFormatConverter);

                    //edto.MainTranslation = new Vector3();
                    //edto.MainScale = new Vector3(1, 1, 1);
                    edto.MainTranslation = new Vector3((float)uistate[0].Left, (float)uistate[0].Top, (float)0);
                    edto.MainScale = new Vector3((float)uistate[0].Scale, (float)uistate[0].Scale, 0);

                    _renderTree.Add(new RenderDTO() { EffectDTO = edto, Type = 1, Order = _renderTree.Count() + 1 });


                    AppDatabase.Current.UpdateUIElementStateField(aggregateId, "Width", backgroundImageSize.Width, sendAggregateUpdateMessage: false);
                    AppDatabase.Current.UpdateUIElementStateField(aggregateId, "Height", backgroundImageSize.Height, sendAggregateUpdateMessage: false); //uistate[0].width,uistate[0].height

                }

                NumberFramesToRender = 5;

                TurnOnRenderingBecauseThereAreRenderableEffects();

                //AppDatabase.Current.AddUpdateUIElementState(aggregateId, 0, 0, backgroundImageSize.Width, backgroundImageSize.Height, 1, false, 0, 0);
            }


            ////Background Image
            //DrawingSize backgroundImageSize;
            //SharpDX.WIC.FormatConverter backgroundImageFormatConverter = null;

            //using (backgroundImageFormatConverter)
            //{
            //    LoadAsset(assetUri, out backgroundImageFormatConverter, out backgroundImageSize);

            //    EffectDTO edto = new EffectDTO();
            //    edto.Effect = new SharpDX.Direct2D1.Effects.BitmapSourceEffect(_deviceManager.ContextDirect2D);
            //    edto.IsRenderable = false;
            //    edto.AggregateId = aggregateId;
            //    edto.Effect.SetValueByName("WicBitmapSource", backgroundImageFormatConverter);
            //    edto.MainTranslation = new Vector3();
            //    edto.MainScale = new Vector3(1, 1, 1);
            //    _renderTree.Add(new RenderDTO() { EffectDTO = edto, Type = 1, Order = _renderTree.Count() + 1 });
            //}

            //NumberFramesToRender = 5;

            //TurnOnRenderingBecauseThereAreRenderableEffects();

            //AppDatabase.Current.AddUpdateUIElementState(aggregateId, 0, 0, backgroundImageSize.Width, backgroundImageSize.Height, 1, false, 0, 0);
        }

        private async void AddImageByUriAsync( UIElementState uiElementState) // string assetUri, string aggregateId)
        {
            var layoutDetail = AppDatabase.Current.GetLayoutDetail(0);  // 0 = LayoutDetail

            AppDatabase.Current.UpdateUIElementStateField(uiElementState.AggregateId, "udfBool1", true, sendAggregateUpdateMessage: false);
            uiElementState.udfBool1 = true;
            DoAggregateUpdatedForImage(uiElementState, false);
        }
    }
}
