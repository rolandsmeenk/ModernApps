var MasterLayout = (function () {
    function MasterLayout(UIRenderer, Debugger) {
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this._layoutControls = [];
        this._visualControls = [];
        this._toolbarControl = new ToolBarControl(UIRenderer, Debugger, "divToolBar");
        this._appbarControl = new AppBarControl(UIRenderer, Debugger, "divAppBar");
        this._loadingControl = new LoadingControl(UIRenderer, Debugger, "divLoading");
        this._notifcationCenterControl = new NotificationCenterControl(UIRenderer, Debugger, "divNotifications", null);
        this._notifcationCenterControl.UpdateFromLayout($(window).width() - 280);
    }
    MasterLayout.prototype.AddLayoutControl = function (layoutControl) {
        this._layoutControls.push(layoutControl);
    };
    MasterLayout.prototype.AddVisualControl = function (visualControl) {
        this._visualControls.push(visualControl);
    };
    MasterLayout.prototype.Start = function () {
        this.Debugger.Log("MasterLayout:Start");
    };
    MasterLayout.prototype.Stop = function () {
        this.Debugger.Log("MasterLayout:Stop");
    };
    MasterLayout.prototype.Show = function () {
        this.Debugger.Log("MasterLayout:Show");
        this._InitializeToolbar();
        this._InitializeAppbar();
    };
    MasterLayout.prototype.Hide = function () {
    };
    MasterLayout.prototype.Unload = function () {
        this._appbarControl.Unload();
        this._toolbarControl.Unload();
        this._loadingControl.Unload();
        this._notifcationCenterControl.Unload();
    };
    MasterLayout.prototype.ShowLoading = function (message) {
        this.Debugger.Log("MasterLayout:ShowLoading");
        this._loadingControl.Show(message);
    };
    MasterLayout.prototype.HideLoading = function () {
        this.Debugger.Log("MasterLayout:HideLoading");
        this._loadingControl.Hide();
    };
    MasterLayout.prototype.ShowAppBar = function () {
        this.Debugger.Log("MasterLayout:ShowAppBar");
        this._appbarControl.Show(null);
    };
    MasterLayout.prototype.HideAppBar = function () {
        this.Debugger.Log("MasterLayout:HideAppBar");
        this._appbarControl.Hide();
    };
    MasterLayout.prototype.ShowToolBar = function () {
        this.Debugger.Log("MasterLayout:ShowToolBar");
        this._toolbarControl.Show(null);
    };
    MasterLayout.prototype.HideToolBar = function () {
        this.Debugger.Log("MasterLayout:HideToolBar");
        this._toolbarControl.Hide();
    };
    MasterLayout.prototype.RaiseNotification = function (id, message, durationMs) {
        this.Debugger.Log("MasterLayout:RaisNotification");
        this._notifcationCenterControl.Show(id, message, durationMs);
    };
    MasterLayout.prototype.CloseNotification = function (id) {
        this.Debugger.Log("MasterLayout:CloseNotification");
        this._notifcationCenterControl.UnloadItem(id);
    };
    MasterLayout.prototype.HideNotifications = function () {
        this.Debugger.Log("MasterLayout:Notifications");
        this._notifcationCenterControl.Hide();
    };
    MasterLayout.prototype._ToolbarClicked = function (event) {
        event.parent.Debugger.Log("MasterLayout:_ToolbarClicked " + event.data);
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
    MasterLayout.prototype._AppBarClicked = function (event) {
        event.parent.Debugger.Log("MasterLayout:_AppBarClicked " + event.data);
        switch(event.data) {
            case "item1":
                break;
            case "item2":
                event.parent.HideAppBar();
                break;
        }
    };
    MasterLayout.prototype._InitializeToolbar = function () {
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
    MasterLayout.prototype._InitializeAppbar = function () {
        this._appbarControl.InitCallbacks({
            parent: this,
            data: null
        }, this._AppBarClicked, null);
        this._appbarControl.AddItem("abi1", "AppbarItem 1", "item1");
        this._appbarControl.AddItem("abi2", "Close AppBar", "item2");
    };
    MasterLayout.prototype._InitializeNotifications = function () {
        this._notifcationCenterControl.InitCallbacks(null, null, null);
    };
    return MasterLayout;
})();
