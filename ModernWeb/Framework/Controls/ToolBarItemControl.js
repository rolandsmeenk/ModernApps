var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ToolBarItemControl = (function (_super) {
    __extends(ToolBarItemControl, _super);
    function ToolBarItemControl(UIRenderer, Debugger, UniqueID, ParentUniqueID) {
        _super.call(this, UIRenderer, Debugger, UniqueID, ParentUniqueID);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this.ParentUniqueID = ParentUniqueID;
    }
    ToolBarItemControl.prototype.LoadIcon = function (iconUrl, iconId) {
        this._iconUrl = iconUrl;
        this._iconId = iconId;
        this._iconDiv = this.UIRenderer.LoadDivInParent(iconId, this.ParentUniqueID);
    };
    return ToolBarItemControl;
})(FrameworkControl);
