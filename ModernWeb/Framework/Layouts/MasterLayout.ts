/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>
/// <reference path="..\Controls\LoadingControl.ts"/>
/// <reference path="..\Controls\AppBarControl.ts"/>
/// <reference path="..\Controls\ToolBarControl.ts"/>
/// <reference path="..\Controls\VerticalDividerControl.ts"/>
/// <reference path="..\Controls\HorizontalDividerControl.ts"/>

/// <reference path="..\Controls\LayoutPanelControl.ts"/>
/// <reference path="..\Controls\TinyMCE\TinyMCEControl.ts"/>
/// <reference path="..\Controls\InfiniteCanvas\InfiniteCanvasControl.ts"/>
/// <reference path="..\Controls\DataGrid\DataGridControl.ts"/>
/// <reference path="..\Controls\ModernTree\ModernTreeControl.ts"/>
/// <reference path="..\Controls\Wysihtml5\Wysihtml5Control.ts"/>
/// <reference path="..\Controls\Media\VideoPlayerControl.ts"/>
/// <reference path="..\Controls\Media\AudioPlayerControl.ts"/>
/// <reference path="..\Controls\ModernIFrame\ModernIFrameControl.ts"/>
/// <reference path="..\Controls\ModernAccordian\ModernAccordianControl.ts"/>
/// <reference path="..\Controls\NotificationCenter\NotificationCenterControl.ts"/>

class MasterLayout {


    private _loadingControl: LoadingControl;
    private _appbarControl: AppBarControl;
    private _toolbarControl: ToolBarControl;
    private _notifcationCenterControl: NotificationCenterControl;
    

    private _layoutControls: any = [];
    private _visualControls: any = [];



    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {

        this._toolbarControl = new ToolBarControl(UIRenderer, Debugger, "divToolBar");
        this._appbarControl = new AppBarControl(UIRenderer, Debugger, "divAppBar");
        this._loadingControl = new LoadingControl(UIRenderer, Debugger, "divLoading");
        this._notifcationCenterControl = new NotificationCenterControl(UIRenderer, Debugger, "divNotifications");


    }

    public AddLayoutControl(layoutControl: LayoutPanelControl) {
        this._layoutControls.push(layoutControl);
    }

    public AddVisualControl(visualControl: FrameworkControl) {
        this._visualControls.push(visualControl);
    }



    public Start() {
        this.Debugger.Log("MasterLayout:Start");

    }

    public Stop() {
        this.Debugger.Log("MasterLayout:Stop");

    }



    public Show() {
        this.Debugger.Log("MasterLayout:Show");


        //APPBAR and TOOLBAR
        this._InitializeToolbar();
        this._InitializeAppbar();
        


    }

    public Hide() {

    }


    public Unload() {
        this._appbarControl.Unload();
        this._toolbarControl.Unload();

    }



    // =======================
    // SHOW / HIDES
    // =======================



    public ShowLoading(message: string) {
        this.Debugger.Log("MasterLayout:ShowLoading");
        this._loadingControl.Show(message)
    }

    public HideLoading() {
        this.Debugger.Log("MasterLayout:HideLoading");
        this._loadingControl.Hide();
    }

    public ShowAppBar() {
        this.Debugger.Log("MasterLayout:ShowAppBar");
        this._appbarControl.Show(null);
    }

    public HideAppBar() {
        this.Debugger.Log("MasterLayout:HideAppBar");
        this._appbarControl.Hide();
    }

    public ShowToolBar() {
        this.Debugger.Log("MasterLayout:ShowToolBar");
        //this._toolbarControl.Show(this, function (event) { event.data.ShowAppBar(); });
        this._toolbarControl.Show( null);
    }

    public HideToolBar() {
        this.Debugger.Log("MasterLayout:HideToolBar");
        this._toolbarControl.Hide();
    }

    public ShowNotifications(message: string) {
        this.Debugger.Log("MasterLayout:ShowNotifications");
        //this._notifcationCenterControl.Show(message)
    }

    public HideNotifications() {
        this.Debugger.Log("MasterLayout:Notifications");
        this._notifcationCenterControl.Hide();
    }



    // =======================
    // CLICK HANDLERS
    // =======================


    private _ToolbarClicked(event) {

        event.parent.Debugger.Log("MasterLayout:_ToolbarClicked " + event.data);
        
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
        event.parent.Debugger.Log("MasterLayout:_AppBarClicked " + event.data);

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

    private _InitializeNotifications() {
        this._notifcationCenterControl.InitCallbacks( null, null, null);
        this.ShowNotifications("");
    }
}


