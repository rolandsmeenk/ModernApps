var ControlBase = (function () {
    function ControlBase(experience) {
        this.ParentPageX = 0;
        this.ParentPageY = 0;
        this.GlobalPaddingTop = 5;
        this._isInitialized = false;
        this._isBroken = false;
        this._visibilityChanged = false;
        this._isVisible = false;
        this._lastIsVisible = false;
        this._experience = experience;
    }
    ControlBase.prototype.Initialize = function () {
        if(!this._isInitialized) {
            if(this.StoryboardOnLoad != null || this.StoryboardOnLoad != undefined) {
                this.StoryboardOnLoad.Init(this);
            }
            this._isInitialized = true;
        }
    };
    ControlBase.prototype.Update = function (frameLengthMsec) {
        this.FrameLengthMsec = frameLengthMsec;
    };
    ControlBase.prototype.Unload = function () {
    };
    ControlBase.prototype.Draw = function (surface) {
        surface.save();
        try  {
            this.DrawImpl(surface);
        } catch (err) {
            this._isBroken = true;
        }
        surface.restore();
        if(this._visibilityChanged) {
            if(this.StoryboardOnLoad != null) {
                if(this._isVisible) {
                    this.StoryboardOnLoad.Reset();
                    this.StoryboardOnLoad.IsPaused = false;
                } else {
                    this.StoryboardOnLoad.IsPaused = true;
                    this.StoryboardOnLoad.Reset();
                }
            }
            this._visibilityChanged = false;
        }
    };
    ControlBase.prototype.DrawImpl = function (surface) {
    };
    ControlBase.prototype.IsVisible = function (x, y, w, h) {
        if((parseFloat(this.SlotCell.vpx1) + parseFloat(this.SlotCell.width)) < 0 || (parseFloat(this.SlotCell.vpx1) > this._experience.Width)) {
            this._isVisible = false;
        } else {
            this._isVisible = true;
        }
        if(!this._isVisible) {
            this.Unload();
            this._lastIsVisible = false;
        }
        if(this._lastIsVisible != this._isVisible) {
            this._visibilityChanged = true;
        }
        this._lastIsVisible = this._isVisible;
        return this._isVisible;
    };
    ControlBase.prototype.HitTest = function (x, y) {
        if(x >= ((this.X() + this.ParentPageX) - this._experience.ViewportX) && x <= ((this.X() + this.ParentPageX) - this._experience.ViewportX + this.Width()) && y >= ((this.Y() + this.ParentPageY) - this._experience.ViewportY) && y <= ((this.Y() + this.ParentPageY) - this._experience.ViewportY + this.Height())) {
            return true;
        }
        return false;
    };
    ControlBase.prototype.MouseOver = function () {
    };
    ControlBase.prototype.MouseOut = function () {
    };
    ControlBase.prototype.Now = function () {
        if(Date.now) {
            return Date.now();
        } else {
            return (new Date().getTime());
        }
    };
    ControlBase.prototype.X = function () {
        var x = this.SlotCell.vpx1o - this.ParentPageX;
        if(this.StoryboardOnLoad != null) {
            if(this.StoryboardOnLoad.AnimDirection == 'lefttoright') {
                x += this.StoryboardOnLoad.X - this.StoryboardOnLoad.AnimAreaX;
            } else if(this.StoryboardOnLoad.AnimDirection == 'righttoleft') {
                x += this.StoryboardOnLoad.X;
            } else {
                x += this.StoryboardOnLoad.X;
            }
        }
        return x;
    };
    ControlBase.prototype.Y = function () {
        var y = this.SlotCell.vpy1o - this.ParentPageY;
        if(this.StoryboardOnLoad != null) {
            if(this.StoryboardOnLoad.AnimDirection == 'bottomtotop') {
                y += this.StoryboardOnLoad.Y;
            } else if(this.StoryboardOnLoad.AnimDirection == 'toptobottom') {
                y += this.StoryboardOnLoad.Y - this.StoryboardOnLoad.AnimAreaX;
            } else {
                y += this.StoryboardOnLoad.Y;
            }
        }
        return y + this.GlobalPaddingTop;
    };
    ControlBase.prototype.Width = function () {
        return this.SlotCell.width;
    };
    ControlBase.prototype.Height = function () {
        return this.SlotCell.height;
    };
    ControlBase.prototype.ClickedOn = function () {
        return this.SlotCell.clicked == 0 ? false : true;
    };
    ControlBase.prototype.Opacity = function () {
        return this.StoryboardOnLoad != null ? this.StoryboardOnLoad.Opacity : 1;
    };
    return ControlBase;
})();
