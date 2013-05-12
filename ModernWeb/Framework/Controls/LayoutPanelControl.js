var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var LayoutPanelControl = (function (_super) {
    __extends(LayoutPanelControl, _super);
    function LayoutPanelControl() {
        _super.apply(this, arguments);

    }
    LayoutPanelControl.prototype.Show = function (parentObject, parentClickCallback, eventData) {
        this.Debugger.Log("LayoutPanelControl:Show");
        this.InitCallbacks(parentObject, parentClickCallback, eventData);
        this.UIRenderer.ShowDiv(this.UniqueID);
    };
    LayoutPanelControl.prototype.UpdateLayout = function (rect) {
        this.Debugger.Log("LayoutPanelControl:UpdateLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this.Dimension = rect;
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);
        if (this.LayoutChangedCallback != null) {
            this.LayoutChangedCallback(rect);
        }
    };
    return LayoutPanelControl;
})(FrameworkControl);
