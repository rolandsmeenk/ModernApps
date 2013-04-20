/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>
/// <reference path="FrameworkControl.ts"/>

declare var $;

class VerticalDividerControl extends FrameworkControl  {

    private _startDrag: bool = false;
    private _shadowDivider: any;

    private _leftRect: any = { x1: 0, y1: 0, x2: 0, y2: 0 };
    private _rightRect: any = { x1: 0, y1: 0, x2: 0, y2: 0 };

    public ParentResizeStartedCallback: any;
    public ParentResizeCompleteCallback: any;

    public MinimumY: number = 0;
    public MaximumY: number = 0;


    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string, public ParentUniqueID: string) {
        super(UIRenderer, Debugger, UniqueID, ParentUniqueID);

        this._shadowDivider = this.UIRenderer.LoadDiv(UniqueID + "_shadow");

        
    }

    public InitUI(left: number) {
        this._updateRects(left);

    }

    public Show(eventData: any) {
        this.Debugger.Log("VerticalDividerControl:Show");

        this._eventData = eventData;

        this.UIRenderer.RootUI.css("-ms-touch-action", "none");

        this._rootDiv.on("mousedown", (event) => {
            this.Debugger.Log("VerticalDividerControl:mousedown");
            this._startDrag = true;

            //this._rootDiv.css("display", "none");
            this._shadowDivider.css("display", "");
            if (this.ParentResizeStartedCallback != null) this.ParentResizeStartedCallback();
        });

        this.UIRenderer.RootUI.on("mousemove", (event) => {
            if (this._startDrag) {
                this.Debugger.Log("VerticalDividerControl:mousemove " + event.pageX);
                this._rootDiv.css("opacity", 0.4);
                this._shadowDivider.css("left", event.pageX);


                this._updateRects(event.pageX);
                
            }
        });

        this.UIRenderer.RootUI.on("mouseup", (event) => {
            if (this._startDrag) {

                this.Debugger.Log("VerticalDividerControl:mouseup " );
                this._rootDiv.css("left", event.pageX );
                this._rootDiv.css("opacity", 1);
                this._rootDiv.css("display", "");
                this._shadowDivider.css("display", "none");
                if (this.ParentResizeCompleteCallback != null) this.ParentResizeCompleteCallback(event.pageX , event.pageY);


                this._updateRects(event.pageX );
            }
            this._startDrag = false;
        });

    }

    private _updateRects(x2: number) {
        var top1 = this.MinimumY;
        var left = parseFloat(this._rootDiv.css("left"));

        this._leftRect.x1 = 0;
        this._leftRect.y1 = top1;
        this._leftRect.x2 = x2;
        this._leftRect.y2 = this.UIRenderer.RootUI.height();


        this._rightRect.x1 = x2;
        this._rightRect.y1 = top1;
        this._rightRect.x2 = this.UIRenderer.RootUI.width();
        this._rightRect.y2 = this._leftRect.y2;


    }


    public GetLeftRectangle() {
        return this._leftRect;
    }

    public GetRightRectangle() {
        return this._rightRect;
    }


    public UpdateHeight(top: number) {
        this.Debugger.Log("VerticalDividerControl:UpdateHeight");
        this._rootDiv.css("top", top);
        this._shadowDivider.css("top", top);
        this._rootDiv.height(this.UIRenderer.RootUI.height() - top);
        this._shadowDivider.height(this.UIRenderer.RootUI.height() - top);
    }

    public Unload() {
        this.Debugger.Log("VerticalDividerControl:Unload");

        this._rootDiv.off("mousedown");
        this.UIRenderer.RootUI.off("mousemove");
        this.UIRenderer.RootUI.off("mouseup");
        this.ParentResizeCompleteCallback = null;

        this._shadowDivider.remove();

        super.Unload();
    }
}

