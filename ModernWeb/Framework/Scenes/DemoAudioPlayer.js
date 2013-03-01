var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DemoAudioPlayer = (function (_super) {
    __extends(DemoAudioPlayer, _super);
    function DemoAudioPlayer(UIRenderer, Debugger) {
        var _this = this;
        _super.call(this, UIRenderer, Debugger);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this._audioPlayerControl = new AudioPlayerControl(UIRenderer, Debugger, "divAudioPlayer", null);
        this.AreaA.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaA.LayoutChangedCallback");
            _this._audioPlayerControl.UpdateFromLayout(rect);
        };
        this.AreaB.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaB.LayoutChangedCallback");
        };
        this.AreaC.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaC.LayoutChangedCallback");
        };
    }
    DemoAudioPlayer.prototype.Show = function () {
        _super.prototype.Show.call(this);
        this.Debugger.Log("DemoAudioPlayer.LayoutChangedCallback");
        this._InitializeAudioPlayer(this.AreaA.Dimension.y2 - this.AreaA.Dimension.y1);
    };
    DemoAudioPlayer.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
        this.Debugger.Log("DemoAudioPlayer.LayoutChangedCallback");
        this._audioPlayerControl.Unload();
    };
    DemoAudioPlayer.prototype.ShowAudioPlayer = function () {
        this.Debugger.Log("DemoAudioPlayer:ShowAudioPlayer");
        this._audioPlayerControl.Show(this, null, null);
    };
    DemoAudioPlayer.prototype.HideAudioPlayer = function () {
        this.Debugger.Log("DemoAudioPlayer:HideAudioPlayer");
        this._audioPlayerControl.Hide();
    };
    DemoAudioPlayer.prototype._InitializeAudioPlayer = function (startHeight) {
        this._audioPlayerControl.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this._audioPlayerControl.InitUI(startHeight);
        this.ShowAudioPlayer();
    };
    return DemoAudioPlayer;
})(Layout001);
