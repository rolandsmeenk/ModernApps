/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>

declare var $;

class AppBarControl {
    private _appBarDiv;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string) {
        this._appBarDiv = this.UIRenderer.LoadDiv(this.UniqueID);

    }


    public Show(parentObject: any, parentClickCallback: any) {
        this.Debugger.Log("AppBarControl:Show");

        //this.UIRenderer.ShowDiv(this.UniqueID);
        this.UIRenderer.AnimateDiv(this.UniqueID, { top: "+=200", display: "" }, 600);

        //this._appBarDiv.off('click').on('click', this, function (event) { event.data.Hide();  } );
        this._appBarDiv.off('click').on('click', parentObject, parentClickCallback);
        
    }

    public Hide() {
        this.Debugger.Log("AppBarControl:Hide");
        //this.UIRenderer.HideDiv(this.UniqueID);
        this.UIRenderer.AnimateDiv(this.UniqueID, { top: "-=200", display: "none" }, 600);

        this._appBarDiv.off('click');
    }


    public Unload() {
        this.Debugger.Log("AppBarControl:Unload");
        this._appBarDiv.off('click');

    }


}

