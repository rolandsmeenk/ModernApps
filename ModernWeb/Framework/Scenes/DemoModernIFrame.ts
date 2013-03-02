/// <reference path="..\Layouts\Layout001.ts"/>
/// <reference path="..\Controls\LayoutPanelControl.ts"/>




class DemoModernIFrame extends Layout001 {


    private _modernIFrame: ModernIFrameControl;


    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {
        super(UIRenderer, Debugger);

 
        this._modernIFrame = new ModernIFrameControl(UIRenderer, Debugger, "divModernIFrame", null);


        //WHEN LAYOUTS UPDATE THIS IS WHAT IS USED TO REFRESH OTHER CONTROLS
        this.AreaA.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("AreaA.LayoutChangedCallback");
            this._modernIFrame.UpdateFromLayout(rect);
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

        this.Debugger.Log("DemoModernIFrame.LayoutChangedCallback");

   
        this._InitializeModernIFrame(this.AreaB.Dimension.y2 - this.AreaB.Dimension.y1);

    }


    public Unload() {
        super.Unload();

        this.Debugger.Log("DemoModernIFrame.LayoutChangedCallback");


        this._modernIFrame.Unload();

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




    // =======================
    // INITIALIZE CONTROLS
    // =======================


    private _InitializeModernIFrame(startHeight: number) {
        this._modernIFrame.InitCallbacks({ parent: this, data: null }, null, null);
        this._modernIFrame.InitUI(startHeight);


        this.ShowModernIFrame();
    }





}


