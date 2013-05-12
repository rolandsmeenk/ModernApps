var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ReaderHelpMessage01 = (function (_super) {
    __extends(ReaderHelpMessage01, _super);
    function ReaderHelpMessage01(UIRenderer, Debugger) {
        var _this = this;
        _super.call(this, UIRenderer, Debugger, $(window).width(), $(window).height() - 45);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this._modernIFrame = new ModernIFrameControl(this.UIRenderer, this.Debugger, "divModernIFrameNewMessage", null);
        this.AreaA.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaA.LayoutChangedCallback");
        };
    }
    ReaderHelpMessage01.prototype.ExecuteAction = function (data) {
        this.Debugger.Log("ReaderHelpMessage01.ExecuteAction params = " + data);
        if (data != null) {
            var parts = data.split("|");
            this.Debugger.Log("url : " + parts[2]);
        }
    };
    ReaderHelpMessage01.prototype.Show = function () {
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
                "data": "act2|ReaderPreviewMessage01|Reader/",
                "style": ''
            }
        ], {
            "logoUrl": "/Content/Icons/dark/Like.png",
            "items": [
                {
                    "id": "tb11",
                    "text": "",
                    "data": "act2|ReaderPreviewMessage01|Reader/",
                    "style": 'color:white; background-image:url("/Content/icons/dark/goback.png");background-position:0px 0px;background-size:50px; background-repeat:no-repeat;padding-left:35px;float:right;margin-right:220px;'
                }
            ],
            "title": "READER",
            "titleLength": 190,
            "backgroundColor": useThisTheme.backgroundColor
        }, {
            "accent1": useThisTheme.accent1,
            "accent2": useThisTheme.accent2,
            "accent3": useThisTheme.accent3,
            "accent4": useThisTheme.accent4,
            "backgroundColor": useThisTheme.backgroundColor,
            "foregroundColor": useThisTheme.foregroundColor
        });
        this.Debugger.Log("ReaderHelpMessage01.Show");
        this._Init(this.AreaA.Dimension.y2 - this.AreaA.Dimension.y1);
        this._modernIFrame.LoadUrl("/Content/Reader/SampleHelpMessage.html");
        $("#divToolBar").css("border-top", "3px solid " + useThisTheme.backgroundColor);
    };
    ReaderHelpMessage01.prototype.Unload = function () {
        this.Debugger.Log("ReaderHelpMessage01.Unload");
        if (this._modernIFrame != null) {
            this._modernIFrame.Unload();
        }
        _super.prototype.Unload.call(this);
    };
    ReaderHelpMessage01.prototype._Init = function (startHeight) {
        this.Debugger.Log("ReaderHelpMessage01._InitAct1 startHeight = " + startHeight);
        this._modernIFrame.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this._modernIFrame.InitUI(startHeight);
        this._modernIFrame.Show(this, null, null);
    };
    return ReaderHelpMessage01;
})(Layout003);
