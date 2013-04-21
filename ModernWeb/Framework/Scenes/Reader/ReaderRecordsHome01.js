var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ReaderRecordsHome01 = (function (_super) {
    __extends(ReaderRecordsHome01, _super);
    function ReaderRecordsHome01(UIRenderer, Debugger) {
        var _this = this;
        _super.call(this, UIRenderer, Debugger);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this._modernIFrame = new ModernIFrameControl(this.UIRenderer, this.Debugger, "divModernIFrame", null);
        this._modernAccordian = new ModernAccordianControl(this.UIRenderer, this.Debugger, "divModernAccordian", null);
        this._dataGrid = new DataGridControl(this.UIRenderer, this.Debugger, "divDataGrid", null);
        this.AreaA.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaA.LayoutChangedCallback");
            _this._dataGrid.UpdateFromLayout(rect);
        };
        this.AreaB.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaB.LayoutChangedCallback");
            _this._modernIFrame.UpdateFromLayout(rect);
        };
        this.AreaC.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaC.LayoutChangedCallback");
            var newRect = rect;
            _this._modernAccordian.UpdateFromLayout(rect);
            _this._modernAccordian.Translate(0, 0);
        };
        this.ResizingStartedCallback = function () {
            _this.Debugger.Log("ReaderRecordsHome01.ResizingStartedCallback");
            _this._modernIFrame.Disable(0.5);
            _this._modernIFrame.TemporaryNotification("resizing ...", "Resizing");
            _this._dataGrid.Disable(0.5);
            _this._dataGrid.TemporaryNotification("resizing ...", "Resizing");
        };
        this.ResizingCompleteCallback = function () {
            _this.Debugger.Log("ReaderRecordsHome01.ResizingCompleteCallback");
            _this._modernIFrame.Enable();
            _this._modernIFrame.ClearTemporaryNotification();
            _this._dataGrid.Enable();
            _this._dataGrid.ClearTemporaryNotification();
        };
    }
    ReaderRecordsHome01.prototype.ExecuteAction = function (data) {
        this.Debugger.Log("ReaderRecordsHome01.ExecuteAction params = " + data);
        if(data != null) {
            var parts = data.split("|");
            switch(parts[2]) {
                case "filter":
                    if(this._dataGrid.VisualState == 100) {
                        this._dataGrid.AnimateTopToolbarOut();
                        this.HorizontalDividerControl.AnimateTop(280, false);
                        var _self = this;
                        setTimeout(function () {
                            _self._dataGrid.LoadData("GetReaderDataGridData", {
                                id: 10
                            });
                        }, 600);
                    } else {
                        this._dataGrid.LoadData("GetReaderDataGridData", {
                            id: 10
                        });
                    }
                    break;
                case "filter page":
                    this._dataGrid.LoadPage(parts[3]);
                    break;
                case "preview":
                    if(parts[3] == "url") {
                        this._modernIFrame.LoadUrl(parts[4]);
                    } else {
                        this._modernIFrame.LoadUrl("/Content/Reader/SampleReadMessage.html");
                    }
                    break;
                case "add rss":
                case "add favourite":
                case "add music":
                case "add pic":
                case "add mail":
                case "add calendar":
                case "add video":
                    var url = "";
                    var qsp = this.GetQueryStringParams();
                    qsp.Page = parts[3] + "|" + parts[4];
                    var qs = this.GenerateQueryString(qsp);
                    url = "http://" + document.location.host + "?" + qs;
                    if(this._dataGrid.VisualState == 100) {
                        this._modernIFrame.LoadUrl(url);
                    } else {
                        this._dataGrid.AnimateTopToolbarIn();
                        this.HorizontalDividerControl.AnimateTop(77, true);
                        var _self = this;
                        setTimeout(function () {
                            _self._modernIFrame.LoadUrl(url);
                        }, 600);
                    }
                    break;
                case "close rss":
                case "close favourite":
                case "close music":
                case "close pic":
                case "close mail":
                case "close calendar":
                case "close video":
                    this._dataGrid.AnimateTopToolbarOut();
                    this.HorizontalDividerControl.AnimateTop(280, false);
                    var _self = this;
                    setTimeout(function () {
                        _self._dataGrid.SelectFirst();
                    }, 600);
                    break;
            }
        }
    };
    ReaderRecordsHome01.prototype.Show = function () {
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
            }, 
            
        ], {
            "logoUrl": "/Content/Icons/Dark/Like.png",
            "items": [
                {
                    "id": "tb1",
                    "text": "MESSAGES",
                    "data": "action|open appbar",
                    "style": 'padding-top:5px; margin-left:20px; width:130px; font-size:20px; background-image:url("/Content/Reader/main_screen/downArrow_White.png");background-position:105px 18px; background-repeat:no-repeat; '
                }, 
                {
                    "id": "tb5",
                    "text": "",
                    "data": "",
                    "style": 'background-image:url(' + useThisLogo.logoUrl + '); background-repeat:no-repeat;background-size: Contain;float:right; margin-right:190px;' + useThisLogo.logoStyle
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
        $("#divAppBar #app1").css("background-color", useThisTheme.accent2).css("border", "0px solid #8d8d8d");
        this.Debugger.Log("ReaderHome01.Show");
        this._Init(this.AreaB.Dimension.y2 - this.AreaB.Dimension.y1);
        this._modernAccordian.LoadData("GetReaderBlockData", {
            id: 10
        });
    };
    ReaderRecordsHome01.prototype.Unload = function () {
        this.Debugger.Log("ReaderHome01.Unload");
        if(this._modernIFrame != null) {
            this._modernIFrame.Unload();
        }
        if(this._modernAccordian != null) {
            this._modernAccordian.Unload();
        }
        if(this._dataGrid != null) {
            this._dataGrid.Unload();
        }
        _super.prototype.Unload.call(this);
    };
    ReaderRecordsHome01.prototype._Init = function (startHeight) {
        this.Debugger.Log("ReaderHome01._InitAct1 startHeight = " + startHeight);
        this._modernIFrame.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this._modernIFrame.InitUI(startHeight);
        this._modernIFrame.Show(this, null, null);
        this._modernAccordian.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this._modernAccordian.InitUI(startHeight);
        this._modernAccordian.Show(this, null, null);
        this._dataGrid.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this._dataGrid.InitUI(startHeight);
        this._dataGrid.Show(this, null, null);
    };
    return ReaderRecordsHome01;
})(Layout001);
