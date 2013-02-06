/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>

/// <reference path="FrameworkControl.ts"/>

declare var $;

class LayoutPanelControl extends FrameworkControl {



    public Show(parentObject: any, parentClickCallback: any, eventData: any) {
        this.Debugger.Log("FrameworkControl:Show");

        this.InitCallbacks(parentObject, parentClickCallback, eventData);

        this.UIRenderer.ShowDiv(this.UniqueID);
    }

    

}

