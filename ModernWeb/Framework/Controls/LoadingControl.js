var LoadingControl = (function () {
    function LoadingControl(UIRenderer, Debugger, UniqueID) {
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this._shadowDiv = this.UIRenderer.LoadDiv(this.UniqueID);
    }
    LoadingControl.prototype.Show = function (message) {
        this.Debugger.Log("LoadingControl.Show");
        this.UIRenderer.FillDivContent(this.UniqueID, message);
        this.UIRenderer.ShowDiv(this.UniqueID);
    };
    LoadingControl.prototype.Hide = function () {
        this.Debugger.Log("LoadingControl.Hide");
        this.UIRenderer.HideDiv(this.UniqueID);
    };
    LoadingControl.prototype.Unload = function () {
        this.Debugger.Log("LoadingControl.Unload");
        this._shadowDiv.remove();
    };
    return LoadingControl;
})();
