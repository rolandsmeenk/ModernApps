/// <reference path="utils.interpolation.ts"/>
/// <reference path="views.pagex.ts"/>

declare var $;


class Experience
{
    
    private _canvas: any;
    private _canvasContext: any;
    public DrawCallCount = 0; // live counter
    private _LastX: number = 0;
    private _LastY: number = 0;
    private _LastMouseX: number = 0;
    private _LastMouseY: number = 0;
    private _CurrentInertiaX: number = 0;
    private _CurrentInertiaY: number = 0;
    private _CurrentVelocityX: number = 0;
    private _CurrentVelocityY: number = 0;
    private _CurrentDirectionX: number = 0;
    private _CurrentDirectionY: number = 0;
    private _LastMotionUpdateX: number = 0;
    private _LastMotionUpdateY: number = 0;
    private _KeyboardVelocityX: number = 0;
    private _KeyboardVelocityY: number = 0;
    private _viewportTargetX: number = 0;
    private _viewportTargetY: number = 0;
    private _InertiaMaxTimeX: number = 0;
    private _InertiaMaxTimeY: number = 0;
    private _bProcessInertiaX: bool;
    private _bProcessInertiaY: bool;
    public TimelineX: number = 0;
    public TimelineY: number = 0;
    private _ViewportMinX: number = 0;
    private _ViewportMinY: number = 0;
    private _ViewportMaxX: number = 0;
    private _ViewportMaxY: number = 0;
    public ViewportX: number = 0;
    public ViewportY: number = 0;
    private _StartX: number = 0;
    private _StartY: number = 0;
    private _FrameLength: number = 0;

    private _RoundedViewportX: number = 0;
    private _RoundedViewportY: number = 0;

    public AllowVerticalNavigation: bool = true;
    public AllowHorizontalNavigation: bool = true;

    public Width: number = 0;
    public Height: number = 0;


    private _MousePointer: any = { "x": 0, "y": 0 };
    public _MousePointerDown: any = { "x": 0, "y": 0 };
    private _MousePointerReal: any = { "x": 0, "y": 0 };

    public _PanningActive: bool = false;
    private _MouseDragOpacityTarget: number = 1;

    public Pages: any = [];

    public Interpolation: Interpolation;


    constructor(canvas: any, interpolation: Interpolation, maxX: number, maxY: number) {

        this._canvas = canvas;
        this._canvasContext = canvas[0].getContext("2d");
        this.Interpolation = interpolation;

        this.Width = this._canvas[0].clientWidth;
        this.Height = this._canvas[0].clientHeight;

        this._ViewportMaxX = maxX;
        this._ViewportMaxY = maxY;
        //this._ViewportMinX = -1 * maxX;
        //this._ViewportMinY = -1 * maxY;
    }


    public Update(frameLength) {
        
        //Dbg.Print('frameLength : ' + frameLength);
        this._FrameLength = frameLength;
        var frameTick = frameLength / 60;

        //if (mKeyboardVelocityX != 0) {
        //    mViewportX += mKeyboardVelocityX * frameLength;
        //    mViewportX = Math.min(ViewportMax, mViewportX);

        //    mViewportTargetX = mViewportX;
        //    mKeyboardVelocityX *= .94;
        //    if (Math.abs(mKeyboardVelocityX) < 0.001) {
        //        mKeyboardVelocityX = 0;
        //    }
        //}

        //if (mKeyboardVelocityY != 0) {
        //    mViewportY += mKeyboardVelocityY * frameLength;
        //    mViewportY = Math.min(ViewportMaxY, mViewportY);

        //    mViewportTargetY = mViewportY;
        //    mKeyboardVelocityY *= .94;
        //    if (Math.abs(mKeyboardVelocityY) < 0.001) {
        //        mKeyboardVelocityY = 0;
        //    }
        //}


        //if (mAutopilot && !mPanningActive && !mbProcessInertia) {
        //    mViewportTargetX += 2 * frameTick;
        //}

        //if (mAutopilotY && !mPanningActive && !mbProcessInertiaY) {
        //    mViewportTargetY += 2 * frameTick;
        //}

        // pre-cap target viewport
        this._viewportTargetX = Math.min(this._ViewportMaxX, Math.max(this._ViewportMinX, this._viewportTargetX));
        this._viewportTargetY = Math.min(this._ViewportMaxY, Math.max(this._ViewportMinY, this._viewportTargetY));

        if (this._PanningActive) // builds current velocity
        {	// measure total user-input delta
            // we do this here because the MouseMove() can get called many times more often than Update()
            // particularly on systems with oversampled mice (eg: gaming rigs)

            var dX = this._viewportTargetX - this._LastX;
            this._LastX = this._viewportTargetX;

            

            // we track this for inertia's sake
            var velocity = Math.abs(dX);
            this._CurrentVelocityX += (velocity - this._CurrentVelocityX) * .3;
            this._CurrentDirectionX = dX < 0 ? -1 : 1;


            var dY = this._viewportTargetY - this._LastY;
            this._LastY = this._viewportTargetY;

            // we track this for inertia's sake
            var velocityY = Math.abs(dY);
            this._CurrentVelocityY += (velocityY - this._CurrentVelocityY) * .3;
            this._CurrentDirectionY = dY < 0 ? -1 : 1;

        }
        else {
            if (this._bProcessInertiaX) // decreases current velocity
            {	// apply simple inertia

                this._viewportTargetX += this._CurrentVelocityX * this._CurrentDirectionX;
                this._CurrentVelocityX *= .9;

                //Dbg.Print("mViewportTargetX: " + mViewportTargetX);
                //Dbg.Print("mCurrentVelocityX: " + mCurrentVelocityX);

                if (this._viewportTargetX < this._ViewportMinX || this._viewportTargetX > this._ViewportMaxX) {	// precap and cut inertia short because we hit a wall
                    this._CurrentVelocityX = 0;
                    this._bProcessInertiaX = false;
                }

                if (this._CurrentVelocityX < 0.01) {	// end inertia
                    this._bProcessInertiaX = false;
                    this._CurrentVelocityX = 0;
                }

            }

            if (this._bProcessInertiaY) // decreases current velocity
            {	// apply simple inertia

                this._viewportTargetY += this._CurrentVelocityY * this._CurrentDirectionY;
                this._CurrentVelocityY *= .9;

                if (this._viewportTargetY < this._ViewportMinY || this._viewportTargetY > this._ViewportMaxY) {	// precap and cut inertia short because we hit a wall
                    this._CurrentVelocityY = 0;
                    this._bProcessInertiaY = false;
                }

                if (this._CurrentVelocityY < 0.01) {	// end inertia
                    this._bProcessInertiaY = false;
                    this._CurrentVelocityY = 0;
                }

            }
        }
        // at this point the current velocity has been computed and is ready for use
        this._CurrentVelocityX = this._CurrentVelocityX / frameLength;
        this._CurrentVelocityY = this._CurrentVelocityY / frameLength;


        // catch up the viewport to the virtual viewport
        // this allows us to add smoothing really simply and consistently
        var smoothingFactor = 0.12; // [0.05,1] is a sensible range
        var speed = (this._viewportTargetX - this.ViewportX) * smoothingFactor;
        this.ViewportX += speed;

        if (this.AllowVerticalNavigation) {
            var smoothingFactorY = 0.12; // [0.05,1] is a sensible range
            var speedY = (this._viewportTargetY - this.ViewportY) * smoothingFactorY;
            this.ViewportY += speedY;
        } else this.ViewportY = 0;

        if (this.AllowHorizontalNavigation) {
            var smoothingFactorX = 0.12; // [0.05,1] is a sensible range
            var speedX = (this._viewportTargetX - this.ViewportX) * smoothingFactorX;
            this.ViewportX += speedX;
        } else this.ViewportX = 0;




        // this is the only viewport variable used by the draw system, and we round it for better rendering
        //mRoundedViewportX = Math.round(-mViewportX);
        this._RoundedViewportX = -this.ViewportX;

        this._RoundedViewportY = -this.ViewportY;


        // export the viewport translation and use it as a master timeline for all animations
        // we can offset it in any way necessary here
        this.TimelineX = this.ViewportX;
        this.TimelineY = this.ViewportY;

        //// update all of the visible pages
        //for (var i = 0; i < pages.length; i++) {
        //    // degrade in case of unhandled errors by dropping broken pages
        //    if (pages[i].Broken)
        //        continue;

        //    try {
        //    // update page with latest timeline info
        //        pages[i].Update(frameLength);
        //    }
        //    catch (err) {	// if a page commits an error, remove it from circulation
        //        pages[i].Broken = true;
        //        Dbg.Print("Page " + pages[i].Label + " unhandled error in Update(): " + err);
        //    }
        //}

        //// the drag-indicator helper
        //mMouseDragOpacity += (mMouseDragOpacityTarget - mMouseDragOpacity) * .1;


        // mousedown helper
        if (this._CurrentVelocityX != 0) {
            this._MousePointerDown.x = 0;
            this._MousePointerDown.y = 0;
        }

    }

    public Draw () {

        this.DrawCallCount = 0;

        //// clear surface & prepare for rendering of all visible pages
        //this._canvasContext.clearRect(0, 0, this.Width, this.Height);
        this._canvasContext.save();


        this._canvasContext.translate(this._RoundedViewportX, this._RoundedViewportY); //20);

        for (var i = 0; i < this.Pages.length; i++) {
            var panel = this.Pages[i];

            // degrade in case of unhandled errors
            if (this.Pages[i].Broken)
                continue;

            try {
                if (panel.IsVisible(this.ViewportX, this.ViewportY, this.Width, this.Height)) {
                    panel.Draw(this._canvasContext);
                }
            }
            catch (err) {	// this shouldn't ever happen as the base Draw() method wrapper will catch
            // all draw errors
                this.Pages[i].Broken = true;
                //Dbg.Print("Page " + pages[i].Label + " unhandled error in Draw(): " + err);
            }
        }

        //TextDraw.RetainedDraw();
        this._canvasContext.restore();

        this._canvasContext.globalAlpha = 1;

        

        //this._canvasContext.globalAlpha = this._MouseDragOpacity;

        //if (this._MouseDragIndicator.ReadyForRendering) {
        //    if (this.AllowVerticalNavigation && this.AllowHorizontalNavigation) {
        //        surface.drawImage(mMouseDragIndicatorXY, mMousePointer.x - 37, mMousePointer.y + 35, mMouseDragIndicatorXY.width, mMouseDragIndicatorXY.height);

        //    } else if (this.AllowVerticalNavigation && !this.AllowHorizontalNavigation) {
        //        surface.drawImage(mMouseDragIndicatorY, mMousePointer.x - 37, mMousePointer.y + 35, mMouseDragIndicatorY.width, mMouseDragIndicatorY.height);

        //    } else if (!this.AllowVerticalNavigation && this.AllowHorizontalNavigation) {
        //        surface.drawImage(mMouseDragIndicatorX, mMousePointer.x - 37, mMousePointer.y + 35, mMouseDragIndicatorX.width, mMouseDragIndicatorX.height);

        //    } else {
        //        surface.drawImage(mMouseDragIndicatorXY, mMousePointer.x - 37, mMousePointer.y + 35, mMouseDragIndicatorXY.width, mMouseDragIndicatorXY.height);

        //    }

        //    //surface.drawImage(mMouseDragIndicator, mMousePointer.x - 37, mMousePointer.y + 35, mMouseDragIndicator.width, mMouseDragIndicator.height);

        //};

        //this._canvasContext.globalAlpha = 1;
    }


    public Start() {
        var _self = this;

        this._canvas.bind('mousedown', function (e) { _self._onMouseDown(e); });
        this._canvas.bind('mouseup', function (e) { _self._onMouseUp(e); });
        this._canvas.bind('mousemove', function (e) { _self._onMouseMove(e); });
        this._canvas.bind('mouseout', function (e) { _self._onMouseUp(e); });
        this._canvas.bind('mouseover', function (e) { _self._onMouseEnter(e); });
        //$(document).bind('keydown', Experience.Instance.OnKeyDown);
        //$(document).bind('mousedown', Experience.Instance.PreventSelection);

        this._canvas.css("-ms-touch-action", "none");
        this._canvas.bind('MSPointerDown', function (e) { _self._onTouchDownMS(e); });
        this._canvas.bind('MSPointerMove', function (e) { _self._onTouchMoveMS(e); });
        this._canvas.bind('MSPointerUp', function (e) { _self._onTouchEndMS(e); });


        //this assumes all the pages have already been added before you start the experience
        this._initPages();





        //ViewportMin = 1920 - Experience.Instance.Width;
        this._ViewportMinX = 0;
        this._ViewportMinY = 0;
        this._viewportTargetX = this._ViewportMinX;
        this._viewportTargetY = this._ViewportMinY;

        this._StartX = this._viewportTargetX;
        this._StartY = this._viewportTargetY;
    }

    public LayoutUpdated() {
        this.Width = this._canvas[0].clientWidth;
        this.Height = this._canvas[0].clientHeight;
    }


    public DrawDebugInformation(lineHeight:number, yStart: number, roundedFPS: number) {

        var x = 30;
        var y = yStart;

        //this._canvasContext.clearRect(x, y, 600, 11 * lineHeight); //clears area each draw


        this.DrawString("Viewport (x): " + this.ViewportX.toFixed(2), x, y); y += lineHeight;
        this.DrawString("Viewport (y): " + this.ViewportY.toFixed(2), x, y); y += lineHeight;
        this.DrawString("Draw Calls: " + this.DrawCallCount, x, y); y += lineHeight;
        this.DrawString("Draw Calls (/s): " + Math.round(this.DrawCallCount * roundedFPS) + "/sec", x, y); y += lineHeight;
        this.DrawString("Current Velocity (x): " + this._CurrentVelocityX, x, y); y += lineHeight;
        this.DrawString("Current Velocity (y): " + this._CurrentVelocityY, x, y); y += lineHeight;
        this.DrawString("Timeline (x): " + (this.TimelineX + this.Width).toFixed(2), x, y); y += lineHeight;
        this.DrawString("Timeline (y): " + (this.TimelineY + this.Height).toFixed(2), x, y); y += lineHeight;
        this.DrawString("MousePosition: " + this._MousePointer.x + " , " + this._MousePointer.y, x, y); y += lineHeight;
        this.DrawString("MousePositionReal: " + this._MousePointerReal.x + " , " + this._MousePointerReal.y, x, y); y += lineHeight;
        this.DrawString("MousePositionDown: " + this._MousePointerDown.x + " , " + this._MousePointerDown.y, x, y); y += lineHeight;




    }



    private _onMouseDown(mouseEvent) {

        //firefox issue with offset !!! grrrr
        var offX = 0, offY = 0;
        if (!mouseEvent.offsetX) offX = mouseEvent.layerX - $(mouseEvent.target).position().left;
        else offX = mouseEvent.offsetX;
        if (!mouseEvent.offsetY) offY = mouseEvent.layerY - $(mouseEvent.target).position().top;
        else offY = mouseEvent.offsetY;


        this._LastMouseX = mouseEvent.pageX;
        this._LastMouseY = mouseEvent.pageY;
        this._CurrentInertiaX = 0;
        this._CurrentVelocityX = 0;
        this._LastMotionUpdateX = 0; //new Date().getTime();
        this._LastMotionUpdateY = 0; //new Date().getTime();

        this._KeyboardVelocityX = 0; // mouse down resets any keyboard motion
        this._KeyboardVelocityY = 0;

        mouseEvent.preventDefault();

        this._MousePointer.x = offX;  //mouseEvent.offsetX;
        this._MousePointer.y = offY; // mouseEvent.offsetY;

        this._MousePointerDown.x = offX;  //mouseEvent.offsetX;
        this._MousePointerDown.y = offY;  //mouseEvent.offsetY;



        this._LastX = this._viewportTargetX;
        this._LastY = this._viewportTargetY;

        var mouseDownHandled = false;


        // if mouse wasnt handled by any of the pages, use it for scrolling
        if (!mouseDownHandled) {
            this._PanningActive = true;
            this._MouseDragOpacityTarget = 1;
        }

    }
    private _onMouseUp(mouseEvent) {

        if (this._PanningActive) {
            this._PanningActive = false;
            this._CurrentInertiaX = Math.abs(this._CurrentVelocityX);
            this._CurrentInertiaY = Math.abs(this._CurrentVelocityY);
            this._InertiaMaxTimeX = 300 + this._CurrentInertiaX * 500;
            this._InertiaMaxTimeY = 300 + this._CurrentInertiaY * 500;
            this._bProcessInertiaX = true;
            this._bProcessInertiaY = true;

            // decrease velocity; duration of last mousemove to this mouseup event
            // indicates a hold gesture
            var timeNow = new Date().getTime();

            var deltaTime = timeNow - this._LastMotionUpdateX;
            deltaTime = Math.max(10, deltaTime); // low-timer granularity compensation
            this._LastMotionUpdateX = 0;

            //Dbg.Print("deltaTime : " + deltaTime);

            var deltaTimeY = timeNow - this._LastMotionUpdateY;
            deltaTimeY = Math.max(10, deltaTimeY); // low-timer granularity compensation
            this._LastMotionUpdateY = 0;

            // 100msec is a full hold gesture that complete zeroes out the velocity to be used as inertia
            this._CurrentVelocityX *= 1 - Math.min(1, Math.max(0, deltaTime / 100));
            this._CurrentVelocityY *= 1 - Math.min(1, Math.max(0, deltaTimeY / 100));
        }

        this._LastX = 0;
        this._LastY = 0;
        this._MouseDragOpacityTarget = 0;

        

        var _self = this;
        setTimeout(function () {
            _self._MousePointerDown.x = 0;
            _self._MousePointerDown.y = 0;
        }, 50);


    }
    private _onMouseMove(mouseEvent) {

        //firefox issue with offset !!! grrrr
        var offX = 0, offY = 0;
        if (!mouseEvent.offsetX) offX = mouseEvent.layerX - $(mouseEvent.target).position().left;
        else offX = mouseEvent.offsetX;
        if (!mouseEvent.offsetY) offY = mouseEvent.layerY - $(mouseEvent.target).position().top;
        else offY = mouseEvent.offsetY;

        if (this._PanningActive) {

            // the granularity of JS timers in IE9 is around 16msec
            // which means if we are getting 60+ mouse-move updates per second
            // once in a while we will get a near-zero timespan
            // which throws any velocity/inertia computation out the window
            var timeNow = new Date().getTime();
            //var deltaTime = timeNow - mLastMotionUpdate;

            this._MouseDragOpacityTarget = 1;

            //Dbg.Print('pageX : ' + mouseEvent.pageX + ' offsetX : ' + offX); //mouseEvent.offsetX);
            //Dbg.Print('pageY : ' + mouseEvent.pageY + ' offsetY : ' + offY);  //mouseEvent.offsetY);

            // apply camera panning
            var newX = mouseEvent.pageX;
            var newY = mouseEvent.pageY;
            var deltaX = newX - this._LastMouseX;
            var deltaY = newY - this._LastMouseY;

            //Dbg.Print("deltaX : " + deltaX);

            this._LastMouseX = newX;
            this._LastMouseY = newY;
            this._LastMotionUpdateX = timeNow;
            this._LastMotionUpdateY = timeNow;

            this._MousePointer.x = offX;  //mouseEvent.offsetX;
            this._MousePointer.y = offY; //mouseEvent.offsetY;

            this._viewportTargetX -= deltaX;
            this._viewportTargetY -= deltaY;

        }

        this._MousePointerReal.x = offX; // mouseEvent.offsetX;
        this._MousePointerReal.y = offY; // mouseEvent.offsetY;

    }

    private _onMouseEnter(mouseEvent) { }
    private _onTouchDownMS(touchEvent) { }
    private _onTouchMoveMS(touchEvent) { }
    private _onTouchEndMS(touchEvent) { }










    public Attach(page: PageX) {
        this.Pages.push(page);

        this._ViewportMaxX += page.Width;
        this._ViewportMaxY = page.Height > this._ViewportMaxY ? page.Height : this._ViewportMaxY;

        return page;
    }


    public Reset() {
        this.Pages = [];
        this._ViewportMaxX = 0;
        this._ViewportMaxY = 0;
    }

    private _initPages() {

        // lay everything out one after another
        for (var i = 1; i < this.Pages.length; i++) {
            this.Pages[i].X = this.Pages[i - 1].X + this.Pages[i - 1].Width + 5 - this.Pages[i].OverlapX;
            this.Pages[i].zIndex = i;
        }

        // initialize all the pages
        for (var i = 0; i < this.Pages.length; i++) {
            this.Pages[i].Initialize();
        }

        // resort draw order based on optionally specified zIndex in Initialize() above
        // sometimes we want a page to draw on top of a page to its right
        this.Pages.sort(function (a, b) { return a.zIndex - b.zIndex; });


    }











    private DrawString(str, x, y) {

        this._canvasContext.font = "13pt DebugFont";
        this._canvasContext.textBaseline = "top";
        this._canvasContext.textAlign = "left";

        this._canvasContext.fillStyle = "#f00";
        this._canvasContext.fillText(str, x, y);

    }



    public Unload() {

        this._canvas.unbind('mousedown');
        this._canvas.unbind('mouseup');
        this._canvas.unbind('mousemove');
        this._canvas.unbind('mouseout');
        this._canvas.unbind('mouseover');

        this._canvas.unbind('MSPointerDown');
        this._canvas.unbind('MSPointerMove');
        this._canvas.unbind('MSPointerUp');

    }

}



