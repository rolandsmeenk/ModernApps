var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ModernFilterBoxControl = (function (_super) {
    __extends(ModernFilterBoxControl, _super);
    function ModernFilterBoxControl(UIRenderer, Debugger, UniqueID, ParentUniqueID) {
        _super.call(this, UIRenderer, Debugger, UniqueID, ParentUniqueID);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this.ParentUniqueID = ParentUniqueID;
        this._shadowTextBox = this.UIRenderer.LoadHTMLElement(this.UniqueID + "_TB", this._rootDiv, '<input id="' + this.UniqueID + "_TB" + '" type="text" />');
        this.UIRenderer.LoadHTMLElement(null, this._rootDiv, '<img src="/Content/Icons/Light/feature.search.png"  class="icoSearch" />');
        this._shadowIconSearch = this.UIRenderer.FindHTMLElementInParentByClass("icoSearch", this.UniqueID);
        this._shadowPopup = this.UIRenderer.LoadHTMLElement(this.UniqueID + "_popup", this._rootDiv, '<div id="' + this.UniqueID + "_popup" + '" />');
        var _self = this;
        this._shadowTextBox.off("focus").on("focus", function (event) {
            if (_self._shadowTextBox.val().length > 0) {
                _self._shadowIconSearch.hide();
                _self._shadowPopup.show();
            } else {
                _self._shadowIconSearch.show();
                _self._shadowPopup.hide();
            }
        });
        this._shadowTextBox.off("input").on("input", function (event) {
            if (_self._shadowTextBox.val().length > 0) {
                _self._shadowIconSearch.hide();
                _self._shadowPopup.show();
            } else {
                _self._shadowIconSearch.show();
                _self._shadowPopup.hide();
            }
        });
        this._shadowTextBox.off("blur").on("blur", function (event) {
            _self._shadowIconSearch.show();
            _self._shadowPopup.hide();
        });
    }
    ModernFilterBoxControl.prototype.InitUI = function (startHeight) {
        this.Debugger.Log("ModernFilterBoxControl:InitUI");
    };
    ModernFilterBoxControl.prototype.UpdateFromLayout = function (rect) {
        this.Debugger.Log("ModernFilterBoxControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rect = rect;
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1);
        this._shadowTextBox.width(rect.x2 - rect.x1 - 35);
        this._shadowIconSearch.css("left", rect.x2 - 60).css("top", "5px").show();
        this._shadowPopup.css("left", "10px").css("top", "55px").width(rect.x2 - rect.x1 - 35);
    };
    ModernFilterBoxControl.prototype.Unload = function () {
        this.Debugger.Log("ModernFilterBoxControl:Unload ");
        this._shadowTextBox.off("focus");
        this._shadowTextBox.off("input");
        this._shadowTextBox.off("blur");
        this._shadowTextBox.remove();
        this._shadowIconSearch.remove();
        this._shadowPopup.remove();
        _super.prototype.Unload.call(this);
    };
    return ModernFilterBoxControl;
})(FrameworkControl);
