var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DemoVideoPlayer = (function (_super) {
    __extends(DemoVideoPlayer, _super);
    function DemoVideoPlayer(UIRenderer, Debugger) {
        var _this = this;
        _super.call(this, UIRenderer, Debugger);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this._videoPlayerControl = new VideoPlayerControl(UIRenderer, Debugger, "divVideoPlayer", null);
        this.AreaA.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaA.LayoutChangedCallback");
            _this._videoPlayerControl.UpdateFromLayout(rect);
        };
        this.AreaB.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaB.LayoutChangedCallback");
        };
        this.AreaC.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaC.LayoutChangedCallback");
        };
    }
    DemoVideoPlayer.prototype.Show = function () {
        _super.prototype.Show.call(this);
        this.Debugger.Log("DemoVideoPlayer.LayoutChangedCallback");
        this._InitializeVideoPlayer(this.AreaB.Dimension.y2 - this.AreaB.Dimension.y1);
    };
    DemoVideoPlayer.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
        this.Debugger.Log("DemoVideoPlayer.LayoutChangedCallback");
        this._videoPlayerControl.Unload();
    };
    DemoVideoPlayer.prototype.ShowVideoPlayer = function () {
        this.Debugger.Log("DemoVideoPlayer:ShowVideoPlayer");
        this._videoPlayerControl.Show(this, null, null);
    };
    DemoVideoPlayer.prototype.HideVideoPlayer = function () {
        this.Debugger.Log("DemoVideoPlayer:HideVideoPlayer");
        this._videoPlayerControl.Hide();
    };
    DemoVideoPlayer.prototype._InitializeVideoPlayer = function (startHeight) {
        this._videoPlayerControl.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this._videoPlayerControl.InitUI(startHeight);
        this.ShowVideoPlayer();
    };
    return DemoVideoPlayer;
})(Layout001);
