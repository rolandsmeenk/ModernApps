/// <reference path="..\..\Layouts\Layout001.ts"/>
/// <reference path="..\..\Controls\LayoutPanelControl.ts"/>




class DemoOutlook01 extends Layout001 {


    private _modernIFrame: ModernIFrameControl;
    private _modernAccordian: ModernAccordianControl;
    private _dataGrid: DataGridControl;
    private _searchBox: ModernFilterBoxControl;


    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {
        super(UIRenderer, Debugger);

 
        this._modernIFrame = new ModernIFrameControl(UIRenderer, Debugger, "divModernIFrame", null);
        this._modernAccordian = new ModernAccordianControl(UIRenderer, Debugger, "divModernAccordian", null);
        this._dataGrid = new DataGridControl(UIRenderer, Debugger, "divDataGrid", null);
        this._searchBox = new ModernFilterBoxControl(UIRenderer, Debugger, "divSearchBox", null);


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
            var newRect:any = rect;
            this._modernAccordian.UpdateFromLayout(rect);
            this._modernAccordian.Translate(0, 50);
            this._searchBox.UpdateFromLayout(rect);
        };



        this.ResizingStartedCallback = () => {
            this.Debugger.Log("DemoModernIFrame.ResizingStartedCallback");

            this._modernIFrame.Disable(0.5);
            this._modernIFrame.TemporaryNotification("resizing ...", "Resizing");

            this._dataGrid.Disable(0.5);
            this._dataGrid.TemporaryNotification("resizing ...", "Resizing");
        };

        this.ResizingCompleteCallback = () => {
            this.Debugger.Log("DemoModernIFrame.ResizingCompleteCallback");

            this._modernIFrame.Enable();
            this._modernIFrame.ClearTemporaryNotification();

            this._dataGrid.Enable();
            this._dataGrid.ClearTemporaryNotification();
        };
    }

    public Show() {
        super.Show(
            [
                { "id": "app1", "text": "", "data": "scene|WindowsHome01", "style": 'background-color:#0281d5;background-image:url("/Content/Icons/MetroIcons/96x96/Folders & OS/Windows 8.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;' },
                { "id": "app3", "text": "", "data": "scene|XBoxHome01", "style": 'background-color:#228500;background-image:url("/Content/Icons/MetroIcons/96x96/Devices & Drives/XBox 360.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;' },
                { "id": "app2", "text": "", "data": "scene|WindowsPhoneHome01", "style": 'background-color:#0281d5;background-image:url("/Content/Icons/MetroIcons/96x96/Folders & OS/Windows.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;' },
                { "id": "app4", "text": "", "data": "scene|OfficeHome01", "style": 'background-color:#ff5e23;background-image:url("/Content/Icons/MetroIcons/96x96/Office Apps/MS Office.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;' },
            ],
            []
        );

        this.Debugger.Log("DemoModernIFrame.LayoutChangedCallback");


        this._InitializeModernIFrame(this.AreaB.Dimension.y2 - this.AreaB.Dimension.y1);

        this._modernIFrame.LoadUrl("http://msdn.microsoft.com/en-US/");

        this.RaiseNotification("firstTimeNotify", "<div id='firstTimeNotify'>CTRL+F5 - to make sure you have the latest demo running clear your cache!</div>", 5000);
        
    }


    public Unload() {
        this.Debugger.Log("DemoModernIFrame.LayoutChangedCallback");

        this._modernIFrame.Unload();
        this._modernAccordian.Unload();
        this._dataGrid.Unload();
        this._searchBox.Unload();

        super.Unload();
    }



    // =======================
    // SHOW / HIDES
    // =======================


    public ShowModernIFrame() {
        this.Debugger.Log("DemoModernIFrame:ShowModernIFrame");
        this._modernIFrame.Show(this, null, null);
    }

    public HideModernIFrame() {
        this.Debugger.Log("DemoModernIFrame:HideModernIFrame");
        this._modernIFrame.Hide();
    }

    public ShowModernAccordian() {
        this.Debugger.Log("DemoModernIFrame:ShowModernAccordian");
        this._modernAccordian.Show(this, null, null);
    }

    public HideModernAccordian() {
        this.Debugger.Log("DemoModernIFrame:HideModernAccordian");
        this._modernAccordian.Hide();
    }

    public ShowDataGrid() {
        this.Debugger.Log("DemoModernIFrame:ShowDataGrid");
        this._dataGrid.Show(this, null, null);
    }

    public HideDataGrid() {
        this.Debugger.Log("DemoModernIFrame:ShowDataGrid");
        this._dataGrid.Hide();
    }

    // =======================
    // INITIALIZE CONTROLS
    // =======================


    private _InitializeModernIFrame(startHeight: number) {
        this._modernIFrame.InitCallbacks({ parent: this, data: null }, null, null);
        this._modernIFrame.InitUI(startHeight);
        this.ShowModernIFrame();


        this._modernAccordian.InitCallbacks({ parent: this, data: null }, null, null);
        this._modernAccordian.InitUI(startHeight);
        this.ShowModernAccordian();


        this._dataGrid.InitCallbacks({ parent: this, data: null }, null, null);
        this._dataGrid.InitUI(startHeight);
        this.ShowDataGrid();


        this._modernAccordian.LoadData("GetMenuData", { id: 10 });
        this._dataGrid.LoadData("GetDataGridData", { id: 10 });
    }





}


