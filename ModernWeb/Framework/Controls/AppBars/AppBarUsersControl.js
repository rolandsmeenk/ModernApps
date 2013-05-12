var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AppBarUsersControl = (function (_super) {
    __extends(AppBarUsersControl, _super);
    function AppBarUsersControl(UIRenderer, Debugger, UniqueID) {
        _super.call(this, UIRenderer, Debugger, UniqueID, null);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this._itemCounter = 0;
        this._items = [];
        this.IsShowing = false;
    }
    AppBarUsersControl.prototype.Show = function (eventData) {
        this.Debugger.Log("AppBarUsersControl:Show");
        this._eventData = eventData;
        this.UIRenderer.AnimateDiv(this.UniqueID, {
            top: "+=355",
            display: ""
        }, 600);
        this.IsShowing = true;
        this._selectedUserId = this.GetQueryVariable("uid");
        this.LoadData("GetReaderUserListData", {
            id: 10
        });
        var stylesheet1 = document.styleSheets[0], selector = "#divAppBarUsers .ABUsers div:hover", rule = "{ background-color:" + _bootup.Theme.AccentColor3 + "; }";
        if (stylesheet1.insertRule) {
            stylesheet1.insertRule(selector + rule, stylesheet1.cssRules.length);
        } else if (stylesheet1.addRule) {
            stylesheet1.addRule(selector, rule, -1);
        }
    };
    AppBarUsersControl.prototype.Hide = function () {
        this.Debugger.Log("AppBarUsersControl:Hide");
        this.UIRenderer.AnimateDiv(this.UniqueID, {
            top: "-=355",
            display: "none"
        }, 600);
        this.IsShowing = false;
        this._rootDiv.off('click');
    };
    AppBarUsersControl.prototype.Unload = function () {
        this.Debugger.Log("AppBarUsersControl:Unload");
        this.IsShowing = false;
        for(var i = 0; i < this._items.length; i++) {
            this._items[i].Unload();
        }
        _super.prototype.Unload.call(this);
    };
    AppBarUsersControl.prototype.AddItem = function (id, text, eventData, iconStyle) {
        this.Debugger.Log("AppBarUsersControl:AddItem");
        try  {
            var newToolbarItem = new AppBarItemControl(this.UIRenderer, this.Debugger, id, this.UniqueID);
            newToolbarItem._rootDiv.attr("style", iconStyle);
            newToolbarItem.Show(this._parentObject, this._parentClickCallback, eventData);
            newToolbarItem.UpdateContent(text);
            this._items.push(newToolbarItem);
            this._itemCounter++;
        } catch (ex) {
            alert(ex.message);
        }
    };
    AppBarUsersControl.prototype.LoadData = function (data, params) {
        this.Debugger.Log("AppBarUsersControl:LoadData - " + data);
        this.TemporaryNotification("loading ... ", "Loading");
        var self = this;
        _bootup.DataLoader.RetrieveData(data, "POST", params, "json", function (r) {
            _bootup.Debugger.Log("finished loading - ");
            self.ClearTemporaryNotification();
            self.UIRenderer.UnloadDiv("divABUsersList");
            var userListHtml = '<div id="divABUsersList" class="ABUsers">';
            $.each(r.result, function () {
                userListHtml += '<div data-do="action|change user|' + this.gid + '|' + this.name + '|' + this.id + '" data-uid="' + this.id + '">' + this.name + '</div>';
            });
            userListHtml += '</div>';
            self.UIRenderer.LoadHTMLElement(null, self._rootDiv, userListHtml);
            var p = $("#" + self.UniqueID + " .ABUsers div").each(function () {
                $(this).off("click").on("click", this, function (e) {
                    if (self._selectedItem != null) {
                        self._selectedItem.css("background", "");
                    }
                    self._selectedItem = $(this);
                    self._selectedItem.css("background", _bootup.Theme.AccentColor2);
                    self.Debugger.Log("AppBarUsersControl Item Clicked ID-" + $(this).data("id"));
                    self.ProcessActionSceneAct($(this).data("do"));
                });
            });
            if (self._selectedUserId != undefined) {
                var found = $("#" + self.UniqueID + " #divABUsersList div[data-uid='" + self._selectedUserId + "']").each(function () {
                    self._selectedItem = $(this);
                    self._selectedItem.css("background", _bootup.Theme.AccentColor2);
                });
            }
        });
    };
    return AppBarUsersControl;
})(FrameworkControl);
