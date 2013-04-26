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

        private void DoGeneralSystemWideMessageCallbackText(GeneralSystemWideMessage msg)
        {

            if (msg.Identifier == "COMPOSER")
            {
               if (msg.Action == "ADD TEXT")
                {
                    var uistate = AppDatabase.Current.RetrieveUIElementState(msg.AggregateId);
                    if (uistate != null && uistate.Count() > 0)
                    {
                        TextDTO textDto = new TextDTO();

                        textDto.TextFormat = new SharpDX.DirectWrite.TextFormat(
                            _deviceManager.FactoryDirectWrite,
                            uistate[0].udfString2,
                            SharpDX.DirectWrite.FontWeight.Light,
                            SharpDX.DirectWrite.FontStyle.Normal,
                            SharpDX.DirectWrite.FontStretch.Normal,
                            (float)uistate[0].udfDouble1);

                        textDto.Brush = new SharpDX.Direct2D1.SolidColorBrush(_deviceManager.ContextDirect2D, Color.Black);
                        textDto.Text = msg.Text1;
                        textDto.LayoutRect = new RectangleF(0, 0, (float)uistate[0].Width, (float)uistate[0].Height);
                        textDto.IsRenderable = true;
                        textDto.MainScale = new Vector3(1, 1, 1);
                        textDto.MainTranslation = new Vector3(0, 0, 0);
                        textDto.AggregateId = msg.AggregateId;

                        _renderTree.Add(new RenderDTO() { TextDTO = textDto, Type = eRenderType.Text, Order = _renderTree.Count() + 1 });

                        NumberFramesToRender = 3;

                        //TurnOnRenderingBecauseThereAreRenderableEffects();
                        //AppDatabase.Current.AddUpdateUIElementState(aggregateId, 0, 0,backgroundImageSize.Width, backgroundImageSize.Height,  1, false, 0, 0);

                    }
                }
               else if (msg.Action == "DELETE TEXT")
               {
                   #region DELETE TEXT
                   var found = _renderTree.Where(x => x.Type == eRenderType.Text && x.TextDTO.AggregateId == msg.AggregateId).FirstOrDefault();
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

        private void DoAggregateUpdatedForText( List<UIElementState> uistate,  GeneralSystemWideMessage msg)
        {
            RenderDTO found = _renderTree.Where(x => x.Type == eRenderType.Text && x.TextDTO.AggregateId == msg.AggregateId).FirstOrDefault();
            if (found != null)
            {
                
                found.TextDTO.IsRenderable = uistate[0].IsRenderable;
                found.TextDTO.MainTranslation = new Vector3((float)uistate[0].Left, (float)uistate[0].Top, (float)0);
                found.TextDTO.MainScale = new Vector3((float)uistate[0].Scale, (float)uistate[0].Scale, 0);

                found.TextDTO.LayoutRect = new RectangleF(0, 0, (float)uistate[0].Width, (float)uistate[0].Height);

                found.TextDTO.TextFormat = new SharpDX.DirectWrite.TextFormat(
                    _deviceManager.FactoryDirectWrite,
                    uistate[0].udfString2,
                    SharpDX.DirectWrite.FontWeight.Light,
                    SharpDX.DirectWrite.FontStyle.Normal,
                    SharpDX.DirectWrite.FontStretch.Normal,
                    (float)uistate[0].udfDouble1);

                found.TextDTO.Text = string.IsNullOrEmpty(uistate[0].udfString1) ? "Lorem Ipsum" : uistate[0].udfString1;
                
            }
        }


        private async Task<RenderDTO> AddUpdateUIElementState_Text(UIElementState uistate, RenderDTO rDto, Color color)
        {
            TextDTO textDto = null;

            if (rDto == null || rDto.TextDTO == null)
            {
                textDto = new TextDTO();
                textDto.AggregateId = uistate.AggregateId;

                rDto = new RenderDTO() { TextDTO = textDto, Type = eRenderType.Text, Order = _renderTree.Count() + 1 };

                _renderTree.Add(rDto);
            }
            else
            {
                textDto = rDto.TextDTO;
            }
            


            textDto.TextFormat = new SharpDX.DirectWrite.TextFormat(
                _deviceManager.FactoryDirectWrite,
                uistate.udfString2,
                SharpDX.DirectWrite.FontWeight.Light,
                SharpDX.DirectWrite.FontStyle.Normal,
                SharpDX.DirectWrite.FontStretch.Normal,
                (float)uistate.udfDouble1);

            textDto.Brush = new SharpDX.Direct2D1.SolidColorBrush(_deviceManager.ContextDirect2D, color);
            textDto.Text = uistate.udfString1;
            textDto.TextFormat.TextAlignment = SharpDX.DirectWrite.TextAlignment.Center;
            textDto.LayoutRect = new RectangleF(0, 0, (float)uistate.Width, (float)uistate.Height);





            rDto.TextDTO.IsRenderable = uistate.IsRenderable; //true
            rDto.TextDTO.MainScale = new Vector3((float)uistate.Scale, (float)uistate.Scale, 1);
            rDto.TextDTO.MainTranslation = new Vector3((float)uistate.Left, (float)uistate.Top, 0);





            ////ROTATION
            //if (!string.IsNullOrEmpty(uistate.udfString5))
            //{
            //    var strokeParts = uistate.udfString5.Split("|".ToCharArray());
            //    if (strokeParts.Length > 0)
            //    {
            //        rDto.ShapeDTO.MainRotation = new Vector3(
            //            MathUtil.DegreesToRadians(float.Parse(string.IsNullOrEmpty(strokeParts[0]) ? "0" : strokeParts[0])),
            //            MathUtil.DegreesToRadians(float.Parse(string.IsNullOrEmpty(strokeParts[1]) ? "0" : strokeParts[1])),
            //            MathUtil.DegreesToRadians(float.Parse(string.IsNullOrEmpty(strokeParts[2]) ? "0" : strokeParts[2]))
            //            );
            //    }
            //}


            if (NumberFramesToRender < 1) NumberFramesToRender = 1;

            //TurnOnRenderingBecauseThereAreRenderableEffects();

            return rDto;
        }


    }
}
