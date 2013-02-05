﻿/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>
/// <reference path="FrameworkControl.ts"/>

declare var $;

class HorizontalDividerControl extends FrameworkControl  {

    private _startDrag: bool = false;
    private _shadowDivider: any;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string, public ParentUniqueID: string) {
        super(UIRenderer, Debugger, UniqueID, ParentUniqueID);

        this._shadowDivider = this.UIRenderer.LoadDiv(UniqueID + "_shadow");

        
    }


    public Show(eventData: any) {
        this.Debugger.Log("HorizontalDividerControl:Show");

        this._eventData = eventData;

        this._rootDiv.mousedown(() => {
            this.Debugger.Log("HorizontalDividerControl:mousedown");
            this._startDrag = true;

            //this._rootDiv.css("display", "none");
            this._shadowDivider.css("display", "");
        });

        this.UIRenderer.RootUI.on("mousemove", (event) => {
            if (this._startDrag) {
                this.Debugger.Log("HorizontalDividerControl:mousemove " + event.pageY);
                this._rootDiv.css("opacity", 0.4);
                this._shadowDivider.css("top", event.pageY);
            }
        });

        this.UIRenderer.RootUI.on("mouseup", (event) => {
            if (this._startDrag) {
                this.Debugger.Log("HorizontalDividerControl:mouseup");
                this._rootDiv.css("top", event.pageY);
                this._rootDiv.css("opacity", 1)
                this._rootDiv.css("display", "");
                this._shadowDivider.css("display", "none");
            }
            this._startDrag = false;
        });

    }


    public Unload() {
        super.Unload();
        this._rootDiv.off("mousedown");
        this.UIRenderer.RootUI.off("mousemove");
        this.UIRenderer.RootUI.off("mouseup");
    }
}
