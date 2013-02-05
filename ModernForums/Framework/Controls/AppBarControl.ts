/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>

declare var $;

class AppBarControl extends FrameworkControl {
    //private _appBarDiv;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string) {
        //this._appBarDiv = this.UIRenderer.LoadDiv(this.UniqueID);

        super(UIRenderer, Debugger, UniqueID, null);
    }


    public Show(parentObject: any, parentClickCallback: any, eventData: any) {
        this.Debugger.Log("AppBarControl:Show");

        this._parentObject = parentObject;
        this._parentClickCallback = parentClickCallback;
        this._eventData = eventData;

        //this.UIRenderer.ShowDiv(this.UniqueID);
        this.UIRenderer.AnimateDiv(this.UniqueID, { top: "+=200", display: "" }, 600);

        //this._appBarDiv.off('click').on('click', this, function (event) { event.data.Hide();  } );
        if (this.ParentUniqueID != null)
            this._rootDiv.off('click').on('click', this, () => { this._parentObject.data = this._eventData; this._parentClickCallback(this._parentObject); });
        else
            this._rootDiv.off('click').on('click', this._parentObject, this._parentClickCallback);

        
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


}

