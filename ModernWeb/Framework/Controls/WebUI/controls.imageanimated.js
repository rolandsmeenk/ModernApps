var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ImageAnimated = (function (_super) {
    __extends(ImageAnimated, _super);
    function ImageAnimated(experience, slot, bkgcolor, url, cropx, cropy, cropw, croph, deltax, deltay, deltaw, deltah, deltatime, maxdeltax, maxdeltay, maxdeltaw, maxdeltah) {
        _super.call(this, experience);
        this._stateOfLoading = 0;
        this._movementX = 0;
        this._movementY = 0;
        this._movementW = 0;
        this._movementH = 0;
        this._xDirection = -1;
        this._yDirection = -1;
        this._wDirection = -1;
        this._hDirection = -1;
        this._loadedImage = new Image();
        this.Slot = slot;
        this.Color = bkgcolor;
        this.ImageUrl = url;
        this.CropX = cropx;
        this.CropY = cropy;
        this.CropW = cropw;
        this.CropH = croph;
        this.DeltaX = deltax;
        this.DeltaY = deltay;
        this.DeltaW = deltaw;
        this.DeltaH = deltah;
        this.DeltaTime = deltatime;
        this.MaxDeltaX = maxdeltax;
        this.MaxDeltaY = maxdeltay;
        this.MaxDeltaW = maxdeltaw;
        this.MaxDeltaH = maxdeltah;
    }
    ImageAnimated.prototype.Initialize = function () {
        _super.prototype.Initialize.call(this);
        this.zIndex += 3;
    };
    ImageAnimated.prototype.Update = function (tick) {
        _super.prototype.Update.call(this, tick);
    };
    ImageAnimated.prototype.Draw = function (surface) {
        _super.prototype.Draw.call(this, surface);
        surface.fillStyle = this.Color;
        surface.fillRect(this.X(), this.Y(), this.Width(), this.Height());
        if(this._stateOfLoading == 0 && (this.ImageUrl != undefined || this.ImageUrl != "")) {
            this._loadedImage.ib = this;
            this._loadedImage.src = this.ImageUrl;
            this._stateOfLoading = 1;
            this._loadedImage.onload = function () {
                this._stateOfLoading = 2;
            };
        } else {
            if(this._stateOfLoading == 2) {
                var newX = 0;
                if(this.DeltaX > 0) {
                    newX = this.FrameLengthMsec / 1000;
                    newX = newX / this.DeltaTime;
                    newX = newX * this.DeltaX;
                    if(this._xDirection == -1) {
                        if(this._movementX > this.MaxDeltaX) {
                            this._xDirection = 1;
                        }
                        this._movementX += newX;
                    } else if(this._xDirection == 1) {
                        if(this._movementX < 0) {
                            this._xDirection = -1;
                        }
                        this._movementX -= newX;
                    }
                }
                var newY = 0;
                if(this.DeltaY > 0) {
                    newY = this.FrameLengthMsec / 1000;
                    newY = newY / this.DeltaTime;
                    newY = newY * this.DeltaY;
                    if(this._yDirection == -1) {
                        if(this._movementY > this.MaxDeltaY) {
                            this._yDirection = 1;
                        }
                        this._movementY += newY;
                    } else if(this._yDirection == 1) {
                        if(this._movementY < 0) {
                            this._yDirection = -1;
                        }
                        this._movementY -= newY;
                    }
                }
                var newW = 0;
                if(this.DeltaW > 0) {
                    newW = this.FrameLengthMsec / 1000;
                    newW = newW / this.DeltaTime;
                    newW = newW * this.DeltaW;
                    if(this._wDirection == -1) {
                        if(this._movementW > this.MaxDeltaW) {
                            this._wDirection = 1;
                        }
                        this._movementW += newW;
                    } else if(this._wDirection == 1) {
                        if(this._movementW < 0) {
                            this._wDirection = -1;
                        }
                        this._movementW -= newW;
                    }
                }
                var newH = 0;
                if(this.DeltaH > 0) {
                    newH = this.FrameLengthMsec / 1000;
                    newH = newH / this.DeltaTime;
                    newH = newH * this.DeltaH;
                    if(this._hDirection == -1) {
                        if(this._movementH > this.MaxDeltaH) {
                            this._hDirection = 1;
                        }
                        this._movementH += newH;
                    } else if(this._hDirection == 1) {
                        if(this._movementH < 0) {
                            this._hDirection = -1;
                        }
                        this._movementH -= newH;
                    }
                }
                surface.drawImage(this._loadedImage, this.CropX + this._movementX, this.CropY + this._movementY, this.CropW + this._movementW, this.CropH + this._movementH, this.X(), this.Y(), this.Width(), this.Height());
            }
        }
    };
    ImageAnimated.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
    };
    return ImageAnimated;
})(ControlBase);
