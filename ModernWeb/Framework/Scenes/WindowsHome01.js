var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var WindowsHome01 = (function (_super) {
    __extends(WindowsHome01, _super);
    function WindowsHome01(UIRenderer, Debugger) {
        var _this = this;
        _super.call(this, UIRenderer, Debugger, $(window).width(), $(window).height() - 45);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this._infiniteCanvasControl = new InfiniteCanvasControl(this.UIRenderer, this.Debugger, "divInfiniteCanvas", null, 21);
        var _self = this;
        this.AreaA.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaA.LayoutChangedCallback");
            _this._infiniteCanvasControl.UpdateFromLayout(rect);
        };
    }
    WindowsHome01.prototype.Show = function () {
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
            "logoUrl": "/Content/Icons/MetroIcons/96x96/Folders & OS/Windows 8.png",
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
            "title": "Windows",
            "titleLength": 160,
            "backgroundColor": "#0281d5"
        }, {
            "accent1": "#0281d5",
            "accent2": "#2a91d5",
            "accent3": "#56a4d8",
            "accent4": "#77b5de",
            "backgroundColor": "#fff",
            "foregroundColor": "#000"
        });
        this.Debugger.Log("WindowsHome01.Show");
        this.RaiseNotification("firstTimeNotify", "<div id='firstTimeNotify'>CTRL+F5 - to make sure you have the latest demo running clear your cache!</div>", 5000);
        _bootup.Theme.AccentColor1 = this.GetSetting("accent1");
        _bootup.Theme.AccentColor2 = this.GetSetting("accent2");
        _bootup.Theme.AccentColor3 = this.GetSetting("accent3");
        _bootup.Theme.AccentColor4 = this.GetSetting("accent4");
        _bootup.Theme.BackgroundColor = this.GetSetting("backgroundColor");
        _bootup.Theme.ForegroundColor = this.GetSetting("foregroundColor");
        this._infiniteCanvasControl.InitTheme(_bootup.Theme);
    };
    WindowsHome01.prototype.Unload = function () {
        this.Debugger.Log("WindowsHome01.Unload");
        this._infiniteCanvasControl.Unload();
        _super.prototype.Unload.call(this);
    };
    return WindowsHome01;
})(Layout003);
