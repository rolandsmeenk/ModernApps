var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Layout002 = (function (_super) {
    __extends(Layout002, _super);
    function Layout002(UIRenderer, Debugger) {
        _super.call(this, UIRenderer, Debugger);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.VerticalDividerControl = new VerticalDividerControl(UIRenderer, Debugger, "divVerticalDivider", null);
        this.AreaA = new LayoutPanelControl(UIRenderer, Debugger, "divLeftPanel", null);
        this.AddLayoutControl(this.AreaA);
        this.AreaB = new LayoutPanelControl(UIRenderer, Debugger, "divRightPanel", null);
        this.AddLayoutControl(this.AreaB);
    }
    Layout002.prototype.Show = function (appBarItemsArray, toolBarItemsArray, settingsData) {
        _super.prototype.Show.call(this, appBarItemsArray, toolBarItemsArray, settingsData);
        this.Debugger.Log("Layout001.LayoutChangedCallback");
        var minTop = 45;
        var starting_vertical_left = parseFloat(this.VerticalDividerControl._rootDiv.css("left"));
        this._IntializeVerticalDivider(minTop);
        this.VerticalDividerControl.UpdateHeight(minTop);
        this._ResizeVerticalDivider(starting_vertical_left, 0);
        this.VerticalDividerControl.InitUI(starting_vertical_left);
        this._InitializeLayoutPanels();
    };
    Layout002.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
        this.Debugger.Log("Layout002.LayoutChangedCallback");
        this.VerticalDividerControl.Unload();
        this.AreaA.Unload();
        this.AreaB.Unload();
    };
    Layout002.prototype.ShowVerticalDivider = function () {
        this.Debugger.Log("Layout002:ShowVerticalDivider");
        this.VerticalDividerControl.Show(null);
    };
    Layout002.prototype.HideVerticalDivider = function () {
        this.Debugger.Log("Layout002:HideVerticalDivider");
        this.VerticalDividerControl.Hide();
    };
    Layout002.prototype.ShowLeftPanel = function () {
        this.Debugger.Log("Layout001:ShowLeftPanel");
        this.AreaA.Show(this, null, null);
    };
    Layout002.prototype.HideLeftPanel = function () {
        this.Debugger.Log("Layout001:HideLeftPanel");
        this.AreaA.Hide();
    };
    Layout002.prototype.ShowRightPanel = function () {
        this.Debugger.Log("Layout001:ShowRightPanel");
        this.AreaB.Show(this, null, null);
    };
    Layout002.prototype.HideRightPanel = function () {
        this.Debugger.Log("Layout001:HideRightPanel");
        this.AreaB.Hide();
    };
    Layout002.prototype._IntializeVerticalDivider = function (minTop) {
        var _this = this;
        this.Debugger.Log("Layout002._IntializeVerticalDivider");
        this.VerticalDividerControl.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this.VerticalDividerControl.MinimumY = minTop;
        this.VerticalDividerControl.ParentResizeCompleteCallback = function (x, y) {
            _this._ResizeVerticalDivider(x, y);
            if(_this.ResizingCompleteCallback != null) {
                _this.ResizingCompleteCallback();
            }
        };
        this.VerticalDividerControl.ParentResizeStartedCallback = function () {
            if(_this.ResizingStartedCallback != null) {
                _this.ResizingStartedCallback();
            }
        };
        this.ShowVerticalDivider();
        this.VerticalDividerControl.UpdateHeight(minTop);
    };
    Layout002.prototype._ResizeVerticalDivider = function (x, y) {
        this.Debugger.Log("Layout002._ResizeVerticalDivider");
        var newRect = this.VerticalDividerControl.GetLeftRectangle();
        newRect.x1 = 0;
        newRect.x2 = x;
        this.AreaA.UpdateLayout(newRect);
        var newRect = this.VerticalDividerControl.GetRightRectangle();
        newRect.x1 = x;
        this.AreaB.UpdateLayout(newRect);
    };
    Layout002.prototype._InitializeLayoutPanels = function () {
        this.Debugger.Log("Layout001._InitializeLayoutPanels");
        this.AreaA.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this.ShowLeftPanel();
        this.AreaB.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this.ShowRightPanel();
        this._UpdateLayoutPanels();
    };
    Layout002.prototype._UpdateLayoutPanels = function () {
        this.Debugger.Log("Layout001._UpdateLayoutPanels");
        this.AreaA.UpdateLayout(this.VerticalDividerControl.GetLeftRectangle());
        this.AreaB.UpdateLayout(this.VerticalDividerControl.GetRightRectangle());
    };
    return Layout002;
})(MasterLayout);
