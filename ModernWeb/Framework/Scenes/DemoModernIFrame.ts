/// <reference path="..\Layouts\Layout001.ts"/>
/// <reference path="..\Controls\LayoutPanelControl.ts"/>




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
        super.Show();
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


