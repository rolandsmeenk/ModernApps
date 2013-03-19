var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ToggleOnOff = (function (_super) {
    __extends(ToggleOnOff, _super);
    function ToggleOnOff(experience, slot, oncolor, offcolor) {
        _super.call(this, experience);
        this._laststate = false;
        this.Slot = slot;
        this.ColorOn = oncolor;
        this.ColorOff = offcolor;
    }
    ToggleOnOff.prototype.Initialize = function () {
        _super.prototype.Initialize.call(this);
        this.zIndex += 3;
    };
    ToggleOnOff.prototype.Update = function (tick) {
        _super.prototype.Update.call(this, tick);
    };
    ToggleOnOff.prototype.Draw = function (surface) {
        _super.prototype.Draw.call(this, surface);
        if(this._laststate != this.ClickedOn()) {
            if(this.ClickedOn) {
                surface.fillStyle = this.ColorOn;
            } else {
                surface.fillStyle = this.ColorOff;
            }
            this._laststate = this.ClickedOn();
        }
        surface.fillRect(this.X(), this.Y(), this.Width(), this.Height());
    };
    ToggleOnOff.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
    };
    return ToggleOnOff;
})(ControlBase);
