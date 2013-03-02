/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>
/// <reference path="FrameworkControl.ts"/>

declare var $;

class HorizontalDividerControl extends FrameworkControl  {

    private _startDrag: bool = false;
    private _shadowDivider: any;

    private _topRect: any = { x1: 0, y1: 0, x2: 0, y2: 0 };
    private _bottomRect: any = { x1: 0, y1: 0, x2: 0, y2: 0 };

    public MinimumY: number = 0;
    public MaximumY: number = 0;

    public ParentResizeStartedCallback: any;
    public ParentResizeCompleteCallback: any;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string, public ParentUniqueID: string) {
        super(UIRenderer, Debugger, UniqueID, ParentUniqueID);

        this._shadowDivider = this.UIRenderer.LoadDiv(UniqueID + "_shadow");

        this.MinimumY = 0;
    }

    public InitUI(minTop: number) {
        this._updateRects(minTop);

    }

    public Show(eventData: any) {
        this.Debugger.Log("HorizontalDividerControl:Show");

        this.MaximumY = this.UIRenderer.RootUI.height();


        this._eventData = eventData;

        this._rootDiv.mousedown(() => {
            this.Debugger.Log("HorizontalDividerControl:mousedown");
            this._startDrag = true;

            //this._rootDiv.css("display", "none");
            this._shadowDivider.css("display", "");

            if (this.ParentResizeStartedCallback != null) this.ParentResizeStartedCallback("resize started");
        });

        this.UIRenderer.RootUI.on("mousemove", (event) => {
            if (this._startDrag) {
                this.Debugger.Log("HorizontalDividerControl:mousemove " + event.pageY);
                this._rootDiv.css("opacity", 0.4);
                this._shadowDivider.css("top", event.pageY);

                this._updateRects(event.pageY);

            }
        });

        this.UIRenderer.RootUI.on("mouseup", (event) => {
            if (this._startDrag) {
                this.Debugger.Log("HorizontalDividerControl:mouseup");
                this._rootDiv.css("top", event.pageY);
                this._rootDiv.css("opacity", 1)
                this._rootDiv.css("display", "");
                this._shadowDivider.css("display", "none");
                if (this.ParentResizeCompleteCallback != null) this.ParentResizeCompleteCallback(event.pageX, event.pageY);

                this._updateRects(event.pageY);
            }
            this._startDrag = false;
        });

    }


    private _updateRects(y2: number) {
        var top1 = this.MinimumY;
        var left = parseFloat(this._rootDiv.css("left"));

        this._topRect.x1 = left;
        this._topRect.y1 = top1;
        this._topRect.x2 = left + this._rootDiv.width();
        this._topRect.y2 = y2;


        this._bottomRect.x1 = this._topRect.x1;
        this._bottomRect.y1 = this._topRect.y2;
        this._bottomRect.x2 = this._topRect.x2;
        this._bottomRect.y2 = this.MaximumY;

    }


    public UpdateWidth(left: number) {
        this.Debugger.Log("HorizontalDividerControl:UpdateWidth " + left);

        this._rootDiv.css("left", left);
        this._shadowDivider.css("left", left);
        this._rootDiv.width(this.UIRenderer.RootUI.width() - left);
        this._shadowDivider.width(this.UIRenderer.RootUI.width() - left);
        
    }

    public GetTopRectangle() {
        return this._topRect;
    }

    public GetBottomRectangle() {
        return this._bottomRect;
    }


    public Unload() {
        super.Unload();
        this._rootDiv.off("mousedown");
        this.UIRenderer.RootUI.off("mousemove");
        this.UIRenderer.RootUI.off("mouseup");
        this.ParentResizeCompleteCallback = null;
    }
}

