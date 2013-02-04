var ScreenManager = (function () {
    function ScreenManager(UIRenderer, Debugger) {
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.MasterLayoutScreen = new MasterLayoutScreen(UIRenderer, Debugger);
        this.Debugger.Log("ScreenManager:Constructor");
    }
    ScreenManager.prototype.Start = function () {
        this.Debugger.Log("ScreenManager:Start");
        this.MasterLayoutScreen.Start();
    };
    ScreenManager.prototype.Stop = function () {
        this.Debugger.Log("ScreenManager:Stop");
        this.MasterLayoutScreen.Stop();
    };
    return ScreenManager;
})();
