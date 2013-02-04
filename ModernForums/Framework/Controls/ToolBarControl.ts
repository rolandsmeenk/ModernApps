/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>

declare var $;

class ToolBarControl {
    private _toolBarDiv;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string) {

        this._toolBarDiv = this.UIRenderer.LoadDiv(this.UniqueID);

    }


    public Show(parentObject : any , parentClickCallback: any) {
        this.Debugger.Log("ToolBarControl:Show");
        this.UIRenderer.ShowDiv(this.UniqueID);
        //this.UIRenderer.AnimateDiv(this.UniqueID, { top: "+=80" }, 600);
        
        this._toolBarDiv.off('click').on('click', parentObject, parentClickCallback );
        
    }

    public Hide() {
        this.Debugger.Log("ToolBarControl:Hide");
        this.UIRenderer.HideDiv(this.UniqueID);
        //this.UIRenderer.AnimateDiv(this.UniqueID, { top: "-=80" }, 600);
        this._toolBarDiv.off('click');
        
    }


    public Unload() {
        this.Debugger.Log("ToolBarControl:Unload");
        this._toolBarDiv.off('click');
        
    }


}

