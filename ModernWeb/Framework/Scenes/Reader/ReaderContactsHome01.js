var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ReaderContactsHome01 = (function (_super) {
    __extends(ReaderContactsHome01, _super);
    function ReaderContactsHome01(UIRenderer, Debugger) {
        _super.call(this, UIRenderer, Debugger, $(window).width(), $(window).height() - 45);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
    }
    ReaderContactsHome01.prototype.ExecuteAction = function (data) {
        this.Debugger.Log("ReaderContactsHome01.ExecuteAction params = " + data);
        if (data != null) {
            var parts = data.split("|");
            this.Debugger.Log("url : " + parts[2]);
            this._modernIFrame.LoadUrl(parts[2]);
        }
    };
    ReaderContactsHome01.prototype.Show = function () {
        var useThisLogo = this.GetCompanyLogo(this.GetQueryVariable("gid"));
        var useThisTheme = _bootup.Theme.GetTheme(this.GetQueryVariable("gid"));
        var useThisName = this.GetQueryVariable("un");
        useThisName = useThisName == undefined ? "Theme (Lazy Blue)" : useThisName;
        var useThisProjectName = this.GetQueryVariable("prjn");
        useThisProjectName = useThisProjectName == undefined ? "Group 1" : useThisProjectName;
        _super.prototype.Show.call(this, [
            {
                "id": "app1",
                "text": "Messages",
                "data": "scene2|ReaderRecordsHome01|Reader/",
                "style": 'background-color:Transparent;background-image:url("/Content/Reader/top_panel/records_hover.png");background-position:25px 45px;background-repeat:no-repeat;border:1px solid #8d8d8d;'
            }, 
            {
                "id": "app3",
                "text": "Contacts",
                "data": "scene2|ReaderContactsHome01|Reader/",
                "style": 'background-color:Transparent;background-image:url("/Content/Reader/top_panel/contact_default.png");background-position:25px 45px; background-repeat:no-repeat;border:1px solid #8d8d8d;'
            }, 
            {
                "id": "app2",
                "text": "Configuration",
                "data": "scene2|ReaderConfigurationHome01|Reader/",
                "style": 'background-color:Transparent;background-image:url("/Content/Reader/top_panel/config_default.png");background-position:25px 45px; background-repeat:no-repeat;border:1px solid #8d8d8d;'
            }
        ], {
            "logoUrl": "/Content/Icons/Dark/Like.png",
            "items": [
                {
                    "id": "tb1",
                    "text": "CONTACTS",
                    "data": "action|open appbar",
                    "style": 'margin-left:20px; width:150px; font-size:20px;background-image:url("/Content/Reader/main_screen/downArrow_White.png");background-position:115px 18px; background-repeat:no-repeat; '
                }, 
                {
                    "id": "tb5",
                    "text": "",
                    "data": "",
                    "style": 'background-image:url(' + useThisLogo.logoUrl + ');background-position:0px 0px; background-repeat:no-repeat;background-size: Contain;float:right; margin-right:190px;' + useThisLogo.logoStyle
                }, 
                {
                    "id": "tb4",
                    "text": useThisProjectName,
                    "data": "action|open appbar projects",
                    "style": 'padding-right:30px; background-image:url("/Content/Reader/main_screen/downArrow_White.png");background-position: 94% 20px;  background-repeat:no-repeat; float:right;padding-top:10px;'
                }, 
                {
                    "id": "tb3",
                    "text": useThisName,
                    "data": "action|open appbar users",
                    "style": 'padding-right:30px; background-image:url("/Content/Reader/main_screen/downArrow_White.png");background-position: 94% 20px; background-repeat:no-repeat;  float:right; padding-top:10px;'
                }
            ],
            "title": "READER",
            "titleLength": 180,
            "backgroundColor": useThisTheme.backgroundColor
        }, {
            "accent1": useThisTheme.accent1,
            "accent2": useThisTheme.accent2,
            "accent3": useThisTheme.accent3,
            "accent4": useThisTheme.accent4,
            "backgroundColor": useThisTheme.backgroundColor,
            "foregroundColor": useThisTheme.foregroundColor
        });
        $("#divAppBar #app3").css("background-color", useThisTheme.accent2).css("border", "0px solid #8d8d8d");
        this.Debugger.Log("ReaderContactsHome01.Show");
    };
    ReaderContactsHome01.prototype.Unload = function () {
        this.Debugger.Log("ReaderContactsHome01.Unload");
        _super.prototype.Unload.call(this);
    };
    ReaderContactsHome01.prototype._Init = function (startHeight) {
        this.Debugger.Log("ReaderContactsHome01._Init startHeight = " + startHeight);
    };
    return ReaderContactsHome01;
})(Layout003);
