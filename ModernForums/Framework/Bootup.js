var BootUp = (function () {
    function BootUp(theme, rootUI, headUI) {
        this.UIRenderer = new UIRenderer(rootUI, headUI);
        this.Debugger = new Debugger(this.UIRenderer, 20);
        this.Theme = new Theme(theme, this.UIRenderer, this.Debugger);
        this.LanguageResources = new LanguageResources();
        this.ScreenManager = new ScreenManager(this.UIRenderer, this.Debugger);
        this.AssetLoader = new AssetLoader();
        this.DataLoader = new DataLoader(this.Debugger);
        this.UsageStats = new UsageStats();
    }
    BootUp.prototype.Start = function () {
        this.Debugger.Start();
        this.Debugger.Log("BootUp:Start");
        this.ScreenManager.MasterLayoutScreen.ShowLoading("Loading...");
        this.ScreenManager.Start();
        this.DataLoader.RetrieveData("GetForums", "POST", {
            id: 100
        }, "html", function (result) {
            _bootup.ScreenManager.MasterLayoutScreen.HideLoading();
            _bootup.ScreenManager.MasterLayoutScreen.Show();
        });
    };
    BootUp.prototype.Stop = function () {
        this.Debugger.Log("BootUp:Stop");
        this.Debugger.Stop();
        this.ScreenManager.Stop();
    };
    return BootUp;
})();
window.onload = StartBootup;
window.onunload = StopBootup;
var _bootup;
function StartBootup() {
    _bootup = new BootUp("Black-Magic", $("#divRootUI"), $('head'));
    _bootup.Start();
}
function StopBootup() {
    _bootup.Stop();
}
