/// <reference path="utils.frameratecounter.ts"/>
/// <reference path="experience.ts"/>
/// <reference path="utils.interpolation.ts"/>
/// <reference path="views.pagex.ts"/>
/// <reference path="animation.storyboard.ts"/>

/// <reference path="controls.rectangleanimatedwithtext.ts"/>

declare var $;

class AppContainer
{
    private _fpsCounter: FrameRateCounter;

    private _lastTickMsec = 0;
    private LastNumberOfDrawCalls = 0; // latched counter
    private StatsBlock;

    private _canvas: any;
    private _canvasContext: any;

    private _experience: Experience;
    private _interpolation: Interpolation;

    private _tickIntervalPointer: any;
    private _updateStatsIntervalPointer: any;

    constructor(){
        this._fpsCounter = new FrameRateCounter(); 
        this._interpolation = new Interpolation();
    }

    public CheckBrowserCompatibility(canvas: any)
    {

        this._canvas = canvas[0];
        this._canvasContext = this._canvas.getContext("2d");

        this._experience = new Experience(canvas, this._interpolation, 4000, 3000);

        if (canvas)
        {
            this.Init();
            this.ConfigureApplication();
            this._experience.Start();
        }
    }


    public Init()
    {
        var _self = this;

        this._tickIntervalPointer = setInterval(function () { _self.Tick(); }, 15);
        this._updateStatsIntervalPointer = setInterval(function () { _self.UpdateStats(); }, 1000);

        // not available yet
        //window.msRequestAnimationFrame(this.Tick);

    }



    public LayoutUpdated()
    {
        this._experience.LayoutUpdated();
    }


    public Tick()
    {
        
        var curTimeMsec = new Date().getTime();
        var timeSpanMsec = curTimeMsec - this._lastTickMsec;
        this._lastTickMsec = curTimeMsec;

        
        if (timeSpanMsec < 500)
        {	// skip super long frames
            
            this.Update(timeSpanMsec);
            this.Draw();
            //mPlaneProjection.Spin();
        }

       
    }

    public Update(frameTick)
    {
        this._experience.Update(frameTick);
        this._fpsCounter.Tick();
    }

    public Draw()
    {
        // clear surface & prepare for rendering of all visible pages
        this._canvasContext.clearRect(0, 0, this._experience.Width, this._experience.Height);


        //EXPERIENCE
        this._experience.Draw();


        //DEBUG info
        this._canvasContext.save();
        this._drawDebuggInformation();
        this._canvasContext.restore();


    }


    private _drawDebuggInformation()
    {
        var roundedFPS = Math.round(this._fpsCounter.GetFPS() * 100) / 100;

        var x = 30;
        var y = 30;
        var lineHeight = 18;

        //this._canvasContext.clearRect(x, y, 300, 1 * lineHeight); //clears area each draw
        //this._canvasContext.globalAlpha = 1;

        this.DrawString("FPS: " + roundedFPS, x, y); y += lineHeight;

        this._experience.DrawDebugInformation(lineHeight, y , roundedFPS );  y += lineHeight;

    } 




    public UpdateStats()
    {
        this._fpsCounter.Update();
    }



    private DrawString (str, x, y) {
            
        this._canvasContext.font = "13pt DebugFont";
        this._canvasContext.textBaseline = "top";
        this._canvasContext.textAlign = "left";

        this._canvasContext.fillStyle = "#f00";
        this._canvasContext.fillText(str, x, y);

    }


    public Unload() {

        clearInterval(this._tickIntervalPointer);
        clearInterval(this._updateStatsIntervalPointer);


        this._experience.Unload();
        this._experience = null;
        this._interpolation = null;
        this._fpsCounter = null;

    }



    public ConfigureApplication() {

        this._experience.AllowVerticalNavigation = true;
        this._experience.AllowHorizontalNavigation = true;


        var pg = new PageX(
                this._experience,
                "pg1",
                7,
                5,
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
                [
                    //new Rectangle(this._experience, 9, "#ff0", new Storyboard(this._experience, 'bounce', 'in', 1.5, 20, 'righttoleft', 0, 1))
                    //new RectangleAnimated(this._experience, 9, "#ff0", "#fff", 120, 1.1, "FromTop", true)
                    new RectangleAnimatedWithText(this._experience, 9, "#ffbc01", "#fff", 120, 0.7, "FromTop", "Demo tile 1", "#fff", "font-size:14px;"),
                    new RectangleAnimatedWithText(this._experience, 5, "#9700ff", "#fff", 120, 1.1, "FromBottom", "Demo tile 2", "#fff", "font-size:14px;"),
                    new RectangleAnimatedWithText(this._experience, 16, "#00b1ff", "#fff", 120, 1.4, "FromLeft", "Demo tile 3", "#fff", "font-size:14px;"),
                    new RectangleAnimatedWithText(this._experience, 17, "#ff5e23", "#fff", 120, 0.5, "FromRight", "Demo tile 4", "#fff", "font-size:14px;"),
                    new RectangleAnimatedWithText(this._experience, 11, "#0281d5", "#fff", 120, 0.9, "FromTop", "Demo tile 5", "#fff", "font-size:14px;")

                ]
            );

        this._experience.Attach(pg);



    }

}

