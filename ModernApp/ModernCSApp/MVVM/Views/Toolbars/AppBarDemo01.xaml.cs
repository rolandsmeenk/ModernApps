using ModernCSApp.Views.Controls;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;


namespace ModernCSApp.Views.Toolbars
{
    public sealed partial class AppBarDemo01 : BaseUserControl, IToolbarUserControl
    {
        public AppBarDemo01()
        {
            this.InitializeComponent();
        }

        public void LoadControl(string aggregateId)
        {
            throw new NotImplementedException();
        }

        public bool EditingIsDisabled
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }

        
    }

    //public class ResizeableGridView : GridView
    //{
    //    protected override void PrepareContainerForItemOverride(Windows.UI.Xaml.DependencyObject element, object item)
    //    {
    //        try
    //        {
    //            dynamic _Item = item;
    //            element.SetValue(Windows.UI.Xaml.Controls.VariableSizedWrapGrid.ColumnSpanProperty, _Item.ColSpan);
    //            element.SetValue(Windows.UI.Xaml.Controls.VariableSizedWrapGrid.RowSpanProperty, _Item.RowSpan);
    //        }
    //        catch
    //        {
    //            element.SetValue(Windows.UI.Xaml.Controls.VariableSizedWrapGrid.ColumnSpanProperty, 1);
    //            element.SetValue(Windows.UI.Xaml.Controls.VariableSizedWrapGrid.RowSpanProperty, 1);
    //        }
    //        finally
    //        {
    //            base.PrepareContainerForItemOverride(element, item);
    //        }
    //    }
    //}


}
