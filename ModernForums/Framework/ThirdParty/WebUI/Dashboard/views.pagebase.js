/*
* this is pretty much backwards from standard inheritance
* but it helps us wrap draw calls and cut down on repeated code
*/

function PageBase()
{
    //Dbg.Print("PageBase::PageBase(); Ctr Starting..");
    //console.dir(this);

    // we can override by storing inherited methods in this base obj
    // this is only for 1 level of inheritance :/
    //this.base = this; // recursive so be careful

    this.StartTime = 0;
    this.EndTime = 0;

    this.zIndex = 0;

    this.mSlice = [];

    //All these values are set by the page that implements this base
    this.X = 0;
    this.Y = 0;
    this.Width = 0; // 846;  //<== SET by the control
    this.Height = 0; // 600;  //<== SET by the control
    this.OverlapX = 0;

    this.Interpolator = 0;
    this.LocalTime = 0; // for glow pulses and other continuous animations (msec)
    this.DisplayDebug = false;

    var mLoadingProgressSmooth = 0;

    // the mouse position is relative to the page (regardless of scrolling!)
    this.HandleContactDown = function (mousePoint)
    {	// if derived class implements this method, call it!
        if (this.OnContactDown)
        {
            this.OnContactDown(mousePoint);
        }
    }

    this.Preload = function (src)
    {
        var instance = Preloader.Open(src);
        this.mSlice.push(instance);
        return instance;
    }

    this.Derived_Initialize = this.Initialize;
    this.Initialize = function ()
    {
        
        Dbg.Print("PageBase::Initialize(); label = " + this.Label);

        this.Derived_Initialize();
    }

    this.Derived_Update = this.Update;
    this.Update = function (frameLengthMsec)
    {
        this.Interpolator = this.GetPanelInterpolationRight(0, this.Width);
        this.LocalTime += frameLengthMsec;

        // draw loading indicator
        if (!this.IsLoaded() || mLoadingProgressSmooth < 1)
        {
            var progress = this.LoadedProgress();
            var normalizedProgress = progress / 100;

            if (!this.HasLoadableContent())
            {
                mLoadingProgressSmooth = 1;
            } else
            {
                mLoadingProgressSmooth += (normalizedProgress - mLoadingProgressSmooth) * 0.02;
                mLoadingProgressSmooth += 0.03;
                if (mLoadingProgressSmooth > 0.99)
                    mLoadingProgressSmooth = 1;

                if (mLoadingProgressSmooth > normalizedProgress && mLoadingProgressSmooth == 1)
                    mLoadingProgressSmooth = 0;
            }
        }

        this.Derived_Update(frameLengthMsec);
    }

    this.Derived_Draw = this.Draw;
    this.Draw = function (surface)
    {
        
        surface.save();
        try
        {	// we can restore the drawing context here
            // so if the derived class messes up, this shouldn't destroy the entire experience
            this.DrawImpl(surface);
        }
        catch (err)
        {
            Dbg.Print("Page " + this.Label + " unhandled inner-draw error: " + err);
            this.Broken = true;
        }
        surface.restore();
    }

    this.DrawImpl = function (surface) {

        // xform into local space
        // so the page renderer doesn't need to worry about the timeline
        surface.translate(this.X, this.Y);

        if (this.DisplayDebug) {
            //Experience.Instance.DrawPanelDebug(surface, this); ?

            // draw outline in debug/design mode
            surface.beginPath();
            surface.moveTo(0, 0);
            surface.lineTo(0, 570 - 1);
            surface.moveTo(0, 570 - 1);
            surface.lineTo(this.Width - 1, 570- 1);
            surface.moveTo(this.Width - 1, 570 - 1);
            surface.lineTo(this.Width - 1, 0);
            surface.moveTo(this.Width - 1, 0);
            surface.lineTo(0, 0);
            surface.strokeStyle = "rgba(200,200,200,0)";
            surface.stroke();

            // label the panel section
            surface.font = "18px BadaBoomBBRegular";
            surface.textBaseline = "bottom";
            surface.textAlign = "center";

            //var labelPosition = 560; //y
            var labelPosition = 60; //y

            //surface.fillStyle = "#000";
            //surface.fillText(this.Label, this.Width / 2, labelPosition);
            surface.fillStyle = "#fff";

            surface.fillText(this.Label, this.Width / 2, labelPosition - 2);
        }

        if (mLoadingProgressSmooth == 1) {
            this.Derived_Draw(surface);
        }
        else {
            var loadingStr = "";

            var random = Math.random() * 16;
            for (var i = 0; i < random; i++)
                loadingStr += ".";

            //Dbg.DrawString("Loading " + loadingStr, 350, 500);

            var x = this.Width / 3; //- 128;
            var y = 350;

            // [0-1]
            var progress = this.LoadedProgress();
            var str = Math.round(progress);

            Dbg.Surface.font = "11pt EncomRegular";
            Dbg.Surface.textBaseline = "middle";
            Dbg.Surface.textAlign = "center";
            Dbg.Surface.fillStyle = "#000";
            Dbg.Surface.fillText(str, x, y);
            Dbg.Surface.fillStyle = "#fff";
            Dbg.Surface.fillText(str, x, y);

            // draw loading indicator
            var size = 128;
            var frameNumber = Math.round(30 * mLoadingProgressSmooth);
            var frameOffsetY = frameNumber * 128;

            //surface.drawImage(Preloader.SpinnerLayer1, 0, frameOffsetY, 128, 128, x - 64, y - 64, 128, 128);
        }
    }



    // [0-1] taking the full size of the panel into account
    // panel start/width are in pixels relative to page
    // 0 = panel's left edge on right-side of screen
    // 1 = panel's left edge hit snap-point
    this.GetPanelInterpolation = function (panelStart, panelWidth)
    {
        var renderPosition = this.X - Experience.Instance.Timeline;

        var localTime = this.EndPosition - renderPosition;
        var duration = this.BeginPosition - this.EndPosition;
        var interpolator = 1 + localTime / duration;

        return interpolator;
    }


    // 0 = panel's right edge on right-side of screen
    // 1 = panel's left edge hit snap-point
    this.GetPanelInterpolationRight = function (panelStart, panelWidth)
    {
        var localTime = Experience.Instance.Timeline + Experience.Instance.Width - this.X - panelStart;
        var duration = Experience.Instance.Width - this.Width;
        var interpolator = localTime / Experience.Instance.Width;

        // window width - panel left edge = visible panel amount
        // [-1,0] = panel appearing on right side
        // [0,1] = panel completely visible, scrolling across screen
        // [1,2] = panel disappearing on left side
        if (interpolator < 0)
        {
            interpolator = (Experience.Instance.Width + Experience.Instance.Timeline) / this.Width;
            interpolator = -(1 - interpolator);
            interpolator = 0;
        }

        //Dbg.Print("Experience.Instance.Timeline = " + Experience.Instance.Timeline);

        return interpolator;
    }

    this.IsVisible = function (x, y, w, h)
    {
        // if within bounds or close-enough to be within bounds
        if ((this.X + this.Width) < x || this.X > (x + w))
            return false;

        return true;
    }

    this.DrawDebug = function ()
    {
    }

    this.IsLoaded = function ()
    {
        for (var i = 0; i < this.mSlice.length; i++)
            if (!this.mSlice[i].ReadyForRendering)
                return false;

        return true;
    }

    this.HasLoadableContent = function ()
    {
        return this.mSlice.length > 0;
    }

    this.LoadedProgress = function ()
    {
        if (!this.HasLoadableContent())
            return 1;

        var numLoaded = 0;
        for (var i = 0; i < this.mSlice.length; i++)
            if (this.mSlice[i].ReadyForRendering)
                numLoaded++;

        return 100.0 * numLoaded / this.mSlice.length;
    }
}
