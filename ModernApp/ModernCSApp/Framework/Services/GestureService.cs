
using ModernCSApp.Views;
using Windows.UI.Xaml.Input;
namespace ModernCSApp.Services
{
    public class GestureService
    {

        private static GestureService Instance = new GestureService();


        private GestureService()
        {


        }

        public static void Init()
        {
            

        }
        private static Windows.UI.Input.GestureRecognizer _gr;

        public static void Start(BaseUserPage pageWithPointerEventsToRegister)
        {
            if (pageWithPointerEventsToRegister == null) return;

            pageWithPointerEventsToRegister.PointerPressed += page_PointerPressed;
            pageWithPointerEventsToRegister.PointerMoved += page_PointerMoved;
            pageWithPointerEventsToRegister.PointerReleased += page_PointerReleased;


            _gr = new Windows.UI.Input.GestureRecognizer();
            _gr.CrossSliding += gr_CrossSliding;
            _gr.Dragging += gr_Dragging;
            _gr.Holding += gr_Holding;
            _gr.ManipulationCompleted += gr_ManipulationCompleted;
            _gr.ManipulationInertiaStarting += gr_ManipulationInertiaStarting;
            _gr.ManipulationStarted += gr_ManipulationStarted;
            _gr.ManipulationUpdated += gr_ManipulationUpdated;
            _gr.RightTapped += gr_RightTapped;
            _gr.Tapped += gr_Tapped;
            _gr.GestureSettings = 
                Windows.UI.Input.GestureSettings.ManipulationRotate 
                | Windows.UI.Input.GestureSettings.ManipulationTranslateX 
                | Windows.UI.Input.GestureSettings.ManipulationTranslateY 
                | Windows.UI.Input.GestureSettings.ManipulationScale 
                | Windows.UI.Input.GestureSettings.ManipulationRotateInertia 
                | Windows.UI.Input.GestureSettings.ManipulationScaleInertia 
                | Windows.UI.Input.GestureSettings.ManipulationTranslateInertia 
                | Windows.UI.Input.GestureSettings.Tap
                | Windows.UI.Input.GestureSettings.CrossSlide
                ;


        }

        public static void Stop(BaseUserPage pageWithPointerEventsToUnRegister)
        {
            if (pageWithPointerEventsToUnRegister == null) return;

            if (_gr != null)
            {
                _gr.CrossSliding -= gr_CrossSliding;
                _gr.Dragging -= gr_Dragging;
                _gr.Holding -= gr_Holding;
                _gr.ManipulationCompleted -= gr_ManipulationCompleted;
                _gr.ManipulationInertiaStarting -= gr_ManipulationInertiaStarting;
                _gr.ManipulationStarted -= gr_ManipulationStarted;
                _gr.ManipulationUpdated -= gr_ManipulationUpdated;
                _gr.RightTapped -= gr_RightTapped;
                _gr.Tapped -= gr_Tapped;

                pageWithPointerEventsToUnRegister.PointerPressed -= page_PointerPressed;
                pageWithPointerEventsToUnRegister.PointerMoved -= page_PointerMoved;
                pageWithPointerEventsToUnRegister.PointerReleased -= page_PointerReleased;
            }
        }


        static void gr_Tapped(Windows.UI.Input.GestureRecognizer sender, Windows.UI.Input.TappedEventArgs args)
        {
            //Debug.WriteLine("gr_Tapped");
        }
        static void gr_RightTapped(Windows.UI.Input.GestureRecognizer sender, Windows.UI.Input.RightTappedEventArgs args)
        {
            //Debug.WriteLine("gr_RightTapped");
        }
        static void gr_Holding(Windows.UI.Input.GestureRecognizer sender, Windows.UI.Input.HoldingEventArgs args)
        {
            //Debug.WriteLine("gr_Holding");
        }
        static void gr_Dragging(Windows.UI.Input.GestureRecognizer sender, Windows.UI.Input.DraggingEventArgs args)
        {
            //Debug.WriteLine("gr_Dragging");
        }
        static void gr_CrossSliding(Windows.UI.Input.GestureRecognizer sender, Windows.UI.Input.CrossSlidingEventArgs args)
        {
            //Debug.WriteLine("gr_CrossSliding");
        }
        static void gr_ManipulationUpdated(Windows.UI.Input.GestureRecognizer sender, Windows.UI.Input.ManipulationUpdatedEventArgs args)
        {
            //Debug.WriteLine("gr_ManipulationUpdated");
        }
        static void gr_ManipulationStarted(Windows.UI.Input.GestureRecognizer sender, Windows.UI.Input.ManipulationStartedEventArgs args)
        {
            //Debug.WriteLine("gr_ManipulationStarted");
        }
        static void gr_ManipulationCompleted(Windows.UI.Input.GestureRecognizer sender, Windows.UI.Input.ManipulationCompletedEventArgs args)
        {
            //Debug.WriteLine("gr_ManipulationCompleted");
        }
        static void gr_ManipulationInertiaStarting(Windows.UI.Input.GestureRecognizer sender, Windows.UI.Input.ManipulationInertiaStartingEventArgs args)
        {
            //Debug.WriteLine("gr_ManipulationInertiaStarting");
        }

        static void page_PointerReleased(object sender, PointerRoutedEventArgs e)
        {
            var ps = e.GetIntermediatePoints(null);
            if (ps != null && ps.Count > 0)
            {
                _gr.ProcessUpEvent(ps[0]);
                e.Handled = true;
                _gr.CompleteGesture();
            }
        }

        static void page_PointerMoved(object sender, PointerRoutedEventArgs e)
        {
            _gr.ProcessMoveEvents(e.GetIntermediatePoints(null));
            e.Handled = true;
        }

        static void page_PointerPressed(object sender, PointerRoutedEventArgs e)
        {
            var ps = e.GetIntermediatePoints(null);
            if (ps != null && ps.Count > 0)
            {
                _gr.ProcessDownEvent(ps[0]);
                e.Handled = true;
            }
        }

    }
}
