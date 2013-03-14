var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Layout001 = (function (_super) {
    __extends(Layout001, _super);
    function Layout001(UIRenderer, Debugger) {
        _super.call(this, UIRenderer, Debugger);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.HorizontalDividerControl = new HorizontalDividerControl(UIRenderer, Debugger, "divHorizontalDivider", null);
        this.VerticalDividerControl = new VerticalDividerControl(UIRenderer, Debugger, "divVerticalDivider", null);
        this.AreaA = new LayoutPanelControl(UIRenderer, Debugger, "divTopRightPanel", null);
        this.AddLayoutControl(this.AreaA);
        this.AreaB = new LayoutPanelControl(UIRenderer, Debugger, "divBottomRightPanel", null);
        this.AddLayoutControl(this.AreaB);
        this.AreaC = new LayoutPanelControl(UIRenderer, Debugger, "divLeftPanel", null);
        this.AddLayoutControl(this.AreaC);
    }
    Layout001.prototype.Show = function (appBarItemsArray, toolBarItemsArray, settingsData) {
        _super.prototype.Show.call(this, appBarItemsArray, toolBarItemsArray, settingsData);
        this.Debugger.Log("Layout001.LayoutChangedCallback");
        var minTop = 45;
        var starting_vertical_left = parseFloat(this.VerticalDividerControl._rootDiv.css("left"));
        var starting_horizontal_top = parseFloat(this.HorizontalDividerControl._rootDiv.css("top"));
        this._IntializeVerticalDivider(minTop);
        this._IntializeHorizontalDivider(minTop, starting_vertical_left);
        this.VerticalDividerControl.UpdateHeight(minTop);
        this.HorizontalDividerControl.UpdateWidth(starting_vertical_left);
        this._ResizeVerticalDivider(starting_vertical_left, 0);
        this._ResizeHorizontalDivider(starting_vertical_left, starting_horizontal_top);
        this.HorizontalDividerControl.InitUI(starting_horizontal_top);
        this.VerticalDividerControl.InitUI(starting_vertical_left);
        this._InitializeLayoutPanels();
    };
    Layout001.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
        this.Debugger.Log("Layout001.LayoutChangedCallback");
        this.VerticalDividerControl.Unload();
        this.HorizontalDividerControl.Unload();
        this.AreaA.Unload();
        this.AreaB.Unload();
        this.AreaC.Unload();
    };
    Layout001.prototype.ShowVerticalDivider = function () {
        this.Debugger.Log("Layout001:ShowVerticalDivider");
        this.VerticalDividerControl.Show(null);
    };
    Layout001.prototype.HideVerticalDivider = function () {
        this.Debugger.Log("Layout001:HideVerticalDivider");
        this.VerticalDividerControl.Hide();
    };
    Layout001.prototype.ShowHorizontalDivider = function () {
        this.Debugger.Log("Layout001:ShowHorizontalDivider");
        this.HorizontalDividerControl.Show(null);
    };
    Layout001.prototype.HideHorizontalDivider = function () {
        this.Debugger.Log("Layout001:HideHorizontalDivider");
        this.HorizontalDividerControl.Hide();
    };
    Layout001.prototype.ShowTopRightPanel = function () {
        this.Debugger.Log("Layout001:ShowTopRightPanel");
        this.AreaA.Show(this, null, null);
    };
    Layout001.prototype.HideTopRightPanel = function () {
        this.Debugger.Log("Layout001:HideTopRightPanel");
        this.AreaA.Hide();
    };
    Layout001.prototype.ShowBottomRightPanel = function () {
        this.Debugger.Log("Layout001:ShowBottomRightPanel");
        this.AreaB.Show(this, null, null);
    };
    Layout001.prototype.HideBottomRightPanel = function () {
        this.Debugger.Log("Layout001:HideBottomRightPanel");
        this.AreaB.Hide();
    };
    Layout001.prototype.ShowLeftPanel = function () {
        this.Debugger.Log("Layout001:ShowLeftPanel");
        this.AreaC.Show(this, null, null);
    };
    Layout001.prototype.HideLeftPanel = function () {
        this.Debugger.Log("Layout001:HideLeftPanel");
        this.AreaC.Hide();
    };
    Layout001.prototype._IntializeVerticalDivider = function (minTop) {
        var _this = this;
        this.Debugger.Log("Layout001._IntializeVerticalDivider");
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
    Layout001.prototype._ResizeVerticalDivider = function (x, y) {
        this.Debugger.Log("Layout001._ResizeVerticalDivider");
        this.HorizontalDividerControl.UpdateWidth(x);
        var newRect = this.HorizontalDividerControl.GetTopRectangle();
        newRect.x1 = x;
        this.AreaA.UpdateLayout(newRect);
        var newRect = this.HorizontalDividerControl.GetBottomRectangle();
        newRect.x1 = x;
        this.AreaB.UpdateLayout(newRect);
        var newRect = this.VerticalDividerControl.GetLeftRectangle();
        newRect.x1 = 0;
        newRect.x2 = x;
        this.AreaC.UpdateLayout(newRect);
    };
    Layout001.prototype._IntializeHorizontalDivider = function (minTop, minLeft) {
        var _this = this;
        this.Debugger.Log("Layout001._IntializeHorizontalDivider");
        this.HorizontalDividerControl.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this.HorizontalDividerControl.MinimumY = minTop;
        this.HorizontalDividerControl.ParentResizeCompleteCallback = function (x, y) {
            _this.Debugger.Log("Layout001.HorizontalDividerControl.ParentResizeCompleteCallback");
            _this._ResizeHorizontalDivider(x, y);
            if(_this.ResizingCompleteCallback != null) {
                _this.ResizingCompleteCallback();
            }
        };
        this.HorizontalDividerControl.ParentResizeStartedCallback = function () {
            _this.Debugger.Log("Layout001.HorizontalDividerControl.ParentResizeStartedCallback");
            if(_this.ResizingStartedCallback != null) {
                _this.ResizingStartedCallback();
            }
        };
        this.ShowHorizontalDivider();
        this.HorizontalDividerControl.UpdateWidth(minLeft);
    };
    Layout001.prototype._ResizeHorizontalDivider = function (x, y) {
        this._UpdateLayoutPanels();
    };
    Layout001.prototype._InitializeLayoutPanels = function () {
        this.Debugger.Log("Layout001._InitializeLayoutPanels");
        this.AreaA.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this.ShowTopRightPanel();
        this.AreaB.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this.ShowBottomRightPanel();
        this.AreaC.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this.ShowLeftPanel();
        this._UpdateLayoutPanels();
    };
    Layout001.prototype._UpdateLayoutPanels = function () {
        this.Debugger.Log("Layout001._UpdateLayoutPanels");
        this.AreaA.UpdateLayout(this.HorizontalDividerControl.GetTopRectangle());
        this.AreaB.UpdateLayout(this.HorizontalDividerControl.GetBottomRectangle());
        this.AreaC.UpdateLayout(this.VerticalDividerControl.GetLeftRectangle());
    };
    return Layout001;
})(MasterLayout);
