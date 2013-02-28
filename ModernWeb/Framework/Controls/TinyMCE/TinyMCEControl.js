var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TinyMCEControl = (function (_super) {
    __extends(TinyMCEControl, _super);
    function TinyMCEControl(UIRenderer, Debugger, UniqueID, ParentUniqueID) {
        _super.call(this, UIRenderer, Debugger, UniqueID, ParentUniqueID);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this.ParentUniqueID = ParentUniqueID;
        this._shadowTextArea = this.UIRenderer.LoadTextAreaInParent("elm1", this._rootDiv);
    }
    TinyMCEControl.prototype.InitUI = function (startHeight) {
        this.Debugger.Log("TinyMCEControl:InitUI");
        tinyMCE.init({
            mode: "textareas",
            theme: "simple"
        });
        this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
        setTimeout(function () {
            $(".mceIframeContainer").height(startHeight - 26);
        }, 15);
    };
    TinyMCEControl.prototype.UpdateFromLayout = function (rect) {
        this.Debugger.Log("TinyMCEControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rect = rect;
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1 - 35);
        $(".mceIframeContainer").height(rect.y2 - rect.y1 - 26);
    };
    TinyMCEControl.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
    };
    return TinyMCEControl;
})(FrameworkControl);
