var SceneManager = (function () {
    function SceneManager(UIRenderer, Debugger) {
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this._animationDurationMs = 450;
        this.Debugger.Log("SceneManager:Constructor");
    }
    SceneManager.prototype.NavigateToScene = function (to) {
        this.Debugger.Log("SceneManager:NavigateToScene - " + to);
        var _self = this;
        if(this.CurrentScene != null) {
            this.CurrentScene.HideAppBar();
            this.UIRenderer.RootUI.animate({
                opacity: 0,
                top: "-=100"
            }, this._animationDurationMs, function () {
                _self.CurrentScene.Stop();
                _self.CurrentScene.Unload();
                _self.CurrentScene = null;
                _self._loadScene(to, _self, true);
            });
        } else {
            this._loadScene(to, _self, false);
        }
    };
    SceneManager.prototype._loadScene = function (to, _self, showMainUI) {
        this.Debugger.Log("SceneManager:_loadScene - " + to);
        var parts;
        if(to.indexOf("|") > 1) {
            parts = to.split("|");
        } else {
            parts = [
                to, 
                ""
            ];
        }
        var url = '/Framework/Scenes/' + parts[1] + parts[0] + '.js';
        $.getScript(url, function () {
            eval('_self.CurrentScene = new ' + parts[0] + '(_self.UIRenderer, _self.Debugger);_self._start();');
            if(showMainUI) {
                _self.ShowMainUI(_self._animationDurationMs);
            }
        });
    };
    SceneManager.prototype.ShowMainUI = function (timeMs) {
        this.Debugger.Log("SceneManager:ShowMainUI - " + timeMs);
        this.UIRenderer.RootUI.animate({
            opacity: 1.0,
            top: "+=100"
        }, timeMs, function () {
        });
    };
    SceneManager.prototype.NavigateToAct = function (to) {
        this.Debugger.Log("SceneManager:NavigateToAct - " + to);
        var _self = this;
        if(this.CurrentScene != null) {
            this.CurrentScene.HideAppBar();
            this.UIRenderer.RootUI.animate({
                opacity: 0,
                left: "-=20"
            }, this._animationDurationMs, function () {
                _self.CurrentScene.Stop();
                _self.CurrentScene.Unload();
                _self.CurrentScene = null;
                _self._loadAct(to, _self, true);
            });
        }
    };
    SceneManager.prototype._loadAct = function (to, _self, showMainUI) {
        this.Debugger.Log("SceneManager:_loadAct - " + to);
        var parts;
        if(to.indexOf("|") > 1) {
            parts = to.split("|");
        } else {
            parts = [
                to, 
                ""
            ];
        }
        var url = '/Framework/Scenes/' + parts[1] + parts[0] + '.js';
        $.getScript(url, function () {
            eval('_self.CurrentScene = new ' + parts[0] + '(_self.UIRenderer, _self.Debugger);_self._start();');
            if(showMainUI) {
                _self.ShowActUI(_self._animationDurationMs);
            }
        });
    };
    SceneManager.prototype.ShowActUI = function (timeMs) {
        this.Debugger.Log("SceneManager:ShowActUI - " + timeMs);
        this.UIRenderer.RootUI.animate({
            opacity: 1.0,
            left: "+=20"
        }, timeMs, function () {
        });
    };
    SceneManager.prototype.NavigateToLocation = function (to) {
        this.Debugger.Log("SceneManager:NavigateToLocation - " + to);
        var _self = this;
        if(this.CurrentScene != null) {
            this.CurrentScene.HideAppBar();
            this.UIRenderer.RootUI.animate({
                opacity: 0,
                top: "-=20"
            }, this._animationDurationMs, function () {
                _self.CurrentScene.Stop();
                _self.CurrentScene.Unload();
                _self.CurrentScene = null;
                _self._loadLocation(to, _self, true);
            });
        }
    };
    SceneManager.prototype._loadLocation = function (to, _self, showMainUI) {
        this.Debugger.Log("SceneManager:_loadLocation - " + to);
        window.location.href = to;
    };
    SceneManager.prototype._start = function () {
        this.Debugger.Log("SceneManager:Start");
        this.CurrentScene.Start();
        this.CurrentScene.ShowLoading("Loading...");
        var _self = this;
        setTimeout(function () {
            _self.CurrentScene.HideLoading();
            _self.CurrentScene.Show([], [], {
            });
        }, 100);
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
