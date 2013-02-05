/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>
/// <reference path="FrameworkControl.ts"/>

declare var $;

class VerticalDividerControl extends FrameworkControl  {

    private _startDrag: bool = false;


    public Show(eventData: any) {
        this.Debugger.Log("VerticalDividerControl:Show");

        this._eventData = eventData;

        this._rootDiv.off("mousedown").mousedown(() => {
            this.Debugger.Log("VerticalDividerControl:mousedown");
            this._startDrag = true;
        });

        this.UIRenderer.RootUI.off("mousemove").on("mousemove", (event) => {
            if (this._startDrag) {
                this.Debugger.Log("VerticalDividerControl:mousemove " + event.pageX);
                //this._rootDiv.css("left", event.pageX);
            }
        });

        this.UIRenderer.RootUI.off("mouseup").on("mouseup", (event) => {
            if (this._startDrag) {
                this.Debugger.Log("VerticalDividerControl:mouseup");
                this._rootDiv.css("left", event.pageX);
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

