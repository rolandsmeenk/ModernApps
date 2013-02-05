var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ToolBarControl = (function (_super) {
    __extends(ToolBarControl, _super);
    function ToolBarControl(UIRenderer, Debugger, UniqueID) {
        _super.call(this, UIRenderer, Debugger, UniqueID, null);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this._itemCounter = 0;
        this._items = [];
    }
    ToolBarControl.prototype.InitCallbacks = function (parentObject, parentClickCallback, eventData) {
        this.Debugger.Log("ToolBarControl:InitCallbacks");
        this._parentObject = parentObject;
        this._parentClickCallback = parentClickCallback;
        this._eventData = eventData;
    };
    ToolBarControl.prototype.Show = function (eventData) {
        this.Debugger.Log("ToolBarControl:Show");
        this._eventData = eventData;
        this.UIRenderer.ShowDiv(this.UniqueID);
    };
    ToolBarControl.prototype.AddItem = function (id, text, eventData) {
        this.Debugger.Log("ToolBarControl:AddItem");
        try  {
            var newToolbarItem = new ToolBarItemControl(this.UIRenderer, this.Debugger, id, this.UniqueID);
            newToolbarItem.Show(this._parentObject, this._parentClickCallback, eventData);
            newToolbarItem.UpdateContent(text);
            this._items.push(newToolbarItem);
            this._itemCounter++;
        } catch (ex) {
            alert(ex.message);
        }
    };
    return ToolBarControl;
})(FrameworkControl);
