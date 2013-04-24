var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ReaderComposeFavorite01 = (function (_super) {
    __extends(ReaderComposeFavorite01, _super);
    function ReaderComposeFavorite01(UIRenderer, Debugger) {
        var _this = this;
        _super.call(this, UIRenderer, Debugger, $(window).width(), $(window).height() - 45);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this._modernIFrame = new ModernIFrameControl(this.UIRenderer, this.Debugger, "divModernIFrameNewMessage", null);
        this.AreaA.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaA.LayoutChangedCallback");
        };
    }
    ReaderComposeFavorite01.prototype.ExecuteAction = function (data) {
        this.Debugger.Log("ReaderComposeFavorite01.ExecuteAction params = " + data);
        if(data != null) {
            var parts = data.split("|");
            this.Debugger.Log("url : " + parts[2]);
        }
    };
    ReaderComposeFavorite01.prototype.Show = function () {
        var useThisLogo = this.GetCompanyLogo(this.GetQueryVariable("gid"));
        var useThisTheme = _bootup.Theme.GetTheme(this.GetQueryVariable("gid"));
        var useThisName = this.GetQueryVariable("un");
        useThisName = useThisName == undefined ? "Theme (Lazy Blue)" : useThisName;
        var useThisProjectName = this.GetQueryVariable("prjn");
        useThisProjectName = useThisProjectName == undefined ? "Group 1" : useThisProjectName;
        _super.prototype.Show.call(this, [
            {
                "id": "app1",
                "text": "Message",
                "data": "act|Reader/ReaderComposeMessage01",
                "style": ''
            }, 
            
        ], {
            "logoUrl": "/Content/Icons/dark/Like.png",
            "items": [
                {
                    "id": "tb1",
                    "text": "Save",
                    "data": "action|execute parent|close favorite",
                    "style": 'background-image:url("/Content/icons/dark/save.png");background-position:0px 0px;background-size:50px; background-repeat:no-repeat;padding-left:35px;'
                }, 
                {
                    "id": "tb10",
                    "text": "Close",
                    "data": "action|execute parent|close favorite",
                    "style": 'background-image:url("/Content/icons/dark/close.png");background-position:0px 0px;background-size:50px; background-repeat:no-repeat;padding-left:35px; float:right; margin-right:270px;'
                }, 
                
            ],
            "title": "FAVOURITE",
            "titleLength": 260,
            "backgroundColor": useThisTheme.accent2
        }, {
            "accent1": useThisTheme.accent1,
            "accent2": useThisTheme.accent2,
            "accent3": useThisTheme.accent3,
            "accent4": useThisTheme.accent4,
            "backgroundColor": useThisTheme.backgroundColor,
            "foregroundColor": useThisTheme.foregroundColor
        });
        this.Debugger.Log("ReaderComposeFavorite01.Show");
        _bootup.Theme.AccentColor1 = this.GetSetting("accent1");
        _bootup.Theme.AccentColor2 = this.GetSetting("accent2");
        _bootup.Theme.AccentColor3 = this.GetSetting("accent3");
        _bootup.Theme.AccentColor4 = this.GetSetting("accent4");
        _bootup.Theme.BackgroundColor = this.GetSetting("backgroundColor");
        _bootup.Theme.ForegroundColor = this.GetSetting("foregroundColor");
        this._Init(this.AreaA.Dimension.y2 - this.AreaA.Dimension.y1);
        $("#divToolBar").css("border-top", "3px solid " + useThisTheme.backgroundColor);
    };
    ReaderComposeFavorite01.prototype.Unload = function () {
        this.Debugger.Log("ReaderComposeFavorite01.Unload");
        if(this._modernIFrame != null) {
            this._modernIFrame.Unload();
        }
        _super.prototype.Unload.call(this);
    };
    ReaderComposeFavorite01.prototype._Init = function (startHeight) {
        this.Debugger.Log("ReaderComposeFavorite01._InitAct1 startHeight = " + startHeight);
        this._modernIFrame.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this._modernIFrame.InitUI(startHeight);
        this._modernIFrame.Show(this, null, null);
    };
    return ReaderComposeFavorite01;
})(Layout003);
