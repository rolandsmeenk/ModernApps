/// <reference path="MasterLayout.ts"/>
/// <reference path="..\Controls\LayoutPanelControl.ts"/>

//         
//           
//       
//          A
//      
//           
//      

class Layout003 extends MasterLayout{

    public ResizingStartedCallback: any;
    public ResizingCompleteCallback: any;

    //LAYOUTS
    public AreaA: LayoutPanelControl;
    
    private _rect: any;


    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, width: number, height: number) {
        super(UIRenderer, Debugger);

        //LAYOUTS
        this.AreaA = new LayoutPanelControl(UIRenderer, Debugger, "divAreaA", null);
        this.AddLayoutControl(this.AreaA);



        var a_width = width;
        var a_height = height;
        
        var a_left = ($(window).width() - a_width) / 2;
        var a_top = ($(window).height() - a_height) / 2;

        this._rect = {x1: a_left, y1: a_top, x2: a_left + a_width, y2: a_top + a_height, w: a_width, h: a_height };

        
    }

    public Show() {
        super.Show();

        this.Debugger.Log("Layout003.Show");

    
        this._InitializeLayoutPanels();
        
    }


    public Unload() {
        super.Unload();

        this.Debugger.Log("Layout003.Unload");

        this.AreaA.Unload();


    }



    // =======================
    // SHOW / HIDES
    // =======================


    public ShowPanel() {
        this.Debugger.Log("Layout003:ShowPanel");
        this.AreaA.Show(this, null, null);
    }

    public HidePanel() {
        this.Debugger.Log("Layout003:HidePanel");
        this.AreaA.Hide();
    }











    private _InitializeLayoutPanels() {
        this.Debugger.Log("Layout003._InitializeLayoutPanels");
        this.AreaA.InitCallbacks({ parent: this, data: null }, null, null);
        this._UpdateLayoutPanels(this._rect);

    }

    private _UpdateLayoutPanels(rect: any) {
        this.Debugger.Log("Layout003._UpdateLayoutPanels");
        this.AreaA.UpdateLayout(rect);

    }


}


