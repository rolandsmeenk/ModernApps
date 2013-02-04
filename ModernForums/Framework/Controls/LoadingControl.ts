/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>

declare var $;

class LoadingControl {

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string) {
        this.UIRenderer.LoadDiv(this.UniqueID);
    }

    public Show(message: string) {
        this.UIRenderer.FillDivContent(this.UniqueID, message);
        this.UIRenderer.ShowDiv(this.UniqueID);

    }

    public Hide() {
        this.UIRenderer.HideDiv(this.UniqueID);
        
    }

}

