/// <reference path="experience.ts"/>

//declare var $;

class PageBase
{
    //Dbg.Print("PageBase::PageBase(); Ctr Starting..");
    //console.dir(this);

    // we can override by storing inherited methods in this base obj
    // this is only for 1 level of inheritance :/
    //this.base = this; // recursive so be careful

    public StartTime : number = 0;
    public EndTime: number = 0;

    public zIndex:number = 0;

    public mSlice: any = [];

    //All these values are set by the page that implements this base
    public X: number = 0;
    public Y: number = 0;
    public Width: number = 0; // 846;  //<== SET by the control
    public Height: number = 0; // 600;  //<== SET by the control
    public OverlapX: number = 0;

    public Interpolator: number = 0;
    public LocalTime: number = 0; // for glow pulses and other continuous animations (msec)
    public DisplayDebug: bool = false;
    public Broken: bool = false;

    public BeginPosition: number;
    public EndPosition: number;

    public mLoadingProgressSmooth: number = 0;

    

    constructor(public Experience: Experience) {
    
    }


    // the mouse position is relative to the page (regardless of scrolling!)
    public HandleContactDown(mousePoint)
    {	// if derived class implements this method, call it!
        //if (this.OnContactDown)
        //{
        //    this.OnContactDown(mousePoint);
        //}
    }

    public Preload(src)
    {
        //var instance = Preloader.Open(src);
        //this.mSlice.push(instance);
        //return instance;
    }

    
    public Initialize()
    {
        
        //Dbg.Print("PageBase::Initialize(); label = " + this.Label);

    }

    
    public Update(frameLengthMsec)
    {
        this.Interpolator = this.GetPanelInterpolationRight(0, this.Width);
        this.LocalTime += frameLengthMsec;

        // draw loading indicator
        if (!this.IsLoaded() || this.mLoadingProgressSmooth < 1)
        {
            var progress = this.LoadedProgress();
            var normalizedProgress = progress / 100;

            if (!this.HasLoadableContent())
            {
                this.mLoadingProgressSmooth = 1;
            } else
            {
                this.mLoadingProgressSmooth += (normalizedProgress - this.mLoadingProgressSmooth) * 0.02;
                this.mLoadingProgressSmooth += 0.03;
                if (this.mLoadingProgressSmooth > 0.99)
                    this.mLoadingProgressSmooth = 1;

                if (this.mLoadingProgressSmooth > normalizedProgress && this.mLoadingProgressSmooth == 1)
                    this.mLoadingProgressSmooth = 0;
            }
        }
    }

    
    public Draw(surface)
    {
        
        surface.save();
        try
        {	// we can restore the drawing context here
            // so if the derived class messes up, this shouldn't destroy the entire experience
            this.DrawImpl(surface);
        }
        catch (err)
        {
            //Dbg.Print("Page " + this.Label + " unhandled inner-draw error: " + err);
            this.Broken = true;
        }
        surface.restore();
    }

    public DrawImpl(surface) {

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

            var labelPosition = 60; //y


            surface.fillStyle = "#fff";

            //surface.fillText(this.Label, this.Width / 2, labelPosition - 2);
        }

        if (this.mLoadingProgressSmooth == 1) {
            //this.Derived_Draw(surface);
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

            //Dbg.Surface.font = "11pt EncomRegular";
            //Dbg.Surface.textBaseline = "middle";
            //Dbg.Surface.textAlign = "center";
            //Dbg.Surface.fillStyle = "#000";
            //Dbg.Surface.fillText(str, x, y);
            //Dbg.Surface.fillStyle = "#fff";
            //Dbg.Surface.fillText(str, x, y);

            // draw loading indicator
            var size = 128;
            var frameNumber = Math.round(30 * this.mLoadingProgressSmooth);
            var frameOffsetY = frameNumber * 128;

            //surface.drawImage(Preloader.SpinnerLayer1, 0, frameOffsetY, 128, 128, x - 64, y - 64, 128, 128);
        }
    }



    // [0-1] taking the full size of the panel into account
    // panel start/width are in pixels relative to page
    // 0 = panel's left edge on right-side of screen
    // 1 = panel's left edge hit snap-point
    public GetPanelInterpolation(panelStart, panelWidth)
    {
        var renderPosition = this.X - this.Experience.TimelineX;

        var localTime = this.EndPosition - renderPosition;
        var duration = this.BeginPosition - this.EndPosition;
        var interpolator = 1 + localTime / duration;

        return interpolator;
    }


    // 0 = panel's right edge on right-side of screen
    // 1 = panel's left edge hit snap-point
    public GetPanelInterpolationRight(panelStart, panelWidth)
    {
        var localTime = this.Experience.TimelineX + this.Experience.Width - this.X - panelStart;
        var duration = this.Experience.Width - this.Width;
        var interpolator = localTime / this.Experience.Width;

        // window width - panel left edge = visible panel amount
        // [-1,0] = panel appearing on right side
        // [0,1] = panel completely visible, scrolling across screen
        // [1,2] = panel disappearing on left side
        if (interpolator < 0)
        {
            interpolator = (this.Experience.Width + this.Experience.TimelineX) / this.Width;
            interpolator = -(1 - interpolator);
            interpolator = 0;
        }

        //Dbg.Print("Experience.Instance.Timeline = " + Experience.Instance.Timeline);

        return interpolator;
    }

    public IsVisible(x, y, w, h)
    {
        // if within bounds or close-enough to be within bounds
        if ((this.X + this.Width) < x || this.X > (x + w))
            return false;

        return true;
    }

    public DrawDebug()
    {
    }

    public IsLoaded()
    {
        for (var i = 0; i < this.mSlice.length; i++)
            if (!this.mSlice[i].ReadyForRendering)
                return false;

        return true;
    }

    public HasLoadableContent()
    {
        return this.mSlice.length > 0;
    }

    public LoadedProgress()
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
