
var Storyboards = new Array();

function Storyboard(type, side, duration, areax, direction, opacitystart, opacityend)
{
    this.Index = -1;
    this.X = 0;
    this.Y = 0;
    this.Control = null;
    this.Opacity = 0;
    this.IsPaused = false;

    this.Init = function (o)
    {
        var i = this.Index == -1 ? Storyboards.length : this.Index;

        //Dbg.Print("Animator.Init i : " + i);
        //Dbg.Print("Animator.Init o : " + o);

        Storyboards[i] = this;
        this.Index = i;
        this.Control = o;

        // create easer
        this.easer = new Easing.Easer({
            type: this.AnimType,
            side: this.AnimSide
        });

    }

    this.UnInit = function ()
    {
        Storyboards[i] = null;
        this.Control = null;
        hasBegun = false;
    }

    this.Reset = function ()
    {
        hasBegun = false;
    }


    var hasBegun = false;
    this.Begin = function ()
    {
        //Dbg.Print("Animator.Begin");
        this.Start = this.Now();
        this.End = this.Start + this.AnimDuration * 1000;
        this.Opacity = this.AnimOpacityStart;

        //Dbg.Print("this.Start : " + this.Start);
        //Dbg.Print("this.End : " + this.End);
        hasBegun = true;
    }


    this.Now = function ()
    {
        if (Date.now)
            return Date.now();
        else
            return (new Date().getTime());
    }


    this.NextFrame = function (interval_id)
    {
        if (this.IsPaused) return;
        //Dbg.Print("Animator.NextFrame hasBegun : " + hasBegun);
        if (!hasBegun) this.Begin();

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


    this.AnimType = type;
    this.AnimDuration = duration;
    this.AnimSide = side;
    this.AnimAreaX = areax;
    //this.AnimAreaY = areay;
    this.Start = null;
    this.End = null;
    this.AnimDirection = direction;
    this.AnimOpacityStart = opacitystart;  //default = 1
    this.AnimOpacityEnd = opacityend; //default = 1


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