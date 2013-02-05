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
        this._shadowDivider = this.UIRenderer.LoadDiv(UniqueID + "_shadow");
    }
    HorizontalDividerControl.prototype.Show = function (eventData) {
        var _this = this;
        this.Debugger.Log("HorizontalDividerControl:Show");
        this._eventData = eventData;
        this._rootDiv.mousedown(function () {
            _this.Debugger.Log("HorizontalDividerControl:mousedown");
            _this._startDrag = true;
            _this._shadowDivider.css("display", "");
        });
        this.UIRenderer.RootUI.on("mousemove", function (event) {
            if(_this._startDrag) {
                _this.Debugger.Log("HorizontalDividerControl:mousemove " + event.pageY);
                _this._rootDiv.css("opacity", 0.4);
                _this._shadowDivider.css("top", event.pageY);
            }
        });
        this.UIRenderer.RootUI.on("mouseup", function (event) {
            if(_this._startDrag) {
                _this.Debugger.Log("HorizontalDividerControl:mouseup");
                _this._rootDiv.css("top", event.pageY);
                _this._rootDiv.css("opacity", 1);
                _this._rootDiv.css("display", "");
                _this._shadowDivider.css("display", "none");
            }
            _this._startDrag = false;
        });
    };
    HorizontalDividerControl.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
        this._rootDiv.off("mousedown");
        this.UIRenderer.RootUI.off("mousemove");
        this.UIRenderer.RootUI.off("mouseup");
    };
    return HorizontalDividerControl;
})(FrameworkControl);
