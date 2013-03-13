var FrameworkControl = (function () {
    function FrameworkControl(UIRenderer, Debugger, UniqueID, ParentUniqueID) {
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this.ParentUniqueID = ParentUniqueID;
        if(this.ParentUniqueID != null) {
            this._rootDiv = this.UIRenderer.LoadDivInParent(this.UniqueID, this.ParentUniqueID);
        } else {
            this._rootDiv = this.UIRenderer.LoadDiv(this.UniqueID);
        }
    }
    FrameworkControl.prototype.InitCallbacks = function (parentObject, parentClickCallback, eventData) {
        this.Debugger.Log("FrameworkControl:InitCallbacks");
        this._parentObject = parentObject;
        this._parentClickCallback = parentClickCallback;
        this._eventData = eventData;
    };
    FrameworkControl.prototype.Show = function (parentObject, parentClickCallback, eventData) {
        var _this = this;
        this.Debugger.Log("FrameworkControl:Show - " + this.UniqueID);
        this.InitCallbacks(parentObject, parentClickCallback, eventData);
        this.UIRenderer.ShowDiv(this.UniqueID);
        if(this.ParentUniqueID != null) {
            this._rootDiv.off('click').on('click', this, function () {
                _this._parentObject.data = _this._eventData;
                _this._parentClickCallback(_this._parentObject);
            });
        } else {
            this._rootDiv.off('click').on('click', this._parentObject, this._parentClickCallback);
        }
    };
    FrameworkControl.prototype.Hide = function () {
        this.Debugger.Log("FrameworkControl:Hide");
        this.UIRenderer.HideDiv(this.UniqueID);
        this._rootDiv.off('click');
    };
    FrameworkControl.prototype.Unload = function () {
        this.Debugger.Log("FrameworkControl:Unload");
        this._rootDiv.off('click');
        this._rootDiv.remove();
    };
    FrameworkControl.prototype.UpdateContent = function (content) {
        this.Debugger.Log("FrameworkControl:UpdateContent");
        this._rootDiv.html(content);
    };
    FrameworkControl.prototype.TemporaryNotification = function (message, styleClass) {
        var loadingDiv = this.UIRenderer.LoadDivInParent(this.UniqueID + "_TemporaryNotification", this.UniqueID);
        loadingDiv.html(message);
        loadingDiv.addClass(styleClass);
    };
    FrameworkControl.prototype.ClearTemporaryNotification = function () {
        this.UIRenderer.UnloadDiv(this.UniqueID + "_TemporaryNotification");
    };
    FrameworkControl.prototype.Translate = function (x, y) {
        this.Debugger.Log("FrameworkControl:Translate x=" + x + " y=" + y);
        if(this._rootDiv != null) {
            this._rootDiv.css("left", parseFloat(this._rootDiv.css("left")) + x).css("top", parseFloat(this._rootDiv.css("top")) + y);
        }
    };
    FrameworkControl.prototype.ProcessActionSceneAct = function (data) {
        this.Debugger.Log("FrameworkControl:_ProcessActionSceneAct data - " + data);
        var p1;
        var p2;
        if(data != null) {
            var parts = data.split("|");
            p1 = parts[0];
            p2 = parts[1];
            switch(p1) {
                case "scene":
                    _bootup.SceneManager.NavigateToScene(p2);
                    break;
                case "act":
                    _bootup.SceneManager.NavigateToAct(p2);
                    break;
                case "action":
                    switch(p2) {
                        case "close appbar":
                            _bootup.SceneManager.CurrentScene.HideAppBar();
                            break;
                        case "open appbar":
                            _bootup.SceneManager.CurrentScene.ShowAppBar();
                            break;
                        case "execute":
                            _bootup.SceneManager.CurrentScene.ExecuteAction(data);
                            break;
                    }
                    break;
            }
        }
    };
    return FrameworkControl;
})();
