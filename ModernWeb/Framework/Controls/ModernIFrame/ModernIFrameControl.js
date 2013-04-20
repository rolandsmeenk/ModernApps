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
        this._isDisabled = false;
        this._shortCircuit = 9;
        this._isLoadedWithData = false;
        this.UIRenderer.HideDiv(UniqueID);
    }
    ModernIFrameControl.prototype.InitUI = function (startHeight) {
        this.Debugger.Log("ModernIFrameControl:InitUI");
        this._shadowIFrame = this.UIRenderer.LoadHTMLElement('modernIFrame', this._rootDiv, '<iframe id="modernIFrame" name="modernIFrame"  style="display:none;" />');
        this._overlay = this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
        this._overlay.css("display", "none");
    };
    ModernIFrameControl.prototype.UpdateFromLayout = function (rect) {
        this.Debugger.Log("ModernIFrameControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);
    };
    ModernIFrameControl.prototype.Enable = function () {
        this.Debugger.Log("ModernIFrameControl:Disable ");
        this._isDisabled = false;
        this._overlay.css("display", "none");
    };
    ModernIFrameControl.prototype.Disable = function (opacity) {
        this.Debugger.Log("ModernIFrameControl:Disable ");
        if(this._isDisabled) {
            return;
        }
        this._isDisabled = true;
        this._overlay.css("display", "");
        this._overlay.css("opacity", opacity);
    };
    ModernIFrameControl.prototype.Unload = function () {
        this.Debugger.Log("ModernIFrameControl:Unload ");
        this._shadowIFrame.remove();
        this._overlay.remove();
        _super.prototype.Unload.call(this);
    };
    ModernIFrameControl.prototype.LoadUrl = function (url) {
        this.Debugger.Log("ModernIFrameControl:LoadUrl - " + url);
        if(this._isDisabled) {
            return;
        }
        if(this._isLoadedWithData) {
            this.AnimateOut();
        }
        this._shortCircuit = 2;
        this.Disable(0.8);
        this._url = url;
        var self = this;
        this._loadUrlHandle = setInterval(function () {
            self._shortCircuit--;
            if(self._shadowIFrame.prop("readyState") == "complete" || self._shortCircuit == 0) {
                clearInterval(self._loadUrlHandle);
                _bootup.Debugger.Log("finished loading - " + self._url);
                self.Enable();
            }
        }, 500);
        this._shadowIFrame.attr("src", url).show();
        this._isLoadedWithData = true;
        this.AnimateIn();
    };
    ModernIFrameControl.prototype.AnimateIn = function () {
        var p = $("#" + this.UniqueID).animate({
            opacity: 1.0,
            marginLeft: "0"
        }, 600);
    };
    ModernIFrameControl.prototype.AnimateOut = function () {
        this._isLoadedWithData = false;
        var p = $("#" + this.UniqueID).animate({
            opacity: 0,
            marginLeft: "-50px"
        }, 100);
    };
    return ModernIFrameControl;
})(FrameworkControl);
