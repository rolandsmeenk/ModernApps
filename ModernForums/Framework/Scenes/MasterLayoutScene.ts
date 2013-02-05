/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>
/// <reference path="..\Controls\LoadingControl.ts"/>
/// <reference path="..\Controls\AppBarControl.ts"/>
/// <reference path="..\Controls\ToolBarControl.ts"/>


class MasterLayoutScene {
    private _loadingControl: LoadingControl;
    private _appbarControl: AppBarControl;
    private _toolbarControl: ToolBarControl;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {

        this._toolbarControl = new ToolBarControl(UIRenderer, Debugger, "divToolBar");
        this._appbarControl = new AppBarControl(UIRenderer, Debugger, "divAppBar");
        this._loadingControl = new LoadingControl(UIRenderer, Debugger, "divLoading");
        
    }


    public Start() {
        this.Debugger.Log("MasterLayoutScene:Start");

    }

    public Stop() {
        this.Debugger.Log("MasterLayoutScene:Stop");
        this._appbarControl.Unload();
        this._toolbarControl.Unload();
    }

    public Show() {
        this.Debugger.Log("MasterLayoutScene:Show");

        this._InitializeToolbar();
    }




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
        this._appbarControl.Show({ parent: this, data: null }, this._AppBarClicked, null);

    }

    public HideAppBar() {
        this.Debugger.Log("MasterLayoutScene:HideAppBar");
        this._appbarControl.Hide();
    }

    public ShowToolBar() {
        this.Debugger.Log("MasterLayoutScene:ShowToolBar");
        //this._toolbarControl.Show(this, function (event) { event.data.ShowAppBar(); });
        this._toolbarControl.Show( { parent: this, data : null }, this._ToolbarClicked, null);
    }

    public HideToolBar() {
        this.Debugger.Log("MasterLayoutScene:HideToolBar");
        this._toolbarControl.Hide();
    }


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
        event.data.Debugger.Log("MasterLayoutScene:_AppBarClicked");
        event.data.HideAppBar();
        event.data.ShowToolBar(); //crazy: for some reason we need to rewire up the Toolbar events ...
    }




    private _InitializeToolbar() {
        this.ShowToolBar();
        this._toolbarControl.AddItem("tbi1", "ToolbarItem 1", "item1");
        this._toolbarControl.AddItem("tbi2", "Show AppBar", "item2");
        this._toolbarControl.AddItem("tbi3", "ToolbarItem 3", "item3");
        this._toolbarControl.AddItem("tbi4", "ToolbarItem 4", "item4");
    }

}



//for some weird reason when opening appbar the toolbar events get lost hence
//why i need to ShowToolBar again when the AppBar closes (the HideToolBar in the ToolbarClicked is not
//really necessary I just added it to make it clean compared to the AppBarClicked)