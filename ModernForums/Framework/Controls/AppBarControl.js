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
        this._itemCounter = 0;
        this._items = [];
    }
    AppBarControl.prototype.InitCallbacks = function (parentObject, parentClickCallback, eventData) {
        this.Debugger.Log("AppBarControl:InitCallbacks");
        this._parentObject = parentObject;
        this._parentClickCallback = parentClickCallback;
        this._eventData = eventData;
    };
    AppBarControl.prototype.Show = function (eventData) {
        this.Debugger.Log("AppBarControl:Show");
        this._eventData = eventData;
        this.UIRenderer.AnimateDiv(this.UniqueID, {
            top: "+=200",
            display: ""
        }, 600);
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
    AppBarControl.prototype.AddItem = function (id, text, eventData) {
        this.Debugger.Log("AppBarControl:AddItem");
        try  {
            var newToolbarItem = new AppBarItemControl(this.UIRenderer, this.Debugger, id, this.UniqueID);
            newToolbarItem.Show(this._parentObject, this._parentClickCallback, eventData);
            newToolbarItem.UpdateContent(text);
            this._items.push(newToolbarItem);
            this._itemCounter++;
        } catch (ex) {
            alert(ex.message);
        }
    };
    return AppBarControl;
})(FrameworkControl);
