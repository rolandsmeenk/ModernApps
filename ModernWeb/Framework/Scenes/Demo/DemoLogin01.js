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
        var _html = '<div id="divLogin01">' + '     <div class="authMail" data-command="action" data-action="DemoModernIFrame" />' + '     <div class="authSearch" data-command="action" data-action="DemoOutlook01" />' + '     <div class="authLogin" data-command="action" data-action="DemoWysihtml5" />' + '</div>';
        this._shadowBackgroundDiv = this.UIRenderer.LoadHTMLElement("divLogin01", null, _html);
        this._shadowBackgroundDiv.find('div[data-command="action"]').on("click", function () {
            _bootup.SceneManager.NavigateToAct($(this).data("action"));
        });
        var _self = this;
        this.AreaA.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaA.LayoutChangedCallback");
            _self._shadowBackgroundDiv.css("left", rect.x1).css("top", rect.y1).width(rect.w).height(rect.h);
        };
    }
    DemoLogin01.prototype.Show = function () {
        _super.prototype.Show.call(this, [
            {
                "id": "app1",
                "text": "",
                "data": "scene|WindowsHome01",
                "style": 'background-color:#0281d5;background-image:url("/Content/Icons/MetroIcons/96x96/Folders & OS/Windows 8.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }, 
            {
                "id": "app3",
                "text": "",
                "data": "scene|XBoxHome01",
                "style": 'background-color:#228500;background-image:url("/Content/Icons/MetroIcons/96x96/Devices & Drives/XBox 360.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }, 
            {
                "id": "app2",
                "text": "",
                "data": "scene|WindowsPhoneHome01",
                "style": 'background-color:#0281d5;background-image:url("/Content/Icons/MetroIcons/96x96/Folders & OS/Windows.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }, 
            {
                "id": "app4",
                "text": "",
                "data": "scene|OfficeHome01",
                "style": 'background-color:#ff5e23;background-image:url("/Content/Icons/MetroIcons/96x96/Office Apps/MS Office.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }
        ], [], {});
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
