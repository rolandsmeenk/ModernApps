var MasterLayoutScene = (function () {
    function MasterLayoutScene(UIRenderer, Debugger) {
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this._toolbarControl = new ToolBarControl(UIRenderer, Debugger, "divToolBar");
        this._appbarControl = new AppBarControl(UIRenderer, Debugger, "divAppBar");
        this._loadingControl = new LoadingControl(UIRenderer, Debugger, "divLoading");
        this._verticalDividerControl = new VerticalDividerControl(UIRenderer, Debugger, "divVerticalDivider", null);
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
        this._InitializeAppbar();
        this._IntializeVerticalDivider();
    };
    MasterLayoutScene.prototype.Unload = function () {
        this._appbarControl.Unload();
        this._toolbarControl.Unload();
        this._verticalDividerControl.Unload();
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
        this._appbarControl.Show(null);
    };
    MasterLayoutScene.prototype.HideAppBar = function () {
        this.Debugger.Log("MasterLayoutScene:HideAppBar");
        this._appbarControl.Hide();
    };
    MasterLayoutScene.prototype.ShowToolBar = function () {
        this.Debugger.Log("MasterLayoutScene:ShowToolBar");
        this._toolbarControl.Show(null);
    };
    MasterLayoutScene.prototype.HideToolBar = function () {
        this.Debugger.Log("MasterLayoutScene:HideToolBar");
        this._toolbarControl.Hide();
    };
    MasterLayoutScene.prototype.ShowVerticalDivider = function () {
        this.Debugger.Log("MasterLayoutScene:ShowVerticalDivider");
        this._verticalDividerControl.Show(null);
    };
    MasterLayoutScene.prototype.HideVerticalDivider = function () {
        this.Debugger.Log("MasterLayoutScene:HideVerticalDivider");
        this._verticalDividerControl.Hide();
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
        event.parent.Debugger.Log("MasterLayoutScene:_AppBarClicked " + event.data);
        switch(event.data) {
            case "item1":
                break;
            case "item2":
                event.parent.HideAppBar();
                break;
        }
    };
    MasterLayoutScene.prototype._InitializeToolbar = function () {
        this._toolbarControl.InitCallbacks({
            parent: this,
            data: null
        }, this._ToolbarClicked, null);
        this._toolbarControl.AddItem("tbi1", "ToolbarItem 1", "item1");
        this._toolbarControl.AddItem("tbi2", "Show AppBar", "item2");
        this._toolbarControl.AddItem("tbi3", "ToolbarItem 3", "item3");
        this._toolbarControl.AddItem("tbi4", "ToolbarItem 4", "item4");
        this.ShowToolBar();
    };
    MasterLayoutScene.prototype._InitializeAppbar = function () {
        this._appbarControl.InitCallbacks({
            parent: this,
            data: null
        }, this._AppBarClicked, null);
        this._appbarControl.AddItem("abi1", "AppbarItem 1", "item1");
        this._appbarControl.AddItem("abi2", "Close AppBar", "item2");
    };
    MasterLayoutScene.prototype._IntializeVerticalDivider = function () {
        this._verticalDividerControl.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this.ShowVerticalDivider();
    };
    return MasterLayoutScene;
})();
