/// <reference path="experience.ts"/>

declare var $;

class Storyboard
{
    public Index = -1;
    public X = 0;
    public Y = 0;
    public Control = null;
    public Opacity = 0;
    public IsPaused = false;


    public AnimType: any ;
    public AnimDuration ;
    public AnimSide ;
    public AnimAreaX ;
    //this.AnimAreaY = areay;
    public Start = null;
    public End = null;
    public AnimDirection ;
    public AnimOpacityStart;
    public AnimOpacityEnd;

    public easer: any;
    
    private _experience: Experience;


    constructor(experience, type, side, duration, areax, direction, opacitystart, opacityend) {
        this.AnimType = type;
        this.AnimSide = side;
        this.AnimDuration = duration;
        this.AnimAreaX = areax;
        this.AnimDirection = direction;
        this.AnimOpacityStart = opacitystart;
        this.AnimOpacityEnd = opacityend;
        this._experience = experience;
    }

    public Init(o)
    {
        var i = this.Index == -1 ? this._experience.Storyboards.length : this.Index;

        //Dbg.Print("Animator.Init i : " + i);
        //Dbg.Print("Animator.Init o : " + o);

        this._experience.Storyboards[i] = this;
        this.Index = i;
        this.Control = o;

        // create easer
        this.easer = new Easing.Easer({
            type: this.AnimType,
            side: this.AnimSide
        });

    }

    public UnInit()
    {
        this._experience.Storyboards[this.Index] = null;
        this.Control = null;
        this.hasBegun = false;
    }

    public Reset()
    {
        this.hasBegun = false;
    }


    private hasBegun:bool = false;
    public Begin()
    {
        //Dbg.Print("Animator.Begin");
        this.Start = this.Now();
        this.End = this.Start + this.AnimDuration * 1000;
        this.Opacity = this.AnimOpacityStart;

        //Dbg.Print("this.Start : " + this.Start);
        //Dbg.Print("this.End : " + this.End);
        this.hasBegun = true;
    }


    public Now()
    {
        if (Date.now)
            return Date.now();
        else
            return (new Date().getTime());
    }


    public NextFrame(interval_id)
    {
        if (this.IsPaused) return;
        //Dbg.Print("Animator.NextFrame hasBegun : " + hasBegun);
        if (!this.hasBegun) this.Begin();

        //Dbg.Print("Animator.NextFrame Start : " + this.Start);
        var e = this.easer,
            now = this.Now() - this.Start,
            end = this.End - this.Start;

        if (now > end)
        {
            // clamp to end time
            now = end;

            // clear animation interval
            // clearInterval(interval_id);

            return;
        }

        // set value
        if (this.AnimDirection != null || this.AnimDirection != undefined)
        {
            if (this.AnimDirection == 'lefttoright')
            {
                this.X = e.ease(
                now,            // curr time
                0,              // start position
                this.AnimAreaX, // relative end position
                end             // end time
                );
            }
            else if (this.AnimDirection == 'righttoleft')
            {
                this.X = this.AnimAreaX - e.ease(now, 0, this.AnimAreaX, end);
            }
            else if (this.AnimDirection == 'toptobottom')
            {
                this.Y = e.ease(now, 0, this.AnimAreaX, end);
            }
            else if (this.AnimDirection == 'bottomtotop')
            {
                this.Y = this.AnimAreaX - e.ease(now, 0, this.AnimAreaX, end);
            }
        }
        else
        {
            this.X = e.ease(now, 0, this.AnimAreaX, end);
        }

        this.Opacity = e.ease(now, this.AnimOpacityStart, this.AnimOpacityEnd, end); ;
    }





}




//TYPES
//<option value='bounce'>Bounce</option>
//<option value='circular'>Circular</option>
//<option value='cubic'>Cubic (x^3)</option>
//<option value='elastic'>Elastic</option>
//<option value='exp'>Exponential (2^x)</option>
//<option value='linear'>Linear (x)</option>
//<option value='quadratic'>Quadratic (x^2)</option>
//<option value='quartic'>Quartic (x^4)</option>
//<option value='quintic'>Quintic (x^5)</option>
//<option value='sine'>Sinusoidal (cos(x))</option>


//SIDE
//<option value='none'>none</option>
//<option value='both'>both</option>
//<option value='in'>in</option>
//<option value='out'>out</option>

//DURATION
//IN SECONDS