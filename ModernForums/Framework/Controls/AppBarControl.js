var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AppBarControl = (function (_super) {
    __extends(AppBarControl, _super);
    function AppBarControl(UIRenderer, Debugger, UniqueID) {
        _super.call(this, UIRenderer, Debugger, UniqueID, null);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
    }
    AppBarControl.prototype.Show = function (parentObject, parentClickCallback) {
        this.Debugger.Log("AppBarControl:Show");
        this.UIRenderer.AnimateDiv(this.UniqueID, {
            top: "+=200",
            display: ""
        }, 600);
        this._appBarDiv.off('click').on('click', parentObject, parentClickCallback);
    };
    AppBarControl.prototype.Hide = function () {
        this.Debugger.Log("AppBarControl:Hide");
        this.UIRenderer.AnimateDiv(this.UniqueID, {
            top: "-=200",
            display: "none"
        }, 600);
        this._appBarDiv.off('click');
    };
    AppBarControl.prototype.Unload = function () {
        this.Debugger.Log("AppBarControl:Unload");
        this._appBarDiv.off('click');
    };
    return AppBarControl;
})(FrameworkControl);
