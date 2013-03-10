/// <reference path="..\..\Layouts\Layout001.ts"/>
/// <reference path="..\..\Controls\LayoutPanelControl.ts"/>




class DemoTinyMCE extends Layout001 {



    //LAYOUT CHILDREN
    private _tinyMCEControl: TinyMCEControl;


    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {
        super(UIRenderer, Debugger);


        //LAYOUT CHILDREN
        this._tinyMCEControl = new TinyMCEControl(UIRenderer, Debugger, "divTinyMCE", null);




        //WHEN LAYOUTS UPDATE THIS IS WHAT IS USED TO REFRESH OTHER CONTROLS
        this.AreaA.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("AreaA.LayoutChangedCallback");
        };


        this.AreaB.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("AreaB.LayoutChangedCallback");
            this._tinyMCEControl.UpdateFromLayout(rect);
        };

        this.AreaC.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("AreaC.LayoutChangedCallback");

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

        this.Debugger.Log("DemoTinyMCE.LayoutChangedCallback");



        //LAYOUT CHILDREN        
        this._InitializeTinyMCE(this.AreaB.Dimension.y2 - this.AreaB.Dimension.y1);

    }


    public Unload() {
        super.Unload();

        this.Debugger.Log("DemoTinyMCE.LayoutChangedCallback");


        this._tinyMCEControl.Unload();

    }



    // =======================
    // SHOW / HIDES
    // =======================

    public ShowTinyMCE() {
        this.Debugger.Log("DemoTinyMCE:ShowTinyMCE");
        this._tinyMCEControl.Show(this, null, null);
    }

    public HideTinyMCE() {
        this.Debugger.Log("DemoTinyMCE:HideTinyMCE");
        this._tinyMCEControl.Hide();
    }





    // =======================
    // INITIALIZE CONTROLS
    // =======================



    private _InitializeTinyMCE(startHeight: number) {
        this._tinyMCEControl.InitCallbacks({ parent: this, data: null }, null, null);
        this._tinyMCEControl.InitUI(startHeight);

        this.ShowTinyMCE();
    }






}


