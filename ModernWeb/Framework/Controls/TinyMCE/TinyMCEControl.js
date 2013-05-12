var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TinyMCEControl = (function (_super) {
    __extends(TinyMCEControl, _super);
    function TinyMCEControl(UIRenderer, Debugger, UniqueID, ParentUniqueID) {
        _super.call(this, UIRenderer, Debugger, UniqueID, ParentUniqueID);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this.ParentUniqueID = ParentUniqueID;
        this._shadowTextArea = this.UIRenderer.LoadTextAreaInParent("elm1", this._rootDiv);
        this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
    }
    TinyMCEControl.prototype.InitUI = function (startHeight) {
        this.Debugger.Log("TinyMCEControl:InitUI");
        if (typeof tinyMCE == "undefined") {
            this.Debugger.Log("TinyMCEControl:InitUI - loading 'tiny_mce_dev.js'");
            $.getScript('/Framework/ThirdParty/tiny_mce/tiny_mce_dev.js', function () {
                _bootup.SceneManager.CurrentScene.Debugger.Log("TinyMCEControl:InitUI - loaded 'tiny_mce_dev.js'");
                tinyMCE.init({
                    mode: "textareas",
                    theme: "simple"
                });
                setTimeout(function () {
                    $(".mceIframeContainer").height(startHeight - 26);
                }, 500);
            });
        }
        ;
    };
    TinyMCEControl.prototype.UpdateFromLayout = function (rect) {
        this.Debugger.Log("TinyMCEControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rect = rect;
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1 - 35);
        $(".mceIframeContainer").height(rect.y2 - rect.y1 - 26);
    };
    TinyMCEControl.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
    };
    return TinyMCEControl;
})(FrameworkControl);
