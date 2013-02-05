var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var VerticalDividerControl = (function (_super) {
    __extends(VerticalDividerControl, _super);
    function VerticalDividerControl() {
        _super.apply(this, arguments);

        this._startDrag = false;
    }
    VerticalDividerControl.prototype.Show = function (eventData) {
        var _this = this;
        this.Debugger.Log("VerticalDividerControl:Show");
        this._eventData = eventData;
        this._rootDiv.off("mousedown").mousedown(function () {
            _this.Debugger.Log("VerticalDividerControl:mousedown");
            _this._startDrag = true;
        });
        this.UIRenderer.RootUI.off("mousemove").on("mousemove", function (event) {
            if(_this._startDrag) {
                _this.Debugger.Log("VerticalDividerControl:mousemove " + event.pageX);
            }
        });
        this.UIRenderer.RootUI.off("mouseup").on("mouseup", function (event) {
            if(_this._startDrag) {
                _this.Debugger.Log("VerticalDividerControl:mouseup");
                _this._rootDiv.css("left", event.pageX);
            }
            _this._startDrag = false;
        });
    };
    VerticalDividerControl.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
        this._rootDiv.off("mousedown");
        this.UIRenderer.RootUI.off("mousemove");
        this.UIRenderer.RootUI.off("mouseup");
    };
    return VerticalDividerControl;
})(FrameworkControl);
