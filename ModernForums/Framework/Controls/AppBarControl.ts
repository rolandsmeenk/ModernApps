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

    public InitCallbacks(parentObject: any, parentClickCallback: any, eventData: any) {
        this.Debugger.Log("AppBarControl:InitCallbacks");

        this._parentObject = parentObject;
        this._parentClickCallback = parentClickCallback;
        this._eventData = eventData;

        ////this._appBarDiv.off('click').on('click', this, function (event) { event.data.Hide();  } );
        //if (this.ParentUniqueID != null)
        //    this._rootDiv.off('click').on('click', this, () => { this._parentObject.data = this._eventData; this._parentClickCallback(this._parentObject); });
        //else
        //    this._rootDiv.off('click').on('click', this._parentObject, this._parentClickCallback);


    }

    public Show(eventData: any) {
        this.Debugger.Log("AppBarControl:Show");

        this._eventData = eventData;

        this.UIRenderer.AnimateDiv(this.UniqueID, { top: "+=200", display: "" }, 600);

    }

    public Hide() {
        this.Debugger.Log("AppBarControl:Hide");
        //this.UIRenderer.HideDiv(this.UniqueID);
        this.UIRenderer.AnimateDiv(this.UniqueID, { top: "-=200", display: "none" }, 600);

        this._rootDiv.off('click');
    }


    public Unload() {
        this.Debugger.Log("AppBarControl:Unload");
        this._rootDiv.off('click');

    }

    public AddItem(id: string, text: string, eventData: any) {
        this.Debugger.Log("AppBarControl:AddItem");
        try {
            var newToolbarItem = new AppBarItemControl(this.UIRenderer, this.Debugger, id, this.UniqueID);
            newToolbarItem.Show(this._parentObject, this._parentClickCallback, eventData);
            newToolbarItem.UpdateContent(text);
            this._items.push(newToolbarItem);
            this._itemCounter++;
        } catch (ex) {

            alert(ex.message);
        }
    }



}

