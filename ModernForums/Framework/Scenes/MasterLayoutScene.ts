/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>
/// <reference path="..\Controls\LoadingControl.ts"/>
/// <reference path="..\Controls\AppBarControl.ts"/>
/// <reference path="..\Controls\ToolBarControl.ts"/>
/// <reference path="..\Controls\VerticalDividerControl.ts"/>
/// <reference path="..\Controls\HorizontalDividerControl.ts"/>

/// <reference path="..\Controls\LayoutPanelControl.ts"/>

class MasterLayoutScene {
    

    private _loadingControl: LoadingControl;
    private _appbarControl: AppBarControl;
    private _toolbarControl: ToolBarControl;
    private _verticalDividerControl: VerticalDividerControl;
    private _horizontalDividerControl: HorizontalDividerControl;

    private _topRightAreaControl: LayoutPanelControl;
    private _bottomRightAreaControl: LayoutPanelControl;
    private _leftAreaControl: LayoutPanelControl;


    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {

        this._toolbarControl = new ToolBarControl(UIRenderer, Debugger, "divToolBar");
        this._appbarControl = new AppBarControl(UIRenderer, Debugger, "divAppBar");
        this._loadingControl = new LoadingControl(UIRenderer, Debugger, "divLoading");
        
        this._horizontalDividerControl = new HorizontalDividerControl(UIRenderer, Debugger, "divHorizontalDivider", null);
        this._verticalDividerControl = new VerticalDividerControl(UIRenderer, Debugger, "divVerticalDivider", null);

        this._topRightAreaControl = new LayoutPanelControl(UIRenderer, Debugger, "divTopRightPanel", null);
        this._bottomRightAreaControl = new LayoutPanelControl(UIRenderer, Debugger, "divBottomRightPanel", null);
        this._leftAreaControl = new LayoutPanelControl(UIRenderer, Debugger, "divLeftPanel", null);
    }


    public Start() {
        this.Debugger.Log("MasterLayoutScene:Start");

    }

    public Stop() {
        this.Debugger.Log("MasterLayoutScene:Stop");

    }



    public Show() {
        this.Debugger.Log("MasterLayoutScene:Show");

        this._InitializeToolbar();
        this._InitializeAppbar();
        this._IntializeVerticalDivider();
        this._IntializeHorizontalDivider();
        this._InitializeLayoutPanels();

    }

    public Hide() {

    }



    public Unload() {
        this._appbarControl.Unload();
        this._toolbarControl.Unload();

        this._verticalDividerControl.Unload();
        this._horizontalDividerControl.Unload();

        this._topRightAreaControl.Unload();
        this._bottomRightAreaControl.Unload();
        this._leftAreaControl.Unload();
    }



    // =======================
    // SHOW / HIDES
    // =======================



    public ShowLoading(message: string) {
        this.Debugger.Log("MasterLayoutScene:ShowLoading");
        this._loadingControl.Show(message)
    }

    public HideLoading() {
        this.Debugger.Log("MasterLayoutScene:HideLoading");
        this._loadingControl.Hide();
    }

    public ShowAppBar() {
        this.Debugger.Log("MasterLayoutScene:ShowAppBar");
        this._appbarControl.Show(null);
    }

    public HideAppBar() {
        this.Debugger.Log("MasterLayoutScene:HideAppBar");
        this._appbarControl.Hide();
    }

    public ShowToolBar() {
        this.Debugger.Log("MasterLayoutScene:ShowToolBar");
        //this._toolbarControl.Show(this, function (event) { event.data.ShowAppBar(); });
        this._toolbarControl.Show( null);
    }

    public HideToolBar() {
        this.Debugger.Log("MasterLayoutScene:HideToolBar");
        this._toolbarControl.Hide();
    }

    public ShowVerticalDivider() {
        this.Debugger.Log("MasterLayoutScene:ShowVerticalDivider");
        this._verticalDividerControl.Show(null);
    }

    public HideVerticalDivider() {
        this.Debugger.Log("MasterLayoutScene:HideVerticalDivider");
        this._verticalDividerControl.Hide();
    }

    public ShowHorizontalDivider() {
        this.Debugger.Log("MasterLayoutScene:ShowHorizontalDivider");
        this._horizontalDividerControl.Show(null);
    }

    public HideHorizontalDivider() {
        this.Debugger.Log("MasterLayoutScene:HideHorizontalDivider");
        this._horizontalDividerControl.Hide();
    }

    public ShowTopRightPanel() {
        this.Debugger.Log("MasterLayoutScene:ShowTopRightPanel");
        this._topRightAreaControl.Show( this, null, null);

    }

    public HideTopRightPanel() {
        this.Debugger.Log("MasterLayoutScene:HideTopRightPanel");
        this._topRightAreaControl.Hide();
    }

    public ShowBottomRightPanel() {
        this.Debugger.Log("MasterLayoutScene:ShowBottomRightPanel");
        this._bottomRightAreaControl.Show(this, null, null);
    }

    public HideBottomRightPanel() {
        this.Debugger.Log("MasterLayoutScene:HideBottomRightPanel");
        this._bottomRightAreaControl.Hide();
    }

    public ShowLeftPanel() {
        this.Debugger.Log("MasterLayoutScene:ShowLeftPanel");
        this._leftAreaControl.Show(this, null, null);
    }

    public HideLeftPanel() {
        this.Debugger.Log("MasterLayoutScene:HideLeftPanel");
        this._leftAreaControl.Hide();
    }


    // =======================
    // CLICK HANDLERS
    // =======================


    private _ToolbarClicked(event) {

        event.parent.Debugger.Log("MasterLayoutScene:_ToolbarClicked " + event.data);
        
        switch (event.data) {
            case "item1": break;
            case "item2":
                //event.data.HideToolBar();
                event.parent.ShowAppBar();
                break;
            case "item3": break;
            case "item4": break;
        }
        
    }

    private _AppBarClicked(event) {
        event.parent.Debugger.Log("MasterLayoutScene:_AppBarClicked " + event.data);

        switch (event.data) {
            case "item1": break;
            case "item2":
                event.parent.HideAppBar();
                break;
        }

    }








    // =======================
    // INITIALIZE CONTROLS
    // =======================


    private _InitializeToolbar() {
        this._toolbarControl.InitCallbacks({ parent: this, data: null }, this._ToolbarClicked, null);
        this._toolbarControl.AddItem("tbi1", "ToolbarItem 1", "item1");
        this._toolbarControl.AddItem("tbi2", "Show AppBar", "item2");
        this._toolbarControl.AddItem("tbi3", "ToolbarItem 3", "item3");
        this._toolbarControl.AddItem("tbi4", "ToolbarItem 4", "item4");

        this.ShowToolBar();
    }

    private _InitializeAppbar() {
        this._appbarControl.InitCallbacks({ parent: this, data: null }, this._AppBarClicked, null);
        this._appbarControl.AddItem("abi1", "AppbarItem 1", "item1");
        this._appbarControl.AddItem("abi2", "Close AppBar", "item2");
        
    }

    private _IntializeVerticalDivider() {
        var _top = 45;

        this._verticalDividerControl.InitCallbacks({ parent: this, data: null }, null, null);
        this._verticalDividerControl.MinimumY = _top;

        this._verticalDividerControl.ParentResizeCompleteCallback = (x, y) => {

            this._horizontalDividerControl.UpdateWidth(x);

            //top right
            var newRect = this._horizontalDividerControl.GetTopRectangle();
            newRect.x1 = x;
            this._topRightAreaControl.UpdateLayout(newRect);

            //bottom right
            var newRect = this._horizontalDividerControl.GetBottomRectangle();
            newRect.x1 = x;
            this._bottomRightAreaControl.UpdateLayout(newRect);

            //left
            var newRect = this._verticalDividerControl.GetLeftRectangle();
            newRect.x1 = 0;
            newRect.x2 = x;
            this._leftAreaControl.UpdateLayout(newRect);
        };

        this.ShowVerticalDivider();
        //this._verticalDividerControl.UpdateHeight(parseFloat(this._horizontalDividerControl._rootDiv.css("top")));
        this._verticalDividerControl.UpdateHeight(_top);
    }

    private _IntializeHorizontalDivider() {
        var _top = 45;
        this._horizontalDividerControl.InitCallbacks({ parent: this, data: null }, null, null);
        this._horizontalDividerControl.MinimumY = _top;
        
        this._horizontalDividerControl.ParentResizeCompleteCallback = (x, y) => {
            //this._verticalDividerControl.UpdateHeight(y);
            

            this._UpdateLayoutPanels();
        };

        this.ShowHorizontalDivider();
        this._horizontalDividerControl.UpdateWidth(parseFloat(this._verticalDividerControl._rootDiv.css("left")));
        
    }

    private _InitializeLayoutPanels() {
        this._topRightAreaControl.InitCallbacks({ parent: this, data: null }, null, null);
        this.ShowTopRightPanel();


        this._bottomRightAreaControl.InitCallbacks({ parent: this, data: null }, null, null);
        this.ShowBottomRightPanel();


        this._leftAreaControl.InitCallbacks({ parent: this, data: null }, null, null);
        this.ShowLeftPanel();


    }


    private _UpdateLayoutPanels() {
        this._topRightAreaControl.UpdateLayout(this._horizontalDividerControl.GetTopRectangle());
        this._bottomRightAreaControl.UpdateLayout(this._horizontalDividerControl.GetBottomRectangle());
        this._leftAreaControl.UpdateLayout(this._verticalDividerControl.GetLeftRectangle());
    }

}


