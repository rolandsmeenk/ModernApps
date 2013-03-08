/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>
/// <reference path="ToolBarItemControl.ts"/>

declare var $;

class ToolBarControl extends FrameworkControl {
    
    private _itemCounter: number = 0;
    private _items = [];

    private _shadowLogoDiv: any;
    private _shadowTitleDiv: any;
    
    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string) {

        super(UIRenderer, Debugger, UniqueID, null);
        
    }

    public InitConfig(logoUrl: string, title: string, titleLength: number, backgroundColor: string) {
        this.Debugger.Log("ToolBarControl:InitConfig");

        this._rootDiv.css("padding-left", titleLength).css("background-color", backgroundColor);

        this._shadowLogoDiv = this.UIRenderer.LoadHTMLElement("imgLogo", this._rootDiv, "<img id='imgLogo' src='" + logoUrl + "' />");
        this._shadowLogoDiv.show();

        this._shadowTitleDiv = this.UIRenderer.LoadHTMLElement("divTitle", this._rootDiv, "<div id='divTitle' >" + title + "</div>");
        this._shadowTitleDiv.show();
    }

    public Show(eventData: any) {
        this.Debugger.Log("ToolBarControl:Show");
         
        this._eventData = eventData;
        
        this.UIRenderer.ShowDiv(this.UniqueID);
        
        //override the FrameworkControl implementation so that we dont wire up the click for this control
    }

    public AddItem(id: string, text: string, eventData: any, style: string) {
        this.Debugger.Log("ToolBarControl:AddItem");
        try {
            var newToolbarItem = new ToolBarItemControl(this.UIRenderer, this.Debugger, id, this.UniqueID);
            newToolbarItem._rootDiv.attr("style", style);
            newToolbarItem.Show(this._parentObject, this._parentClickCallback, eventData);
            newToolbarItem.UpdateContent("<div class='tbiTitle'>" + text + "</div>");
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

        this._shadowLogoDiv.remove();

        super.Unload();
    }
}

