function AppContainer()
{
    var mCanvas;
    var mCanvasContext;
    var mSurfaceWidth = 920;
    var mSurfaceHeight = 710;

    var mPauseApp = false;

    var mConfig = new ApplicationConfiguration();
    var mPlaneProjection = new PlaneProjection(0);

    this.LoadApplication = function (appnumber)
    {
        ChangeApplication(appnumber);
    }

    this.Init = function ()
    {
        StatsBlock = document.getElementById("framerate");
        mCanvas = document.getElementById("Canvas");
        mCanvasContext = mCanvas.getContext("2d");

        mSurfaceWidth = mCanvas.clientWidth;
        mSurfaceHeight = mCanvas.clientHeight;

        mCanvas.width = mSurfaceWidth;
        mCanvas.height = mSurfaceHeight;

        Dbg.Surface = mCanvasContext;
        Dbg.Canvas = mCanvas;

        Dbg.Print("Started canvas with size: " + mSurfaceWidth + "x" + mSurfaceHeight);

        TextDraw.Init();

        mPlaneProjection.Init(mCanvas);

        _InitFirstApplication();

        mAudioTrack1 = document.getElementById("track1");
        mAudioTrack1.muted = false;
        mAudioTrack1.play();

        mAudioToggle = document.getElementById("audioToggle");
        mAudioToggle.onclick = OnAudioToggle;

        setInterval(Tick, 15);
        setInterval(UpdateStats, 1000);

        $(window).resize(AppContainer.Instance.ResizeCanvas);

    }

    function _InitFirstApplication() //called from this.Init();
    {
        mPauseApp = true;
        Experience.Instance.Width = mSurfaceWidth;
        Experience.Instance.Height = mSurfaceHeight;
        mConfig.LoadConfiguration(1);
        //ConfigureApplication1();
        Experience.Instance.Init();  //this actually internally calls Experience.Instance.Start
        mPauseApp = false;
    }

    function ChangeApplication(appnumber) //called from this.LoadApplication()
    {
        mPauseApp = true;
        mConfig.LoadConfiguration(appnumber);
        mPauseApp = false;
    }


    this.ResizeCanvas = function ()
    {
        mSurfaceWidth = mCanvas.clientWidth;
        mSurfaceHeight = mCanvas.clientHeight;

        // setting widt/height causes the canvas to clear
        mCanvas.width = mSurfaceWidth;
        mCanvas.height = mSurfaceHeight;

        Dbg.Print("Resized canvas to size: " + mSurfaceWidth + "x" + mSurfaceHeight);

        Experience.Instance.Width = mSurfaceWidth;
        Experience.Instance.Height = mSurfaceHeight;
    }

    var mAudioTrack1, mAudioTrack2, mAudioToggle;

    function OnAudioToggle()
    {
        mAudioTrack1.muted = !mAudioTrack1.muted;
        Dbg.Print("mAudioTrack1.muted = " + mAudioTrack1.muted);
        mAudioToggle.setAttribute("class", mAudioTrack1.muted ? "AudioOff" : "AudioOn");
    }

    var mLastTickMsec = 0;
    var LastNumberOfDrawCalls = 0; // latched counter
    var StatsBlock;

    function Tick()
    {
        if (mPauseApp) return;

        var curTimeMsec = new Date().getTime();
        var timeSpanMsec = curTimeMsec - mLastTickMsec;
        mLastTickMsec = curTimeMsec;

        if (timeSpanMsec < 500)
        {	// skip super long frames
            Update(timeSpanMsec);
            Draw(mCanvasContext);
            //mPlaneProjection.Spin();
        }

        // not available yet
        //window.msRequestAnimationFrame(Tick);
    }

    function Update(frameTick)
    {
        Experience.Instance.Update(frameTick);
        mFpsCounter.Tick();
    }

    function Draw()
    {
        Experience.Instance.Draw(mCanvasContext, mSurfaceWidth, mSurfaceHeight);
        LastNumberOfDrawCalls = Experience.Instance.DrawCallCount;
    }

    function UpdateStats()
    {
        if (mPauseApp) return;
        mFpsCounter.Update();
    }
}


function CheckBrowserCompatibility(what)
{
    if (what)
    {
        var browserMessage = document.getElementById("browserMessage");
        browserMessage.style.display = "block";
    }
    else
    {
        AppContainer.Instance = new AppContainer();
        AppContainer.Instance.Init();
    }
}