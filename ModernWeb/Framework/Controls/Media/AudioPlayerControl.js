var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AudioPlayerControl = (function (_super) {
    __extends(AudioPlayerControl, _super);
    function AudioPlayerControl(UIRenderer, Debugger, UniqueID, ParentUniqueID) {
        _super.call(this, UIRenderer, Debugger, UniqueID, ParentUniqueID);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this.ParentUniqueID = ParentUniqueID;
        this._shadowCanvas = this.UIRenderer.LoadCanvasInParent("audioPlayer", this._rootDiv);
    }
    AudioPlayerControl.prototype.InitUI = function (startHeight) {
        this.Debugger.Log("AudioPlayerControl:InitUI");
        this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
    };
    AudioPlayerControl.prototype.UpdateFromLayout = function (rect) {
        this.Debugger.Log("AudioPlayerControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);
    };
    AudioPlayerControl.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
    };
    return AudioPlayerControl;
})(FrameworkControl);
