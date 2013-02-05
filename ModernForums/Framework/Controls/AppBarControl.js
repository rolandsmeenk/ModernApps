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
    AppBarControl.prototype.Show = function (parentObject, parentClickCallback, eventData) {
        var _this = this;
        this.Debugger.Log("AppBarControl:Show");
        this._parentObject = parentObject;
        this._parentClickCallback = parentClickCallback;
        this._eventData = eventData;
        this.UIRenderer.AnimateDiv(this.UniqueID, {
            top: "+=200",
            display: ""
        }, 600);
        if(this.ParentUniqueID != null) {
            this._rootDiv.off('click').on('click', this, function () {
                _this._parentObject.data = _this._eventData;
                _this._parentClickCallback(_this._parentObject);
            });
        } else {
            this._rootDiv.off('click').on('click', this._parentObject, this._parentClickCallback);
        }
    };
    AppBarControl.prototype.Hide = function () {
        this.Debugger.Log("AppBarControl:Hide");
        this.UIRenderer.AnimateDiv(this.UniqueID, {
            top: "-=200",
            display: "none"
        }, 600);
        this._rootDiv.off('click');
    };
    AppBarControl.prototype.Unload = function () {
        this.Debugger.Log("AppBarControl:Unload");
        this._rootDiv.off('click');
    };
    return AppBarControl;
})(FrameworkControl);
