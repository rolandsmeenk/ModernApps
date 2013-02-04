var ToolBarControl = (function () {
    function ToolBarControl(UIRenderer, Debugger, UniqueID) {
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this._itemCounter = 0;
        this._toolBarDiv = this.UIRenderer.LoadDiv(this.UniqueID);
    }
    ToolBarControl.prototype.Show = function (parentObject, parentClickCallback) {
        this.Debugger.Log("ToolBarControl:Show");
        this._parentObject = parentObject;
        this._parentClickCallback = parentClickCallback;
        this.UIRenderer.ShowDiv(this.UniqueID);
    };
    ToolBarControl.prototype.Hide = function () {
        this.Debugger.Log("ToolBarControl:Hide");
        this.UIRenderer.HideDiv(this.UniqueID);
        this._toolBarDiv.off('click');
    };
    ToolBarControl.prototype.Unload = function () {
        this.Debugger.Log("ToolBarControl:Unload");
        this._toolBarDiv.off('click');
    };
    ToolBarControl.prototype.AddItem = function (id, text) {
        this.Debugger.Log("ToolBarControl:AddItem");
        var newToolbarItem = new ToolBarItemControl(this.UIRenderer, this.Debugger, id, this.UniqueID);
        newToolbarItem.Show(this._parentObject, this._parentClickCallback);
        newToolbarItem.UpdateContent(text);
        this._items.push(newToolbarItem);
        this._itemCounter++;
    };
    return ToolBarControl;
})();
