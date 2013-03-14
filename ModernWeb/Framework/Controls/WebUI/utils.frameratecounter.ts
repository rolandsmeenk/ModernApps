


declare var $;

class FrameRateCounter
{
    private _frames = 0;
    private _lastFPS = 0;
    private _lastUpdateTime = 0;


    constructor() {
        
    }


    public Tick()
    {
        this._frames++;
    }

    // must be called every second
    // can adjust for inaccuracies in calling intervals
    public Update()
    {
        var newTime = new Date().getTime(); // milliseconds

        if (this._lastUpdateTime == 0)
        {
            this._lastUpdateTime = newTime;
            return;
        }

        var span = (newTime - this._lastUpdateTime); // msec span

        if (span >= 900)
        {	// enough time passed to calculate fps
            var seconds = span / 1000.0;
            this._lastFPS = this._frames / seconds;
            this._frames = 0;
            this._lastUpdateTime = newTime;
        }
    }

    public GetFPS()
    {
        return this._lastFPS;
    }
}


