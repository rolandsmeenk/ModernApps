var MasterLayoutScreen = (function () {
    function MasterLayoutScreen(UIRenderer, Debugger) {
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this._toolbarControl = new ToolBarControl(UIRenderer, Debugger, "divToolBar");
        this._appbarControl = new AppBarControl(UIRenderer, Debugger, "divAppBar");
        this._loadingControl = new LoadingControl(UIRenderer, Debugger, "divLoading");
    }
    MasterLayoutScreen.prototype.Start = function () {
        this.Debugger.Log("MasterLayoutScreen:Start");
    };
    MasterLayoutScreen.prototype.Stop = function () {
        this.Debugger.Log("MasterLayoutScreen:Stop");
        this._appbarControl.Unload();
        this._toolbarControl.Unload();
    };
    MasterLayoutScreen.prototype.Show = function () {
        this.Debugger.Log("MasterLayoutScreen:Show");
        this.ShowToolBar();
        this._toolbarControl.AddItem("tbi1", "Item 1");
    };
    MasterLayoutScreen.prototype.ShowLoading = function (message) {
        this.Debugger.Log("MasterLayoutScreen:ShowLoading");
        this._loadingControl.Show(message);
    };
    MasterLayoutScreen.prototype.HideLoading = function () {
        this.Debugger.Log("MasterLayoutScreen:HideLoading");
        this._loadingControl.Hide();
    };
    MasterLayoutScreen.prototype.ShowAppBar = function () {
        this.Debugger.Log("MasterLayoutScreen:ShowAppBar");
        this._appbarControl.Show(this, this._AppBarClicked);
    };
    MasterLayoutScreen.prototype.HideAppBar = function () {
        this.Debugger.Log("MasterLayoutScreen:HideAppBar");
        this._appbarControl.Hide();
    };
    MasterLayoutScreen.prototype.ShowToolBar = function () {
        this.Debugger.Log("MasterLayoutScreen:ShowToolBar");
        this._toolbarControl.Show(this, this._ToolbarClicked);
    };
    MasterLayoutScreen.prototype.HideToolBar = function () {
        this.Debugger.Log("MasterLayoutScreen:HideToolBar");
        this._toolbarControl.Hide();
    };
    MasterLayoutScreen.prototype._ToolbarClicked = function (event) {
        event.data.Debugger.Log("MasterLayoutScreen:_ToolbarClicked");
    };
    MasterLayoutScreen.prototype._AppBarClicked = function (event) {
        event.data.Debugger.Log("MasterLayoutScreen:_AppBarClicked");
        event.data.HideAppBar();
        event.data.ShowToolBar();
    };
    return MasterLayoutScreen;
})();
