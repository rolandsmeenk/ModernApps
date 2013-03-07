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
/// <reference path="..\Controls\ModernFilterBox\ModernFilterBoxControl.ts"/>
/// <reference path="..\Controls\ModernDropdownList\ModernDropdownListControl.ts"/>



class MasterLayout {


    private _loadingControl: LoadingControl;
    private _appbarControl: AppBarControl;
    private _toolbarControl: ToolBarControl;
    private _notifcationCenterControl: NotificationCenterControl;
    

    private _layoutControls: any = [];
    private _visualControls: any = [];

    public AppBarItemsArray: any;



    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {

        this._toolbarControl = new ToolBarControl(UIRenderer, Debugger, "divToolBar");
        this._appbarControl = new AppBarControl(UIRenderer, Debugger, "divAppBar");
        this._loadingControl = new LoadingControl(UIRenderer, Debugger, "divLoading");


        this._notifcationCenterControl = new NotificationCenterControl(UIRenderer, Debugger, "divNotifications", null);
        this._notifcationCenterControl.UpdateFromLayout($(window).width() - 280);

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
        this._loadingControl.Unload();
        this._notifcationCenterControl.Unload();

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

    public RaiseNotification(id: string, message: string, durationMs: number) {
        this.Debugger.Log("MasterLayout:RaisNotification");
        this._notifcationCenterControl.Show(id, message, durationMs)
    }

    public CloseNotification(id: string) {
        this.Debugger.Log("MasterLayout:CloseNotification");
        this._notifcationCenterControl.UnloadItem(id);
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

        if (event.data != null) {
            var parts = event.data.split("|");

            switch (parts[0]) {
                case "scene":
                    _bootup.SceneManager.NavigateToScene(parts[1]);
                    break;
                case "act": break;
                case "action":
                    switch (parts[1]) {
                        case "close": event.parent.HideAppBar(); break;
                    }
                    break;
            }
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

        if (this.AppBarItemsArray != null) {
            var _self = this;
            $.each(this.AppBarItemsArray, function (intIndex, objValue) {
                _self._appbarControl.AddItem(objValue.id, objValue.text, objValue.data, objValue.style);
            });
        }

        //this._appbarControl.AddItem("abi1", "AppbarItem 1", "item1");
        //this._appbarControl.AddItem("abi2", "Close AppBar", "item2");
        
    }

    private _InitializeNotifications() {
        this._notifcationCenterControl.InitCallbacks( null, null, null);

    }
}


