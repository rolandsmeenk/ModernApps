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


/// <reference path="..\Controls\AppBars\AppBarUsersControl.ts"/>
/// <reference path="..\Controls\AppBars\AppBarProjectsControl.ts"/>

class MasterLayout {


    private _loadingControl: LoadingControl;
    private _appbarControl: AppBarControl;
    private _appbarUsersControl: AppBarUsersControl;
    private _appbarProjectsControl: AppBarProjectsControl;
    private _toolbarControl: ToolBarControl;
    private _notifcationCenterControl: NotificationCenterControl;
    public ActHost: any;

    private _layoutControls: any = [];
    private _visualControls: any = [];

    public _appBarItemsData: any;
    public _toolBarItemsData: any;
    public _settingsData: any;



    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {

        this._appbarControl = new AppBarControl(UIRenderer, Debugger, "divAppBar");
        this._toolbarControl = new ToolBarControl(UIRenderer, Debugger, "divToolBar");
        
        this._appbarUsersControl = new AppBarUsersControl(UIRenderer, Debugger, "divAppBarUsers");
        this._appbarProjectsControl = new AppBarProjectsControl(UIRenderer, Debugger, "divAppBarProjects");
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



    public Show(appBarItemsData: any, toolBarItemsData: any, settingsData: any) {
        this.Debugger.Log("MasterLayout:Show");

        this._appBarItemsData = appBarItemsData;
        this._toolBarItemsData = toolBarItemsData;
        this._settingsData = eval(settingsData);

        //APPBAR and TOOLBAR
        this._InitializeToolbar();
        this._InitializeAppbar();
        this._InitializeAppbarUsers();
        this._InitializeAppbarProjects();
        
        //set theme from settings
        _bootup.Theme.AccentColor1 = this.GetSetting("accent1");
        _bootup.Theme.AccentColor2 = this.GetSetting("accent2");
        _bootup.Theme.AccentColor3 = this.GetSetting("accent3");
        _bootup.Theme.AccentColor4 = this.GetSetting("accent4");
        _bootup.Theme.BackgroundColor = this.GetSetting("backgroundColor");
        _bootup.Theme.ForegroundColor = this.GetSetting("foregroundColor");

    }

    public Hide() {

    }


    public Unload() {
        this._appbarControl.Unload();
        this._toolbarControl.Unload();
        this._loadingControl.Unload();
        this._notifcationCenterControl.Unload();
        this._appbarUsersControl.Unload();
        this._appbarProjectsControl.Unload();
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
        
        if (this._appbarUsersControl.IsShowing) this._appbarUsersControl.Hide();
        if (this._appbarProjectsControl.IsShowing) this._appbarProjectsControl.Hide();

        if (this._appbarControl.IsShowing) this._appbarControl.Hide();
        else  this._appbarControl.Show(null);
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

    public ShowAppBarUsers() {
        this.Debugger.Log("MasterLayout:ShowAppBarUsers");

        if (this._appbarControl.IsShowing) this._appbarControl.Hide();
        if (this._appbarProjectsControl.IsShowing) this._appbarProjectsControl.Hide();

        if (this._appbarUsersControl.IsShowing) this._appbarUsersControl.Hide();
        else this._appbarUsersControl.Show(null);
    }

    public HideAppBarUsers() {
        this.Debugger.Log("MasterLayout:HideAppBarUsers");
        this._appbarUsersControl.Hide();
    }

    public ShowAppBarProjects() {
        this.Debugger.Log("MasterLayout:ShowAppBarProjects");

        if (this._appbarControl.IsShowing) this._appbarControl.Hide();
        if (this._appbarUsersControl.IsShowing) this._appbarUsersControl.Hide();

        if (this._appbarProjectsControl.IsShowing) this._appbarProjectsControl.Hide();
        else this._appbarProjectsControl.Show(null);
    }

    public HideAppBarProjects() {
        this.Debugger.Log("MasterLayout:HideAppBarProjects");
        this._appbarProjectsControl.Hide();
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
    private _ProcessActionSceneAct(p1: string, p2: string, event: any) {
        event.parent.Debugger.Log("MasterLayout:_ProcessActionSceneAct p1=" + p1 + "  p2=" + p2 );
        switch (p1) {
            case "scene":
                _bootup.SceneManager.NavigateToScene(p2);
                break;
            case "act":
                _bootup.SceneManager.NavigateToAct(p2);
                break;
            case "action":
                switch (p2) {
                    case "close appbar": _bootup.SceneManager.CurrentScene.HideAppBar(); break;
                    case "close appbar users": _bootup.SceneManager.CurrentScene.HideAppBarUsers(); break;
                    case "close appbar projects": _bootup.SceneManager.CurrentScene.HideAppBarProjects(); break;
                    case "open appbar": _bootup.SceneManager.CurrentScene.ShowAppBar(); break;
                    case "open appbar users": _bootup.SceneManager.CurrentScene.ShowAppBarUsers(); break;
                    case "open appbar projects": _bootup.SceneManager.CurrentScene.ShowAppBarProjects(); break;
                    case "execute": _bootup.SceneManager.CurrentScene.ExecuteAction(event.data);break;
                }
                break;
        }
    }

    private _AppBarUsersClicked(event) {
        event.parent.Debugger.Log("MasterLayout:_AppBarUsersClicked " + event.data);

    }

    private _AppBarProjectsClicked(event) {
        event.parent.Debugger.Log("MasterLayout:_AppBarProjectsClicked " + event.data);


    }







    // =======================
    // INITIALIZE CONTROLS
    // =======================
    private _InitializeToolbar() {
        this._toolbarControl.InitCallbacks({ parent: this, data: null }, this._ToolbarClicked, null);

        if (this._toolBarItemsData != null) {
            var _self = this;
            $.each(this._toolBarItemsData.items, function (intIndex, objValue) {
                _self._toolbarControl.AddItem(objValue.id, objValue.text, objValue.data, objValue.style);
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

    private _InitializeAppbarUsers() {
        this._appbarUsersControl.InitCallbacks({ parent: this, data: null }, this._AppBarUsersClicked, null);



    }

    private _InitializeAppbarProjects() {
        this._appbarProjectsControl.InitCallbacks({ parent: this, data: null }, this._AppBarProjectsClicked, null);



    }


    // =======================
    // METHODS
    // =======================
    public ExecuteAction(data: any) {
        //override this from the scene
        this.Debugger.Log("MasterLayout:ExecuteAction " + data);
    }

    public GetSetting(key: any) {
        this.Debugger.Log("MasterLayout:GetSetting " + key);
        var ret = eval("this._settingsData." + key);
        return ret;
    }


    public GetQueryVariable(variable: string) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
        this.Debugger.Log('Query variable ' + variable +' not found');
    }


    public GetCompanyLogo(code: string) {

        var logoUrl = code; logoUrl = logoUrl == undefined ? "/Content/Reader/logos/10.png" : "/Content/Reader/logos/" + logoUrl + ".png";

        var logoStyle = "";
        switch (code) {
            case "10": logoStyle = "width:45px;height:45px;"; break;
            case "20": logoStyle = "width:45px;height:45px;"; break;
            case "30": logoStyle = "width:45px;height:45px;"; break;
            case "40": logoStyle = "width:45px;height:45px;"; break;
            default: logoStyle = "width:45px;height:45px;"; break;
        }

        return { "code": code, "logoUrl": logoUrl, "logoStyle": logoStyle };
    }

    public CancelWindowEvent() {
        try {
            var e = window.event;
            if (!e) e = window.event;
            if (e) {
                e.returnValue = false;
                e.cancelBubble = true;
            }
        } catch (c) { }
    }
}


