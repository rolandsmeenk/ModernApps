var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Rectangle = (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(experience, slot, bkgcolor, sbonload) {
        _super.call(this, experience);
        this.Slot = slot;
        this.Color = bkgcolor;
        this.StoryboardOnLoad = sbonload;
    }
    Rectangle.prototype.Initialize = function () {
        _super.prototype.Initialize.call(this);
        this.zIndex += 3;
    };
    Rectangle.prototype.Update = function (tick) {
        _super.prototype.Update.call(this, tick);
    };
    Rectangle.prototype.Draw = function (surface) {
        if(this.IsVisible) {
            _super.prototype.Draw.call(this, surface);
            surface.globalAlpha = this.Opacity();
            surface.fillStyle = this.Color;
            surface.fillRect(this.X(), this.Y(), this.Width(), this.Height());
        }
    };
    Rectangle.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
    };
    return Rectangle;
})(ControlBase);
