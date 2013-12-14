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

        public enum eDotAnimationType
        {
            CenterDot = 0
        }

        public enum eTextAnimationType
        {
            BottomLeftTo01 = 0,
            BottomRightTo01 = 1

        }

        public enum eBackgroundImageAnimationType
        {
            BottomToTop = 0,
            Pan1 = 1,
            Pan2 = 2
        }

        public ModernTile()
        {
            this.InitializeComponent();
            
        }




        public void StartAnimation(SolidColorBrush fill, int startMilliseconds, eDotAnimationType animationType, eTextAnimationType textAnimationType, double iconScale, eBackgroundImageAnimationType backgroundImageAnimationType)
        {

            if(!hasInitialized){
                layoutRoot.Clip.Rect = new Rect(0, 0, this.ActualWidth, this.ActualHeight);
                
                lblLine1.Text = fill.Color.ToString();

                if (animationType == eDotAnimationType.CenterDot)
                { 
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

                    if (textAnimationType == eTextAnimationType.BottomLeftTo01) { 
                        // --from left to 0
                        ((CompositeTransform)lblLine1.RenderTransform).TranslateX = -73;
                        ((DoubleAnimationUsingKeyFrames)sbAnimateText.Children[0]).KeyFrames[0].Value = -73;
                        ((DoubleAnimationUsingKeyFrames)sbAnimateText.Children[0]).KeyFrames[1].Value = 0;
                    }
                    else if (textAnimationType == eTextAnimationType.BottomRightTo01)
                    {
                        // --from right to 0
                        ((CompositeTransform)lblLine1.RenderTransform).TranslateX = this.ActualWidth + 73;
                        ((DoubleAnimationUsingKeyFrames)sbAnimateText.Children[0]).KeyFrames[0].Value = this.ActualWidth + 73;
                        ((DoubleAnimationUsingKeyFrames)sbAnimateText.Children[0]).KeyFrames[1].Value = 0;
                    }


                    //animateicon
                    ((DoubleAnimationUsingKeyFrames)sbAnimateIconIn.Children[0]).KeyFrames[0].Value = this.ActualWidth * -1;
                    ((DoubleAnimationUsingKeyFrames)sbAnimateIconIn.Children[2]).KeyFrames[1].Value = iconScale;
                    ((DoubleAnimationUsingKeyFrames)sbAnimateIconIn.Children[3]).KeyFrames[1].Value = iconScale;


                    //background image
                    InitBackgroundImage(backgroundImageAnimationType);
                    
                }

                hasInitialized = true;
            }


            if (animationType == eDotAnimationType.CenterDot)
            {
                if (isDotShowing) { 
                    sbShrinkDot.Begin(); 
                    sbAnimateText.Stop(); 
                    sbAnimateLayoutOut.Begin(); 
                    sbAnimateIconOut.Begin();
                    sbAnimateBackgroundOut.Begin();

                    if (backgroundImageAnimationType == eBackgroundImageAnimationType.BottomToTop) sbRotateBackgroundImage.Stop();
                    else if (backgroundImageAnimationType == eBackgroundImageAnimationType.Pan1) sbPanBackgroundImage1.Stop();
                    else if (backgroundImageAnimationType == eBackgroundImageAnimationType.Pan2) sbPanBackgroundImage2.Stop();
                    
                }
                else { 
                    sbGrowDot.Begin(); 
                    sbAnimateText.Begin(); 
                    sbAnimateLayoutIn.Begin(); 
                    sbAnimateIconIn.Begin();
                    sbAnimateBackgroundIn.Begin();

                    sbAnimateBackgroundIn.Completed += (o,e) => {

                        if (backgroundImageAnimationType == eBackgroundImageAnimationType.BottomToTop) sbRotateBackgroundImage.Begin();
                        else if (backgroundImageAnimationType == eBackgroundImageAnimationType.Pan1) sbPanBackgroundImage1.Begin();
                        else if (backgroundImageAnimationType == eBackgroundImageAnimationType.Pan2) sbPanBackgroundImage2.Begin();
                    };
                }

                isDotShowing = !isDotShowing;
            }



        }

        private void InitBackgroundImage(eBackgroundImageAnimationType backgroundImageAnimationType)
        {

            if (backgroundImageAnimationType == eBackgroundImageAnimationType.BottomToTop)
            {
                ((CompositeTransform)imgBackground1.RenderTransform).TranslateY = 0;
                ((CompositeTransform)imgBackground2.RenderTransform).TranslateY = this.ActualHeight * -1;
                ((DoubleAnimationUsingKeyFrames)sbRotateBackgroundImage.Children[0]).KeyFrames[0].Value = this.ActualHeight;
                ((DoubleAnimationUsingKeyFrames)sbRotateBackgroundImage.Children[0]).KeyFrames[3].Value = this.ActualHeight * -1;
                ((DoubleAnimationUsingKeyFrames)sbRotateBackgroundImage.Children[0]).KeyFrames[4].Value = this.ActualHeight * -1;

                ((DoubleAnimationUsingKeyFrames)sbRotateBackgroundImage.Children[1]).KeyFrames[0].Value = this.ActualHeight * -1;
                ((DoubleAnimationUsingKeyFrames)sbRotateBackgroundImage.Children[1]).KeyFrames[1].Value = this.ActualHeight * 1;
            }
            else if (backgroundImageAnimationType == eBackgroundImageAnimationType.Pan1)
            {
                imgBackground1.Opacity = 1;
                imgBackground2.Opacity = 0;
                ((CompositeTransform)imgBackground1.RenderTransform).TranslateY = 0;
                ((CompositeTransform)imgBackground2.RenderTransform).TranslateY = 0;
            }
            else if (backgroundImageAnimationType == eBackgroundImageAnimationType.Pan2)
            {
                imgBackground1.Opacity = 0;
                imgBackground2.Opacity = 1;
                ((CompositeTransform)imgBackground1.RenderTransform).TranslateY = 0;
                ((CompositeTransform)imgBackground2.RenderTransform).TranslateY = 0;
            }
        }
    }
}
