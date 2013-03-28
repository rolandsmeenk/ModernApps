

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

    public class RenderDTO
    {
        public int Type { get; set; }
        public EffectDTO EffectDTO { get; set; }        //type = 1
        public TextDTO TextDTO { get; set; }            //type = 2
        public MediaDTO MediaDTO { get; set; }          //type = 3
        public ShapeDTO ShapeDTO { get; set; }          //type = 4
        public ShapePathDTO ShapePathDTO { get; set; }  //type = 5
        public int Order { get; set; }
        public bool HasLinkedEffects { get; set; }
    }

    public class ShapeDTO
    {
        public SharpDX.Direct2D1.Geometry Shape { get; set; }
        public SharpDX.Direct2D1.Brush Brush { get; set; }
        public bool IsRenderable { get; set; }
        public string AggregateId { get; set; }
        public Vector3 MainRotation { get; set; }
        public Vector3 MainTranslation { get; set; }
        public Vector3 MainScale { get; set; }
        public string Grouping1 { get; set; }
        public int Type { get; set; }
        public float StrokeWidth { get; set; }
        public int DashStyleIndex { get; set; }
        public float DashOffset { get; set; }
        public float MiterLimit { get; set; }

    }

    public class ShapePathDTO
    {
        public List<string> ShapeDatas { get; set; }
        public List<SharpDX.Direct2D1.PathGeometry> Shapes { get; set; }
        public SharpDX.Direct2D1.Brush Brush { get; set; }
        public bool IsRenderable { get; set; }
        public string AggregateId { get; set; }
        public Vector3 MainRotation { get; set; }
        public Vector3 MainTranslation { get; set; }
        public Vector3 MainScale { get; set; }
        public string Grouping1 { get; set; }
        public int Type { get; set; }
        public float StrokeWidth { get; set; }
        public int DashStyleIndex { get; set; }
        public float DashOffset { get; set; }
        public float MiterLimit { get; set; }

        public ShapePathDTO()
        {
            ShapeDatas = new List<string>();
            Shapes = new List<SharpDX.Direct2D1.PathGeometry>();
        }
    }

    public class EffectDTO
    {
        public SharpDX.Direct2D1.Effect Effect { get; set; }
        public bool IsRenderable { get; set; }
        public string AggregateId { get; set; }
        public Vector3 MainTranslation { get; set; }
        public Vector3 MainScale { get; set; }
        public string Grouping1 { get; set; }
    }

    public class MediaDTO
    {
        public MediaPlayer MediaPlayer { get; set; }
        public bool IsRenderable { get; set; }
        public string AggregateId { get; set; }
        public Vector3 MainTranslation { get; set; }
        public Vector3 MainScale { get; set; }
    }

    public class TextDTO
    {
        public SharpDX.DirectWrite.TextFormat TextFormat { get; set; }
        public string Text { get; set; }
        public SharpDX.Direct2D1.SolidColorBrush Brush { get; set; }
        public Color4 BrushColor { get; set; }
        public RectangleF LayoutRect { get; set; }
        public bool IsRenderable { get; set; }
        public string AggregateId { get; set; }
        public Vector3 MainTranslation { get; set; }
        public Vector3 MainScale { get; set; }
    }

}
