/// <reference path="experience.ts"/>

/// <reference path="views.pagex.ts"/>
/// <reference path="animation.easing.ts"/>

declare var $;

class BehaviorClickAnimation
{
    
    private _clickEffectOn: bool = true;
    private _clickAnimMousDwn: bool = false;
    private _clickAnimMousUp: bool = false;
    private _clickInProgress: bool = false;
    private _clickDelta: number = 0;
    private _clickEaser: any = new Easing({ type: 'quadratic', side: 'both' });
    private _clickStart = null;
    private _clickEnd = null;
    

    

    public Delta: number = 0;
    private _control: any = control;


    constructor(control){
        this._control = control;
    }

    public CalculateDelta(clickedon) {

        
        if (clickedon == true) {

            if (this._clickEffectOn && !this._clickInProgress) {
                this._clickAnimMousDwn = true;
                this._clickStart = this._control.Now();
                this._clickEnd = this._clickStart + 0.2 * 1000;
                this._clickInProgress = true;
                //Dbg.Print(this.Start + " | " + this.End);
            }

        }

        if (this._clickEffectOn) {
            if (this._clickAnimMousDwn) {
                var e = this._clickEaser,
                now = this._control.Now() - this._clickStart,
                end = this._clickEnd - this._clickStart;

                //Dbg.Print(now + " | " + end);

                if (now > end) {
                    now = end;
                    this._clickAnimMousDwn = false;
                    this._clickAnimMousUp = true;
                    this._clickStart = this._control.Now();
                    this._clickEnd = this._clickStart + 0.15 * 1000;
                }
                else {
                    this._clickDelta = e.ease(now, 0, 25, end);
                }
            }
            else if (this._clickAnimMousUp) {
                var e = this._clickEaser,
                now = this._control.Now() - this._clickStart,
                end = this._clickEnd - this._clickStart;

                if (now > end) {
                    now = end;
                    this._clickAnimMousUp = false;

                    //end animation
                    this._clickDelta = 0;
                    this._clickInProgress = false;
                    this._control.SlotCell.clicked = 0;
                }
                else {
                    this._clickDelta = e.ease(now, 0, 15, end);
                    this._clickDelta = 12 - this._clickDelta;
                }
            }
        }

        this.Delta = this._clickDelta;

        

    }


}