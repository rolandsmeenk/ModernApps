/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>
/// <reference path="LoadingControl.ts"/>
/// <reference path="AppBarControl.ts"/>
/// <reference path="ToolBarControl.ts"/>


class MasterLayoutScreen {
    private _loadingControl: LoadingControl;
    private _appbarControl: AppBarControl;
    private _toolbarControl: ToolBarControl;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {

        this._toolbarControl = new ToolBarControl(UIRenderer, Debugger, "divToolBar");
        this._appbarControl = new AppBarControl(UIRenderer, Debugger, "divAppBar");
        this._loadingControl = new LoadingControl(UIRenderer, Debugger, "divLoading");
        
    }


    public Start() {
        this.Debugger.Log("MasterLayoutScreen:Start");

    }

    public Stop() {
        this.Debugger.Log("MasterLayoutScreen:Stop");
        this._appbarControl.Unload();
        this._toolbarControl.Unload();
    }

    public Show() {
        this.ShowToolBar();
    }


    public ShowLoading(message: string) {
        this.Debugger.Log("MasterLayoutScreen:ShowLoading");
        this._loadingControl.Show(message)
    }

    public HideLoading() {
        this.Debugger.Log("MasterLayoutScreen:HideLoading");
        this._loadingControl.Hide();
    }


    public ShowAppBar() {
        this.Debugger.Log("MasterLayoutScreen:ShowAppBar");
        this._appbarControl.Show(this, this._AppBarClicked);

    }

    public HideAppBar() {
        this.Debugger.Log("MasterLayoutScreen:HideAppBar");
        this._appbarControl.Hide();
    }

    public ShowToolBar() {
        this.Debugger.Log("MasterLayoutScreen:ShowToolBar");
        //this._toolbarControl.Show(this, function (event) { event.data.ShowAppBar(); });
        this._toolbarControl.Show(this, this._ToolbarClicked);
    }

    public HideToolBar() {
        this.Debugger.Log("MasterLayoutScreen:HideToolBar");
        this._toolbarControl.Hide();
    }


    private _ToolbarClicked(event) {
        event.data.Debugger.Log("MasterLayoutScreen:_ToolbarClicked");
        //event.data.HideToolBar();
        event.data.ShowAppBar();
    }

    private _AppBarClicked(event) {
        event.data.Debugger.Log("MasterLayoutScreen:_AppBarClicked");
        event.data.HideAppBar();
        event.data.ShowToolBar(); //crazy: for some reason we need to rewire up the Toolbar events ...
    }


}



//for some weird reason when opening appbar the toolbar events get lost hence
//why i need to ShowToolBar again when the AppBar closes (the HideToolBar in the ToolbarClicked is not
//really necessary I just added it to make it clean compared to the AppBarClicked)