var SceneManager = (function () {
    function SceneManager(UIRenderer, Debugger) {
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.Debugger.Log("SceneManager:Constructor");
    }
    SceneManager.prototype.NavigateToScene = function (to) {
        this.Debugger.Log("SceneManager:NavigateToScene - " + to);
        if(this.CurrentScene != null) {
            this.CurrentScene.Stop();
            this.CurrentScene.Unload();
            this.CurrentScene = null;
        }
        var _self = this;
        $.getScript('/Framework/Scenes/' + to + '.js', function () {
            eval('_self.CurrentScene = new ' + to + '(_self.UIRenderer, _self.Debugger);_self._start();');
        });
    };
    SceneManager.prototype.NavigateToAct = function (to) {
        this.Debugger.Log("SceneManager:NavigateToAct - " + to);
        if(this.CurrentScene != null) {
            this.CurrentScene.Stop();
            this.CurrentScene.Unload();
            this.CurrentScene = null;
        }
        var _self = this;
        $.getScript('/Framework/Scenes/' + to + '.js', function () {
            eval('_self.CurrentScene = new ' + to + '(_self.UIRenderer, _self.Debugger);_self._start();');
        });
    };
    SceneManager.prototype._start = function () {
        this.Debugger.Log("SceneManager:Start");
        this.CurrentScene.Start();
        this.CurrentScene.ShowLoading("Loading...");
        var _self = this;
        setTimeout(function () {
            _self.CurrentScene.HideLoading();
            _self.CurrentScene.Show();
        }, 300);
    };
    SceneManager.prototype._stop = function () {
        this.Debugger.Log("SceneManager:Stop");
        this.CurrentScene.Stop();
    };
    SceneManager.prototype.Unload = function () {
        this.CurrentScene.Stop();
        this.CurrentScene.Unload();
    };
    return SceneManager;
})();
