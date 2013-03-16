var Experience = (function () {
    function Experience(canvas, interpolation, maxX, maxY) {
        this.DrawCallCount = 0;
        this._LastX = 0;
        this._LastY = 0;
        this._LastMouseX = 0;
        this._LastMouseY = 0;
        this._CurrentInertiaX = 0;
        this._CurrentInertiaY = 0;
        this._CurrentVelocityX = 0;
        this._CurrentVelocityY = 0;
        this._CurrentDirectionX = 0;
        this._CurrentDirectionY = 0;
        this._LastMotionUpdateX = 0;
        this._LastMotionUpdateY = 0;
        this._KeyboardVelocityX = 0;
        this._KeyboardVelocityY = 0;
        this._viewportTargetX = 0;
        this._viewportTargetY = 0;
        this._InertiaMaxTimeX = 0;
        this._InertiaMaxTimeY = 0;
        this.TimelineX = 0;
        this.TimelineY = 0;
        this._ViewportMinX = 0;
        this._ViewportMinY = 0;
        this._ViewportMaxX = 0;
        this._ViewportMaxY = 0;
        this.ViewportX = 0;
        this.ViewportY = 0;
        this._StartX = 0;
        this._StartY = 0;
        this._FrameLength = 0;
        this._RoundedViewportX = 0;
        this._RoundedViewportY = 0;
        this.AllowVerticalNavigation = true;
        this.AllowHorizontalNavigation = true;
        this.Width = 0;
        this.Height = 0;
        this._MousePointer = {
            "x": 0,
            "y": 0
        };
        this._MousePointerDown = {
            "x": 0,
            "y": 0
        };
        this._MousePointerReal = {
            "x": 0,
            "y": 0
        };
        this._PanningActive = false;
        this._MouseDragOpacityTarget = 1;
        this.Pages = [];
        this._canvas = canvas;
        this._canvasContext = canvas[0].getContext("2d");
        this.Interpolation = interpolation;
        this.Width = this._canvas[0].clientWidth;
        this.Height = this._canvas[0].clientHeight;
        this._ViewportMaxX = maxX;
        this._ViewportMaxY = maxY;
    }
    Experience.prototype.Update = function (frameLength) {
        this._FrameLength = frameLength;
        var frameTick = frameLength / 60;
        this._viewportTargetX = Math.min(this._ViewportMaxX, Math.max(this._ViewportMinX, this._viewportTargetX));
        this._viewportTargetY = Math.min(this._ViewportMaxY, Math.max(this._ViewportMinY, this._viewportTargetY));
        if(this._PanningActive) {
            var dX = this._viewportTargetX - this._LastX;
            this._LastX = this._viewportTargetX;
            var velocity = Math.abs(dX);
            this._CurrentVelocityX += (velocity - this._CurrentVelocityX) * 0.3;
            this._CurrentDirectionX = dX < 0 ? -1 : 1;
            var dY = this._viewportTargetY - this._LastY;
            this._LastY = this._viewportTargetY;
            var velocityY = Math.abs(dY);
            this._CurrentVelocityY += (velocityY - this._CurrentVelocityY) * 0.3;
            this._CurrentDirectionY = dY < 0 ? -1 : 1;
        } else {
            if(this._bProcessInertiaX) {
                this._viewportTargetX += this._CurrentVelocityX * this._CurrentDirectionX;
                this._CurrentVelocityX *= 0.9;
                if(this._viewportTargetX < this._ViewportMinX || this._viewportTargetX > this._ViewportMaxX) {
                    this._CurrentVelocityX = 0;
                    this._bProcessInertiaX = false;
                }
                if(this._CurrentVelocityX < 0.01) {
                    this._bProcessInertiaX = false;
                    this._CurrentVelocityX = 0;
                }
            }
            if(this._bProcessInertiaY) {
                this._viewportTargetY += this._CurrentVelocityY * this._CurrentDirectionY;
                this._CurrentVelocityY *= 0.9;
                if(this._viewportTargetY < this._ViewportMinY || this._viewportTargetY > this._ViewportMaxY) {
                    this._CurrentVelocityY = 0;
                    this._bProcessInertiaY = false;
                }
                if(this._CurrentVelocityY < 0.01) {
                    this._bProcessInertiaY = false;
                    this._CurrentVelocityY = 0;
                }
            }
        }
        this._CurrentVelocityX = this._CurrentVelocityX / frameLength;
        this._CurrentVelocityY = this._CurrentVelocityY / frameLength;
        var smoothingFactor = 0.12;
        var speed = (this._viewportTargetX - this.ViewportX) * smoothingFactor;
        this.ViewportX += speed;
        if(this.AllowVerticalNavigation) {
            var smoothingFactorY = 0.12;
            var speedY = (this._viewportTargetY - this.ViewportY) * smoothingFactorY;
            this.ViewportY += speedY;
        } else {
            this.ViewportY = 0;
        }
        if(this.AllowHorizontalNavigation) {
            var smoothingFactorX = 0.12;
            var speedX = (this._viewportTargetX - this.ViewportX) * smoothingFactorX;
            this.ViewportX += speedX;
        } else {
            this.ViewportX = 0;
        }
        this._RoundedViewportX = -this.ViewportX;
        this._RoundedViewportY = -this.ViewportY;
        this.TimelineX = this.ViewportX;
        this.TimelineY = this.ViewportY;
        if(this._CurrentVelocityX != 0) {
            this._MousePointerDown.x = 0;
            this._MousePointerDown.y = 0;
        }
    };
    Experience.prototype.Draw = function () {
        this.DrawCallCount = 0;
        this._canvasContext.save();
        this._canvasContext.translate(this._RoundedViewportX, this._RoundedViewportY);
        for(var i = 0; i < this.Pages.length; i++) {
            var panel = this.Pages[i];
            if(this.Pages[i].Broken) {
                continue;
            }
            try  {
                if(panel.IsVisible(this.ViewportX, this.ViewportY, this.Width, this.Height)) {
                    panel.Draw(this._canvasContext);
                }
            } catch (err) {
                this.Pages[i].Broken = true;
            }
        }
        this._canvasContext.restore();
        this._canvasContext.globalAlpha = 1;
    };
    Experience.prototype.Start = function () {
        var _self = this;
        this._canvas.bind('mousedown', function (e) {
            _self._onMouseDown(e);
        });
        this._canvas.bind('mouseup', function (e) {
            _self._onMouseUp(e);
        });
        this._canvas.bind('mousemove', function (e) {
            _self._onMouseMove(e);
        });
        this._canvas.bind('mouseout', function (e) {
            _self._onMouseUp(e);
        });
        this._canvas.bind('mouseover', function (e) {
            _self._onMouseEnter(e);
        });
        this._canvas.css("-ms-touch-action", "none");
        this._canvas.bind('MSPointerDown', function (e) {
            _self._onTouchDownMS(e);
        });
        this._canvas.bind('MSPointerMove', function (e) {
            _self._onTouchMoveMS(e);
        });
        this._canvas.bind('MSPointerUp', function (e) {
            _self._onTouchEndMS(e);
        });
        this._initPages();
        this._ViewportMinX = 0;
        this._ViewportMinY = 0;
        this._viewportTargetX = this._ViewportMinX;
        this._viewportTargetY = this._ViewportMinY;
        this._StartX = this._viewportTargetX;
        this._StartY = this._viewportTargetY;
    };
    Experience.prototype.LayoutUpdated = function () {
        this.Width = this._canvas[0].clientWidth;
        this.Height = this._canvas[0].clientHeight;
    };
    Experience.prototype.DrawDebugInformation = function (lineHeight, yStart, roundedFPS) {
        var x = 30;
        var y = yStart;
        this.DrawString("Viewport (x): " + this.ViewportX.toFixed(2), x, y);
        y += lineHeight;
        this.DrawString("Viewport (y): " + this.ViewportY.toFixed(2), x, y);
        y += lineHeight;
        this.DrawString("Draw Calls: " + this.DrawCallCount, x, y);
        y += lineHeight;
        this.DrawString("Draw Calls (/s): " + Math.round(this.DrawCallCount * roundedFPS) + "/sec", x, y);
        y += lineHeight;
        this.DrawString("Current Velocity (x): " + this._CurrentVelocityX, x, y);
        y += lineHeight;
        this.DrawString("Current Velocity (y): " + this._CurrentVelocityY, x, y);
        y += lineHeight;
        this.DrawString("Timeline (x): " + (this.TimelineX + this.Width).toFixed(2), x, y);
        y += lineHeight;
        this.DrawString("Timeline (y): " + (this.TimelineY + this.Height).toFixed(2), x, y);
        y += lineHeight;
        this.DrawString("MousePosition: " + this._MousePointer.x + " , " + this._MousePointer.y, x, y);
        y += lineHeight;
        this.DrawString("MousePositionReal: " + this._MousePointerReal.x + " , " + this._MousePointerReal.y, x, y);
        y += lineHeight;
        this.DrawString("MousePositionDown: " + this._MousePointerDown.x + " , " + this._MousePointerDown.y, x, y);
        y += lineHeight;
    };
    Experience.prototype._onMouseDown = function (mouseEvent) {
        var offX = 0, offY = 0;
        if(!mouseEvent.offsetX) {
            offX = mouseEvent.layerX - $(mouseEvent.target).position().left;
        } else {
            offX = mouseEvent.offsetX;
        }
        if(!mouseEvent.offsetY) {
            offY = mouseEvent.layerY - $(mouseEvent.target).position().top;
        } else {
            offY = mouseEvent.offsetY;
        }
        this._LastMouseX = mouseEvent.pageX;
        this._LastMouseY = mouseEvent.pageY;
        this._CurrentInertiaX = 0;
        this._CurrentVelocityX = 0;
        this._LastMotionUpdateX = 0;
        this._LastMotionUpdateY = 0;
        this._KeyboardVelocityX = 0;
        this._KeyboardVelocityY = 0;
        mouseEvent.preventDefault();
        this._MousePointer.x = offX;
        this._MousePointer.y = offY;
        this._MousePointerDown.x = offX;
        this._MousePointerDown.y = offY;
        this._LastX = this._viewportTargetX;
        this._LastY = this._viewportTargetY;
        var mouseDownHandled = false;
        if(!mouseDownHandled) {
            this._PanningActive = true;
            this._MouseDragOpacityTarget = 1;
        }
    };
    Experience.prototype._onMouseUp = function (mouseEvent) {
        if(this._PanningActive) {
            this._PanningActive = false;
            this._CurrentInertiaX = Math.abs(this._CurrentVelocityX);
            this._CurrentInertiaY = Math.abs(this._CurrentVelocityY);
            this._InertiaMaxTimeX = 300 + this._CurrentInertiaX * 500;
            this._InertiaMaxTimeY = 300 + this._CurrentInertiaY * 500;
            this._bProcessInertiaX = true;
            this._bProcessInertiaY = true;
            var timeNow = new Date().getTime();
            var deltaTime = timeNow - this._LastMotionUpdateX;
            deltaTime = Math.max(10, deltaTime);
            this._LastMotionUpdateX = 0;
            var deltaTimeY = timeNow - this._LastMotionUpdateY;
            deltaTimeY = Math.max(10, deltaTimeY);
            this._LastMotionUpdateY = 0;
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
    };
    Experience.prototype._onMouseMove = function (mouseEvent) {
        var offX = 0, offY = 0;
        if(!mouseEvent.offsetX) {
            offX = mouseEvent.layerX - $(mouseEvent.target).position().left;
        } else {
            offX = mouseEvent.offsetX;
        }
        if(!mouseEvent.offsetY) {
            offY = mouseEvent.layerY - $(mouseEvent.target).position().top;
        } else {
            offY = mouseEvent.offsetY;
        }
        if(this._PanningActive) {
            var timeNow = new Date().getTime();
            this._MouseDragOpacityTarget = 1;
            var newX = mouseEvent.pageX;
            var newY = mouseEvent.pageY;
            var deltaX = newX - this._LastMouseX;
            var deltaY = newY - this._LastMouseY;
            this._LastMouseX = newX;
            this._LastMouseY = newY;
            this._LastMotionUpdateX = timeNow;
            this._LastMotionUpdateY = timeNow;
            this._MousePointer.x = offX;
            this._MousePointer.y = offY;
            this._viewportTargetX -= deltaX;
            this._viewportTargetY -= deltaY;
        }
        this._MousePointerReal.x = offX;
        this._MousePointerReal.y = offY;
    };
    Experience.prototype._onMouseEnter = function (mouseEvent) {
    };
    Experience.prototype._onTouchDownMS = function (touchEvent) {
    };
    Experience.prototype._onTouchMoveMS = function (touchEvent) {
    };
    Experience.prototype._onTouchEndMS = function (touchEvent) {
    };
    Experience.prototype.Attach = function (page) {
        this.Pages.push(page);
        this._ViewportMaxX += page.Width;
        this._ViewportMaxY = page.Height > this._ViewportMaxY ? page.Height : this._ViewportMaxY;
        return page;
    };
    Experience.prototype.Reset = function () {
        this.Pages = [];
        this._ViewportMaxX = 0;
        this._ViewportMaxY = 0;
    };
    Experience.prototype._initPages = function () {
        for(var i = 1; i < this.Pages.length; i++) {
            this.Pages[i].X = this.Pages[i - 1].X + this.Pages[i - 1].Width + 5 - this.Pages[i].OverlapX;
            this.Pages[i].zIndex = i;
        }
        for(var i = 0; i < this.Pages.length; i++) {
            this.Pages[i].Initialize();
        }
        this.Pages.sort(function (a, b) {
            return a.zIndex - b.zIndex;
        });
    };
    Experience.prototype.DrawString = function (str, x, y) {
        this._canvasContext.font = "13pt DebugFont";
        this._canvasContext.textBaseline = "top";
        this._canvasContext.textAlign = "left";
        this._canvasContext.fillStyle = "#f00";
        this._canvasContext.fillText(str, x, y);
    };
    Experience.prototype.Unload = function () {
        this._canvas.unbind('mousedown');
        this._canvas.unbind('mouseup');
        this._canvas.unbind('mousemove');
        this._canvas.unbind('mouseout');
        this._canvas.unbind('mouseover');
        this._canvas.unbind('MSPointerDown');
        this._canvas.unbind('MSPointerMove');
        this._canvas.unbind('MSPointerUp');
    };
    return Experience;
})();
