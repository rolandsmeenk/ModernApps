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
        this._shadowCanvas = this.UIRenderer.LoadCanvasInParent("modernAccordian", this._rootDiv);
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
        _super.prototype.Unload.call(this);
    };
    return ModernAccordianControl;
})(FrameworkControl);
