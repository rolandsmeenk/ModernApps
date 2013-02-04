/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>

declare var $;

class ToolBarItemControl {
    private _toolBarItemDiv;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string, public ParentUniqueID: string) {

        this._toolBarItemDiv = this.UIRenderer.LoadDivInParent(this.UniqueID, this.ParentUniqueID);

    }

      
    public Show(parentObject : any , parentClickCallback: any) {
        this.Debugger.Log("ToolBarItemControl:Show");
        this.UIRenderer.ShowDiv(this.UniqueID);        
        this._toolBarItemDiv.off('click').on('click', parentObject, parentClickCallback );
        
    }

    public Hide() {
        this.Debugger.Log("ToolBarItemControl:Hide");
        this.UIRenderer.HideDiv(this.UniqueID);
        this._toolBarItemDiv.off('click');
        
    }


    public Unload() {
        this.Debugger.Log("ToolBarItemControl:Unload");
        this._toolBarItemDiv.off('click');
        
    }

    public UpdateContent(content: any) {
        this._toolBarItemDiv.html(content);
    }

}

