/// <reference path="..\Layouts\Layout001.ts"/>
/// <reference path="..\Controls\LayoutPanelControl.ts"/>




class DemoVideoPlayer extends Layout001 {


    private _videoPlayerControl: VideoPlayerControl;


    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {
        super(UIRenderer, Debugger);

 
        this._videoPlayerControl = new VideoPlayerControl(UIRenderer, Debugger, "divVideoPlayer", null);


        //WHEN LAYOUTS UPDATE THIS IS WHAT IS USED TO REFRESH OTHER CONTROLS
        this.AreaA.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("AreaA.LayoutChangedCallback");
            this._videoPlayerControl.UpdateFromLayout(rect);
        };


        this.AreaB.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("AreaB.LayoutChangedCallback");
        };

        this.AreaC.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("AreaC.LayoutChangedCallback");
        };


    }

    public Show() {
        super.Show();

        this.Debugger.Log("DemoVideoPlayer.LayoutChangedCallback");

   
        this._InitializeVideoPlayer(this.AreaB.Dimension.y2 - this.AreaB.Dimension.y1);

    }


    public Unload() {
        super.Unload();

        this.Debugger.Log("DemoVideoPlayer.LayoutChangedCallback");


        this._videoPlayerControl.Unload();

    }



    // =======================
    // SHOW / HIDES
    // =======================


    public ShowVideoPlayer() {
        this.Debugger.Log("DemoVideoPlayer:ShowVideoPlayer");
        this._videoPlayerControl.Show(this, null, null);
    }

    public HideVideoPlayer() {
        this.Debugger.Log("DemoVideoPlayer:HideVideoPlayer");
        this._videoPlayerControl.Hide();
    }




    // =======================
    // INITIALIZE CONTROLS
    // =======================


    private _InitializeVideoPlayer(startHeight: number) {
        this._videoPlayerControl.InitCallbacks({ parent: this, data: null }, null, null);
        this._videoPlayerControl.InitUI(startHeight);

        this.ShowVideoPlayer();
    }





}


