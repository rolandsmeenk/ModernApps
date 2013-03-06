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
        this._dataGrid = new DataGridControl(UIRenderer, Debugger, "divDataGrid", null);
        this._searchBox = new ModernFilterBoxControl(UIRenderer, Debugger, "divSearchBox", null);
        this.AreaA.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaA.LayoutChangedCallback");
            _this._dataGrid.UpdateFromLayout(rect);
        };
        this.AreaB.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaB.LayoutChangedCallback");
            _this._modernIFrame.UpdateFromLayout(rect);
        };
        this.AreaC.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaC.LayoutChangedCallback");
            var newRect = rect;
            _this._modernAccordian.UpdateFromLayout(rect);
            _this._modernAccordian.Translate(0, 50);
            _this._searchBox.UpdateFromLayout(rect);
        };
        this.ResizingStartedCallback = function () {
            _this.Debugger.Log("DemoModernIFrame.ResizingStartedCallback");
            _this._modernIFrame.Disable(0.5);
            _this._modernIFrame.TemporaryNotification("resizing ...", "Resizing");
            _this._dataGrid.Disable(0.5);
            _this._dataGrid.TemporaryNotification("resizing ...", "Resizing");
        };
        this.ResizingCompleteCallback = function () {
            _this.Debugger.Log("DemoModernIFrame.ResizingCompleteCallback");
            _this._modernIFrame.Enable();
            _this._modernIFrame.ClearTemporaryNotification();
            _this._dataGrid.Enable();
            _this._dataGrid.ClearTemporaryNotification();
        };
    }
    DemoModernIFrame.prototype.Show = function () {
        _super.prototype.Show.call(this);
        this.Debugger.Log("DemoModernIFrame.LayoutChangedCallback");
        this._InitializeModernIFrame(this.AreaB.Dimension.y2 - this.AreaB.Dimension.y1);
        this._modernIFrame.LoadUrl("http://msdn.microsoft.com/en-US/");
        this.RaiseNotification("firstTimeNotify", "<div id='firstTimeNotify'>CTRL+F5 - to make sure you have the latest demo running clear your cache!</div>", 5000);
    };
    DemoModernIFrame.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
        this.Debugger.Log("DemoModernIFrame.LayoutChangedCallback");
        this._modernIFrame.Unload();
        this._modernAccordian.Unload();
        this._dataGrid.Unload();
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
    DemoModernIFrame.prototype.ShowDataGrid = function () {
        this.Debugger.Log("DemoModernIFrame:ShowDataGrid");
        this._dataGrid.Show(this, null, null);
    };
    DemoModernIFrame.prototype.HideDataGrid = function () {
        this.Debugger.Log("DemoModernIFrame:ShowDataGrid");
        this._dataGrid.Hide();
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
        this._dataGrid.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this._dataGrid.InitUI(startHeight);
        this.ShowDataGrid();
        this._modernAccordian.LoadData("GetMenuData", {
            id: 10
        });
        this._dataGrid.LoadData("GetDataGridData", {
            id: 10
        });
    };
    return DemoModernIFrame;
})(Layout001);
