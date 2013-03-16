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
            this.ConfigureApplication();
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
        this._canvasContext.clearRect(0, 0, this._experience.Width, this._experience.Height);
        this._experience.Draw();
        this._canvasContext.save();
        this._drawDebuggInformation();
        this._canvasContext.restore();
    };
    AppContainer.prototype._drawDebuggInformation = function () {
        var roundedFPS = Math.round(this._fpsCounter.GetFPS() * 100) / 100;
        var x = 30;
        var y = 30;
        var lineHeight = 18;
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
        this._canvasContext.fillStyle = "#f00";
        this._canvasContext.fillText(str, x, y);
    };
    AppContainer.prototype.Unload = function () {
        clearInterval(this._tickIntervalPointer);
        clearInterval(this._updateStatsIntervalPointer);
        this._experience.Unload();
        this._experience = null;
        this._interpolation = null;
        this._fpsCounter = null;
    };
    AppContainer.prototype.ConfigureApplication = function () {
        this._experience.AllowVerticalNavigation = true;
        this._experience.AllowHorizontalNavigation = true;
        var pg = new PageX(this._experience, "pg1", 7, 5, [
            0, 
            1, 
            2, 
            3, 
            4, 
            5, 
            6, 
            7, 
            8, 
            9, 
            10, 
            11, 
            12, 
            13, 
            14, 
            15, 
            16, 
            17, 
            18, 
            19, 
            20, 
            21, 
            22, 
            23, 
            24, 
            25, 
            26, 
            27, 
            28, 
            29, 
            30, 
            31, 
            32, 
            33, 
            34
        ], [
            new Rectangle(this._experience, 9, "#ff0", new Storyboard(this._experience, 'quadratic', 'in', 1.5, 20, 'righttoleft', 0, 1))
        ]);
        this._experience.Attach(pg);
    };
    return AppContainer;
})();
