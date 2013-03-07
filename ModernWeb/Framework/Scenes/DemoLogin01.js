var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DemoLogin01 = (function (_super) {
    __extends(DemoLogin01, _super);
    function DemoLogin01(UIRenderer, Debugger) {
        var _this = this;
        _super.call(this, UIRenderer, Debugger, 500, 250);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        var _html = '<div id="divLogin01">' + '     <div class="authWindowsLive" data-command="action" data-action="windows" />' + '     <div class="authIncite" data-command="action" data-action="xbox" />' + '     <div class="authLeighton" data-command="action" data-action="phone" />' + '</div>';
        this._shadowBackgroundDiv = this.UIRenderer.LoadHTMLElement("divLogin01", null, _html);
        this._shadowBackgroundDiv.find('div[data-command="action"]').on("click", function () {
            switch($(this).data("action")) {
                case "phone":
                    _bootup.SceneManager.NavigateToScene("DemoLogin01");
                    break;
                case "windows":
                    _bootup.SceneManager.NavigateToScene("DemoLogin01");
                    break;
                case "xbox":
                    _bootup.SceneManager.NavigateToScene("DemoLogin01");
                    break;
            }
        });
        var _self = this;
        this.AreaA.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaA.LayoutChangedCallback");
            _self._shadowBackgroundDiv.css("left", rect.x1).css("top", rect.y1).width(rect.w).height(rect.h);
        };
    }
    DemoLogin01.prototype.Show = function () {
        _super.prototype.Show.call(this);
        this.Debugger.Log("DemoLogin01.Show");
        this._shadowBackgroundDiv.show();
    };
    DemoLogin01.prototype.Unload = function () {
        this.Debugger.Log("DemoLogin01.Unload");
        this._shadowBackgroundDiv.find('div[data-command="action"]').off("click");
        this._shadowBackgroundDiv.remove();
        _super.prototype.Unload.call(this);
    };
    return DemoLogin01;
})(Layout003);
