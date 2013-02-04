var ToolBarItemControl = (function () {
    function ToolBarItemControl(UIRenderer, Debugger, UniqueID, ParentUniqueID) {
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this.ParentUniqueID = ParentUniqueID;
        this._toolBarItemDiv = this.UIRenderer.LoadDivInParent(this.UniqueID, this.ParentUniqueID);
    }
    ToolBarItemControl.prototype.Show = function (parentObject, parentClickCallback, eventData) {
        var _this = this;
        this.Debugger.Log("ToolBarItemControl:Show");
        this._parentObject = parentObject;
        this._parentClickCallback = parentClickCallback;
        this._eventData = eventData;
        this.UIRenderer.ShowDiv(this.UniqueID);
        this._toolBarItemDiv.off('click').on('click', this, function () {
            _this._parentObject.data = _this._eventData;
            _this._parentClickCallback(_this._parentObject);
        });
    };
    ToolBarItemControl.prototype.Hide = function () {
        this.Debugger.Log("ToolBarItemControl:Hide");
        this.UIRenderer.HideDiv(this.UniqueID);
        this._toolBarItemDiv.off('click');
    };
    ToolBarItemControl.prototype.Unload = function () {
        this.Debugger.Log("ToolBarItemControl:Unload");
        this._toolBarItemDiv.off('click');
    };
    ToolBarItemControl.prototype.UpdateContent = function (content) {
        this._toolBarItemDiv.html(content);
    };
    return ToolBarItemControl;
})();
