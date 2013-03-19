/// <reference path="..\Layouts\Layout002.ts"/>
/// <reference path="..\Controls\LayoutPanelControl.ts"/>




class OutlookCompose01 extends Layout002 {


    //private _tinyMCEControl: TinyMCEControl;




    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {
        super(UIRenderer, Debugger);

        //LAYOUT CHILDREN
        //this._tinyMCEControl = new TinyMCEControl(UIRenderer, Debugger, "divTinyMCE", null);


        //WHEN LAYOUTS UPDATE THIS IS WHAT IS USED TO REFRESH OTHER CONTROLS
        this.AreaA.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("AreaA.LayoutChangedCallback");

        };

        this.AreaB.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("AreaB.LayoutChangedCallback");
            //this._tinyMCEControl.UpdateFromLayout(rect);
        };


        this.ResizingStartedCallback = () => {
            this.Debugger.Log("OutlookCompose01.ResizingStartedCallback");


        };

        this.ResizingCompleteCallback = () => {
            this.Debugger.Log("OutlookCompose01.ResizingCompleteCallback");

        };


    }



    public ExecuteAction(data: any) {
        //override this from the scene
        this.Debugger.Log("OutlookCompose01.ExecuteAction params = " + data);
        
        if (data != null) {
            var parts = data.split("|");

            this.Debugger.Log("url : " + parts[2]);



        }
    }


    // =======================
    // SHOW / HIDES
    // =======================
    public Show() {
        super.Show(
            [
                { "id": "app1", "text": "", "data": "scene|WindowsHome01", "style": 'background-color:#0281d5;background-image:url("/Content/Icons/MetroIcons/96x96/Folders & OS/Windows 8.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;' },
                { "id": "app3", "text": "", "data": "scene|XBoxHome01", "style": 'background-color:#228500;background-image:url("/Content/Icons/MetroIcons/96x96/Devices & Drives/XBox 360.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;' },
                { "id": "app2", "text": "", "data": "scene|WindowsPhoneHome01", "style": 'background-color:#0281d5;background-image:url("/Content/Icons/MetroIcons/96x96/Folders & OS/Windows.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;' },
                { "id": "app4", "text": "", "data": "scene|OfficeHome01", "style": 'background-color:#ff5e23;background-image:url("/Content/Icons/MetroIcons/96x96/Office Apps/MS Office.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;' },
                { "id": "app5", "text": "", "data": "scene|OutlookHome01", "style": 'background-color:#fff2a7;background-image:url("/Content/Icons/MetroIcons/96x96/Office Apps/Outlook.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;' },
            ],
            {
                "logoUrl": "/Content/Icons/MetroIcons/96x96/Office Apps/Outlook.png",
                "items": [
                    { "id": "tb2", "text": "", "data": "action|open appbar", "style": 'background-image:url("/Content/Icons/c4.png");background-position-x: -70px; background-position-y: -29px;  width: 6px; height: 15px; margin-top:13px; background-size:230px;' },
                    { "id": "tb1", "text": "Home", "data": "act|OutlookHome01", "style": 'margin-left:20px;' },
                    { "id": "tb3", "text": "Compose", "data": "act|OutlookCompose01", "style": '' },
                    { "id": "tb4", "text": "Settings", "data": "act|OutlookSettings01", "style": '' }
                ],
                "title": "Outlook",
                "titleLength": 160,
                "backgroundColor": "#ffce5a"
            },
            {}
        );
        this.Debugger.Log("OutlookHome01.Show");
    
        this._Init(this.AreaB.Dimension.y1, this.AreaB.Dimension.y2 - this.AreaB.Dimension.y1);



    }

    //public ShowTinyMCE() {
    //    this.Debugger.Log("OutlookCompose01:ShowTinyMCE");
    //    //this._tinyMCEControl.Show(this, null, null);
    //}

    //public HideTinyMCE() {
    //    this.Debugger.Log("OutlookCompose01:HideTinyMCE");
    //    this._tinyMCEControl.Hide();
    //}



    // =======================
    // CLEANUP
    // =======================


    public Unload() {
        
        this.Debugger.Log("OutlookCompose01.Unload");



        super.Unload();

    }



    // =======================
    // INITIALIZE CONTROLS
    // =======================


    private _Init(startWidthA: number, startWidthB: number) {

        this.Debugger.Log("OutlookCompose01._InitAct1 startHeight = " + startWidthB);

        
        //this._InitializeTinyMCE(startWidthB);
    }



    //private _InitializeTinyMCE(startWidth: number) {
    //    this._tinyMCEControl.InitCallbacks({ parent: this, data: null }, null, null);
    //    //this._tinyMCEControl.InitUI(startWidth);

    //    this.ShowTinyMCE();
    //}

}


