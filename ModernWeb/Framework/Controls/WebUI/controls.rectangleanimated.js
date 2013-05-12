var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var RectangleAnimated = (function (_super) {
    __extends(RectangleAnimated, _super);
    function RectangleAnimated(experience, slot, bkgcolor, bkgalpha, deltapixel, deltatime, deltadirection, stopatmax) {
        _super.call(this, experience);
        this._movementX = 0;
        this._movementY = 0;
        this._movementH = 0;
        this._movementW = 0;
        this._xDirection = -1;
        this._yDirection = -1;
        this._stopAnimation = false;
        this.StopAtMax = true;
        this.Slot = slot;
        this.Color = bkgcolor;
        this.Alpha = bkgalpha;
        this.DeltaPixel = deltapixel;
        this.DeltaTime = deltatime;
        this.DeltaDirection = deltadirection;
        this.StopAtMax = stopatmax;
    }
    RectangleAnimated.prototype.Initialize = function () {
        this.Initialize();
        this.zIndex += 3;
    };
    RectangleAnimated.prototype.Update = function (tick) {
        _super.prototype.Update.call(this, tick);
    };
    RectangleAnimated.prototype.Draw = function (surface) {
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
                    if (this.StopAtMax) {
                        this._stopAnimation = true;
                    }
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
                    if (this.StopAtMax) {
                        this._stopAnimation = true;
                    }
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
                    if (this.StopAtMax) {
                        this._stopAnimation = true;
                    }
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
                    if (this.StopAtMax) {
                        this._stopAnimation = true;
                    }
                    if (this._movementW <= 0) {
                        this._xDirection = -1;
                    }
                    this._movementW -= newChange;
                    this._movementX += (this.Width() - this._movementW);
                }
            }
        }
        surface.fillStyle = this.Color;
        surface.globalAlpha = this.Alpha;
        surface.fillRect(this._movementX, this._movementY, this._movementW, this._movementH);
    };
    RectangleAnimated.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
    };
    return RectangleAnimated;
})(ControlBase);
