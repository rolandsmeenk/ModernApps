/// <reference path="..\Layouts\Layout003.ts"/>
/// <reference path="..\Controls\LayoutPanelControl.ts"/>




class WindowsHome01 extends Layout003 {

    private _infiniteCanvasControl: InfiniteCanvasControl;


    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {
        super(UIRenderer, Debugger, 700, 450);

        this._infiniteCanvasControl = new InfiniteCanvasControl(this.UIRenderer, this.Debugger, "divInfiniteCanvas", null);

        //WHEN LAYOUTS UPDATE THIS IS WHAT IS USED TO REFRESH OTHER CONTROLS
        var _self = this;
        this.AreaA.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("AreaA.LayoutChangedCallback");
            
            this._infiniteCanvasControl.UpdateFromLayout(rect);
        };




    }

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
                "logoUrl": "/Content/Icons/MetroIcons/96x96/Folders & OS/Windows 8.png",
                "items": [
                    { "id": "tb2", "text": "", "data": "action|open appbar", "style": 'background-image:url("/Content/Icons/c4.png");background-position-x: -70px; background-position-y: -29px;  width: 6px; height: 15px; margin-top:13px; background-size:230px;' },
                    { "id": "tb1", "text": "ToolbarItem 1", "data": "action|item1", "style": '' },
                    { "id": "tb3", "text": "ToolbarItem 3", "data": "action|item3", "style": '' },
                    { "id": "tb4", "text": "ToolbarItem 4", "data": "action|item4", "style": '' }
                ],
                "title": "Windows",
                "titleLength": 160,
                "backgroundColor": "#0281d5"
            },
            {
                "accent1": "#0281d5",
                "accent2": "#2a91d5",
                "accent3": "#56a4d8",
                "accent4": "#77b5de",
            }
        );
        this.Debugger.Log("WindowsHome01.Show");
    
        this.RaiseNotification("firstTimeNotify", "<div id='firstTimeNotify'>CTRL+F5 - to make sure you have the latest demo running clear your cache!</div>", 5000);


        //update theme
        _bootup.Theme.AccentColor1 = this.GetSetting("accent1");
        _bootup.Theme.AccentColor2 = this.GetSetting("accent2");
        _bootup.Theme.AccentColor3 = this.GetSetting("accent3");
        _bootup.Theme.AccentColor4 = this.GetSetting("accent4");


        this._infiniteCanvasControl.InitTheme(_bootup.Theme);


    }


    public Unload() {
        
        this.Debugger.Log("WindowsHome01.Unload");

        this._infiniteCanvasControl.Unload();

        super.Unload();

    }



    // =======================
    // SHOW / HIDES
    // =======================


    // =======================
    // INITIALIZE CONTROLS
    // =======================






}




