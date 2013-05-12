var PageBase = (function () {
    function PageBase(Experience) {
        this.Experience = Experience;
        this.StartTime = 0;
        this.EndTime = 0;
        this.zIndex = 0;
        this.mSlice = [];
        this.X = 0;
        this.Y = 0;
        this.Width = 0;
        this.Height = 0;
        this.OverlapX = 0;
        this.Interpolator = 0;
        this.LocalTime = 0;
        this.DisplayDebug = false;
        this.Broken = false;
        this.mLoadingProgressSmooth = 0;
    }
    PageBase.prototype.HandleContactDown = function (mousePoint) {
    };
    PageBase.prototype.Preload = function (src) {
    };
    PageBase.prototype.Initialize = function () {
    };
    PageBase.prototype.Update = function (frameLengthMsec) {
        this.Interpolator = this.GetPanelInterpolationRight(0, this.Width);
        this.LocalTime += frameLengthMsec;
        if (!this.IsLoaded() || this.mLoadingProgressSmooth < 1) {
            var progress = this.LoadedProgress();
            var normalizedProgress = progress / 100;
            if (!this.HasLoadableContent()) {
                this.mLoadingProgressSmooth = 1;
            } else {
                this.mLoadingProgressSmooth += (normalizedProgress - this.mLoadingProgressSmooth) * 0.02;
                this.mLoadingProgressSmooth += 0.03;
                if (this.mLoadingProgressSmooth > 0.99) {
                    this.mLoadingProgressSmooth = 1;
                }
                if (this.mLoadingProgressSmooth > normalizedProgress && this.mLoadingProgressSmooth == 1) {
                    this.mLoadingProgressSmooth = 0;
                }
            }
        }
    };
    PageBase.prototype.Draw = function (surface) {
        surface.save();
        try  {
            this.DrawImpl(surface);
        } catch (err) {
            this.Broken = true;
        }
        surface.restore();
    };
    PageBase.prototype.DrawImpl = function (surface) {
        surface.translate(this.X, this.Y);
        if (this.DisplayDebug) {
            surface.beginPath();
            surface.moveTo(0, 0);
            surface.lineTo(0, 570 - 1);
            surface.moveTo(0, 570 - 1);
            surface.lineTo(this.Width - 1, 570 - 1);
            surface.moveTo(this.Width - 1, 570 - 1);
            surface.lineTo(this.Width - 1, 0);
            surface.moveTo(this.Width - 1, 0);
            surface.lineTo(0, 0);
            surface.strokeStyle = "rgba(200,200,200,0)";
            surface.stroke();
            surface.font = "18px BadaBoomBBRegular";
            surface.textBaseline = "bottom";
            surface.textAlign = "center";
            var labelPosition = 60;
            surface.fillStyle = "#fff";
        }
        if (this.mLoadingProgressSmooth == 1) {
        } else {
            var loadingStr = "";
            var random = Math.random() * 16;
            for(var i = 0; i < random; i++) {
                loadingStr += ".";
            }
            var x = this.Width / 3;
            var y = 350;
            var progress = this.LoadedProgress();
            var str = Math.round(progress);
            var size = 128;
            var frameNumber = Math.round(30 * this.mLoadingProgressSmooth);
            var frameOffsetY = frameNumber * 128;
        }
    };
    PageBase.prototype.GetPanelInterpolation = function (panelStart, panelWidth) {
        var renderPosition = this.X - this.Experience.TimelineX;
        var localTime = this.EndPosition - renderPosition;
        var duration = this.BeginPosition - this.EndPosition;
        var interpolator = 1 + localTime / duration;
        return interpolator;
    };
    PageBase.prototype.GetPanelInterpolationRight = function (panelStart, panelWidth) {
        var localTime = this.Experience.TimelineX + this.Experience.Width - this.X - panelStart;
        var duration = this.Experience.Width - this.Width;
        var interpolator = localTime / this.Experience.Width;
        if (interpolator < 0) {
            interpolator = (this.Experience.Width + this.Experience.TimelineX) / this.Width;
            interpolator = -(1 - interpolator);
            interpolator = 0;
        }
        return interpolator;
    };
    PageBase.prototype.IsVisible = function (x, y, w, h) {
        if ((this.X + this.Width) < x || this.X > (x + w)) {
            return false;
        }
        return true;
    };
    PageBase.prototype.DrawDebug = function () {
    };
    PageBase.prototype.IsLoaded = function () {
        for(var i = 0; i < this.mSlice.length; i++) {
            if (!this.mSlice[i].ReadyForRendering) {
                return false;
            }
        }
        return true;
    };
    PageBase.prototype.HasLoadableContent = function () {
        return this.mSlice.length > 0;
    };
    PageBase.prototype.LoadedProgress = function () {
        if (!this.HasLoadableContent()) {
            return 1;
        }
        var numLoaded = 0;
        for(var i = 0; i < this.mSlice.length; i++) {
            if (this.mSlice[i].ReadyForRendering) {
                numLoaded++;
            }
        }
        return 100.0 * numLoaded / this.mSlice.length;
    };
    return PageBase;
})();
