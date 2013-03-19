var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var InfiniteCanvasControl = (function (_super) {
    __extends(InfiniteCanvasControl, _super);
    function InfiniteCanvasControl(UIRenderer, Debugger, UniqueID, ParentUniqueID, TopPadding) {
        _super.call(this, UIRenderer, Debugger, UniqueID, ParentUniqueID);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this.ParentUniqueID = ParentUniqueID;
        this._TopPadding = TopPadding;
        this._shadowCanvas = this.UIRenderer.LoadCanvasInParent("infiniteCanvas", this._rootDiv);
        this._AppContainer = new AppContainer();
        this._AppContainer.CheckBrowserCompatibility(this._shadowCanvas);
    }
    InfiniteCanvasControl.prototype.InitUI = function (startHeight) {
        this.Debugger.Log("InfiniteCanvasControl:InitUI");
        this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
    };
    InfiniteCanvasControl.prototype.InitTheme = function (theme) {
        this._shadowCanvas.css("background-color", theme.BackgroundColor);
    };
    InfiniteCanvasControl.prototype.UpdateFromLayout = function (rect) {
        this.Debugger.Log("InfiniteCanvasControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rootDiv.css("left", rect.x1).css("top", rect.y1 + this._TopPadding).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);
        this._shadowCanvas.attr("width", rect.x2 - rect.x1).attr("height", rect.y2 - rect.y1);
        this._AppContainer.LayoutUpdated();
    };
    InfiniteCanvasControl.prototype.Unload = function () {
        this._AppContainer.Unload();
        this._shadowCanvas.remove();
        _super.prototype.Unload.call(this);
    };
    return InfiniteCanvasControl;
})(FrameworkControl);
