var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TextAnimated = (function (_super) {
    __extends(TextAnimated, _super);
    function TextAnimated(experience, slot, deltapixel, deltatime, deltadirection, title, titlefont, titlefillstyle, padding) {
        _super.call(this, experience);
        this._movementX = 0;
        this._movementY = 0;
        this._movementH = 0;
        this._movementW = 0;
        this._xDirection = -1;
        this._yDirection = -1;
        this._stopAnimation = false;
        this.Slot = slot;
        this.Title = title;
        this.TitleFont = titlefont;
        this.TitleFillStyle = titlefillstyle;
        this.Padding = padding;
        this.DeltaTime = deltatime;
        this.DeltaPixel = deltapixel;
        this.DeltaDirection = deltadirection;
    }
    TextAnimated.prototype.Initialize = function () {
        _super.prototype.Initialize.call(this);
        this.zIndex += 3;
    };
    TextAnimated.prototype.Update = function (tick) {
        _super.prototype.Update.call(this, tick);
    };
    TextAnimated.prototype.Draw = function (surface) {
        _super.prototype.Draw.call(this, surface);
        var newChange = 0;
        if (this.DeltaPixel > 0 && !this._stopAnimation) {
            newChange = this.FrameLengthMsec / 1000;
            newChange = newChange / this.DeltaTime;
            newChange = newChange * this.DeltaPixel;
            this._movementY = this.Y();
            this._movementX = this.X();
            if (this.DeltaDirection == "FromBottom") {
                this._movementW = this.Width();
                if (this._yDirection == -1) {
                    if (this._movementH >= this.DeltaPixel) {
                        this._yDirection = 1;
                    }
                    this._movementH = this._movementH + newChange;
                    this._movementY += (this.Height() - this._movementH);
                } else if (this._yDirection == 1) {
                    this._stopAnimation = true;
                    if (this._movementH <= 0) {
                        this._yDirection = -1;
                    }
                    this._movementH = this._movementH - newChange;
                    this._movementY += (this.Height() - this._movementH);
                }
            } else if (this.DeltaDirection == "FromTop") {
                this._movementW = this.Width();
                if (this._yDirection == -1) {
                    if (this._movementH >= this.DeltaPixel) {
                        this._yDirection = 1;
                    }
                    this._movementH = this._movementH + newChange;
                } else if (this._yDirection == 1) {
                    this._stopAnimation = true;
                    if (this._movementH <= 0) {
                        this._yDirection = -1;
                    }
                    this._movementH = this._movementH - newChange;
                }
            } else if (this.DeltaDirection == "FromLeft") {
                this._movementH = this.Height();
                if (this._xDirection == -1) {
                    if (this._movementW >= this.DeltaPixel) {
                        this._xDirection = 1;
                    }
                    this._movementW += newChange;
                } else if (this._xDirection == 1) {
                    this._stopAnimation = true;
                    if (this._movementW <= 0) {
                        this._xDirection = -1;
                    }
                    this._movementW -= newChange;
                }
            } else if (this.DeltaDirection == "FromRight") {
                this._movementH = this.Height();
                if (this._xDirection == -1) {
                    if (this._movementW >= this.DeltaPixel) {
                        this._xDirection = 1;
                    }
                    this._movementW += newChange;
                    this._movementX += (this.Width() - this._movementW);
                } else if (this._xDirection == 1) {
                    this._stopAnimation = true;
                    if (this._movementW <= 0) {
                        this._xDirection = -1;
                    }
                    this._movementW -= newChange;
                    this._movementX += (this.Width() - this._movementW);
                }
            }
        }
        if (this._stopAnimation) {
            surface.save();
            surface.font = this.TitleFont;
            surface.globalAlpha = 1.0;
            surface.fillStyle = this.TitleFillStyle;
            var metrics = surface.measureText(this.Title);
            if (this.DeltaDirection == "FromBottom") {
                surface.translate(this.X() + (metrics.width / 2) + 10, this.Y() + this.Height() + this.Padding);
                surface.fillText(this.Title, 0, 0, this.Width());
            } else if (this.DeltaDirection == "FromTop") {
                surface.translate(this.X() + (metrics.width / 2) + 10, this.Y() + this.Padding);
                surface.fillText(this.Title, 0, 0, this.Width());
            } else if (this.DeltaDirection == "FromLeft") {
                surface.translate(this.X() + 10, this.Y() + (metrics.width / 2) + 10);
                surface.rotate(90 * (Math.PI / 180));
                surface.fillText(this.Title, 0, 0, this.Width());
            } else if (this.DeltaDirection == "FromRight") {
                surface.translate(this.X() + this.Width() - 10, this.Y() + this.Height() - (metrics.width / 2) - 10);
                surface.rotate(-90 * (Math.PI / 180));
                surface.fillText(this.Title, 0, 0, this.Width());
            }
            surface.restore();
        }
    };
    TextAnimated.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
    };
    return TextAnimated;
})(ControlBase);
