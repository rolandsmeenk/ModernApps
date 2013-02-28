var FrameworkControl = (function () {
    function FrameworkControl(UIRenderer, Debugger, UniqueID, ParentUniqueID) {
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this.ParentUniqueID = ParentUniqueID;
        if(this.ParentUniqueID != null) {
            this._rootDiv = this.UIRenderer.LoadDivInParent(this.UniqueID, this.ParentUniqueID);
        } else {
            this._rootDiv = this.UIRenderer.LoadDiv(this.UniqueID);
        }
    }
    FrameworkControl.prototype.InitCallbacks = function (parentObject, parentClickCallback, eventData) {
        this.Debugger.Log("FrameworkControl:InitCallbacks");
        this._parentObject = parentObject;
        this._parentClickCallback = parentClickCallback;
        this._eventData = eventData;
    };
    FrameworkControl.prototype.Show = function (parentObject, parentClickCallback, eventData) {
        var _this = this;
        this.Debugger.Log("FrameworkControl:Show");
        this.InitCallbacks(parentObject, parentClickCallback, eventData);
        this.UIRenderer.ShowDiv(this.UniqueID);
        if(this.ParentUniqueID != null) {
            this._rootDiv.off('click').on('click', this, function () {
                _this._parentObject.data = _this._eventData;
                _this._parentClickCallback(_this._parentObject);
            });
        } else {
            this._rootDiv.off('click').on('click', this._parentObject, this._parentClickCallback);
        }
    };
    FrameworkControl.prototype.Hide = function () {
        this.Debugger.Log("FrameworkControl:Hide");
        this.UIRenderer.HideDiv(this.UniqueID);
        this._rootDiv.off('click');
    };
    FrameworkControl.prototype.Unload = function () {
        this.Debugger.Log("FrameworkControl:Unload");
        this._rootDiv.off('click');
    };
    FrameworkControl.prototype.UpdateContent = function (content) {
        this.Debugger.Log("FrameworkControl:UpdateContent");
        this._rootDiv.html(content);
    };
    return FrameworkControl;
})();
