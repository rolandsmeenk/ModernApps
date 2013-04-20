/// <reference path="..\Layouts\Layout001.ts"/>
/// <reference path="..\Controls\LayoutPanelControl.ts"/>




class ReaderRecordsHome01 extends Layout001 {


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

            switch (parts[2]) {
                case "filter":
                    this._dataGrid.LoadData("GetReaderDataGridData", { id: 10 });
                    break;
                case "filter page":
                    this._dataGrid.LoadPage(parts[3]);
                    break;
                case "preview":
                    this._modernIFrame.LoadUrl("/Content/Reader/SampleReadMessage.html");
                    break;
            }

            

            //this.Debugger.Log("url : " + parts[2]);

            //this._modernIFrame.LoadUrl(parts[2]);

        }
    }


    // =======================
    // SHOW / HIDES
    // =======================
    public Show() {

        var useThisLogo = this.GetCompanyLogo(this.GetQueryVariable("gid"));
        var useThisTheme = _bootup.Theme.GetTheme(this.GetQueryVariable("gid"));
        var useThisName = this.GetQueryVariable("un"); useThisName = useThisName == undefined ? "User 1 (Lazy Blue)" : useThisName;
        var useThisProjectName = this.GetQueryVariable("prjn"); useThisProjectName = useThisProjectName == undefined ? "Group 1" : useThisProjectName;

        super.Show(
            [
                { "id": "app1", "text": "Messages", "data": "scene|ReaderRecordsHome01", "style": 'background-color:Transparent;background-image:url("/Content/Reader/top_panel/records_hover.png");background-position:25px 45px;background-repeat:no-repeat;border:1px solid #8d8d8d;' },
                { "id": "app3", "text": "Contacts", "data": "scene|ReaderContactsHome01", "style": 'background-color:Transparent;background-image:url("/Content/Reader/top_panel/contact_default.png");background-position:25px 45px; background-repeat:no-repeat;border:1px solid #8d8d8d;' },
                { "id": "app2", "text": "Configuration", "data": "scene|ReaderConfigurationHome01", "style": 'background-color:Transparent;background-image:url("/Content/Reader/top_panel/config_default.png");background-position:25px 45px; background-repeat:no-repeat;border:1px solid #8d8d8d;' },
            ],
            {
                "logoUrl": "/Content/Icons/Dark/Like.png",
                "items": [                    
                    { "id": "tb1", "text": "MESSAGES", "data": "action|open appbar", "style": 'padding-top:5px; margin-left:20px; width:130px; font-size:20px; background-image:url("/Content/Reader/main_screen/downArrow_White.png");background-position:105px 18px; background-repeat:no-repeat; ' },
                    { "id": "tb5", "text": "", "data": "", "style": 'background-image:url(' + useThisLogo.logoUrl + '); background-repeat:no-repeat;background-size: Contain;float:right; margin-right:190px;' + useThisLogo.logoStyle },
                    { "id": "tb4", "text": useThisProjectName, "data": "action|open appbar projects", "style": 'padding-right:30px; background-image:url("/Content/Reader/main_screen/downArrow_White.png");background-position: 94% 20px;  background-repeat:no-repeat; float:right;padding-top:10px;' },
                    { "id": "tb3", "text": useThisName, "data": "action|open appbar users", "style": 'padding-right:30px; background-image:url("/Content/Reader/main_screen/downArrow_White.png");background-position: 94% 20px; background-repeat:no-repeat;  float:right; padding-top:10px;' }
                ],
                "title": "READER",
                "titleLength": 180,
                "backgroundColor": useThisTheme.backgroundColor
            },
            {
                "accent1": useThisTheme.accent1,
                "accent2": useThisTheme.accent2,
                "accent3": useThisTheme.accent3,
                "accent4": useThisTheme.accent4,
                "backgroundColor": useThisTheme.backgroundColor,
                "foregroundColor": useThisTheme.foregroundColor,
            }
        );
    
        //set the selected appbaritem
        $("#divAppBar #app1").css("background-color", useThisTheme.accent2).css("border", "0px solid #8d8d8d");

        this.Debugger.Log("ReaderRecordsHome01.Show");

        this._Init(this.AreaB.Dimension.y2 - this.AreaB.Dimension.y1);

        this._modernAccordian.LoadData("GetReaderBlockData", { id: 10 });
        //this._dataGrid.LoadData("GetReaderDataGridData", { id: 10 });
        //this._modernIFrame.LoadUrl("/Content/Reader/SampleReadMessage.html");

    }



    // =======================
    // CLEANUP
    // =======================


    public Unload() {
        
        this.Debugger.Log("ReaderHome01.Unload");


        if (this._modernIFrame != null) this._modernIFrame.Unload();
        if (this._modernAccordian != null) this._modernAccordian.Unload();
        if (this._dataGrid != null) this._dataGrid.Unload();


        super.Unload();

    }



    // =======================
    // INITIALIZE CONTROLS
    // =======================


    private _Init(startHeight: number) {

        this.Debugger.Log("ReaderHome01._InitAct1 startHeight = " + startHeight);

        this._modernIFrame.InitCallbacks({ parent: this, data: null }, null, null);
        this._modernIFrame.InitUI(startHeight);
        this._modernIFrame.Show(this, null, null);


        this._modernAccordian.InitCallbacks({ parent: this, data: null }, null, null);
        this._modernAccordian.InitUI(startHeight);
        this._modernAccordian.Show(this, null, null);


        this._dataGrid.InitCallbacks({ parent: this, data: null }, null, null);
        this._dataGrid.InitUI(startHeight);
        this._dataGrid.Show(this, null, null);


        
    }



}


