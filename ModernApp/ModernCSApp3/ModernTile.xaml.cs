using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Media.Animation;
using Windows.UI.Xaml.Navigation;

// The User Control item template is documented at http://go.microsoft.com/fwlink/?LinkId=234236

namespace ModernCSApp3
{
    public sealed partial class ModernTile : UserControl
    {
        bool isDotShowing = false;
        bool hasInitialized = false;

        public enum eAnimationType
        {
            CenterDot = 0
        }

        public ModernTile()
        {
            this.InitializeComponent();
            
        }


        public void StartAnimation(SolidColorBrush fill, int startMilliseconds, eAnimationType animationType)
        {

            if(!hasInitialized){
                layoutRoot.Clip.Rect = new Rect(0, 0, this.ActualWidth, this.ActualHeight);
                
                lblLine1.Text = fill.Color.ToString();

                if (animationType == eAnimationType.CenterDot) { 
                    ctlGrowingDot.Fill = fill;

                    double widthToUse = this.ActualWidth > this.ActualHeight ? this.ActualWidth : this.ActualHeight;

                    //growdot
                    ((DoubleAnimationUsingKeyFrames)sbGrowDot.Children[0]).KeyFrames[0].KeyTime = TimeSpan.FromMilliseconds(startMilliseconds);
                    ((DoubleAnimationUsingKeyFrames)sbGrowDot.Children[0]).KeyFrames[1].Value = widthToUse * 2;

                    ((DoubleAnimationUsingKeyFrames)sbGrowDot.Children[1]).KeyFrames[0].KeyTime = TimeSpan.FromMilliseconds(startMilliseconds);
                    ((DoubleAnimationUsingKeyFrames)sbGrowDot.Children[1]).KeyFrames[1].Value = widthToUse * 2;

                    //shrinkdot
                    ((DoubleAnimationUsingKeyFrames)sbShrinkDot.Children[0]).KeyFrames[0].KeyTime = TimeSpan.FromMilliseconds(400 + startMilliseconds);
                    ((DoubleAnimationUsingKeyFrames)sbShrinkDot.Children[1]).KeyFrames[0].KeyTime = TimeSpan.FromMilliseconds(400 + startMilliseconds);

                    //animatetext
                    ((DoubleAnimationUsingKeyFrames)sbAnimateText.Children[0]).KeyFrames[0].KeyTime = TimeSpan.FromMilliseconds(startMilliseconds + 300);
                    ((DoubleAnimationUsingKeyFrames)sbAnimateText.Children[0]).KeyFrames[1].KeyTime = TimeSpan.FromMilliseconds(startMilliseconds + 300 + 1500);

                }

                hasInitialized = true;
            }


            if (animationType == eAnimationType.CenterDot) {
                if (isDotShowing) { sbShrinkDot.Begin(); sbAnimateText.Stop(); }
                else { sbGrowDot.Begin(); sbAnimateText.Begin(); }

                isDotShowing = !isDotShowing;
            }



        }
    }
}
