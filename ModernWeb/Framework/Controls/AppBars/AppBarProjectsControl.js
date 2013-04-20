var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AppBarProjectsControl = (function (_super) {
    __extends(AppBarProjectsControl, _super);
    function AppBarProjectsControl(UIRenderer, Debugger, UniqueID) {
        _super.call(this, UIRenderer, Debugger, UniqueID, null);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this._itemCounter = 0;
        this._items = [];
        this.IsShowing = false;
    }
    AppBarProjectsControl.prototype.Show = function (eventData) {
        this.Debugger.Log("AppBarProjectsControl:Show");
        this._eventData = eventData;
        this.UIRenderer.AnimateDiv(this.UniqueID, {
            top: "+=355",
            display: ""
        }, 600);
        this.IsShowing = true;
        this._selectedProjectCode = this.GetQueryVariable("prjc");
        this.LoadData("GetReaderProjectListData", {
            id: 10
        });
        var stylesheet1 = document.styleSheets[0], selector = "#divAppBarProjects .ABProjects div:hover", rule = "{ background-color:" + _bootup.Theme.AccentColor3 + "; }";
        if(stylesheet1.insertRule) {
            stylesheet1.insertRule(selector + rule, stylesheet1.cssRules.length);
        } else if(stylesheet1.addRule) {
            stylesheet1.addRule(selector, rule, -1);
        }
        var stylesheet2 = document.styleSheets[0], selector = "#divABProjectsListFilter div:hover", rule = "{ background-color:" + _bootup.Theme.AccentColor3 + "; }";
        if(stylesheet2.insertRule) {
            stylesheet2.insertRule(selector + rule, stylesheet2.cssRules.length);
        } else if(stylesheet2.addRule) {
            stylesheet2.addRule(selector, rule, -1);
        }
    };
    AppBarProjectsControl.prototype.Hide = function () {
        this.Debugger.Log("AppBarProjectsControl:Hide");
        this.UIRenderer.AnimateDiv(this.UniqueID, {
            top: "-=355",
            display: "none"
        }, 600);
        this.IsShowing = false;
        this._rootDiv.off('click');
    };
    AppBarProjectsControl.prototype.Unload = function () {
        this.Debugger.Log("AppBarProjectsControl:Unload");
        this.IsShowing = false;
        for(var i = 0; i < this._items.length; i++) {
            this._items[i].Unload();
        }
        _super.prototype.Unload.call(this);
    };
    AppBarProjectsControl.prototype.AddItem = function (id, text, eventData, iconStyle) {
        this.Debugger.Log("AppBarProjectsControl:AddItem");
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
    AppBarProjectsControl.prototype.LoadData = function (data, params) {
        this.Debugger.Log("AppBarProjectsControl:LoadData - " + data);
        this.TemporaryNotification("loading ... ", "Loading");
        var self = this;
        _bootup.DataLoader.RetrieveData(data, "POST", params, "json", function (r) {
            _bootup.Debugger.Log("finished loading - ");
            self.ClearTemporaryNotification();
            self.UIRenderer.UnloadDiv("divABProjectsList");
            var userListHtml = '<div id="divABProjectsList" class="ABProjects">';
            $.each(r.result, function () {
                userListHtml += '<div data-do="action|change project|' + this.id + '|' + this.name + '" data-pc="' + this.id + '">' + this.name + '</div>';
            });
            userListHtml += '</div>';
            self.UIRenderer.LoadHTMLElement(null, self._rootDiv, userListHtml);
            var p = $("#" + self.UniqueID + " .ABProjects div").each(function () {
                $(this).off("click").on("click", this, function (e) {
                    if(self._selectedItem != null) {
                        self._selectedItem.css("background", "");
                    }
                    self._selectedItem = $(this);
                    self._selectedItem.css("background", _bootup.Theme.AccentColor2);
                    self.Debugger.Log("AppBarProjectsControl Item Clicked ID-" + $(this).data("id"));
                    self.ProcessActionSceneAct($(this).data("do"));
                });
            });
            var filterListHtml = '<div id="divABProjectsListFilter">';
            filterListHtml += "<div>A</div>";
            filterListHtml += "<div>B</div>";
            filterListHtml += "<div>C</div>";
            filterListHtml += "<div>D</div>";
            filterListHtml += "<div>E</div>";
            filterListHtml += "<div>F</div>";
            filterListHtml += "<div>G</div>";
            filterListHtml += "<div>H</div>";
            filterListHtml += "<div>I</div>";
            filterListHtml += "<div>J</div>";
            filterListHtml += "<div>K</div>";
            filterListHtml += "<div>L</div>";
            filterListHtml += "<div>M</div>";
            filterListHtml += "<div>N</div>";
            filterListHtml += "<div>O</div>";
            filterListHtml += "<div>P</div>";
            filterListHtml += "<div>Q</div>";
            filterListHtml += "<div>R</div>";
            filterListHtml += "<div>S</div>";
            filterListHtml += "<div>T</div>";
            filterListHtml += "<div>U</div>";
            filterListHtml += "<div>V</div>";
            filterListHtml += "<div>W</div>";
            filterListHtml += "<div>X</div>";
            filterListHtml += "<div>Y</div>";
            filterListHtml += "<div>Z</div>";
            filterListHtml += '</div>';
            self.UIRenderer.LoadHTMLElement(null, self._rootDiv, filterListHtml);
            if(self._selectedProjectCode != undefined) {
                var found = $("#" + self.UniqueID + " #divABProjectsList div[data-pc='" + self._selectedProjectCode + "']").each(function () {
                    self._selectedItem = $(this);
                    self._selectedItem.css("background", _bootup.Theme.AccentColor2);
                });
            }
        });
    };
    return AppBarProjectsControl;
})(FrameworkControl);
