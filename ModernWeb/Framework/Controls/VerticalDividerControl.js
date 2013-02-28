var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var VerticalDividerControl = (function (_super) {
    __extends(VerticalDividerControl, _super);
    function VerticalDividerControl(UIRenderer, Debugger, UniqueID, ParentUniqueID) {
        _super.call(this, UIRenderer, Debugger, UniqueID, ParentUniqueID);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this.ParentUniqueID = ParentUniqueID;
        this._startDrag = false;
        this._leftRect = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        };
        this._rightRect = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        };
        this.MinimumY = 0;
        this.MaximumY = 0;
        this._shadowDivider = this.UIRenderer.LoadDiv(UniqueID + "_shadow");
    }
    VerticalDividerControl.prototype.InitUI = function (left) {
        this._updateRects(left);
    };
    VerticalDividerControl.prototype.Show = function (eventData) {
        var _this = this;
        this.Debugger.Log("VerticalDividerControl:Show");
        this._eventData = eventData;
        this._rootDiv.mousedown(function () {
            _this.Debugger.Log("VerticalDividerControl:mousedown");
            _this._startDrag = true;
            _this._shadowDivider.css("display", "");
        });
        this.UIRenderer.RootUI.on("mousemove", function (event) {
            if(_this._startDrag) {
                _this.Debugger.Log("VerticalDividerControl:mousemove " + event.pageX);
                _this._rootDiv.css("opacity", 0.4);
                _this._shadowDivider.css("left", event.pageX);
                _this._updateRects(event.pageX);
            }
        });
        this.UIRenderer.RootUI.on("mouseup", function (event) {
            if(_this._startDrag) {
                _this.Debugger.Log("VerticalDividerControl:mouseup ");
                _this._rootDiv.css("left", event.pageX);
                _this._rootDiv.css("opacity", 1);
                _this._rootDiv.css("display", "");
                _this._shadowDivider.css("display", "none");
                if(_this.ParentResizeCompleteCallback != null) {
                    _this.ParentResizeCompleteCallback(event.pageX, event.pageY);
                }
                _this._updateRects(event.pageX);
            }
            _this._startDrag = false;
        });
    };
    VerticalDividerControl.prototype._updateRects = function (x2) {
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
    };
    VerticalDividerControl.prototype.GetLeftRectangle = function () {
        return this._leftRect;
    };
    VerticalDividerControl.prototype.GetRightRectangle = function () {
        return this._rightRect;
    };
    VerticalDividerControl.prototype.UpdateHeight = function (top) {
        this.Debugger.Log("VerticalDividerControl:UpdateHeight");
        this._rootDiv.css("top", top);
        this._shadowDivider.css("top", top);
        this._rootDiv.height(this.UIRenderer.RootUI.height() - top);
        this._shadowDivider.height(this.UIRenderer.RootUI.height() - top);
    };
    VerticalDividerControl.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
        this._rootDiv.off("mousedown");
        this.UIRenderer.RootUI.off("mousemove");
        this.UIRenderer.RootUI.off("mouseup");
        this.ParentResizeCompleteCallback = null;
    };
    return VerticalDividerControl;
})(FrameworkControl);
