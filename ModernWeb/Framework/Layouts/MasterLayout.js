var MasterLayout = (function () {
    function MasterLayout(UIRenderer, Debugger) {
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this._layoutControls = [];
        this._visualControls = [];
        this._toolbarControl = new ToolBarControl(UIRenderer, Debugger, "divToolBar");
        this._appbarControl = new AppBarControl(UIRenderer, Debugger, "divAppBar");
        this._loadingControl = new LoadingControl(UIRenderer, Debugger, "divLoading");
        this.ActHost = this.UIRenderer.LoadDiv("divActHost");
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
    MasterLayout.prototype.Show = function (appBarItemsData, toolBarItemsData) {
        this.Debugger.Log("MasterLayout:Show");
        this._appBarItemsData = appBarItemsData;
        this._toolBarItemsData = toolBarItemsData;
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
        this.ActHost.remove();
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
    MasterLayout.prototype.ShowToolBar = function (logoUrl, title, titleLength, backgroundColor) {
        this.Debugger.Log("MasterLayout:ShowToolBar");
        this._toolbarControl.InitConfig(logoUrl, title, titleLength, backgroundColor);
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
        if(event.data != null) {
            var parts = event.data.split("|");
            event.parent._ProcessActionSceneAct(parts[0], parts[1], event);
        }
    };
    MasterLayout.prototype._AppBarClicked = function (event) {
        event.parent.Debugger.Log("MasterLayout:_AppBarClicked " + event.data);
        if(event.data != null) {
            var parts = event.data.split("|");
            event.parent._ProcessActionSceneAct(parts[0], parts[1], event);
        }
    };
    MasterLayout.prototype._ProcessActionSceneAct = function (p1, p2, event) {
        event.parent.Debugger.Log("MasterLayout:_ProcessActionSceneAct p1=" + p1 + "  p2=" + p2);
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
                        _bootup.SceneManager.CurrentScene.ExecuteAction(event.data);
                        break;
                }
                break;
        }
    };
    MasterLayout.prototype.ExecuteAction = function (data) {
    };
    MasterLayout.prototype._InitializeToolbar = function () {
        this._toolbarControl.InitCallbacks({
            parent: this,
            data: null
        }, this._ToolbarClicked, null);
        if(this._toolBarItemsData != null) {
            var _self = this;
            $.each(this._toolBarItemsData.items, function (intIndex, objValue) {
                _self._toolbarControl.AddItem(objValue.id, objValue.text, objValue.data, objValue.style);
            });
        }
        this.ShowToolBar(this._toolBarItemsData.logoUrl, this._toolBarItemsData.title, this._toolBarItemsData.titleLength, this._toolBarItemsData.backgroundColor);
    };
    MasterLayout.prototype._InitializeAppbar = function () {
        this._appbarControl.InitCallbacks({
            parent: this,
            data: null
        }, this._AppBarClicked, null);
        if(this._appBarItemsData != null) {
            var _self = this;
            $.each(this._appBarItemsData, function (intIndex, objValue) {
                _self._appbarControl.AddItem(objValue.id, objValue.text, objValue.data, objValue.style);
            });
        }
    };
    MasterLayout.prototype._InitializeNotifications = function () {
        this._notifcationCenterControl.InitCallbacks(null, null, null);
    };
    return MasterLayout;
})();
