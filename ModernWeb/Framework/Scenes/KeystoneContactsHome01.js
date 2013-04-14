var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var KeystoneContactsHome01 = (function (_super) {
    __extends(KeystoneContactsHome01, _super);
    function KeystoneContactsHome01(UIRenderer, Debugger) {
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
            _this.Debugger.Log("OutlookHome01.ResizingStartedCallback");
            _this._modernIFrame.Disable(0.5);
            _this._modernIFrame.TemporaryNotification("resizing ...", "Resizing");
            _this._dataGrid.Disable(0.5);
            _this._dataGrid.TemporaryNotification("resizing ...", "Resizing");
        };
        this.ResizingCompleteCallback = function () {
            _this.Debugger.Log("OutlookHome01.ResizingCompleteCallback");
            _this._modernIFrame.Enable();
            _this._modernIFrame.ClearTemporaryNotification();
            _this._dataGrid.Enable();
            _this._dataGrid.ClearTemporaryNotification();
        };
    }
    KeystoneContactsHome01.prototype.ExecuteAction = function (data) {
        this.Debugger.Log("OutlookHome01.ExecuteAction params = " + data);
        if(data != null) {
            var parts = data.split("|");
            this.Debugger.Log("url : " + parts[2]);
            this._modernIFrame.LoadUrl(parts[2]);
        }
    };
    KeystoneContactsHome01.prototype.Show = function () {
        _super.prototype.Show.call(this, [
            {
                "id": "app1",
                "text": "",
                "data": "scene|KeystonRecordsHome01",
                "style": 'background-color:#0281d5;background-image:url("/Content/Icons/MetroIcons/96x96/Folders & OS/Windows 8.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }, 
            {
                "id": "app3",
                "text": "",
                "data": "scene|KeystonContactsHome01",
                "style": 'background-color:#228500;background-image:url("/Content/Icons/MetroIcons/96x96/Devices & Drives/XBox 360.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }, 
            {
                "id": "app2",
                "text": "",
                "data": "scene|KeystonConfigurationHome01",
                "style": 'background-color:#0281d5;background-image:url("/Content/Icons/MetroIcons/96x96/Folders & OS/Windows.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }, 
            {
                "id": "app4",
                "text": "",
                "data": "scene|KeystonPortalHome01",
                "style": 'background-color:#ff5e23;background-image:url("/Content/Icons/MetroIcons/96x96/Office Apps/MS Office.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }, 
            {
                "id": "app5",
                "text": "",
                "data": "scene|KeystonSupportHome01",
                "style": 'background-color:#fff2a7;background-image:url("/Content/Icons/MetroIcons/96x96/Office Apps/Outlook.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }, 
            {
                "id": "app6",
                "text": "",
                "data": "scene|KeystonHelpHome01",
                "style": 'background-color:#fff2a7;background-image:url("/Content/Icons/MetroIcons/96x96/Office Apps/Outlook.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }, 
            {
                "id": "app7",
                "text": "",
                "data": "scene|KeystonLogOutHome01",
                "style": 'background-color:#fff2a7;background-image:url("/Content/Icons/MetroIcons/96x96/Office Apps/Outlook.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }, 
            
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
                    "text": "RECORDS",
                    "data": "act|ChangeArea01",
                    "style": 'margin-left:20px;'
                }, 
                {
                    "id": "tb3",
                    "text": "Jose Fajardo (Admin)",
                    "data": "act|ProxyUser01",
                    "style": ''
                }, 
                {
                    "id": "tb4",
                    "text": "Wellington Dam",
                    "data": "act|ChangeProject01",
                    "style": ''
                }
            ],
            "title": "Keystone",
            "titleLength": 160,
            "backgroundColor": "#0281d5"
        }, {
        });
        this.Debugger.Log("KeystoneHome01.Show");
        this._Init(this.AreaB.Dimension.y2 - this.AreaB.Dimension.y1);
        this._modernIFrame.LoadUrl("http://msdn.microsoft.com/en-US/");
    };
    KeystoneContactsHome01.prototype.Unload = function () {
        this.Debugger.Log("KeystoneHome01.Unload");
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
    KeystoneContactsHome01.prototype._Init = function (startHeight) {
        this.Debugger.Log("KeystoneHome01._InitAct1 startHeight = " + startHeight);
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
        this._modernAccordian.LoadData("GetMenuData", {
            id: 10
        });
        this._dataGrid.LoadData("GetDataGridData", {
            id: 10
        });
    };
    return KeystoneContactsHome01;
})(Layout001);
