/// <reference path="..\Layouts\Layout001.ts"/>
/// <reference path="..\Controls\LayoutPanelControl.ts"/>




class KeystoneRecordsHome01 extends Layout001 {


    private _modernIFrame: ModernIFrameControl;
    private _modernAccordian: ModernAccordianControl;
    private _dataGrid: DataGridControl;


    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {
        super(UIRenderer, Debugger);

        this._modernIFrame = new ModernIFrameControl(this.UIRenderer, this.Debugger, "divModernIFrame", null);
        this._modernAccordian = new ModernAccordianControl(this.UIRenderer, this.Debugger, "divModernAccordian", null);
        this._dataGrid = new DataGridControl(this.UIRenderer, this.Debugger, "divDataGrid", null);
        

        //WHEN LAYOUTS UPDATE THIS IS WHAT IS USED TO REFRESH OTHER CONTROLS
        this.AreaA.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("AreaA.LayoutChangedCallback");
            this._dataGrid.UpdateFromLayout(rect);
        };

        this.AreaB.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("AreaB.LayoutChangedCallback");
            this._modernIFrame.UpdateFromLayout(rect);
        };

        this.AreaC.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("AreaC.LayoutChangedCallback");
            var newRect: any = rect;
            this._modernAccordian.UpdateFromLayout(rect);
            this._modernAccordian.Translate(0, 0);

        };

        this.ResizingStartedCallback = () => {
            this.Debugger.Log("OutlookHome01.ResizingStartedCallback");

            this._modernIFrame.Disable(0.5);
            this._modernIFrame.TemporaryNotification("resizing ...", "Resizing");

            this._dataGrid.Disable(0.5);
            this._dataGrid.TemporaryNotification("resizing ...", "Resizing");
        };

        this.ResizingCompleteCallback = () => {
            this.Debugger.Log("OutlookHome01.ResizingCompleteCallback");

            this._modernIFrame.Enable();
            this._modernIFrame.ClearTemporaryNotification();

            this._dataGrid.Enable();
            this._dataGrid.ClearTemporaryNotification();
        };


    }



    public ExecuteAction(data: any) {
        //override this from the scene
        this.Debugger.Log("OutlookHome01.ExecuteAction params = " + data);
        
        if (data != null) {
            var parts = data.split("|");

            this.Debugger.Log("url : " + parts[2]);

            this._modernIFrame.LoadUrl(parts[2]);

        }
    }


    // =======================
    // SHOW / HIDES
    // =======================
    public Show() {
        super.Show(
            [
                { "id": "app1", "text": "", "data": "scene|KeystonRecordsHome01", "style": 'background-color:#0281d5;background-image:url("/Content/keystone/top_panel/record_hover.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;border-width:1px;border-color:white;' },
                { "id": "app3", "text": "", "data": "scene|KeystonContactsHome01", "style": 'background-color:#0281d5;background-image:url("/Content/keystone/top_panel/contact_default.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;border-width:1px;border-color:white;' },
                { "id": "app2", "text": "", "data": "scene|KeystonConfigurationHome01", "style": 'background-color:#0281d5;background-image:url("/Content/keystone/top_panel/configuration_default.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;border-width:1px;border-color:white;' },
                { "id": "app4", "text": "", "data": "scene|KeystonPortalHome01", "style": 'background-color:#0281d5;background-image:url("/Content/keystone/top_panel/portal_default.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;border-width:1px;border-color:white;' },
                { "id": "app5", "text": "", "data": "scene|KeystonSupportHome01", "style": 'background-color:#0281d5;background-image:url("/Content/keystone/top_panel/support_default.png");background-position-x:25px;background-position-y:25px;background-size:50px; background-repeat:no-repeat;border-width:1px;border-color:white;' },
                { "id": "app6", "text": "", "data": "scene|KeystonHelpHome01", "style": 'background-color:#0281d5;background-image:url("/Content/keystone/top_panel/help_default.png");background-position-x:25px;background-position-y:25px;background-size:50px; background-repeat:no-repeat;border-width:1px;border-color:white;' },
                { "id": "app7", "text": "", "data": "scene|KeystonLogOutHome01", "style": 'background-color:#0281d5;background-image:url("/Content/keystone/top_panel/signout_default.png");background-position-x:25px;background-position-y:25px;background-size:50px; background-repeat:no-repeat;border-width:1px;border-color:white;' },
            ],
            {
                "logoUrl": "/Content/keystone/main_screen/logo.png",
                "items": [                    
                    { "id": "tb1", "text": "RECORDS", "data": "act|ChangeArea01", "style": 'margin-left:20px;font-size:20px;margin-top:-5px;height:40px;' },
                    { "id": "tb2", "text": "", "data": "action|open appbar", "style": 'margin-left:0px;background-image:url("/Content/Icons/c4.png");background-position-x: -70px; background-position-y: -29px;  width: 6px; height: 15px; margin-top:13px; background-size:230px;' },
                    { "id": "tb3", "text": "Jose Fajardo (Admin)", "data": "act|ProxyUser01", "style": 'margin-left:590px;width:160px;' },
                    { "id": "tb4", "text": "Wellington Dam", "data": "act|ChangeProject01", "style": 'width:150px;' },
                    { "id": "tb5", "text": "[Company Logo]", "data": "", "style": 'width:130px;height:40px;background-color:red;' }
                ],
                "title": "",
                "titleLength": 160,
                "backgroundColor": "#0281d5"
            },
            {}
        );
        this.Debugger.Log("KeystoneHome01.Show");
    
        this._Init(this.AreaB.Dimension.y2 - this.AreaB.Dimension.y1);

        this._modernIFrame.LoadUrl("http://msdn.microsoft.com/en-US/");
    }




    // =======================
    // CLEANUP
    // =======================


    public Unload() {
        
        this.Debugger.Log("KeystoneHome01.Unload");


        if (this._modernIFrame != null) this._modernIFrame.Unload();
        if (this._modernAccordian != null) this._modernAccordian.Unload();
        if (this._dataGrid != null) this._dataGrid.Unload();


        super.Unload();

    }



    // =======================
    // INITIALIZE CONTROLS
    // =======================


    private _Init(startHeight: number) {

        this.Debugger.Log("KeystoneHome01._InitAct1 startHeight = " + startHeight);

        this._modernIFrame.InitCallbacks({ parent: this, data: null }, null, null);
        this._modernIFrame.InitUI(startHeight);
        this._modernIFrame.Show(this, null, null);


        this._modernAccordian.InitCallbacks({ parent: this, data: null }, null, null);
        this._modernAccordian.InitUI(startHeight);
        this._modernAccordian.Show(this, null, null);


        this._dataGrid.InitCallbacks({ parent: this, data: null }, null, null);
        this._dataGrid.InitUI(startHeight);
        this._dataGrid.Show(this, null, null);


        this._modernAccordian.LoadData("GetMenuData", { id: 10 });
        this._dataGrid.LoadData("GetDataGridData", { id: 10 });
    }



}


