/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>

declare var $;

class ToolBarItemControl {
    private _toolBarItemDiv;
    private _parentObject: any;
    private _parentClickCallback: any;
    private _eventData: any;


    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string, public ParentUniqueID: string) {

        this._toolBarItemDiv = this.UIRenderer.LoadDivInParent(this.UniqueID, this.ParentUniqueID);

    }

      
    public Show(parentObject: any, parentClickCallback: any, eventData: any) {
        this.Debugger.Log("ToolBarItemControl:Show");
        this._parentObject = parentObject;
        this._parentClickCallback = parentClickCallback;
        this._eventData = eventData;
        this.UIRenderer.ShowDiv(this.UniqueID);
        this._toolBarItemDiv.off('click').on('click', this, () => { this._parentObject.data = this._eventData; this._parentClickCallback(this._parentObject);}  );
        
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

