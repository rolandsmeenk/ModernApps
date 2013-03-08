var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var XBoxHome01 = (function (_super) {
    __extends(XBoxHome01, _super);
    function XBoxHome01(UIRenderer, Debugger) {
        var _this = this;
        _super.call(this, UIRenderer, Debugger, 500, 250);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        var _self = this;
        this.AreaA.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaA.LayoutChangedCallback");
        };
    }
    XBoxHome01.prototype.Show = function () {
        this.Debugger.Log("XBoxHome01.Show");
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
            {
                "id": "app5",
                "text": "",
                "data": "scene|OutlookHome01",
                "style": 'background-color:#fff2a7;background-image:url("/Content/Icons/MetroIcons/96x96/Office Apps/Outlook.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }, 
            
        ], {
            "logoUrl": "/Content/Icons/MetroIcons/96x96/Devices & Drives/XBox 360.png",
            "items": [
                {
                    "id": "tb1",
                    "text": "ToolbarItem 1",
                    "data": "action|item1",
                    "style": ''
                }, 
                {
                    "id": "tb2",
                    "text": "SHOW AppBar",
                    "data": "action|open appbar",
                    "style": ''
                }, 
                {
                    "id": "tb3",
                    "text": "ToolbarItem 3",
                    "data": "action|item3",
                    "style": ''
                }, 
                {
                    "id": "tb4",
                    "text": "ToolbarItem 4",
                    "data": "action|item4",
                    "style": ''
                }
            ],
            "title": "XBox",
            "titleLength": 120,
            "backgroundColor": "#228500"
        });
    };
    XBoxHome01.prototype.Unload = function () {
        this.Debugger.Log("XBoxHome01.Unload");
        _super.prototype.Unload.call(this);
    };
    return XBoxHome01;
})(Layout003);
