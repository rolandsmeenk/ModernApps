

namespace ModernCSApp.Views.Controls
{
    public interface IToolbarUserControl
    {
        void LoadControl(string aggregateId);
        void UnloadControl();
        bool EditingIsDisabled { get; set; }
    }
}
