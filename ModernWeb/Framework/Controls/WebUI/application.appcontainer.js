var AppContainer = (function () {
    function AppContainer() {
        this._lastTickMsec = 0;
        this.LastNumberOfDrawCalls = 0;
        this._fpsCounter = new FrameRateCounter();
        this._interpolation = new Interpolation();
    }
    AppContainer.prototype.CheckBrowserCompatibility = function (canvas) {
        this._canvas = canvas[0];
        this._canvasContext = this._canvas.getContext("2d");
        this._experience = new Experience(canvas, this._interpolation, 4000, 3000);
        if(canvas) {
            this.Init();
            this._experience.Start();
        }
    };
    AppContainer.prototype.Init = function () {
        var _self = this;
        this._tickIntervalPointer = setInterval(function () {
            _self.Tick();
        }, 15);
        this._updateStatsIntervalPointer = setInterval(function () {
            _self.UpdateStats();
        }, 1000);
    };
    AppContainer.prototype.LayoutUpdated = function () {
        this._experience.LayoutUpdated();
    };
    AppContainer.prototype.Tick = function () {
        var curTimeMsec = new Date().getTime();
        var timeSpanMsec = curTimeMsec - this._lastTickMsec;
        this._lastTickMsec = curTimeMsec;
        if(timeSpanMsec < 500) {
            this.Update(timeSpanMsec);
            this.Draw();
        }
    };
    AppContainer.prototype.Update = function (frameTick) {
        this._experience.Update(frameTick);
        this._fpsCounter.Tick();
    };
    AppContainer.prototype.Draw = function () {
        this._drawDebuggInformation();
    };
    AppContainer.prototype._drawDebuggInformation = function () {
        var roundedFPS = Math.round(this._fpsCounter.GetFPS() * 100) / 100;
        var x = 30;
        var y = 30;
        var lineHeight = 18;
        this._canvasContext.clearRect(x, y, 300, 1 * lineHeight);
        this.DrawString("FPS: " + roundedFPS, x, y);
        y += lineHeight;
        this._experience.DrawDebugInformation(lineHeight, y, roundedFPS);
        y += lineHeight;
    };
    AppContainer.prototype.UpdateStats = function () {
        this._fpsCounter.Update();
    };
    AppContainer.prototype.DrawString = function (str, x, y) {
        this._canvasContext.font = "13pt DebugFont";
        this._canvasContext.textBaseline = "top";
        this._canvasContext.textAlign = "left";
        this._canvasContext.fillStyle = "#FFFFFF";
        this._canvasContext.fillText(str, x, y);
    };
    AppContainer.prototype.Unload = function () {
        this._experience.Unload();
        clearInterval(this._tickIntervalPointer);
        clearInterval(this._updateStatsIntervalPointer);
    };
    return AppContainer;
})();
