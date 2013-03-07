var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DemoWysihtml5 = (function (_super) {
    __extends(DemoWysihtml5, _super);
    function DemoWysihtml5(UIRenderer, Debugger) {
        var _this = this;
        _super.call(this, UIRenderer, Debugger);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.AppBarItemsArray = [
            {
                "id": "app1",
                "text": "",
                "data": "scene|DemoLogin01",
                "style": 'background-color:#0281d5;background-image:url("/Content/Icons/MetroIcons/96x96/Folders & OS/Windows 8.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }, 
            {
                "id": "app3",
                "text": "",
                "data": "scene|DemoLogin01",
                "style": 'background-color:#228500;background-image:url("/Content/Icons/MetroIcons/96x96/Devices & Drives/XBox 360.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }, 
            {
                "id": "app2",
                "text": "",
                "data": "scene|DemoLogin01",
                "style": 'background-color:#0281d5;background-image:url("/Content/Icons/MetroIcons/96x96/Folders & OS/Windows.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }
        ];
        this._wysihtml5Control = new Wysihtml5Control(UIRenderer, Debugger, "divWysihtml5", null);
        this.AreaA.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaA.LayoutChangedCallback");
            _this._wysihtml5Control.UpdateFromLayout(rect);
        };
        this.AreaB.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaB.LayoutChangedCallback");
        };
        this.AreaC.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaC.LayoutChangedCallback");
        };
    }
    DemoWysihtml5.prototype.Show = function () {
        _super.prototype.Show.call(this);
        this.Debugger.Log("DemoWysihtml5.LayoutChangedCallback");
        this._InitializeWysihtml5(this.AreaA.Dimension.y2 - this.AreaA.Dimension.y1);
    };
    DemoWysihtml5.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
        this.Debugger.Log("DemoWysihtml5.LayoutChangedCallback");
        this._wysihtml5Control.Unload();
    };
    DemoWysihtml5.prototype.ShowWysihtml5 = function () {
        this.Debugger.Log("DemoWysihtml5:ShowWysihtml5");
        this._wysihtml5Control.Show(this, null, null);
    };
    DemoWysihtml5.prototype.HideWysihtml5 = function () {
        this.Debugger.Log("DemoWysihtml5:HideWysihtml5");
        this._wysihtml5Control.Hide();
    };
    DemoWysihtml5.prototype._InitializeWysihtml5 = function (startHeight) {
        this._wysihtml5Control.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this._wysihtml5Control.InitUI(startHeight);
        this.ShowWysihtml5();
    };
    return DemoWysihtml5;
})(Layout001);
