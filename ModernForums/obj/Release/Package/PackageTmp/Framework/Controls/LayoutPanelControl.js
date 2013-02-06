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
        this.Debugger.Log("FrameworkControl:Show");
        this.InitCallbacks(parentObject, parentClickCallback, eventData);
        this.UIRenderer.ShowDiv(this.UniqueID);
    };
    return LayoutPanelControl;
})(FrameworkControl);
