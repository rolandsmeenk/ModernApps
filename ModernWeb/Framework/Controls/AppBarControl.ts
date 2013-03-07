/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>
/// <reference path="AppBarItemControl.ts"/>

declare var $;

class AppBarControl extends FrameworkControl {
    private _itemCounter: number = 0;
    private _items = [];

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string) {
        
        super(UIRenderer, Debugger, UniqueID, null);

    }



    public Show(eventData: any) {
        this.Debugger.Log("AppBarControl:Show");

        this._eventData = eventData;

        this.UIRenderer.AnimateDiv(this.UniqueID, { top: "+=200", display: "" }, 600);

        //override the FrameworkControl implementation so that we dont wire up the click for this control

    }

    public Hide() {
        this.Debugger.Log("AppBarControl:Hide");
        //this.UIRenderer.HideDiv(this.UniqueID);
        this.UIRenderer.AnimateDiv(this.UniqueID, { top: "-=200", display: "none" }, 600);

        this._rootDiv.off('click');
    }



    public Unload() {
        this.Debugger.Log("AppBarControl:Unload");

        for (var i = 0; i < this._items.length; i++) {
            this._items[i].Unload();
        }

        super.Unload();
    }


    public AddItem(id: string, text: string, eventData: any, iconStyle: string) {
        this.Debugger.Log("AppBarControl:AddItem");
        try {
            var newToolbarItem = new AppBarItemControl(this.UIRenderer, this.Debugger, id, this.UniqueID);
            newToolbarItem._rootDiv.attr("style", iconStyle);
            newToolbarItem.Show(this._parentObject, this._parentClickCallback, eventData);
            newToolbarItem.UpdateContent(text);
            this._items.push(newToolbarItem);
            this._itemCounter++;
        } catch (ex) {

            alert(ex.message);
        }
    }



}

