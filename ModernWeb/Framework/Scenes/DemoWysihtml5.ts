/// <reference path="..\Layouts\Layout001.ts"/>
/// <reference path="..\Controls\LayoutPanelControl.ts"/>




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
        super.Show();

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


