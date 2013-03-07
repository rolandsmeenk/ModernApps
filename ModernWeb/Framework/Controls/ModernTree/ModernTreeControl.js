var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ModernTreeControl = (function (_super) {
    __extends(ModernTreeControl, _super);
    function ModernTreeControl(UIRenderer, Debugger, UniqueID, ParentUniqueID) {
        _super.call(this, UIRenderer, Debugger, UniqueID, ParentUniqueID);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this.ParentUniqueID = ParentUniqueID;
        this._isDisabled = false;
        this.UIRenderer.HideDiv(UniqueID);
    }
    ModernTreeControl.prototype.InitUI = function (startHeight) {
        this.Debugger.Log("ModernTreeControl:InitUI");
        this._shadowCanvas = this.UIRenderer.LoadCanvasInParent("modernTree", this._rootDiv);
        this._overlay = this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
        this._overlay.css("display", "none");
        this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
    };
    ModernTreeControl.prototype.UpdateFromLayout = function (rect) {
        this.Debugger.Log("ModernTreeControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);
    };
    ModernTreeControl.prototype.Enable = function () {
        this.Debugger.Log("ModernTreeControl:Enable ");
        this._isDisabled = false;
        this._overlay.css("display", "none");
    };
    ModernTreeControl.prototype.Disable = function (opacity) {
        this.Debugger.Log("ModernTreeControl:Disable ");
        if(this._isDisabled) {
            return;
        }
        this._isDisabled = true;
        this._overlay.css("display", "");
        this._overlay.css("opacity", opacity);
    };
    ModernTreeControl.prototype.Unload = function () {
        this._overlay.remove();
        this._shadowCanvas.remove();
        _super.prototype.Unload.call(this);
    };
    return ModernTreeControl;
})(FrameworkControl);
