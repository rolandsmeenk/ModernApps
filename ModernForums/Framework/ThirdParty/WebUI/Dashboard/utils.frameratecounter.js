function FramerateCounter()
{
    this.mFrames = 0;
    this.mLastFPS = 0;
    this.mLastUpdateTime = 0;

    this.Tick = function ()
    {
        this.mFrames++;
    }

    // must be called every second
    // can adjust for inaccuracies in calling intervals
    this.Update = function ()
    {
        var newTime = new Date().getTime(); // milliseconds

        if (this.mLastUpdateTime == 0)
        {
            this.mLastUpdateTime = newTime;
            return;
        }

        var span = (newTime - this.mLastUpdateTime); // msec span

        if (span >= 900)
        {	// enough time passed to calculate fps
            var seconds = span / 1000.0;
            this.mLastFPS = this.mFrames / seconds;
            this.mFrames = 0;
            this.mLastUpdateTime = newTime;
        }
    }

    this.GetFPS = function ()
    {
        return this.mLastFPS;
    }
}

var mFpsCounter = new FramerateCounter();

