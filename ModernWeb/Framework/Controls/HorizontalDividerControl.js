var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var HorizontalDividerControl = (function (_super) {
    __extends(HorizontalDividerControl, _super);
    function HorizontalDividerControl(UIRenderer, Debugger, UniqueID, ParentUniqueID) {
        _super.call(this, UIRenderer, Debugger, UniqueID, ParentUniqueID);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this.ParentUniqueID = ParentUniqueID;
        this._startDrag = false;
        this._topRect = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        };
        this._bottomRect = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        };
        this.MinimumY = 0;
        this.MaximumY = 0;
        this._shadowDivider = this.UIRenderer.LoadDiv(UniqueID + "_shadow");
        this.MinimumY = 0;
    }
    HorizontalDividerControl.prototype.InitUI = function (minTop) {
        this._updateRects(minTop);
    };
    HorizontalDividerControl.prototype.Show = function (eventData) {
        var _this = this;
        this.Debugger.Log("HorizontalDividerControl:Show");
        this.MaximumY = this.UIRenderer.RootUI.height();
        this._eventData = eventData;
        this.UIRenderer.RootUI.css("-ms-touch-action", "none");
        this._rootDiv.on("mousedown", function (event) {
            _this.Debugger.Log("HorizontalDividerControl:mousedown");
            _this._startDrag = true;
            _this._shadowDivider.css("display", "");
            if (_this.ParentResizeStartedCallback != null) {
                _this.ParentResizeStartedCallback("resize started");
            }
        });
        this.UIRenderer.RootUI.on("mousemove", function (event) {
            if (_this._startDrag) {
                _this.Debugger.Log("HorizontalDividerControl:mousemove " + event.pageY);
                _this._rootDiv.css("opacity", 0.4);
                _this._shadowDivider.css("top", event.pageY);
                _this._updateRects(event.pageY);
            }
        });
        this.UIRenderer.RootUI.on("mouseup", function (event) {
            if (_this._startDrag) {
                _this.Debugger.Log("HorizontalDividerControl:mouseup");
                _this._rootDiv.css("top", event.pageY);
                _this._rootDiv.css("opacity", 1);
                _this._rootDiv.css("display", "");
                _this._shadowDivider.css("display", "none");
                if (_this.ParentResizeCompleteCallback != null) {
                    _this.ParentResizeCompleteCallback(event.pageX, event.pageY);
                }
                _this._updateRects(event.pageY);
            }
            _this._startDrag = false;
        });
        this._shadowDivider.css("display", "none");
    };
    HorizontalDividerControl.prototype.AnimateTop = function (top, hideThumb) {
        var newTop = this._topRect.y1 + top;
        this._startDrag = true;
        this._shadowDivider.css("display", "");
        if (this.ParentResizeStartedCallback != null) {
            this.ParentResizeStartedCallback("resize started");
        }
        if (this._startDrag) {
            this._rootDiv.css("opacity", 0.4);
            var _self = this;
            this._shadowDivider.animate({
                top: newTop
            }, 400, function () {
                _self._shadowDivider.css("top", newTop);
                _self._updateRects(newTop);
                if (_self._startDrag) {
                    _self._rootDiv.css("top", newTop);
                    _self._rootDiv.css("opacity", 1);
                    if (hideThumb) {
                        _self._rootDiv.css("display", "none");
                    } else {
                        _self._rootDiv.css("display", "");
                    }
                    _self._shadowDivider.css("display", "none");
                    if (_self.ParentResizeCompleteCallback != null) {
                        _self.ParentResizeCompleteCallback(0, newTop);
                    }
                    _self._updateRects(newTop);
                }
                _self._startDrag = false;
            });
        }
    };
    HorizontalDividerControl.prototype._updateRects = function (y2) {
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
    };
    HorizontalDividerControl.prototype.UpdateWidth = function (left) {
        this.Debugger.Log("HorizontalDividerControl:UpdateWidth " + left);
        this._rootDiv.css("left", left);
        this._shadowDivider.css("left", left);
        this._rootDiv.width(this.UIRenderer.RootUI.width() - left);
        this._shadowDivider.width(this.UIRenderer.RootUI.width() - left);
    };
    HorizontalDividerControl.prototype.GetTopRectangle = function () {
        return this._topRect;
    };
    HorizontalDividerControl.prototype.GetBottomRectangle = function () {
        return this._bottomRect;
    };
    HorizontalDividerControl.prototype.Unload = function () {
        this.Debugger.Log("HorizontalDividerControl:Unload");
        this._rootDiv.off("mousedown");
        this.UIRenderer.RootUI.off("mousemove");
        this.UIRenderer.RootUI.off("mouseup");
        this.ParentResizeCompleteCallback = null;
        this._shadowDivider.remove();
        _super.prototype.Unload.call(this);
    };
    return HorizontalDividerControl;
})(FrameworkControl);
