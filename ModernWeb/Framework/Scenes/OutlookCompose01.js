var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var OutlookCompose01 = (function (_super) {
    __extends(OutlookCompose01, _super);
    function OutlookCompose01(UIRenderer, Debugger) {
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
        this.ResizingStartedCallback = function () {
            _this.Debugger.Log("OutlookCompose01.ResizingStartedCallback");
        };
        this.ResizingCompleteCallback = function () {
            _this.Debugger.Log("OutlookCompose01.ResizingCompleteCallback");
        };
    }
    OutlookCompose01.prototype.ExecuteAction = function (data) {
        this.Debugger.Log("OutlookCompose01.ExecuteAction params = " + data);
        if (data != null) {
            var parts = data.split("|");
            this.Debugger.Log("url : " + parts[2]);
        }
    };
    OutlookCompose01.prototype.Show = function () {
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
            "logoUrl": "/Content/Icons/MetroIcons/96x96/Office Apps/Outlook.png",
            "items": [
                {
                    "id": "tb2",
                    "text": "",
                    "data": "action|open appbar",
                    "style": 'background-image:url("/Content/Icons/c4.png");background-position-x: -70px; background-position-y: -29px;  width: 6px; height: 15px; margin-top:13px; background-size:230px;'
                }, 
                {
                    "id": "tb1",
                    "text": "Home",
                    "data": "act|OutlookHome01",
                    "style": 'margin-left:20px;'
                }, 
                {
                    "id": "tb3",
                    "text": "Compose",
                    "data": "act|OutlookCompose01",
                    "style": ''
                }, 
                {
                    "id": "tb4",
                    "text": "Settings",
                    "data": "act|OutlookSettings01",
                    "style": ''
                }
            ],
            "title": "Outlook",
            "titleLength": 220,
            "backgroundColor": "#ffce5a"
        }, {});
        this.Debugger.Log("OutlookHome01.Show");
        $("#imgLogo").css({
            "height": "40px",
            "margin-top": "15px"
        });
        this._Init(this.AreaB.Dimension.y1, this.AreaB.Dimension.y2 - this.AreaB.Dimension.y1);
    };
    OutlookCompose01.prototype.Unload = function () {
        this.Debugger.Log("OutlookCompose01.Unload");
        _super.prototype.Unload.call(this);
    };
    OutlookCompose01.prototype._Init = function (startWidthA, startWidthB) {
        this.Debugger.Log("OutlookCompose01._InitAct1 startHeight = " + startWidthB);
    };
    return OutlookCompose01;
})(Layout002);
