var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var VideoPlayerControl = (function (_super) {
    __extends(VideoPlayerControl, _super);
    function VideoPlayerControl(UIRenderer, Debugger, UniqueID, ParentUniqueID) {
        _super.call(this, UIRenderer, Debugger, UniqueID, ParentUniqueID);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this.ParentUniqueID = ParentUniqueID;
        this._shadowCanvas = this.UIRenderer.LoadCanvasInParent("videoPlayer", this._rootDiv);
    }
    VideoPlayerControl.prototype.InitUI = function (startHeight) {
        this.Debugger.Log("VideoPlayerControl:InitUI");
        this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
    };
    VideoPlayerControl.prototype.UpdateFromLayout = function (rect) {
        this.Debugger.Log("VideoPlayerControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);
    };
    VideoPlayerControl.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
    };
    return VideoPlayerControl;
})(FrameworkControl);
