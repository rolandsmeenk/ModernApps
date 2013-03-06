/// <reference path="MasterLayout.ts"/>
/// <reference path="..\Controls\LayoutPanelControl.ts"/>

//       |   
//       |      
//       |
//   A   |      B
//       |
//       |      
//       |

class Layout002 extends MasterLayout{

    public VerticalDividerControl: VerticalDividerControl;

    public ResizingStartedCallback: any;
    public ResizingCompleteCallback: any;

    //LAYOUTS
    public AreaA: LayoutPanelControl;
    public AreaB: LayoutPanelControl;



    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {
        super(UIRenderer, Debugger);

        this.VerticalDividerControl = new VerticalDividerControl(UIRenderer, Debugger, "divVerticalDivider", null);

        //LAYOUTS
        this.AreaA = new LayoutPanelControl(UIRenderer, Debugger, "divLeftPanel", null);
        this.AddLayoutControl(this.AreaA);

        this.AreaB = new LayoutPanelControl(UIRenderer, Debugger, "divRightPanel", null);
        this.AddLayoutControl(this.AreaB);

        

    }

    public Show() {
        super.Show();

        this.Debugger.Log("Layout001.LayoutChangedCallback");

        //INIT/RESIZE THE Dividers Followed by the LayoutControls that need tohe dimensions of the Dividers
        var minTop: number = 45;
        var starting_vertical_left: number = parseFloat(this.VerticalDividerControl._rootDiv.css("left"));
        

        this._IntializeVerticalDivider(minTop);
        this._IntializeHorizontalDivider(minTop, starting_vertical_left);

        this.VerticalDividerControl.UpdateHeight(minTop);
        
        this._ResizeVerticalDivider(starting_vertical_left, 0);
        
        this.VerticalDividerControl.InitUI(starting_vertical_left);

        this._InitializeLayoutPanels();

    }


    public Unload() {
        super.Unload();

        this.Debugger.Log("Layout002.LayoutChangedCallback");

        this.VerticalDividerControl.Unload();
        
        this.AreaA.Unload();
        this.AreaB.Unload();
        

    }



    // =======================
    // SHOW / HIDES
    // =======================

    public ShowVerticalDivider() {
        this.Debugger.Log("Layout002:ShowVerticalDivider");
        this.VerticalDividerControl.Show(null);
    }

    public HideVerticalDivider() {
        this.Debugger.Log("Layout002:HideVerticalDivider");
        this.VerticalDividerControl.Hide();
    }


    public ShowLeftPanel() {
        this.Debugger.Log("Layout001:ShowLeftPanel");
        this.AreaA.Show(this, null, null);

    }

    public HideLeftPanel() {
        this.Debugger.Log("Layout001:HideLeftPanel");
        this.AreaA.Hide();
    }

    public ShowRightPanel() {
        this.Debugger.Log("Layout001:ShowRightPanel");
        this.AreaB.Show(this, null, null);
    }

    public HideRightPanel() {
        this.Debugger.Log("Layout001:HideRightPanel");
        this.AreaB.Hide();
    }











    private _IntializeVerticalDivider(minTop: number) {
        this.Debugger.Log("Layout002._IntializeVerticalDivider");
        this.VerticalDividerControl.InitCallbacks({ parent: this, data: null }, null, null);
        this.VerticalDividerControl.MinimumY = minTop;

        this.VerticalDividerControl.ParentResizeCompleteCallback = (x, y) => {
            this._ResizeVerticalDivider(x, y);
            if (this.ResizingCompleteCallback != null) this.ResizingCompleteCallback();
        };

        this.VerticalDividerControl.ParentResizeStartedCallback = () => {
            if (this.ResizingStartedCallback != null) this.ResizingStartedCallback();
        };


        this.ShowVerticalDivider();
        //this.VerticalDividerControl.UpdateHeight(parseFloat(this.HorizontalDividerControl._rootDiv.css("top")));
        this.VerticalDividerControl.UpdateHeight(minTop);
    }

    private _ResizeVerticalDivider(x: number, y: number) {
        this.Debugger.Log("Layout002._ResizeVerticalDivider");
        
        //left
        var newRect = this.VerticalDividerControl.GetLeftRectangle();
        newRect.x1 = 0;
        newRect.x2 = x;
        this.AreaA.UpdateLayout(newRect);

        //right
        var newRect = this.VerticalDividerControl.GetRightRectangle();
        newRect.x1 = x;
        this.AreaB.UpdateLayout(newRect);

    }


    private _InitializeLayoutPanels() {
        this.Debugger.Log("Layout001._InitializeLayoutPanels");
        this.AreaA.InitCallbacks({ parent: this, data: null }, null, null);
        this.ShowLeftPanel();


        this.AreaB.InitCallbacks({ parent: this, data: null }, null, null);
        this.ShowRightPanel();

        this._UpdateLayoutPanels();
    }

    private _UpdateLayoutPanels() {
        this.Debugger.Log("Layout001._UpdateLayoutPanels");
        this.AreaA.UpdateLayout(this.VerticalDividerControl.GetLeftRectangle());
        this.AreaB.UpdateLayout(this.VerticalDividerControl.GetRightRectangle());
        
    }


}


