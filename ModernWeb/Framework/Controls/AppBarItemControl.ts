/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>
/// <reference path="FrameworkControl.ts"/>

declare var $;

class AppBarItemControl extends FrameworkControl  {

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string, public ParentUniqueID: string) {
        super(UIRenderer, Debugger, UniqueID, ParentUniqueID);
    }


}

