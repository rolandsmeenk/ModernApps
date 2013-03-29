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
using SharpDX.Direct2D1;
using SumoNinjaMonkey.Framework.Lib;
using ModernCSApp.Services;

namespace ModernCSApp.DxRenderer
{
    public partial class BackgroundComposer
    {
        private PathToD2DPathGeometryConverter _pathD2DConverter = new PathToD2DPathGeometryConverter();

       
        private RadialGradientBrush CreateRadialGradientBrush(DeviceContext context, float width, float height, Color4 color1, Color4 color2, float color1Position, float color2Position)
        {

            GradientStop[] stops = new GradientStop[2];
            //stops[0] = new GradientStop() { Color = new Color4(0.85f, 0, 0, 1.0f), Position = 0.0f };
            //stops[1] = new GradientStop() { Color = new Color4(0.22f, 0, 0, 1.0f), Position = 1.0f };
            stops[0] = new GradientStop() { Color = color1, Position = color1Position };
            stops[1] = new GradientStop() { Color = color2, Position = color2Position };


            GradientStopCollection gsc = new GradientStopCollection(context, stops, ExtendMode.Clamp);

            RadialGradientBrush brush = new RadialGradientBrush(
                context,
                new RadialGradientBrushProperties()
                {
                    RadiusX = width / 1.3f,
                    RadiusY = height / 1.3f,
                    Center = new Vector2(width / 2.0f, height / 2.0f),
                    GradientOriginOffset = new Vector2(0, 0)
                },
                gsc);


            return brush;
        }





        private async Task<RenderDTO> AddUpdateUIElementState_Path(UIElementState uistate, RenderDTO rDto)
        {
            if (rDto == null)
            {
                ShapePathDTO dto = new ShapePathDTO();
                dto.AggregateId = uistate.AggregateId;

                rDto = new RenderDTO() { ShapePathDTO = dto, Type = eRenderType.ShapePath, Order = _renderTree.Count() + 1 };

                rDto.ShapePathDTO.ShapeDatas.Add("M6.33675,26.318 L32.1257,26.318 C32.1257,26.318 44.2178,18.6175 32.1257,10.8489 C32.1257,10.8489 31.7393,1.25822 23.4461,0.582515 C23.4461,0.582515 16.6888,-0.631889 13.9267,6.25699 C13.9267,6.25699 11.8669,4.43488 8.52113,5.78424 C8.52113,5.78424 6.01503,6.73083 5.88855,10.6481 C5.88855,10.6481 0.609425,11.1868 0.547688,17.8748 C0.547688,17.8748 -0.417516,25.1005 6.33675,26.318 z");
                rDto.ShapePathDTO.Shapes.Add(_pathD2DConverter.parse(dto.ShapeDatas[0], _deviceManager.FactoryDirect2D));

                _renderTree.Add(rDto);
            }

        

            //stroke stuff
            rDto.ShapePathDTO.StrokeWidth = (float)uistate.udfDouble3;
            if (!string.IsNullOrEmpty(uistate.udfString4))
            {
                var strokeParts = uistate.udfString4.Split("|".ToCharArray());
                if (strokeParts.Length > 0)
                {
                    rDto.ShapePathDTO.DashOffset = float.Parse(strokeParts[0]);
                    rDto.ShapePathDTO.MiterLimit = float.Parse(strokeParts[1]);
                    rDto.ShapePathDTO.DashStyleIndex = int.Parse(string.IsNullOrEmpty(strokeParts[2]) ? "0" : strokeParts[2]);
                    if (rDto.ShapePathDTO.DashStyleIndex < 0) rDto.ShapePathDTO.DashStyleIndex = 0;
                    if (rDto.ShapePathDTO.DashStyleIndex == 5) rDto.ShapePathDTO.DashStyleIndex = 0;
                }
            }


            if (uistate.udfInt2 == 1)
            {
                var parts1 = uistate.udfString2.Split("|".ToCharArray());
                var parts2 = uistate.udfString3.Split("|".ToCharArray());

                Color4 colorToUse1;
                Color4 colorToUse2;
                try
                {
                    colorToUse1 = new Color4(
                        float.Parse(parts1[0]) / 255,
                        float.Parse(parts1[1]) / 255,
                        float.Parse(parts1[2]) / 255,
                        parts1.Length > 6 ? float.Parse(parts1[6]) / 255 : float.Parse(parts1[3]) / 255
                        );

                    colorToUse2 = new Color4(
                        float.Parse(parts2[0]) / 255,
                        float.Parse(parts2[1]) / 255,
                        float.Parse(parts2[2]) / 255,
                        parts2.Length > 6 ? float.Parse(parts2[6]) / 255 : float.Parse(parts2[3]) / 255
                        );
                }
                catch
                {
                    colorToUse1 = Color.Black;
                    colorToUse2 = Color.White;
                }

                rDto.ShapePathDTO.Brush = CreateRadialGradientBrush(_deviceManager.ContextDirect2D, (float)uistate.Width, (float)uistate.Height, colorToUse1, colorToUse2, (float)uistate.udfDouble1 / 100, (float)uistate.udfDouble2 / 100);

            }
            else
            {
                var parts = uistate.udfString2.Split("|".ToCharArray());

                Color4 colorToUse;
                try
                {
                    colorToUse = new Color4(
                        float.Parse(parts[0]) / 255,
                        float.Parse(parts[1]) / 255,
                        float.Parse(parts[2]) / 255,
                        parts.Length > 6 ? float.Parse(parts[6]) / 255 : float.Parse(parts[3]) / 255
                        );
                }
                catch
                {
                    colorToUse = Color.Black;
                }

                rDto.ShapePathDTO.Brush = new SharpDX.Direct2D1.SolidColorBrush(_deviceManager.ContextDirect2D, colorToUse);
            }

            rDto.ShapePathDTO.IsRenderable = true;
            rDto.ShapePathDTO.MainScale = new Vector3((float)uistate.Scale, (float)uistate.Scale, 1);
            rDto.ShapePathDTO.MainTranslation = new Vector3((float)uistate.Left, (float)uistate.Top, 0);

            //ROTATION
            if (!string.IsNullOrEmpty(uistate.udfString5))
            {
                var strokeParts = uistate.udfString5.Split("|".ToCharArray());
                if (strokeParts.Length > 0)
                {
                    rDto.ShapePathDTO.MainRotation = new Vector3(
                        MathUtil.DegreesToRadians(float.Parse(string.IsNullOrEmpty(strokeParts[0]) ? "0" : strokeParts[0])),
                        MathUtil.DegreesToRadians(float.Parse(string.IsNullOrEmpty(strokeParts[1]) ? "0" : strokeParts[1])),
                        MathUtil.DegreesToRadians(float.Parse(string.IsNullOrEmpty(strokeParts[2]) ? "0" : strokeParts[2]))
                        );
                }
            }


            

            NumberFramesToRender = 3;

            //TurnOnRenderingBecauseThereAreRenderableEffects();


            return rDto;
        }


        private async Task<RenderDTO> AddUpdateUIElementState_Rectangle(UIElementState uistate, RenderDTO rDto)
        {

            if (rDto == null)
            {
                ShapeDTO dto = new ShapeDTO();
                dto.AggregateId = uistate.AggregateId;

                rDto = new RenderDTO() { ShapeDTO = dto, Type = eRenderType.Shape, Order = _renderTree.Count() + 1 };

                _renderTree.Add(rDto);
            }



            switch (uistate.udfString1)
            {
                case "Rectangle":
                    RectangleF newGeometry1 = new RectangleF(0, 0, (float)uistate.Width, (float)uistate.Height);
                    rDto.ShapeDTO.Shape = new SharpDX.Direct2D1.RectangleGeometry(_deviceManager.FactoryDirect2D, newGeometry1);
                    rDto.ShapeDTO.Type = uistate.udfInt1;
                    break;
                case "Ellipse":
                    SharpDX.Direct2D1.Ellipse newGeometry2 = new SharpDX.Direct2D1.Ellipse(
                        new Vector2(((float)uistate.Width / 2), ((float)uistate.Height / 2)),
                        (float)uistate.Width,
                        (float)uistate.Height
                        );
                    rDto.ShapeDTO.Shape = new SharpDX.Direct2D1.EllipseGeometry(_deviceManager.FactoryDirect2D, newGeometry2);
                    rDto.ShapeDTO.Type = uistate.udfInt1;
                    break;

            }




            //stroke stuff
            rDto.ShapeDTO.StrokeWidth = (float)uistate.udfDouble3;
            if (!string.IsNullOrEmpty(uistate.udfString4))
            {
                var strokeParts = uistate.udfString4.Split("|".ToCharArray());
                if (strokeParts.Length > 0)
                {
                    rDto.ShapeDTO.DashOffset = float.Parse(strokeParts[0]);
                    rDto.ShapeDTO.MiterLimit = float.Parse(strokeParts[1]);
                    rDto.ShapeDTO.DashStyleIndex = int.Parse(string.IsNullOrEmpty(strokeParts[2]) ? "0" : strokeParts[2]);
                    if (rDto.ShapeDTO.DashStyleIndex < 0) rDto.ShapeDTO.DashStyleIndex = 0;
                    if (rDto.ShapeDTO.DashStyleIndex == 5) rDto.ShapeDTO.DashStyleIndex = 0;
                }
            }


            

            if (uistate.udfInt2 == 1)
            {
                var parts1 = uistate.udfString2.Split("|".ToCharArray());
                var parts2 = uistate.udfString3.Split("|".ToCharArray());

                Color4 colorToUse1;
                Color4 colorToUse2;
                try
                {
                    colorToUse1 = new Color4(
                        float.Parse(parts1[0]) / 255,
                        float.Parse(parts1[1]) / 255,
                        float.Parse(parts1[2]) / 255,
                        parts1.Length > 6 ? float.Parse(parts1[6]) / 255 : float.Parse(parts1[3]) / 255
                        );

                    colorToUse2 = new Color4(
                        float.Parse(parts2[0]) / 255,
                        float.Parse(parts2[1]) / 255,
                        float.Parse(parts2[2]) / 255,
                        parts2.Length > 6 ? float.Parse(parts2[6]) / 255 : float.Parse(parts2[3]) / 255
                        );
                }
                catch
                {
                    colorToUse1 = Color.Black;
                    colorToUse2 = Color.White;
                }

                rDto.ShapeDTO.Brush = CreateRadialGradientBrush(_deviceManager.ContextDirect2D, (float)uistate.Width, (float)uistate.Height, colorToUse1, colorToUse2, (float)uistate.udfDouble1 / 100, (float)uistate.udfDouble2 / 100);

            }
            else
            {
                var parts = uistate.udfString2.Split("|".ToCharArray());

                Color4 colorToUse;
                try
                {
                    colorToUse = new Color4(
                        float.Parse(parts[0]) / 255,
                        float.Parse(parts[1]) / 255,
                        float.Parse(parts[2]) / 255,
                        parts.Length > 6 ? float.Parse(parts[6]) / 255 : float.Parse(parts[3]) / 255
                        );
                }
                catch
                {
                    colorToUse = Color.Black;
                }

                rDto.ShapeDTO.Brush = new SharpDX.Direct2D1.SolidColorBrush(_deviceManager.ContextDirect2D, colorToUse);
            }



            rDto.ShapeDTO.IsRenderable = uistate.IsRenderable; //true
            rDto.ShapeDTO.MainScale = new Vector3((float)uistate.Scale, (float)uistate.Scale, 1);
            rDto.ShapeDTO.MainTranslation = new Vector3((float)uistate.Left, (float)uistate.Top, 0);


            //ROTATION
            if (!string.IsNullOrEmpty(uistate.udfString5))
            {
                var strokeParts = uistate.udfString5.Split("|".ToCharArray());
                if (strokeParts.Length > 0)
                {
                    rDto.ShapeDTO.MainRotation = new Vector3(
                        MathUtil.DegreesToRadians(float.Parse(string.IsNullOrEmpty(strokeParts[0]) ? "0" : strokeParts[0])),
                        MathUtil.DegreesToRadians(float.Parse(string.IsNullOrEmpty(strokeParts[1]) ? "0" : strokeParts[1])),
                        MathUtil.DegreesToRadians(float.Parse(string.IsNullOrEmpty(strokeParts[2]) ? "0" : strokeParts[2]))
                        );
                }
            }



            
            NumberFramesToRender = 3;

            //TurnOnRenderingBecauseThereAreRenderableEffects();

            return rDto;
        }
    }
}
