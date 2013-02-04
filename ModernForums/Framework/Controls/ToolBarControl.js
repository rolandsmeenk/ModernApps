var ToolBarControl = (function () {
    function ToolBarControl(UIRenderer, Debugger, UniqueID) {
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this._toolBarDiv = this.UIRenderer.LoadDiv(this.UniqueID);
    }
    ToolBarControl.prototype.Show = function (parentObject, parentClickCallback) {
        this.Debugger.Log("ToolBarControl:Show");
        this.UIRenderer.ShowDiv(this.UniqueID);
        this._toolBarDiv.off('click').on('click', parentObject, parentClickCallback);
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
    return ToolBarControl;
})();
