/// <reference path="..\..\Layouts\Layout001.ts"/>
/// <reference path="..\..\Controls\LayoutPanelControl.ts"/>




class DemoWysihtml5 extends Layout001 {



    //LAYOUT CHILDREN
    private _wysihtml5Control: Wysihtml5Control;


    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {
        super(UIRenderer, Debugger);

        //LAYOUT CHILDREN
        this._wysihtml5Control = new Wysihtml5Control(UIRenderer, Debugger, "divWysihtml5", null);



        //WHEN LAYOUTS UPDATE THIS IS WHAT IS USED TO REFRESH OTHER CONTROLS
        this.AreaA.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("AreaA.LayoutChangedCallback");
            this._wysihtml5Control.UpdateFromLayout(rect);
        };


        this.AreaB.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("AreaB.LayoutChangedCallback");

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

        this.Debugger.Log("DemoWysihtml5.LayoutChangedCallback");



        this._InitializeWysihtml5(this.AreaA.Dimension.y2 - this.AreaA.Dimension.y1);
    }


    public Unload() {
        super.Unload();

        this.Debugger.Log("DemoWysihtml5.LayoutChangedCallback");



        this._wysihtml5Control.Unload();

    }



    // =======================
    // SHOW / HIDES
    // =======================



    public ShowWysihtml5() {
        this.Debugger.Log("DemoWysihtml5:ShowWysihtml5");
        this._wysihtml5Control.Show(this, null, null);
    }

    public HideWysihtml5() {
        this.Debugger.Log("DemoWysihtml5:HideWysihtml5");
        this._wysihtml5Control.Hide();
    }






    // =======================
    // INITIALIZE CONTROLS
    // =======================




    private _InitializeWysihtml5(startHeight: number) {
        this._wysihtml5Control.InitCallbacks({ parent: this, data: null }, null, null);
        this._wysihtml5Control.InitUI(startHeight);

        this.ShowWysihtml5();
    }





}


