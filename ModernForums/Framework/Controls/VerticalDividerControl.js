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
        this._shadowDivider = this.UIRenderer.LoadDiv(UniqueID + "_shadow");
    }
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
            }
        });
        this.UIRenderer.RootUI.on("mouseup", function (event) {
            if(_this._startDrag) {
                _this.Debugger.Log("VerticalDividerControl:mouseup");
                _this._rootDiv.css("left", event.pageX);
                _this._rootDiv.css("opacity", 1);
                _this._rootDiv.css("display", "");
                _this._shadowDivider.css("display", "none");
                if(_this.ParentResizeCompleteCallback != null) {
                    _this.ParentResizeCompleteCallback(event.pageX, event.pageY);
                }
            }
            _this._startDrag = false;
        });
    };
    VerticalDividerControl.prototype.UpdateHeight = function (top) {
        this.Debugger.Log("VerticalDividerControl:UpdateHeight");
        this._rootDiv.css("top", top);
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
