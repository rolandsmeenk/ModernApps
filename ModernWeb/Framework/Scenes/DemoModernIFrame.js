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
        this._modernIFrame = new ModernIFrameControl(UIRenderer, Debugger, "divModernIFrame", null);
        this._modernAccordian = new ModernAccordianControl(UIRenderer, Debugger, "divModernAccordian", null);
        this.AreaA.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaA.LayoutChangedCallback");
        };
        this.AreaB.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaB.LayoutChangedCallback");
            _this._modernIFrame.UpdateFromLayout(rect);
        };
        this.AreaC.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaC.LayoutChangedCallback");
            _this._modernAccordian.UpdateFromLayout(rect);
        };
        this.ResizingStartedCallback = function () {
            _this.Debugger.Log("DemoModernIFrame.ResizingStartedCallback");
            _this._modernIFrame.Disable(0.5);
            _this._modernIFrame.TemporaryNotification("resizing ...", "Resizing");
        };
        this.ResizingCompleteCallback = function () {
            _this.Debugger.Log("DemoModernIFrame.ResizingCompleteCallback");
            _this._modernIFrame.Enable();
            _this._modernIFrame.ClearTemporaryNotification();
        };
    }
    DemoModernIFrame.prototype.Show = function () {
        _super.prototype.Show.call(this);
        this.Debugger.Log("DemoModernIFrame.LayoutChangedCallback");
        this._InitializeModernIFrame(this.AreaB.Dimension.y2 - this.AreaB.Dimension.y1);
        this._modernIFrame.LoadUrl("http://smh.com.au");
    };
    DemoModernIFrame.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
        this.Debugger.Log("DemoModernIFrame.LayoutChangedCallback");
        this._modernIFrame.Unload();
        this._modernAccordian.Unload();
    };
    DemoModernIFrame.prototype.ShowModernIFrame = function () {
        this.Debugger.Log("DemoModernIFrame:ShowModernIFrame");
        this._modernIFrame.Show(this, null, null);
    };
    DemoModernIFrame.prototype.HideModernIFrame = function () {
        this.Debugger.Log("DemoModernIFrame:HideModernIFrame");
        this._modernIFrame.Hide();
    };
    DemoModernIFrame.prototype.ShowModernAccordian = function () {
        this.Debugger.Log("DemoModernIFrame:ShowModernAccordian");
        this._modernAccordian.Show(this, null, null);
    };
    DemoModernIFrame.prototype.HideModernAccordian = function () {
        this.Debugger.Log("DemoModernIFrame:HideModernAccordian");
        this._modernAccordian.Hide();
    };
    DemoModernIFrame.prototype._InitializeModernIFrame = function (startHeight) {
        this._modernIFrame.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this._modernIFrame.InitUI(startHeight);
        this.ShowModernIFrame();
        this._modernAccordian.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this._modernAccordian.InitUI(startHeight);
        this.ShowModernAccordian();
        this._modernAccordian.LoadData("GetMenuData", {
            id: 100
        });
    };
    return DemoModernIFrame;
})(Layout001);
