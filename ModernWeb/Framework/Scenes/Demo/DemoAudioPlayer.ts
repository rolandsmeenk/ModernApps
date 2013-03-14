/// <reference path="..\..\Layouts\Layout001.ts"/>
/// <reference path="..\..\Controls\LayoutPanelControl.ts"/>




class DemoAudioPlayer extends Layout001 {


    private _audioPlayerControl: AudioPlayerControl;


    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {
        super(UIRenderer, Debugger);


        this._audioPlayerControl = new AudioPlayerControl(UIRenderer, Debugger, "divAudioPlayer", null);




        //WHEN LAYOUTS UPDATE THIS IS WHAT IS USED TO REFRESH OTHER CONTROLS
        this.AreaA.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("AreaA.LayoutChangedCallback");
            this._audioPlayerControl.UpdateFromLayout(rect);

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
            [],
            {}
        );

        this.Debugger.Log("DemoAudioPlayer.LayoutChangedCallback");


        this._InitializeAudioPlayer(this.AreaA.Dimension.y2 - this.AreaA.Dimension.y1);
        
    }


    public Unload() {
        super.Unload();

        this.Debugger.Log("DemoAudioPlayer.LayoutChangedCallback");

        this._audioPlayerControl.Unload();

    }



    // =======================
    // SHOW / HIDES
    // =======================

    public ShowAudioPlayer() {
        this.Debugger.Log("DemoAudioPlayer:ShowAudioPlayer");
        this._audioPlayerControl.Show(this, null, null);
    }

    public HideAudioPlayer() {
        this.Debugger.Log("DemoAudioPlayer:HideAudioPlayer");
        this._audioPlayerControl.Hide();
    }




    // =======================
    // INITIALIZE CONTROLS
    // =======================

    private _InitializeAudioPlayer(startHeight: number) {
        this._audioPlayerControl.InitCallbacks({ parent: this, data: null }, null, null);
        this._audioPlayerControl.InitUI(startHeight);

        this.ShowAudioPlayer();
    }






}


