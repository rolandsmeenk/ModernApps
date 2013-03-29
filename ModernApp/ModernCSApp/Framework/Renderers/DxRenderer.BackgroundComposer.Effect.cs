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

        private void DoGeneralSystemWideMessageCallbackEffect(GeneralSystemWideMessage msg)
        {

            if (msg.Identifier == "COMPOSER")
            {
                if (msg.Action == "DELETE EFFECT")
                {
                    #region DELETE EFFECT
                    var found = _renderTree.Where(x => x.Type == eRenderType.Effect && x.EffectDTO.AggregateId == msg.AggregateId).FirstOrDefault();
                    if (found != null)
                    {
                        _renderTree.Remove(found);
                        NumberFramesToRender = 50;
                        //ForcedTurnOnRenderingBecauseThereAreRenderableEffects();
                    }
                    #endregion
                }
            }


        }

        

        private void DoAggregateUpdatedForEffect(List<UIElementState> uistate, GeneralSystemWideMessage msg)
        {
            var found = _renderTree.Where(
                x =>
                    x.Type == eRenderType.Effect
                    && x.EffectDTO.AggregateId == msg.AggregateId
                    );

            if (found != null && found.Count() > 0 && uistate != null && uistate.Count > 0)
            {
                RenderDTO renderItem = found.First();

                //update for the effects that are "grouped", which means they are children to a parent effect
                if (renderItem != null && !string.IsNullOrEmpty(renderItem.EffectDTO.Grouping1))
                {
                    UpdateRenderItemWithUIElement_Effect(uistate[0], renderItem);
                }
            }
        }

        private async Task<RenderDTO> CreateRenderItemWithUIElement_Effect(UIElementState uies, string effectClass, RenderDTO parentRenderTreeItem)
        {

            EffectDTO edto = new EffectDTO();
            edto.IsRenderable = uies.IsRenderable;
            edto.AggregateId = uies.AggregateId;
            edto.Grouping1 = uies.Grouping1;
            if (parentRenderTreeItem != null)
            {
                edto.MainTranslation = parentRenderTreeItem.EffectDTO.MainTranslation;
                edto.MainScale = parentRenderTreeItem.EffectDTO.MainScale;
            }
            else
            {
                edto.MainTranslation = new Vector3(0);
                edto.MainScale = new Vector3(1);
            }

            switch (effectClass)
            {
                case "SharpDX.Direct2D1.Effects.AffineTransform2D": break;
                case "SharpDX.Direct2D1.Effects.ArithmeticComposite": break;
                case "SharpDX.Direct2D1.Effects.Atlas": break;
                case "SharpDX.Direct2D1.Effects.BitmapSourceEffect":
                    #region bitmap source
                    var asset = await LoadAssetAsync(_deviceManager.WICFactory, uies.udfString1);
                    edto.Effect = new SharpDX.Direct2D1.Effects.BitmapSourceEffect(_deviceManager.ContextDirect2D);
                    edto.Effect.SetValueByName("WicBitmapSource", asset.Item1);
                    #endregion
                    break;
                case "SharpDX.Direct2D1.Effects.Blend": break;
                case "SharpDX.Direct2D1.Effects.Border": break;
                case "SharpDX.Direct2D1.Effects.Brightness":
                    #region brightness
                    edto.Effect = new SharpDX.Direct2D1.Effects.Brightness(_deviceManager.ContextDirect2D);
                    ((SharpDX.Direct2D1.Effects.Brightness)edto.Effect).WhitePoint = new Vector2((float)uies.udfDouble1, (float)uies.udfDouble2);
                    ((SharpDX.Direct2D1.Effects.Brightness)edto.Effect).BlackPoint = new Vector2((float)uies.udfDouble3, (float)uies.udfDouble4);

                    edto.Effect.SetInputEffect(0, parentRenderTreeItem.EffectDTO.Effect, true);
                    #endregion
                    break;
                case "SharpDX.Direct2D1.Effects.ColorManagement": break;
                case "SharpDX.Direct2D1.Effects.ColorMatrix": break;
                case "SharpDX.Direct2D1.Effects.Composite": 
                    #region composite
                    if (!string.IsNullOrEmpty(uies.Grouping2) && !string.IsNullOrEmpty(uies.udfString2))
                    {
                        edto.Effect = new SharpDX.Direct2D1.Effects.Composite(_deviceManager.ContextDirect2D);

                        if (!string.IsNullOrEmpty(uies.Grouping2))
                        {
                            var found = _renderTree.Where(x => x.EffectDTO != null && x.EffectDTO.AggregateId == uies.Grouping2);
                            if (found != null && found.Count() > 0)
                                edto.Effect.SetInputEffect(0, found.First().EffectDTO.Effect, true);
                            else
                                edto.Effect.SetInputEffect(1, parentRenderTreeItem.EffectDTO.Effect, true);
                        }
                        else edto.Effect.SetInputEffect(1, parentRenderTreeItem.EffectDTO.Effect, true);

                        if (!string.IsNullOrEmpty(uies.udfString2))
                        {
                            var found = _renderTree.Where(x => x.EffectDTO != null && x.EffectDTO.AggregateId == uies.udfString2);
                            if (found != null && found.Count() > 0)
                                edto.Effect.SetInputEffect(1, found.First().EffectDTO.Effect, true);
                            else
                                edto.Effect.SetInputEffect(1, parentRenderTreeItem.EffectDTO.Effect, true);
                        }
                        else edto.Effect.SetInputEffect(1, parentRenderTreeItem.EffectDTO.Effect, true);
                    }
                    #endregion                    
                    break;
                case "SharpDX.Direct2D1.Effects.ConvolveMatrix":                     
                    #region convolve matrix
                    
                    edto.Effect = new SharpDX.Direct2D1.Effects.ConvolveMatrix(_deviceManager.ContextDirect2D);
                    edto.Effect.SetInputEffect(0, parentRenderTreeItem.EffectDTO.Effect, true);

                    if (!string.IsNullOrEmpty(uies.udfString2)) //matrix
                    {
                        var parts = uies.udfString2.Split("|".ToCharArray());
                        if (parts.Length == 9)
                        {
                            float[] matrix = new float[9]{
                                float.Parse(parts[0]),
                                float.Parse(parts[1]),
                                float.Parse(parts[2]),
                                float.Parse(parts[3]),
                                float.Parse(parts[4]),
                                float.Parse(parts[5]),
                                float.Parse(parts[6]),
                                float.Parse(parts[7]),
                                float.Parse(parts[8]),
                            };
                            ((SharpDX.Direct2D1.Effects.ConvolveMatrix)edto.Effect).KernelMatrix = matrix;
                        }
                        //edto.Effect.SetInput(0, parentRenderTreeItem.EffectDTO.Effect.Output, true);
                        //var kernelmatrix = new float[9] { 0.0f, 0.0f, 0.0f, 0.0f, -1.0f, 0.0f, 0.0f, 0.0f, 0.0f };
                        //((SharpDX.Direct2D1.Effects.ConvolveMatrix)edto.Effect).KernelMatrix = kernelmatrix;
                    }
                    else
                    {
                        ((SharpDX.Direct2D1.Effects.ConvolveMatrix)edto.Effect).KernelMatrix = new float[9] { 0.0f, 0.0f, 0.0f, 0.0f, -1.0f, 0.0f, 0.0f, 0.0f, 0.0f };
                    }
                        
                    
                    #endregion                    
                    break;
                case "SharpDX.Direct2D1.Effects.Crop": 
                    #region crop
                    edto.Effect = new SharpDX.Direct2D1.Effects.Crop(_deviceManager.ContextDirect2D);
                    ((SharpDX.Direct2D1.Effects.Crop)edto.Effect).Rectangle  = new Vector4((float)uies.udfDouble1, (float)uies.udfDouble2, (float)uies.udfDouble3, (float)uies.udfDouble4);
                    edto.Effect.SetInputEffect(0, parentRenderTreeItem.EffectDTO.Effect, true);
                    #endregion                    
                    break;
                case "SharpDX.Direct2D1.Effects.DirectionalBlur":
                    #region directional blur
                    edto.Effect = new SharpDX.Direct2D1.Effects.DirectionalBlur(_deviceManager.ContextDirect2D);
                    edto.Effect.SetValueByName("StandardDeviation", (float)uies.udfDouble1);
                    edto.Effect.SetValueByName("Angle", (float)uies.udfDouble2);
                    edto.Effect.SetInputEffect(0, parentRenderTreeItem.EffectDTO.Effect, true);
                    #endregion
                    break;
                case "SharpDX.Direct2D1.Effects.DiscreteTransfer": break;
                case "SharpDX.Direct2D1.Effects.DisplacementMap": break;
                case "SharpDX.Direct2D1.Effects.DistantDiffuse": break;
                case "SharpDX.Direct2D1.Effects.DistantSpecular": break;
                case "SharpDX.Direct2D1.Effects.DpiCompensation": break;
                case "SharpDX.Direct2D1.Effects.Flood": 
                    #region flood
                    edto.Effect = new SharpDX.Direct2D1.Effects.Flood(_deviceManager.ContextDirect2D);
                    ((SharpDX.Direct2D1.Effects.Flood)edto.Effect).Color = new Color4((float)uies.udfDouble1, (float)uies.udfDouble2, (float)uies.udfDouble3, (float)uies.udfDouble4);
                    edto.Effect.SetInputEffect(0, parentRenderTreeItem.EffectDTO.Effect, true);
                    #endregion                    
                    break;
                case "SharpDX.Direct2D1.Effects.GammaTransfer": break;
                case "SharpDX.Direct2D1.Effects.GaussianBlur":
                    #region gaussian blur
                    edto.Effect = new SharpDX.Direct2D1.Effects.GaussianBlur(_deviceManager.ContextDirect2D);
                    edto.Effect.SetValueByName("StandardDeviation", (float)uies.udfDouble1);
                    edto.Effect.SetInputEffect(0, parentRenderTreeItem.EffectDTO.Effect, true);
                    #endregion
                    break;
                case "SharpDX.Direct2D1.Effects.Histogram": break;
                case "SharpDX.Direct2D1.Effects.HueRotate": 
                    #region hue rotate
                    edto.Effect = new SharpDX.Direct2D1.Effects.HueRotation(_deviceManager.ContextDirect2D);
                    edto.Effect.SetValue(0, (float)uies.udfDouble1);
                    edto.Effect.SetInputEffect(0, parentRenderTreeItem.EffectDTO.Effect, true);
                    #endregion                    
                    break;
                case "SharpDX.Direct2D1.Effects.LinearTransfer": break;
                case "SharpDX.Direct2D1.Effects.LuminanceToAlpha": break;
                case "SharpDX.Direct2D1.Effects.Morphology": break;
                case "SharpDX.Direct2D1.Effects.NamespaceDoc": break;
                case "SharpDX.Direct2D1.Effects.PointDiffuse": break;
                case "SharpDX.Direct2D1.Effects.PointSpecular": break;
                case "SharpDX.Direct2D1.Effects.Premultiply": break;
                case "SharpDX.Direct2D1.Effects.Saturation":
                    #region saturation
                    edto.Effect = new SharpDX.Direct2D1.Effects.Saturation(_deviceManager.ContextDirect2D);
                    edto.Effect.SetValue(0, (float)uies.udfDouble1);
                    edto.Effect.SetInputEffect(0, parentRenderTreeItem.EffectDTO.Effect, true);
                    #endregion
                    break;
                case "SharpDX.Direct2D1.Effects.Scale": 
                    #region scale

                    SharpDX.Direct2D1.Effects.Scale ef = new SharpDX.Direct2D1.Effects.Scale(_deviceManager.ContextDirect2D);
                    ef.BorderMode = SharpDX.Direct2D1.BorderMode.Soft;
                    ef.Cached = false;
                    ef.ScaleAmount = new Vector2((float)uies.udfDouble1, (float)uies.udfDouble2);
                    ef.CenterPoint = new Vector2((float)uies.udfDouble3, (float)uies.udfDouble4);
                    edto.Effect = ef;

                    edto.Effect.SetInputEffect(0, parentRenderTreeItem.EffectDTO.Effect, true);
                    #endregion
                    break;
                case "SharpDX.Direct2D1.Effects.Shadow": 
                    #region shadow
                    edto.Effect = new SharpDX.Direct2D1.Effects.Shadow(_deviceManager.ContextDirect2D);
                    edto.Effect.SetValue(0, (float)uies.udfDouble1);
                    edto.Effect.SetInputEffect(0, parentRenderTreeItem.EffectDTO.Effect, true);
                    #endregion                    
                    break;
                case "SharpDX.Direct2D1.Effects.SpotDiffuse": break;
                case "SharpDX.Direct2D1.Effects.SpotSpecular": break;
                case "SharpDX.Direct2D1.Effects.TableTransfer": break;
                case "SharpDX.Direct2D1.Effects.Tile": 
                    #region tile
                    edto.Effect = new SharpDX.Direct2D1.Effects.Tile(_deviceManager.ContextDirect2D);
                    ((SharpDX.Direct2D1.Effects.Tile)edto.Effect).Rectangle = new Vector4((float)uies.udfDouble1, (float)uies.udfDouble2, (float)uies.udfDouble3, (float)uies.udfDouble4);
                    edto.Effect.SetInputEffect(0, parentRenderTreeItem.EffectDTO.Effect, true);
                    #endregion                    
                    break;
                case "SharpDX.Direct2D1.Effects.Transform3D": break;
                case "SharpDX.Direct2D1.Effects.Turbulence": break;
                case "SharpDX.Direct2D1.Effects.UnPremultiply": break;

            }


            RenderDTO _newRenderDto;

            if(parentRenderTreeItem!=null)
                _newRenderDto = new RenderDTO() { EffectDTO = edto, Type = eRenderType.Effect , Order = parentRenderTreeItem.Order };
            else
                _newRenderDto = new RenderDTO() { EffectDTO = edto, Type = eRenderType.Effect, Order = 1};

            _renderTree.Add(_newRenderDto);

            return _newRenderDto;
        }


        private async Task<bool> UpdateRenderItemWithUIElement_Effect(UIElementState uies, RenderDTO renderItem)
        {
            if (_renderTree == null || _renderTree.Count == 0) return true;

            UIElementState uiesParent = AppDatabase.Current.RetrieveUIElementState(renderItem.EffectDTO.Grouping1).First();

            string[] parts = uies.udfString1.Split("|".ToCharArray());


            //child got changed so re update from the parent where applicable
            renderItem.EffectDTO.IsRenderable = uies.IsRenderable;

            renderItem.EffectDTO.MainTranslation = new Vector3(
                (float)uiesParent.Left,
                (float)uiesParent.Top,
                (float)0);

            renderItem.EffectDTO.MainScale = new Vector3(
                (float)uiesParent.Scale,
                (float)uiesParent.Scale,
                0);

            if (string.IsNullOrEmpty(uies.Grouping2))
            {
                if (renderItem.EffectDTO.Effect != null)
                {
                    RenderDTO renderItemParent = _renderTree.Where(x => x.EffectDTO != null && x.EffectDTO.AggregateId == uies.Grouping1).First();
                    renderItem.EffectDTO.Effect.SetInputEffect(0, renderItemParent.EffectDTO.Effect, true);
                }
            }
            else
            {
                if (renderItem.EffectDTO.Effect != null)
                {
                    RenderDTO renderItemParent = _renderTree.Where(x => x.EffectDTO != null && x.EffectDTO.AggregateId == uies.Grouping2).First();
                    renderItem.EffectDTO.Effect.SetInputEffect(0, renderItemParent.EffectDTO.Effect, true);
                }
            }

            //SharpDX.Direct2D1.Effects.Blend

            //now just update child based on new values from child UIElementState
            switch (parts[0])
            {
                case "SharpDX.Direct2D1.Effects.AffineTransform2D": break;
                case "SharpDX.Direct2D1.Effects.ArithmeticComposite": break;
                case "SharpDX.Direct2D1.Effects.Atlas": break;
                case "SharpDX.Direct2D1.Effects.BitmapSourceEffect": 
                    #region bitmap source
                    var asset = await LoadAssetAsync(_deviceManager.WICFactory, uies.udfString1);
                    ((SharpDX.Direct2D1.Effects.BitmapSourceEffect)renderItem.EffectDTO.Effect).SetValueByName("WicBitmapSource", asset.Item1);
                    #endregion
                    break;
                case "SharpDX.Direct2D1.Effects.Blend": break;
                case "SharpDX.Direct2D1.Effects.Border": break;
                case "SharpDX.Direct2D1.Effects.Brightness":
                    #region brightness
                    ((SharpDX.Direct2D1.Effects.Brightness)renderItem.EffectDTO.Effect).WhitePoint = new Vector2((float)uies.udfDouble1, (float)uies.udfDouble2);
                    ((SharpDX.Direct2D1.Effects.Brightness)renderItem.EffectDTO.Effect).BlackPoint = new Vector2((float)uies.udfDouble3, (float)uies.udfDouble4);
                    #endregion
                    break;
                case "SharpDX.Direct2D1.Effects.ColorManagement": break;
                case "SharpDX.Direct2D1.Effects.ColorMatrix": break;
                case "SharpDX.Direct2D1.Effects.Composite": 
                    #region composite
                    if(!string.IsNullOrEmpty(uies.Grouping2) && !string.IsNullOrEmpty(uies.udfString2)){
                        //renderItem.EffectDTO.Effect.SetValue(0, (float)uies.udfDouble1);

                        if (renderItem.EffectDTO.Effect == null)
                            renderItem.EffectDTO.Effect = new SharpDX.Direct2D1.Effects.Composite(_deviceManager.ContextDirect2D);
                        //else
                        //{
                        //    renderItem.EffectDTO.Effect.Dispose();
                        //    renderItem.EffectDTO.Effect = new SharpDX.Direct2D1.Effects.Composite(_deviceManager.ContextDirect2D);
                        //}

                        if (!string.IsNullOrEmpty(uies.Grouping2))
                        {
                            var found = _renderTree.Where(x => x.EffectDTO != null && x.EffectDTO.AggregateId == uies.Grouping2);
                            if (found != null && found.Count() > 0)
                                renderItem.EffectDTO.Effect.SetInputEffect(0, found.First().EffectDTO.Effect, true);
                        }

                        if (!string.IsNullOrEmpty(uies.udfString2))
                        {
                            var found = _renderTree.Where(x => x.EffectDTO != null && x.EffectDTO.AggregateId == uies.udfString2);
                            if (found != null && found.Count() > 0)
                                renderItem.EffectDTO.Effect.SetInputEffect(1, found.First().EffectDTO.Effect, true);
                        }

                    }
                    #endregion
                    break;
                case "SharpDX.Direct2D1.Effects.ConvolveMatrix":                     
                    #region convolve matrix
                    if (!string.IsNullOrEmpty(uies.udfString2)) //matrix
                    {
                        var matrixParts = uies.udfString2.Split("|".ToCharArray());
                        if (matrixParts.Length == 9)
                        {
                            float[] matrix = new float[9]{
                                   float.Parse(matrixParts[0]),
                                   float.Parse(matrixParts[1]),
                                   float.Parse(matrixParts[2]),
                                   float.Parse(matrixParts[3]),
                                   float.Parse(matrixParts[4]),
                                   float.Parse(matrixParts[5]),
                                   float.Parse(matrixParts[6]),
                                   float.Parse(matrixParts[7]),
                                   float.Parse(matrixParts[8]),
                               };
                            ((SharpDX.Direct2D1.Effects.ConvolveMatrix)renderItem.EffectDTO.Effect).KernelMatrix = matrix;
                        }
                    }
                    
                    #endregion
                    break;
                case "SharpDX.Direct2D1.Effects.Crop":
                    #region Crop
                    ((SharpDX.Direct2D1.Effects.Crop)renderItem.EffectDTO.Effect).Rectangle = new Vector4((float)uies.udfDouble1, (float)uies.udfDouble2, (float)uies.udfDouble3, (float)uies.udfDouble4);
                    #endregion
                    break;
                case "SharpDX.Direct2D1.Effects.DirectionalBlur":
                    #region directional blur
                    renderItem.EffectDTO.Effect.SetValueByName("StandardDeviation", (float)uies.udfDouble1);
                    renderItem.EffectDTO.Effect.SetValueByName("Angle", (float)uies.udfDouble2);
                    #endregion
                    break;
                case "SharpDX.Direct2D1.Effects.DiscreteTransfer": break;
                case "SharpDX.Direct2D1.Effects.DisplacementMap": break;
                case "SharpDX.Direct2D1.Effects.DistantDiffuse": break;
                case "SharpDX.Direct2D1.Effects.DistantSpecular": break;
                case "SharpDX.Direct2D1.Effects.DpiCompensation": break;
                case "SharpDX.Direct2D1.Effects.Flood": 
                    #region flood
                    ((SharpDX.Direct2D1.Effects.Flood)renderItem.EffectDTO.Effect).Color = new Color4((float)uies.udfDouble1, (float)uies.udfDouble2, (float)uies.udfDouble3, (float)uies.udfDouble4);
                    #endregion
                    break;
                case "SharpDX.Direct2D1.Effects.GammaTransfer": break;
                case "SharpDX.Direct2D1.Effects.GaussianBlur":
                    #region gaussian blur
                    renderItem.EffectDTO.Effect.SetValueByName("StandardDeviation", (float)uies.udfDouble1);
                    #endregion
                    break;
                case "SharpDX.Direct2D1.Effects.Histogram": break;
                case "SharpDX.Direct2D1.Effects.HueRotate": 
                    #region hue rotate
                    renderItem.EffectDTO.Effect.SetValue(0, (float)uies.udfDouble1);
                    #endregion
                    break;
                case "SharpDX.Direct2D1.Effects.LinearTransfer": break;
                case "SharpDX.Direct2D1.Effects.LuminanceToAlpha": break;
                case "SharpDX.Direct2D1.Effects.Morphology": break;
                case "SharpDX.Direct2D1.Effects.NamespaceDoc": break;
                case "SharpDX.Direct2D1.Effects.PointDiffuse": break;
                case "SharpDX.Direct2D1.Effects.PointSpecular": break;
                case "SharpDX.Direct2D1.Effects.Premultiply": break;
                case "SharpDX.Direct2D1.Effects.Saturation":
                    #region saturation
                    renderItem.EffectDTO.Effect.SetValue(0, (float)uies.udfDouble1);
                    #endregion
                    break;
                case "SharpDX.Direct2D1.Effects.Scale": 
                    #region scale
                    SharpDX.Direct2D1.Effects.Scale ef = (SharpDX.Direct2D1.Effects.Scale)renderItem.EffectDTO.Effect;
                    ef.ScaleAmount = new Vector2((float)uies.udfDouble1, (float)uies.udfDouble2);
                    ef.CenterPoint = new Vector2((float)uies.udfDouble3, (float)uies.udfDouble4);
                    #endregion
                    break;
                case "SharpDX.Direct2D1.Effects.Shadow": 
                    #region shadow
                    renderItem.EffectDTO.Effect.SetValue(0, (float)uies.udfDouble1);
                    #endregion
                    break;
                case "SharpDX.Direct2D1.Effects.SpotDiffuse": break;
                case "SharpDX.Direct2D1.Effects.SpotSpecular": break;
                case "SharpDX.Direct2D1.Effects.TableTransfer": break;
                case "SharpDX.Direct2D1.Effects.Tile": 
                    #region tile
                    ((SharpDX.Direct2D1.Effects.Tile)renderItem.EffectDTO.Effect).Rectangle = new Vector4((float)uies.udfDouble1, (float)uies.udfDouble2, (float)uies.udfDouble3, (float)uies.udfDouble4);
                    #endregion
                    break;
                case "SharpDX.Direct2D1.Effects.Transform3D": break;
                case "SharpDX.Direct2D1.Effects.Turbulence": break;
                case "SharpDX.Direct2D1.Effects.UnPremultiply": break;

            }

            return true;


        }




    }
}
