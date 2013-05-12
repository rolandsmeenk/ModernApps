var FrameRateCounter = (function () {
    function FrameRateCounter() {
        this._frames = 0;
        this._lastFPS = 0;
        this._lastUpdateTime = 0;
    }
    FrameRateCounter.prototype.Tick = function () {
        this._frames++;
    };
    FrameRateCounter.prototype.Update = function () {
        var newTime = new Date().getTime();
        if (this._lastUpdateTime == 0) {
            this._lastUpdateTime = newTime;
            return;
        }
        var span = (newTime - this._lastUpdateTime);
        if (span >= 900) {
            var seconds = span / 1000.0;
            this._lastFPS = this._frames / seconds;
            this._frames = 0;
            this._lastUpdateTime = newTime;
        }
    };
    FrameRateCounter.prototype.GetFPS = function () {
        return this._lastFPS;
    };
    return FrameRateCounter;
})();
