var MasterLayoutScene = (function () {
    function MasterLayoutScene(UIRenderer, Debugger) {
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this._toolbarControl = new ToolBarControl(UIRenderer, Debugger, "divToolBar");
        this._appbarControl = new AppBarControl(UIRenderer, Debugger, "divAppBar");
        this._loadingControl = new LoadingControl(UIRenderer, Debugger, "divLoading");
    }
    MasterLayoutScene.prototype.Start = function () {
        this.Debugger.Log("MasterLayoutScene:Start");
    };
    MasterLayoutScene.prototype.Stop = function () {
        this.Debugger.Log("MasterLayoutScene:Stop");
        this._appbarControl.Unload();
        this._toolbarControl.Unload();
    };
    MasterLayoutScene.prototype.Show = function () {
        this.Debugger.Log("MasterLayoutScene:Show");
        this._InitializeToolbar();
    };
    MasterLayoutScene.prototype.ShowLoading = function (message) {
        this.Debugger.Log("MasterLayoutScene:ShowLoading");
        this._loadingControl.Show(message);
    };
    MasterLayoutScene.prototype.HideLoading = function () {
        this.Debugger.Log("MasterLayoutScene:HideLoading");
        this._loadingControl.Hide();
    };
    MasterLayoutScene.prototype.ShowAppBar = function () {
        this.Debugger.Log("MasterLayoutScene:ShowAppBar");
        this._appbarControl.Show(this, this._AppBarClicked);
    };
    MasterLayoutScene.prototype.HideAppBar = function () {
        this.Debugger.Log("MasterLayoutScene:HideAppBar");
        this._appbarControl.Hide();
    };
    MasterLayoutScene.prototype.ShowToolBar = function () {
        this.Debugger.Log("MasterLayoutScene:ShowToolBar");
        this._toolbarControl.Show({
            parent: this,
            data: null
        }, this._ToolbarClicked);
    };
    MasterLayoutScene.prototype.HideToolBar = function () {
        this.Debugger.Log("MasterLayoutScene:HideToolBar");
        this._toolbarControl.Hide();
    };
    MasterLayoutScene.prototype._ToolbarClicked = function (event) {
        event.parent.Debugger.Log("MasterLayoutScene:_ToolbarClicked " + event.data);
        switch(event.data) {
            case "item1":
                break;
            case "item2":
                event.parent.ShowAppBar();
                break;
            case "item3":
                break;
            case "item4":
                break;
        }
    };
    MasterLayoutScene.prototype._AppBarClicked = function (event) {
        event.data.Debugger.Log("MasterLayoutScene:_AppBarClicked");
        event.data.HideAppBar();
        event.data.ShowToolBar();
    };
    MasterLayoutScene.prototype._InitializeToolbar = function () {
        this.ShowToolBar();
        this._toolbarControl.AddItem("tbi1", "ToobarItem 1", "item1");
        this._toolbarControl.AddItem("tbi2", "Show AppBar", "item2");
        this._toolbarControl.AddItem("tbi3", "ToobarItem 3", "item3");
        this._toolbarControl.AddItem("tbi4", "ToobarItem 4", "item4");
    };
    return MasterLayoutScene;
})();
