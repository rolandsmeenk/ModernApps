var SceneManager = (function () {
    function SceneManager(UIRenderer, Debugger) {
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.MasterLayoutScreen = new MasterLayoutScreen(UIRenderer, Debugger);
        this.Debugger.Log("SceneManager:Constructor");
    }
    SceneManager.prototype.Start = function () {
        this.Debugger.Log("SceneManager:Start");
        this.MasterLayoutScreen.Start();
    };
    SceneManager.prototype.Stop = function () {
        this.Debugger.Log("SceneManager:Stop");
        this.MasterLayoutScreen.Stop();
    };
    return SceneManager;
})();
