/// <reference path="utils.frameratecounter.ts"/>
/// <reference path="experience.ts"/>

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

    private _tickIntervalPointer: any;
    private _updateStatsIntervalPointer: any;

    constructor(){
        this._fpsCounter = new FrameRateCounter(); 
        
    }

    public CheckBrowserCompatibility(canvas: any)
    {

        this._canvas = canvas[0];
        this._canvasContext = this._canvas.getContext("2d");

        this._experience = new Experience(canvas, 4000, 3000);

        if (canvas)
        {
            this.Init();
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
        this._drawDebuggInformation();


    }


    private _drawDebuggInformation()
    {
        var roundedFPS = Math.round(this._fpsCounter.GetFPS() * 100) / 100;

        var x = 30;
        var y = 30;
        var lineHeight = 18;

        this._canvasContext.clearRect(x, y, 300, 1 * lineHeight); //clears area each draw
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

        this._canvasContext.fillStyle = "#FFFFFF";
        this._canvasContext.fillText(str, x, y);

    }


    public Unload() {
        this._experience.Unload();
        clearInterval(this._tickIntervalPointer);
        clearInterval(this._updateStatsIntervalPointer);
    }

}

