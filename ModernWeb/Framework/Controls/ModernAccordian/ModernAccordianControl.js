var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ModernAccordianControl = (function (_super) {
    __extends(ModernAccordianControl, _super);
    function ModernAccordianControl(UIRenderer, Debugger, UniqueID, ParentUniqueID) {
        _super.call(this, UIRenderer, Debugger, UniqueID, ParentUniqueID);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this.ParentUniqueID = ParentUniqueID;
        this._isDisabled = false;
        this.UIRenderer.HideDiv(UniqueID);
    }
    ModernAccordianControl.prototype.InitUI = function (startHeight) {
        this.Debugger.Log("ModernAccordianControl:InitUI");
        this._shadowMenuItems = this.UIRenderer.LoadDivInParent("divModernAccordianItems", this.UniqueID);
        this._overlay = this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
        this._overlay.css("display", "none");
    };
    ModernAccordianControl.prototype.UpdateFromLayout = function (rect) {
        this.Debugger.Log("ModernAccordianControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);
    };
    ModernAccordianControl.prototype.Enable = function () {
        this.Debugger.Log("ModernAccordianControl:Disable ");
        this._isDisabled = false;
        this._overlay.css("display", "none");
    };
    ModernAccordianControl.prototype.Disable = function (opacity) {
        this.Debugger.Log("ModernAccordianControl:Disable ");
        if(this._isDisabled) {
            return;
        }
        this._isDisabled = true;
        this._overlay.css("display", "");
        this._overlay.css("opacity", opacity);
    };
    ModernAccordianControl.prototype.Unload = function () {
        this.Debugger.Log("ModernAccordianControl:Unload ");
        this._shadowMenuItems.remove();
        this._overlay.remove();
        _super.prototype.Unload.call(this);
    };
    ModernAccordianControl.prototype.LoadData = function (data, params) {
        this.Debugger.Log("ModernAccordianControl:LoadData - " + data);
        if(this._isDisabled) {
            return;
        }
        this._data = data;
        this.Disable(0.8);
        this.TemporaryNotification("loading ... ", "Loading");
        var self = this;
        _bootup.DataLoader.RetrieveData(data, "POST", params, "json", function (r) {
            _bootup.Debugger.Log("finished loading - " + self._data);
            self.ClearTemporaryNotification();
            self.Enable();
            $.each(r.result, function () {
                var nodeHtml = "";
                nodeHtml += '<div class="AR">';
                nodeHtml += this.name;
                nodeHtml += '</div>';
                var parentNode = this;
                if(this.children != null) {
                    $.each(this.children, function () {
                        nodeHtml += '<div class="ARC" data-id="' + this.id + '" data-parent="' + parentNode.id + '">';
                        nodeHtml += '<div class="childname">' + this.name + '</div>';
                        if(this.count != null) {
                            nodeHtml += '<div class="count">' + this.count + '</div>';
                        }
                        nodeHtml += '</div>';
                    });
                }
                self.UIRenderer.LoadHTMLElement(null, self._shadowMenuItems, nodeHtml);
            });
            var p = $("#" + self.UniqueID + " div[data-parent]").each(function () {
                $(this).off("click").on("click", this, function (e) {
                    if(self._selectedItem != null) {
                        self._selectedItem.css("background", "").css("color", "black");
                    }
                    self._selectedItem = $(this);
                    self._selectedItem.css("background", "Orange").css("color", "white");
                    self.Debugger.Log("Accordian Item Clicked ID-" + $(this).data("id") + " , ParentID-" + $(this).data("parent"));
                });
            });
            self.Debugger.Log("#" + self.UniqueID + " div[data-parent]" + " - " + p.length);
        });
    };
    return ModernAccordianControl;
})(FrameworkControl);
