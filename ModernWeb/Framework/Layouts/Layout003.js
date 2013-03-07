var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Layout003 = (function (_super) {
    __extends(Layout003, _super);
    function Layout003(UIRenderer, Debugger, width, height) {
        _super.call(this, UIRenderer, Debugger);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.AreaA = new LayoutPanelControl(UIRenderer, Debugger, "divAreaA", null);
        this.AddLayoutControl(this.AreaA);
        var a_width = width;
        var a_height = height;
        var a_left = ($(window).width() - a_width) / 2;
        var a_top = ($(window).height() - a_height) / 2;
        this._rect = {
            x1: a_left,
            y1: a_top,
            x2: a_left + a_width,
            y2: a_top + a_height,
            w: a_width,
            h: a_height
        };
    }
    Layout003.prototype.Show = function () {
        _super.prototype.Show.call(this);
        this.Debugger.Log("Layout003.Show");
        this._InitializeLayoutPanels();
    };
    Layout003.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
        this.Debugger.Log("Layout003.Unload");
        this.AreaA.Unload();
    };
    Layout003.prototype.ShowPanel = function () {
        this.Debugger.Log("Layout003:ShowPanel");
        this.AreaA.Show(this, null, null);
    };
    Layout003.prototype.HidePanel = function () {
        this.Debugger.Log("Layout003:HidePanel");
        this.AreaA.Hide();
    };
    Layout003.prototype._InitializeLayoutPanels = function () {
        this.Debugger.Log("Layout003._InitializeLayoutPanels");
        this.AreaA.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this._UpdateLayoutPanels(this._rect);
    };
    Layout003.prototype._UpdateLayoutPanels = function (rect) {
        this.Debugger.Log("Layout003._UpdateLayoutPanels");
        this.AreaA.UpdateLayout(rect);
    };
    return Layout003;
})(MasterLayout);
