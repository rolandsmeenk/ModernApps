var BootUp = (function () {
    function BootUp(theme, rootUI, headUI) {
        this.UIRenderer = new UIRenderer(rootUI, headUI);
        this.Debugger = new Debugger(this.UIRenderer, 40);
        this.Theme = new Theme(theme, this.UIRenderer, this.Debugger);
        this.LanguageResources = new LanguageResources();
        this.SceneManager = new SceneManager(this.UIRenderer, this.Debugger);
        this.AssetLoader = new AssetLoader();
        this.DataLoader = new DataLoader(this.Debugger);
        this.UsageStats = new UsageStats();
    }
    BootUp.prototype.Start = function () {
        this.Debugger.Start();
        this.Debugger.Log("BootUp:Start");
        this.SceneManager.CurrentScene.ShowLoading("Loading...");
        this.SceneManager.Start();
        setTimeout(function () {
            _bootup.SceneManager.CurrentScene.HideLoading();
            _bootup.SceneManager.CurrentScene.Show();
        }, 300);
    };
    BootUp.prototype.Stop = function () {
        this.Debugger.Log("BootUp:Stop");
        this.Debugger.Stop();
        this.SceneManager.Stop();
    };
    BootUp.prototype.Unload = function () {
        this.Debugger.Log("BootUp:Unload");
        this.SceneManager.Unload();
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
    _bootup.Unload();
}
