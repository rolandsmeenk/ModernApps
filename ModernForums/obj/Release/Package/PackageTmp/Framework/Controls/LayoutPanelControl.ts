/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>

/// <reference path="FrameworkControl.ts"/>

declare var $;

class LayoutPanelControl extends FrameworkControl {

    public LayoutChangedCallback: any;
    public Dimension: any;
    

    public Show(parentObject: any, parentClickCallback: any, eventData: any) {
        this.Debugger.Log("FrameworkControl:Show");

        this.InitCallbacks(parentObject, parentClickCallback, eventData);

        this.UIRenderer.ShowDiv(this.UniqueID);
    }


    public UpdateLayout(rect: any) {
        this.Debugger.Log("FrameworkControl:UpdateLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        
        this.Dimension = rect;
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);

        if (this.LayoutChangedCallback != null) this.LayoutChangedCallback(rect);
        
        
    }

}

