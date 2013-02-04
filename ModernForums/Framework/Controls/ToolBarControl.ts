/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>
/// <reference path="ToolBarItemControl.ts"/>

declare var $;

class ToolBarControl {
    private _toolBarDiv;

    private _itemCounter: number = 0;
    private _items = [];
    private _parentObject: any;
    private _parentClickCallback: any;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string) {

        this._toolBarDiv = this.UIRenderer.LoadDiv(this.UniqueID);
        
    }


    public Show(parentObject : any , parentClickCallback: any) {
        this.Debugger.Log("ToolBarControl:Show");
        this._parentObject = parentObject;
        this._parentClickCallback = parentClickCallback;
        this.UIRenderer.ShowDiv(this.UniqueID);
        //this.UIRenderer.AnimateDiv(this.UniqueID, { top: "+=80" }, 600);
        
        //this._toolBarDiv.off('click').on('click', this._parentObject, this._parentClickCallback );
        
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

    
    public AddItem(id: string, text: string, eventData: any) {
        this.Debugger.Log("ToolBarControl:AddItem");
        try {
            var newToolbarItem = new ToolBarItemControl(this.UIRenderer, this.Debugger, id, this.UniqueID);
            newToolbarItem.Show(this._parentObject, this._parentClickCallback, eventData);
            newToolbarItem.UpdateContent(text);
            this._items.push(newToolbarItem);
            this._itemCounter++;
        } catch (ex) {

            alert(ex.message);
        }
    }
}

