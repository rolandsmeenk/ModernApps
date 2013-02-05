/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>
/// <reference path="ToolBarItemControl.ts"/>

declare var $;

class ToolBarControl extends FrameworkControl {
    private _toolBarDiv;

    private _itemCounter: number = 0;
    private _items = [];
    private _parentObject: any;
    private _parentClickCallback: any;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string) {

        super(UIRenderer, Debugger, UniqueID, null);
        
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

