var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DemoModernIFrame = (function (_super) {
    __extends(DemoModernIFrame, _super);
    function DemoModernIFrame(UIRenderer, Debugger) {
        var _this = this;
        _super.call(this, UIRenderer, Debugger);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.AreaA.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaA.LayoutChangedCallback");
        };
        this.AreaB.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaB.LayoutChangedCallback");
        };
        this.AreaC.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaC.LayoutChangedCallback");
            var newRect = rect;
        };
        this.ResizingStartedCallback = function () {
            _this.Debugger.Log("DemoModernIFrame.ResizingStartedCallback");
        };
        this.ResizingCompleteCallback = function () {
            _this.Debugger.Log("DemoModernIFrame.ResizingCompleteCallback");
        };
    }
    DemoModernIFrame.prototype.Show = function () {
        _super.prototype.Show.call(this);
        this.Debugger.Log("DemoModernIFrame.LayoutChangedCallback");
        this._InitializeModernIFrame(this.AreaB.Dimension.y2 - this.AreaB.Dimension.y1);
    };
    DemoModernIFrame.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
        this.Debugger.Log("DemoModernIFrame.LayoutChangedCallback");
    };
    DemoModernIFrame.prototype._InitializeModernIFrame = function (startHeight) {
    };
    return DemoModernIFrame;
})(Layout001);
