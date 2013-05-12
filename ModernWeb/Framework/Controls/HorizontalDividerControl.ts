/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>
/// <reference path="FrameworkControl.ts"/>

//declare var $;

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

        this.UIRenderer.RootUI.css("-ms-touch-action", "none");

        this._rootDiv.on("mousedown", (event) => {
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


        this._shadowDivider.css("display", "none");
    }


    public AnimateTop(top: number, hideThumb: bool) {

        var newTop: number = this._topRect.y1 + top;

        //mimic mousedown
        this._startDrag = true;
        this._shadowDivider.css("display", "");
        if (this.ParentResizeStartedCallback != null) this.ParentResizeStartedCallback("resize started");

        //mimic mousemove (part 1)
        if (this._startDrag) {
            this._rootDiv.css("opacity", 0.4);

            var _self = this;
            this._shadowDivider.animate({ top: newTop }, 400, function () {

                //mimic mousemove (part 2)
                _self._shadowDivider.css("top", newTop);
                _self._updateRects(newTop);

                //mimic mouseup
                if (_self._startDrag) {
                    _self._rootDiv.css("top", newTop);
                    _self._rootDiv.css("opacity", 1)
                    if (hideThumb) {
                        _self._rootDiv.css("display", "none");
                    } else {
                        _self._rootDiv.css("display", "");
                    }
                    _self._shadowDivider.css("display", "none");
                    if (_self.ParentResizeCompleteCallback != null) _self.ParentResizeCompleteCallback(0, newTop);
                    _self._updateRects(newTop);
                }
                _self._startDrag = false;

            });


        }



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
        this.Debugger.Log("HorizontalDividerControl:Unload");

        this._rootDiv.off("mousedown");
        this.UIRenderer.RootUI.off("mousemove");
        this.UIRenderer.RootUI.off("mouseup");

        this.ParentResizeCompleteCallback = null;

        this._shadowDivider.remove();

        super.Unload();
    }
}

