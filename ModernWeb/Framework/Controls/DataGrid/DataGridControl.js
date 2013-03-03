var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataGridControl = (function (_super) {
    __extends(DataGridControl, _super);
    function DataGridControl(UIRenderer, Debugger, UniqueID, ParentUniqueID) {
        _super.call(this, UIRenderer, Debugger, UniqueID, ParentUniqueID);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this.ParentUniqueID = ParentUniqueID;
        this._isDisabled = false;
        this.UIRenderer.HideDiv(UniqueID);
    }
    DataGridControl.prototype.InitUI = function (startHeight) {
        this.Debugger.Log("DataGridControl:InitUI");
        this._shadowDataItems = this.UIRenderer.LoadDivInParent("divDataGridItems", this.UniqueID);
        this._overlay = this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
        this._overlay.css("display", "none");
    };
    DataGridControl.prototype.UpdateFromLayout = function (rect) {
        this.Debugger.Log("DataGridControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);
    };
    DataGridControl.prototype.Enable = function () {
        this.Debugger.Log("DataGridControl:Disable ");
        this._isDisabled = false;
        this._overlay.css("display", "none");
    };
    DataGridControl.prototype.Disable = function (opacity) {
        this.Debugger.Log("DataGridControl:Disable ");
        if(this._isDisabled) {
            return;
        }
        this._isDisabled = true;
        this._overlay.css("display", "");
        this._overlay.css("opacity", opacity);
    };
    DataGridControl.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
    };
    DataGridControl.prototype.LoadData = function (data, params) {
        this.Debugger.Log("DataGridControl:LoadData - " + data);
        if(this._isDisabled) {
            return;
        }
        this._data = data;
        this.Disable(0.8);
        this.TemporaryNotification("loading ... ", "Loading");
        var self = this;
        _bootup.DataLoader.RetrieveData(data, "POST", params, "json", function (r) {
            _bootup.Debugger.Log("finished loading - " + self._data);
            self.ClearTemporaryNotification();
            self.Enable();
            $.each(r.result, function () {
                var nodeHtml = "";
                nodeHtml += '<div class="DGR">';
                nodeHtml += '<div class="col">' + this.col1 + '</div>';
                nodeHtml += '<div class="col">' + this.col2 + '</div>';
                nodeHtml += '<div class="col">' + this.col3 + '</div>';
                nodeHtml += '<div class="col">' + this.col4 + '</div>';
                nodeHtml += '<div class="col">' + this.col5 + '</div>';
                nodeHtml += '<div class="col">' + this.col6 + '</div>';
                nodeHtml += '<div class="col">' + this.col7 + '</div>';
                nodeHtml += '</div>';
                self.UIRenderer.LoadHTMLElement(null, self._shadowDataItems, nodeHtml);
            });
        });
    };
    return DataGridControl;
})(FrameworkControl);
