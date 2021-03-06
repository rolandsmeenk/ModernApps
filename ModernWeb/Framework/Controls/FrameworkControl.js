var FrameworkControl = (function () {
    function FrameworkControl(UIRenderer, Debugger, UniqueID, ParentUniqueID) {
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this.ParentUniqueID = ParentUniqueID;
        if (this.ParentUniqueID != null) {
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
        if (this.ParentUniqueID != null) {
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
        if (this._rootDiv != null) {
            this._rootDiv.css("left", parseFloat(this._rootDiv.css("left")) + x).css("top", parseFloat(this._rootDiv.css("top")) + y);
        }
    };
    FrameworkControl.prototype.ProcessActionSceneAct = function (data) {
        this.Debugger.Log("FrameworkControl:_ProcessActionSceneAct data - " + data);
        var p1;
        var p2;
        if (data != null) {
            var parts = data.split("|");
            p1 = parts[0];
            p2 = parts[1];
            switch(p1) {
                case "scene":
                    _bootup.SceneManager.NavigateToScene(p2);
                    break;
                case "scene2":
                    var url = "";
                    var qsp = this._getQueryStringParams();
                    qsp.Page = p2 + "|" + parts[2];
                    var qs = this._generateQueryString(qsp);
                    url = "http://" + document.location.host + "?" + qs;
                    _bootup.SceneManager.NavigateToScene(url);
                    break;
                case "act":
                    _bootup.SceneManager.NavigateToAct(p2);
                    break;
                case "act2":
                    var url = "";
                    var qsp = this._getQueryStringParams();
                    qsp.Page = p2 + "|" + parts[2];
                    var qs = this._generateQueryString(qsp);
                    url = "http://" + document.location.host + "?" + qs;
                    _bootup.SceneManager.NavigateToScene(url);
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
                            _bootup.SceneManager.CurrentScene.ExecuteAction(data);
                            break;
                        case "execute parent":
                            var wp = window.parent;
                            wp._bootup.SceneManager.CurrentScene.ExecuteAction(parts[2]);
                            break;
                        case "support":
                            break;
                        case "change user":
                            _bootup.SceneManager.CurrentScene.HideAppBarUsers();
                            var url = "";
                            var qsp = this._getQueryStringParams();
                            qsp.GroupId = parts[2];
                            qsp.UserName = parts[3];
                            qsp.UserId = parts[4];
                            var qs = this._generateQueryString(qsp);
                            url = "http://" + document.location.host + "?" + qs;
                            _bootup.SceneManager.NavigateToLocation(url);
                            break;
                        case "change project":
                            _bootup.SceneManager.CurrentScene.HideAppBarProjects();
                            var url = "";
                            var qsp = this._getQueryStringParams();
                            qsp.ProjectCode = parts[2];
                            qsp.ProjectName = parts[3];
                            var qs = this._generateQueryString(qsp);
                            url = "http://" + document.location.host + "?" + qs;
                            _bootup.SceneManager.NavigateToLocation(url);
                            break;
                        case "location":
                            var url = "";
                            var qsp = this._getQueryStringParams();
                            qsp.Page = parts[2];
                            qsp.MsgId = parts[3];
                            var qs = this._generateQueryString(qsp);
                            url = "http://" + document.location.host + "?" + qs;
                            window.open(url, "_blank");
                            break;
                        case "location2":
                            var url = "";
                            var qsp = this._getQueryStringParams();
                            qsp.Page = parts[2] + "|" + parts[3];
                            qsp.MsgId = parts[4];
                            var qs = this._generateQueryString(qsp);
                            url = "http://" + document.location.host + "?" + qs;
                            window.open(url, "_blank");
                            break;
                    }
                    break;
            }
        }
    };
    FrameworkControl.prototype._getQueryStringParams = function () {
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
    FrameworkControl.prototype._generateQueryString = function (QueryStringParams) {
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
    FrameworkControl.prototype.GetQueryVariable = function (variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for(var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
    };
    return FrameworkControl;
})();
