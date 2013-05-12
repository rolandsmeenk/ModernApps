/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>

//declare var $;

class LoadingControl {

    private _shadowDiv: any;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string) {
        this._shadowDiv =  this.UIRenderer.LoadDiv(this.UniqueID);
    }

    public Show(message: string) {
        this.Debugger.Log("LoadingControl.Show");
        this.UIRenderer.FillDivContent(this.UniqueID, message);
        this.UIRenderer.ShowDiv(this.UniqueID);
    }

    public Hide() {
        this.Debugger.Log("LoadingControl.Hide");
        this.UIRenderer.HideDiv(this.UniqueID);
    }

    public Unload() {
        this.Debugger.Log("LoadingControl.Unload");
        this._shadowDiv.remove();
    }
}

