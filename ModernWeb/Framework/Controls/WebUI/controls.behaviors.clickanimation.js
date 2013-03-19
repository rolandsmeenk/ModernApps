var BehaviorClickAnimation = (function () {
    function BehaviorClickAnimation(control) {
        this._clickEffectOn = true;
        this._clickAnimMousDwn = false;
        this._clickAnimMousUp = false;
        this._clickInProgress = false;
        this._clickDelta = 0;
        this._clickEaser = new Easing({
            type: 'quadratic',
            side: 'both'
        });
        this._clickStart = null;
        this._clickEnd = null;
        this.Delta = 0;
        this._control = control;
        this._control = control;
    }
    BehaviorClickAnimation.prototype.CalculateDelta = function (clickedon) {
        if(clickedon == true) {
            if(this._clickEffectOn && !this._clickInProgress) {
                this._clickAnimMousDwn = true;
                this._clickStart = this._control.Now();
                this._clickEnd = this._clickStart + 0.2 * 1000;
                this._clickInProgress = true;
            }
        }
        if(this._clickEffectOn) {
            if(this._clickAnimMousDwn) {
                var e = this._clickEaser, now = this._control.Now() - this._clickStart, end = this._clickEnd - this._clickStart;
                if(now > end) {
                    now = end;
                    this._clickAnimMousDwn = false;
                    this._clickAnimMousUp = true;
                    this._clickStart = this._control.Now();
                    this._clickEnd = this._clickStart + 0.15 * 1000;
                } else {
                    this._clickDelta = e.ease(now, 0, 25, end);
                }
            } else if(this._clickAnimMousUp) {
                var e = this._clickEaser, now = this._control.Now() - this._clickStart, end = this._clickEnd - this._clickStart;
                if(now > end) {
                    now = end;
                    this._clickAnimMousUp = false;
                    this._clickDelta = 0;
                    this._clickInProgress = false;
                    this._control.SlotCell.clicked = 0;
                } else {
                    this._clickDelta = e.ease(now, 0, 15, end);
                    this._clickDelta = 12 - this._clickDelta;
                }
            }
        }
        this.Delta = this._clickDelta;
    };
    return BehaviorClickAnimation;
})();
