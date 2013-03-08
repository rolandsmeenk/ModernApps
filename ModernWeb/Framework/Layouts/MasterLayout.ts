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
    public ActHost: any;

    private _layoutControls: any = [];
    private _visualControls: any = [];

    public _appBarItemsData: any;
    public _toolBarItemsData: any;



    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {

        this._toolbarControl = new ToolBarControl(UIRenderer, Debugger, "divToolBar");
        this._appbarControl = new AppBarControl(UIRenderer, Debugger, "divAppBar");
        this._loadingControl = new LoadingControl(UIRenderer, Debugger, "divLoading");

        this.ActHost = this.UIRenderer.LoadDiv("divActHost");

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



    public Show(appBarItemsData: any, toolBarItemsData: any) {
        this.Debugger.Log("MasterLayout:Show");

        this._appBarItemsData = appBarItemsData;
        this._toolBarItemsData = toolBarItemsData;


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
        this.ActHost.remove();
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

    public ShowToolBar(logoUrl:string, title: string, titleLength: number, backgroundColor: string) {
        this.Debugger.Log("MasterLayout:ShowToolBar");
        //this._toolbarControl.Show(this, function (event) { event.data.ShowAppBar(); });
        this._toolbarControl.InitConfig(logoUrl, title, titleLength, backgroundColor);
        this._toolbarControl.Show(null);
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
        
        if (event.data != null) {
            var parts = event.data.split("|");

            event.parent._ProcessActionSceneAct(parts[0], parts[1], event);

        }

    }

    private _AppBarClicked(event) {
        event.parent.Debugger.Log("MasterLayout:_AppBarClicked " + event.data);
        
        if (event.data != null) {
            var parts = event.data.split("|");

            event.parent._ProcessActionSceneAct(parts[0], parts[1], event);

        }
    }


    //NOTE: I HATE how this uses _bootup, and how we pass in event ... need to refactor this
    private _ProcessActionSceneAct(p1: string, p2: string, event) {
        event.parent.Debugger.Log("MasterLayout:_ProcessActionSceneAct p1=" + p1 + "  p2=" + p2 );
        switch (p1) {
            case "scene":
                _bootup.SceneManager.NavigateToScene(p2);
                break;
            case "act": break;
            case "action":
                switch (p2) {
                    case "close appbar": _bootup.SceneManager.CurrentScene.HideAppBar(); break;
                    case "open appbar": _bootup.SceneManager.CurrentScene.ShowAppBar(); break;
                }
                break;
        }
    }



    // =======================
    // INITIALIZE CONTROLS
    // =======================


    private _InitializeToolbar() {
        this._toolbarControl.InitCallbacks({ parent: this, data: null }, this._ToolbarClicked, null);

        if (this._toolBarItemsData != null) {
            var _self = this;
            $.each(this._toolBarItemsData.items, function (intIndex, objValue) {
                _self._toolbarControl.AddItem(objValue.id, objValue.text, objValue.data);
            });
        }

        this.ShowToolBar(
            this._toolBarItemsData.logoUrl,
            this._toolBarItemsData.title,
            this._toolBarItemsData.titleLength,
            this._toolBarItemsData.backgroundColor
            );

    }

    private _InitializeAppbar() {
        this._appbarControl.InitCallbacks({ parent: this, data: null }, this._AppBarClicked, null);

        if (this._appBarItemsData!= null) {
            var _self = this;
            $.each(this._appBarItemsData, function (intIndex, objValue) {
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


