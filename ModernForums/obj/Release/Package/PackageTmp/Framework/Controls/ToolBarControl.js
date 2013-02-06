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
    ToolBarControl.prototype.Unload = function () {
        this.Debugger.Log("ToolBarControl:Unload");
        for(var i = 0; i < this._items.length; i++) {
            this._items[i].Unload();
        }
        _super.prototype.Unload.call(this);
    };
    return ToolBarControl;
})(FrameworkControl);
