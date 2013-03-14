/// <reference path="..\..\Layouts\Layout001.ts"/>
/// <reference path="..\..\Controls\LayoutPanelControl.ts"/>




class DemoModernIFrame extends Layout001 {





    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {
        super(UIRenderer, Debugger);

        //WHEN LAYOUTS UPDATE THIS IS WHAT IS USED TO REFRESH OTHER CONTROLS
        this.AreaA.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("AreaA.LayoutChangedCallback");

        };

        this.AreaB.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("AreaB.LayoutChangedCallback");

        };

        this.AreaC.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("AreaC.LayoutChangedCallback");
            var newRect:any = rect;

        };



        this.ResizingStartedCallback = () => {
            this.Debugger.Log("DemoModernIFrame.ResizingStartedCallback");


        };

        this.ResizingCompleteCallback = () => {
            this.Debugger.Log("DemoModernIFrame.ResizingCompleteCallback");


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
            [],
            {}
        );

        this.Debugger.Log("DemoModernIFrame.LayoutChangedCallback");


        this._InitializeModernIFrame(this.AreaB.Dimension.y2 - this.AreaB.Dimension.y1);

         
    }


    public Unload() {
        super.Unload();

        this.Debugger.Log("DemoModernIFrame.LayoutChangedCallback");


    }



    // =======================
    // SHOW / HIDES
    // =======================


    // =======================
    // INITIALIZE CONTROLS
    // =======================


    private _InitializeModernIFrame(startHeight: number) {

    }





}


