var MasterLayout = (function () {
    function MasterLayout(UIRenderer, Debugger) {
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this._layoutControls = [];
        this._visualControls = [];
        this._appbarControl = new AppBarControl(UIRenderer, Debugger, "divAppBar");
        this._toolbarControl = new ToolBarControl(UIRenderer, Debugger, "divToolBar");
        this._appbarUsersControl = new AppBarUsersControl(UIRenderer, Debugger, "divAppBarUsers");
        this._appbarProjectsControl = new AppBarProjectsControl(UIRenderer, Debugger, "divAppBarProjects");
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
    MasterLayout.prototype.Show = function (appBarItemsData, toolBarItemsData, settingsData) {
        this.Debugger.Log("MasterLayout:Show");
        this._appBarItemsData = appBarItemsData;
        this._toolBarItemsData = toolBarItemsData;
        this._settingsData = eval(settingsData);
        this._InitializeToolbar();
        this._InitializeAppbar();
        this._InitializeAppbarUsers();
        this._InitializeAppbarProjects();
        _bootup.Theme.AccentColor1 = this.GetSetting("accent1");
        _bootup.Theme.AccentColor2 = this.GetSetting("accent2");
        _bootup.Theme.AccentColor3 = this.GetSetting("accent3");
        _bootup.Theme.AccentColor4 = this.GetSetting("accent4");
        _bootup.Theme.BackgroundColor = this.GetSetting("backgroundColor");
        _bootup.Theme.ForegroundColor = this.GetSetting("foregroundColor");
    };
    MasterLayout.prototype.Hide = function () {
    };
    MasterLayout.prototype.Unload = function () {
        this._appbarControl.Unload();
        this._toolbarControl.Unload();
        this._loadingControl.Unload();
        this._notifcationCenterControl.Unload();
        this._appbarUsersControl.Unload();
        this._appbarProjectsControl.Unload();
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
        if (this._appbarUsersControl.IsShowing) {
            this._appbarUsersControl.Hide();
        }
        if (this._appbarProjectsControl.IsShowing) {
            this._appbarProjectsControl.Hide();
        }
        if (this._appbarControl.IsShowing) {
            this._appbarControl.Hide();
        } else {
            this._appbarControl.Show(null);
        }
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
    MasterLayout.prototype.ShowAppBarUsers = function () {
        this.Debugger.Log("MasterLayout:ShowAppBarUsers");
        if (this._appbarControl.IsShowing) {
            this._appbarControl.Hide();
        }
        if (this._appbarProjectsControl.IsShowing) {
            this._appbarProjectsControl.Hide();
        }
        if (this._appbarUsersControl.IsShowing) {
            this._appbarUsersControl.Hide();
        } else {
            this._appbarUsersControl.Show(null);
        }
    };
    MasterLayout.prototype.HideAppBarUsers = function () {
        this.Debugger.Log("MasterLayout:HideAppBarUsers");
        this._appbarUsersControl.Hide();
    };
    MasterLayout.prototype.ShowAppBarProjects = function () {
        this.Debugger.Log("MasterLayout:ShowAppBarProjects");
        if (this._appbarControl.IsShowing) {
            this._appbarControl.Hide();
        }
        if (this._appbarUsersControl.IsShowing) {
            this._appbarUsersControl.Hide();
        }
        if (this._appbarProjectsControl.IsShowing) {
            this._appbarProjectsControl.Hide();
        } else {
            this._appbarProjectsControl.Show(null);
        }
    };
    MasterLayout.prototype.HideAppBarProjects = function () {
        this.Debugger.Log("MasterLayout:HideAppBarProjects");
        this._appbarProjectsControl.Hide();
    };
    MasterLayout.prototype._ToolbarClicked = function (event) {
        event.parent.Debugger.Log("MasterLayout:_ToolbarClicked " + event.data);
        if (event.data != null) {
            var parts = event.data.split("|");
            event.parent._ProcessActionSceneAct(parts[0], parts[1], event);
        }
    };
    MasterLayout.prototype._AppBarClicked = function (event) {
        event.parent.Debugger.Log("MasterLayout:_AppBarClicked " + event.data);
        if (event.data != null) {
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
            case "scene2":
                var parts = event.data.split("|");
                _bootup.SceneManager.NavigateToScene(p2 + "|" + parts[2]);
                break;
            case "act":
                _bootup.SceneManager.NavigateToAct(p2);
                break;
            case "act2":
                var parts = event.data.split("|");
                _bootup.SceneManager.NavigateToAct(p2 + "|" + parts[2]);
                break;
            case "action":
                switch(p2) {
                    case "close appbar":
                        _bootup.SceneManager.CurrentScene.HideAppBar();
                        break;
                    case "close appbar users":
                        _bootup.SceneManager.CurrentScene.HideAppBarUsers();
                        break;
                    case "close appbar projects":
                        _bootup.SceneManager.CurrentScene.HideAppBarProjects();
                        break;
                    case "open appbar":
                        _bootup.SceneManager.CurrentScene.ShowAppBar();
                        break;
                    case "open appbar users":
                        _bootup.SceneManager.CurrentScene.ShowAppBarUsers();
                        break;
                    case "open appbar projects":
                        _bootup.SceneManager.CurrentScene.ShowAppBarProjects();
                        break;
                    case "execute":
                        _bootup.SceneManager.CurrentScene.ExecuteAction(event.data);
                        break;
                    case "execute parent":
                        var parts = event.data.split("|");
                        var wp = window.parent;
                        wp._bootup.SceneManager.CurrentScene.ExecuteAction("execute|action|" + parts[2]);
                        break;
                }
                break;
        }
    };
    MasterLayout.prototype._AppBarUsersClicked = function (event) {
        event.parent.Debugger.Log("MasterLayout:_AppBarUsersClicked " + event.data);
    };
    MasterLayout.prototype._AppBarProjectsClicked = function (event) {
        event.parent.Debugger.Log("MasterLayout:_AppBarProjectsClicked " + event.data);
    };
    MasterLayout.prototype._InitializeToolbar = function () {
        this._toolbarControl.InitCallbacks({
            parent: this,
            data: null
        }, this._ToolbarClicked, null);
        if (this._toolBarItemsData != null) {
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
        if (this._appBarItemsData != null) {
            var _self = this;
            $.each(this._appBarItemsData, function (intIndex, objValue) {
                _self._appbarControl.AddItem(objValue.id, objValue.text, objValue.data, objValue.style);
            });
        }
    };
    MasterLayout.prototype._InitializeNotifications = function () {
        this._notifcationCenterControl.InitCallbacks(null, null, null);
    };
    MasterLayout.prototype._InitializeAppbarUsers = function () {
        this._appbarUsersControl.InitCallbacks({
            parent: this,
            data: null
        }, this._AppBarUsersClicked, null);
    };
    MasterLayout.prototype._InitializeAppbarProjects = function () {
        this._appbarProjectsControl.InitCallbacks({
            parent: this,
            data: null
        }, this._AppBarProjectsClicked, null);
    };
    MasterLayout.prototype.ExecuteAction = function (data) {
        this.Debugger.Log("MasterLayout:ExecuteAction " + data);
    };
    MasterLayout.prototype.GetSetting = function (key) {
        this.Debugger.Log("MasterLayout:GetSetting " + key);
        var ret = eval("this._settingsData." + key);
        return ret;
    };
    MasterLayout.prototype.GetQueryStringParams = function () {
        var parts = {
            "Page": "",
            "MsgId": "",
            "GroupId": "",
            "UserName": "",
            "UserId": "",
            "ProjectCode": "",
            "ProjectName": ""
        };
        var foundPage = this.GetQueryVariable("pg");
        var foundMsgId = this.GetQueryVariable("msgid");
        var foundGroupId = this.GetQueryVariable("gid");
        var foundUserId = this.GetQueryVariable("uid");
        var foundUserName = this.GetQueryVariable("un");
        var foundProjectCode = this.GetQueryVariable("prjc");
        var foundProjectName = this.GetQueryVariable("prjn");
        parts.Page = foundPage;
        parts.MsgId = foundMsgId;
        parts.GroupId = foundGroupId;
        parts.UserId = foundUserId;
        parts.UserName = foundUserName;
        parts.ProjectCode = foundProjectCode;
        parts.ProjectName = foundProjectName;
        return parts;
    };
    MasterLayout.prototype.GenerateQueryString = function (QueryStringParams) {
        var qs = "";
        if (QueryStringParams.Page != undefined) {
            qs += "&pg=" + QueryStringParams.Page;
        }
        if (QueryStringParams.MsgId != undefined) {
            qs += "&msgid=" + QueryStringParams.MsgId;
        }
        if (QueryStringParams.GroupId != undefined) {
            qs += "&gid=" + QueryStringParams.GroupId;
        }
        if (QueryStringParams.UserId != undefined) {
            qs += "&uid=" + QueryStringParams.UserId;
        }
        if (QueryStringParams.UserName != undefined) {
            qs += "&un=" + QueryStringParams.UserName;
        }
        if (QueryStringParams.ProjectCode != undefined) {
            qs += "&prjc=" + QueryStringParams.ProjectCode;
        }
        if (QueryStringParams.ProjectName != undefined) {
            qs += "&prjn=" + QueryStringParams.ProjectName;
        }
        return qs;
    };
    MasterLayout.prototype.GetQueryVariable = function (variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for(var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
    };
    MasterLayout.prototype.GetCompanyLogo = function (code) {
        var logoUrl = code;
        logoUrl = logoUrl == undefined ? "/Content/Reader/logos/10.png" : "/Content/Reader/logos/" + logoUrl + ".png";
        var logoStyle = "";
        switch(code) {
            case "10":
                logoStyle = "width:45px;height:45px;";
                break;
            case "20":
                logoStyle = "width:45px;height:45px;";
                break;
            case "30":
                logoStyle = "width:45px;height:45px;";
                break;
            case "40":
                logoStyle = "width:45px;height:45px;";
                break;
            default:
                logoStyle = "width:45px;height:45px;";
                break;
        }
        return {
            "code": code,
            "logoUrl": logoUrl,
            "logoStyle": logoStyle
        };
    };
    MasterLayout.prototype.CancelWindowEvent = function () {
        try  {
            var e = window.event;
            if (!e) {
                e = window.event;
            }
            if (e) {
                e.returnValue = false;
                e.cancelBubble = true;
            }
        } catch (c) {
        }
    };
    return MasterLayout;
})();
