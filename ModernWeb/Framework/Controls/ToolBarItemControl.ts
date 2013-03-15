/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>
/// <reference path="FrameworkControl.ts"/>

declare var $;

class ToolBarItemControl extends FrameworkControl  {

    private _iconUrl: string;
    private _iconId: string;
    private _iconDiv: any;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string, public ParentUniqueID: string) {

        super(UIRenderer, Debugger, UniqueID, ParentUniqueID);
    }

    //https://a.gfx.ms/is/invis.gif
    public LoadIcon(iconUrl: string, iconId: string) {
        this._iconUrl = iconUrl;
        this._iconId = iconId;

        this._iconDiv = this.UIRenderer.LoadDivInParent(iconId, this.ParentUniqueID);

    }


}

