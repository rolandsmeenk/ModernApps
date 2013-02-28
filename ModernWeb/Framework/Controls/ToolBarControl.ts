﻿/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>
/// <reference path="ToolBarItemControl.ts"/>

declare var $;

class ToolBarControl extends FrameworkControl {
    
    private _itemCounter: number = 0;
    private _items = [];
    
    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string) {

        super(UIRenderer, Debugger, UniqueID, null);
        
    }


    public Show(eventData: any) {
        this.Debugger.Log("ToolBarControl:Show");

        this._eventData = eventData;
        
        this.UIRenderer.ShowDiv(this.UniqueID);
        
        //override the FrameworkControl implementation so that we dont wire up the click for this control
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

    public Unload() {
        this.Debugger.Log("ToolBarControl:Unload");

        for (var i = 0; i < this._items.length; i++) {
            this._items[i].Unload();
        }

        super.Unload();
    }
}
