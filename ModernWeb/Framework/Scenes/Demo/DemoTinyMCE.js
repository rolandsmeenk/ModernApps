var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DemoTinyMCE = (function (_super) {
    __extends(DemoTinyMCE, _super);
    function DemoTinyMCE(UIRenderer, Debugger) {
        var _this = this;
        _super.call(this, UIRenderer, Debugger);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this._tinyMCEControl = new TinyMCEControl(UIRenderer, Debugger, "divTinyMCE", null);
        this.AreaA.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaA.LayoutChangedCallback");
        };
        this.AreaB.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaB.LayoutChangedCallback");
            _this._tinyMCEControl.UpdateFromLayout(rect);
        };
        this.AreaC.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaC.LayoutChangedCallback");
        };
    }
    DemoTinyMCE.prototype.Show = function () {
        _super.prototype.Show.call(this, [
            {
                "id": "app1",
                "text": "",
                "data": "scene|WindowsHome01",
                "style": 'background-color:#0281d5;background-image:url("/Content/Icons/MetroIcons/96x96/Folders & OS/Windows 8.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }, 
            {
                "id": "app3",
                "text": "",
                "data": "scene|XBoxHome01",
                "style": 'background-color:#228500;background-image:url("/Content/Icons/MetroIcons/96x96/Devices & Drives/XBox 360.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }, 
            {
                "id": "app2",
                "text": "",
                "data": "scene|WindowsPhoneHome01",
                "style": 'background-color:#0281d5;background-image:url("/Content/Icons/MetroIcons/96x96/Folders & OS/Windows.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }, 
            {
                "id": "app4",
                "text": "",
                "data": "scene|OfficeHome01",
                "style": 'background-color:#ff5e23;background-image:url("/Content/Icons/MetroIcons/96x96/Office Apps/MS Office.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }, 
            
        ], [], {
        });
        this.Debugger.Log("DemoTinyMCE.LayoutChangedCallback");
        this._InitializeTinyMCE(this.AreaB.Dimension.y2 - this.AreaB.Dimension.y1);
    };
    DemoTinyMCE.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
        this.Debugger.Log("DemoTinyMCE.LayoutChangedCallback");
        this._tinyMCEControl.Unload();
    };
    DemoTinyMCE.prototype.ShowTinyMCE = function () {
        this.Debugger.Log("DemoTinyMCE:ShowTinyMCE");
        this._tinyMCEControl.Show(this, null, null);
    };
    DemoTinyMCE.prototype.HideTinyMCE = function () {
        this.Debugger.Log("DemoTinyMCE:HideTinyMCE");
        this._tinyMCEControl.Hide();
    };
    DemoTinyMCE.prototype._InitializeTinyMCE = function (startHeight) {
        this._tinyMCEControl.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this._tinyMCEControl.InitUI(startHeight);
        this.ShowTinyMCE();
    };
    return DemoTinyMCE;
})(Layout001);
