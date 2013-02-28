var SceneManager = (function () {
    function SceneManager(UIRenderer, Debugger) {
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.MasterLayoutScene = new MasterLayoutScene(UIRenderer, Debugger);
        this.Debugger.Log("SceneManager:Constructor");
    }
    SceneManager.prototype.Start = function () {
        this.Debugger.Log("SceneManager:Start");
        this.MasterLayoutScene.Start();
    };
    SceneManager.prototype.Stop = function () {
        this.Debugger.Log("SceneManager:Stop");
        this.MasterLayoutScene.Stop();
    };
    SceneManager.prototype.Unload = function () {
        this.MasterLayoutScene.Unload();
    };
    return SceneManager;
})();
