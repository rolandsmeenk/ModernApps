var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var OfficeHome01 = (function (_super) {
    __extends(OfficeHome01, _super);
    function OfficeHome01(UIRenderer, Debugger) {
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
            _this.Debugger.Log("OfficeHome01.ResizingStartedCallback");
        };
        this.ResizingCompleteCallback = function () {
            _this.Debugger.Log("OfficeHome01.ResizingCompleteCallback");
        };
    }
    OfficeHome01.prototype.Show = function () {
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
            }
        ], {
            "logoUrl": "/Content/Icons/MetroIcons/96x96/Office Apps/MS Office.png",
            "items": [
                {
                    "id": "tb2",
                    "text": "",
                    "data": "action|open appbar",
                    "style": 'background-image:url("/Content/Icons/c4.png");background-position-x: -70px; background-position-y: -29px;  width: 6px; height: 15px; margin-top:13px; background-size:230px;'
                }, 
                {
                    "id": "tb1",
                    "text": "ToolbarItem 1",
                    "data": "action|item1",
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
            "title": "Microsoft Office",
            "titleLength": 290,
            "backgroundColor": "#ff5e23"
        }, {});
        this.Debugger.Log("OfficeHome01.Show");
        $("#imgLogo").css({
            "height": "40px",
            "margin-top": "15px"
        });
    };
    OfficeHome01.prototype.Unload = function () {
        this.Debugger.Log("OfficeHome01.Unload");
        _super.prototype.Unload.call(this);
    };
    return OfficeHome01;
})(Layout001);
