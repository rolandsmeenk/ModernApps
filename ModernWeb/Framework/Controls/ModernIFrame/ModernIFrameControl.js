var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ModernIFrameControl = (function (_super) {
    __extends(ModernIFrameControl, _super);
    function ModernIFrameControl(UIRenderer, Debugger, UniqueID, ParentUniqueID) {
        _super.call(this, UIRenderer, Debugger, UniqueID, ParentUniqueID);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this.ParentUniqueID = ParentUniqueID;
        this._shadowIFrame = this.UIRenderer.LoadHTMLElement('modernIFrame', this._rootDiv, '<iframe id="modernIFrame" src="http://www.westpac.com.au" style="display:none;" />');
    }
    ModernIFrameControl.prototype.InitUI = function (startHeight) {
        this.Debugger.Log("ModernIFrameControl:InitUI");
        this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
    };
    ModernIFrameControl.prototype.UpdateFromLayout = function (rect) {
        this.Debugger.Log("ModernIFrameControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);
    };
    ModernIFrameControl.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
    };
    return ModernIFrameControl;
})(FrameworkControl);
