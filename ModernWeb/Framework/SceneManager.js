var SceneManager = (function () {
    function SceneManager(UIRenderer, Debugger) {
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.CurrentScene = new DemoModernIFrame(UIRenderer, Debugger);
        this.Debugger.Log("SceneManager:Constructor");
    }
    SceneManager.prototype.Start = function () {
        this.Debugger.Log("SceneManager:Start");
        this.CurrentScene.Start();
    };
    SceneManager.prototype.Stop = function () {
        this.Debugger.Log("SceneManager:Stop");
        this.CurrentScene.Stop();
    };
    SceneManager.prototype.Unload = function () {
        this.CurrentScene.Unload();
    };
    return SceneManager;
})();
