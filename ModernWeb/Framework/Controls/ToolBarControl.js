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
    ToolBarControl.prototype.InitConfig = function (logoUrl, title, titleLength, backgroundColor) {
        this.Debugger.Log("ToolBarControl:InitConfig");
        this._rootDiv.css("padding-left", titleLength).css("background-color", backgroundColor);
        this._shadowLogoDiv = this.UIRenderer.LoadHTMLElement("imgLogo", this._rootDiv, "<img id='imgLogo' src='" + logoUrl + "' />");
        this._shadowLogoDiv.show();
        this._shadowTitleDiv = this.UIRenderer.LoadHTMLElement("divTitle", this._rootDiv, "<div id='divTitle' >" + title + "</div>");
        this._shadowTitleDiv.show();
    };
    ToolBarControl.prototype.Show = function (eventData) {
        this.Debugger.Log("ToolBarControl:Show");
        this._eventData = eventData;
        this.UIRenderer.ShowDiv(this.UniqueID);
    };
    ToolBarControl.prototype.AddItem = function (id, text, eventData, style) {
        this.Debugger.Log("ToolBarControl:AddItem");
        try  {
            var newToolbarItem = new ToolBarItemControl(this.UIRenderer, this.Debugger, id, this.UniqueID);
            newToolbarItem._rootDiv.attr("style", style);
            newToolbarItem.Show(this._parentObject, this._parentClickCallback, eventData);
            newToolbarItem.UpdateContent("<div class='tbiTitle'>" + text + "</div>");
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
        this._shadowLogoDiv.remove();
        _super.prototype.Unload.call(this);
    };
    return ToolBarControl;
})(FrameworkControl);
