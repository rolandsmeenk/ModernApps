/// <reference path="MasterLayout.ts"/>
/// <reference path="..\Controls\LayoutPanelControl.ts"/>

//       |   
//       |      A
//       |
//   C   |--------------
//       |
//       |      B
//       |

class Layout001 extends MasterLayout{

    public VerticalDividerControl: VerticalDividerControl;
    public HorizontalDividerControl: HorizontalDividerControl;

    public ResizingStartedCallback: any;
    public ResizingCompleteCallback: any;

    //LAYOUTS
    public AreaA: LayoutPanelControl;
    public AreaB: LayoutPanelControl;
    public AreaC: LayoutPanelControl;



    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {
        super(UIRenderer, Debugger);


        this.HorizontalDividerControl = new HorizontalDividerControl(UIRenderer, Debugger, "divHorizontalDivider", null);
        this.VerticalDividerControl = new VerticalDividerControl(UIRenderer, Debugger, "divVerticalDivider", null);

        //LAYOUTS
        this.AreaA = new LayoutPanelControl(UIRenderer, Debugger, "divTopRightPanel", null);
        this.AddLayoutControl(this.AreaA);

        this.AreaB = new LayoutPanelControl(UIRenderer, Debugger, "divBottomRightPanel", null);
        this.AddLayoutControl(this.AreaB);

        this.AreaC = new LayoutPanelControl(UIRenderer, Debugger, "divLeftPanel", null);
        this.AddLayoutControl(this.AreaC);




    }

    public Show(appBarItemsArray: any, toolBarItemsArray: any, settingsData: any) {
        super.Show(appBarItemsArray, toolBarItemsArray, settingsData);

        this.Debugger.Log("Layout001.LayoutChangedCallback");

        //INIT/RESIZE THE Dividers Followed by the LayoutControls that need tohe dimensions of the Dividers
        var minTop: number = 60;
        var starting_vertical_left: number = parseFloat(this.VerticalDividerControl._rootDiv.css("left"));
        var starting_horizontal_top: number = parseFloat(this.HorizontalDividerControl._rootDiv.css("top"));


        this._IntializeVerticalDivider(minTop);
        this._IntializeHorizontalDivider(minTop, starting_vertical_left);

        this.VerticalDividerControl.UpdateHeight(minTop);
        this.HorizontalDividerControl.UpdateWidth(starting_vertical_left);

        this._ResizeVerticalDivider(starting_vertical_left, 0);
        this._ResizeHorizontalDivider(starting_vertical_left, starting_horizontal_top);

        this.HorizontalDividerControl.InitUI(starting_horizontal_top);
        this.VerticalDividerControl.InitUI(starting_vertical_left);

        this._InitializeLayoutPanels();

    }


    public Unload() {
        super.Unload();

        this.Debugger.Log("Layout001.LayoutChangedCallback");

        this.VerticalDividerControl.Unload();
        this.HorizontalDividerControl.Unload();

        this.AreaA.Unload();
        this.AreaB.Unload();
        this.AreaC.Unload();

    }



    // =======================
    // SHOW / HIDES
    // =======================

    public ShowVerticalDivider() {
        this.Debugger.Log("Layout001:ShowVerticalDivider");
        this.VerticalDividerControl.Show(null);
    }

    public HideVerticalDivider() {
        this.Debugger.Log("Layout001:HideVerticalDivider");
        this.VerticalDividerControl.Hide();
    }

    public ShowHorizontalDivider() {
        this.Debugger.Log("Layout001:ShowHorizontalDivider");
        this.HorizontalDividerControl.Show(null);
    }

    public HideHorizontalDivider() {
        this.Debugger.Log("Layout001:HideHorizontalDivider");
        this.HorizontalDividerControl.Hide();
    }

    public ShowTopRightPanel() {
        this.Debugger.Log("Layout001:ShowTopRightPanel");
        this.AreaA.Show(this, null, null);

    }

    public HideTopRightPanel() {
        this.Debugger.Log("Layout001:HideTopRightPanel");
        this.AreaA.Hide();
    }

    public ShowBottomRightPanel() {
        this.Debugger.Log("Layout001:ShowBottomRightPanel");
        this.AreaB.Show(this, null, null);
    }

    public HideBottomRightPanel() {
        this.Debugger.Log("Layout001:HideBottomRightPanel");
        this.AreaB.Hide();
    }

    public ShowLeftPanel() {
        this.Debugger.Log("Layout001:ShowLeftPanel");
        this.AreaC.Show(this, null, null);
    }

    public HideLeftPanel() {
        this.Debugger.Log("Layout001:HideLeftPanel");
        this.AreaC.Hide();
    }











    private _IntializeVerticalDivider(minTop: number) {
        this.Debugger.Log("Layout001._IntializeVerticalDivider");
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
        this.Debugger.Log("Layout001._ResizeVerticalDivider");
        this.HorizontalDividerControl.UpdateWidth(x);

        //top right
        var newRect = this.HorizontalDividerControl.GetTopRectangle();
        newRect.x1 = x;
        this.AreaA.UpdateLayout(newRect);

        //bottom right
        var newRect = this.HorizontalDividerControl.GetBottomRectangle();
        newRect.x1 = x;
        this.AreaB.UpdateLayout(newRect);

        //left
        var newRect = this.VerticalDividerControl.GetLeftRectangle();
        newRect.x1 = 0;
        newRect.x2 = x;
        this.AreaC.UpdateLayout(newRect);
    }


    private _IntializeHorizontalDivider(minTop: number, minLeft: number) {
        this.Debugger.Log("Layout001._IntializeHorizontalDivider");
        this.HorizontalDividerControl.InitCallbacks({ parent: this, data: null }, null, null);
        this.HorizontalDividerControl.MinimumY = minTop;

        this.HorizontalDividerControl.ParentResizeCompleteCallback = (x, y) => {
            this.Debugger.Log("Layout001.HorizontalDividerControl.ParentResizeCompleteCallback");
            this._ResizeHorizontalDivider(x, y);
            if (this.ResizingCompleteCallback != null) this.ResizingCompleteCallback();
        };

        this.HorizontalDividerControl.ParentResizeStartedCallback = () => {
            this.Debugger.Log("Layout001.HorizontalDividerControl.ParentResizeStartedCallback");
            if (this.ResizingStartedCallback != null) this.ResizingStartedCallback();
        };

        this.ShowHorizontalDivider();
        this.HorizontalDividerControl.UpdateWidth(minLeft);

    }


    private _ResizeHorizontalDivider(x: number, y: number) {

        //this.VerticalDividerControl.UpdateHeight(y);

        this._UpdateLayoutPanels();
    }


    private _InitializeLayoutPanels() {
        this.Debugger.Log("Layout001._InitializeLayoutPanels");
        this.AreaA.InitCallbacks({ parent: this, data: null }, null, null);
        this.ShowTopRightPanel();


        this.AreaB.InitCallbacks({ parent: this, data: null }, null, null);
        this.ShowBottomRightPanel();


        this.AreaC.InitCallbacks({ parent: this, data: null }, null, null);
        this.ShowLeftPanel();

        this._UpdateLayoutPanels();
    }

    private _UpdateLayoutPanels() {
        this.Debugger.Log("Layout001._UpdateLayoutPanels");
        this.AreaA.UpdateLayout(this.HorizontalDividerControl.GetTopRectangle());
        this.AreaB.UpdateLayout(this.HorizontalDividerControl.GetBottomRectangle());
        this.AreaC.UpdateLayout(this.VerticalDividerControl.GetLeftRectangle());
    }


}


