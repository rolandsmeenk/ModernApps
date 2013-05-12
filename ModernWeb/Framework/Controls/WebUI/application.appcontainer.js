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
        if (canvas) {
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
        if (timeSpanMsec < 500) {
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
        var pg = new PageX(this._experience, "page 1", 6, 3, [
            [
                0, 
                1
            ], 
            [
                4, 
                11
            ], 
            2, 
            3, 
            [
                6, 
                12
            ], 
            7, 
            13, 
            [
                8, 
                15
            ], 
            [
                16, 
                17
            ]
        ], [
            new ElasticButton(this._experience, 0, "#FFC300", '#E4AE00', new Storyboard(this._experience, 'quadratic', 'in', 1.5, 20, 'righttoleft', 0, 1), 'requestToLoadApplication(2);', 'http://farm7.static.flickr.com/6011/6016039604_bfd53fcc75_m.jpg', '[slot]', 'normal 32px Segoe UI', 0, 0, "White", null), 
            new ElasticButton(this._experience, 1, "#00B8FF", '#00A3E2', new Storyboard(this._experience, 'quadratic', 'in', 1.2, 20, 'righttoleft', 0, 1), 'requestToLoadApplication(2);', 'http://farm7.static.flickr.com/6011/6016039604_bfd53fcc75_m.jpg', '[slot]', 'normal 32px Segoe UI', 0, 0, "White", null), 
            new ElasticButton(this._experience, 2, "#FF0000", '#D40000', new Storyboard(this._experience, 'quadratic', 'in', 1.3, 20, 'righttoleft', 0, 1), 'requestToLoadApplication(2);', 'http://farm7.static.flickr.com/6011/6016039604_bfd53fcc75_m.jpg', '[slot]', 'normal 32px Segoe UI', 0, 0, "White", null), 
            new ElasticButton(this._experience, 3, "#C000FF", '#AA00E2', new Storyboard(this._experience, 'quadratic', 'in', 1.1, 20, 'righttoleft', 0, 1), 'requestToLoadApplication(2);', 'http://farm7.static.flickr.com/6011/6016039604_bfd53fcc75_m.jpg', '[slot]', 'normal 32px Segoe UI', 0, 0, "White", null), 
            new ElasticButton(this._experience, 4, "#007ABC", '#005E90', new Storyboard(this._experience, 'quadratic', 'in', 1.2, 20, 'righttoleft', 0, 1), 'requestToLoadApplication(2);', 'http://farm7.static.flickr.com/6011/6016039604_bfd53fcc75_m.jpg', '[slot]', 'normal 32px Segoe UI', 0, 0, "White", null), 
            new ElasticButton(this._experience, 5, "#CAFF00", '#B5E404', new Storyboard(this._experience, 'quadratic', 'in', 1.2, 20, 'righttoleft', 0, 1), 'requestToLoadApplication(2);', 'http://farm7.static.flickr.com/6011/6016039604_bfd53fcc75_m.jpg', '[slot]', 'normal 32px Segoe UI', 0, 0, "White", null), 
            new ElasticButton(this._experience, 6, "#00FFC2", '#00DCA7', new Storyboard(this._experience, 'quadratic', 'in', 1.3, 20, 'righttoleft', 0, 1), 'requestToLoadApplication(2);', 'http://farm7.static.flickr.com/6011/6016039604_bfd53fcc75_m.jpg', '[slot]', 'normal 32px Segoe UI', 0, 0, "White", null), 
            new ElasticButton(this._experience, 7, "#D684FC", '#B16DD0', new Storyboard(this._experience, 'quadratic', 'in', 1.4, 20, 'righttoleft', 0, 1), 'requestToLoadApplication(2);', 'http://farm7.static.flickr.com/6011/6016039604_bfd53fcc75_m.jpg', '[slot]', 'normal 32px Segoe UI', 0, 0, "White", null), 
            new ElasticButton(this._experience, 8, "#FFCD00", '#E0B400', new Storyboard(this._experience, 'quadratic', 'in', 1.4, 20, 'righttoleft', 0, 1), 'requestToLoadApplication(2);', 'http://farm7.static.flickr.com/6011/6016039604_bfd53fcc75_m.jpg', '[slot]', 'normal 32px Segoe UI', 0, 0, "White", null)
        ]);
        this._experience.Attach(pg);
    };
    return AppContainer;
})();
