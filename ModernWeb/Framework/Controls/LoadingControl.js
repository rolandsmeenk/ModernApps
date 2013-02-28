var LoadingControl = (function () {
    function LoadingControl(UIRenderer, Debugger, UniqueID) {
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this.UIRenderer.LoadDiv(this.UniqueID);
    }
    LoadingControl.prototype.Show = function (message) {
        this.UIRenderer.FillDivContent(this.UniqueID, message);
        this.UIRenderer.ShowDiv(this.UniqueID);
    };
    LoadingControl.prototype.Hide = function () {
        this.UIRenderer.HideDiv(this.UniqueID);
    };
    return LoadingControl;
})();
