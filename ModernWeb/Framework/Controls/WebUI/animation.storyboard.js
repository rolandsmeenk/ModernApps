var Storyboard = (function () {
    function Storyboard(experience, type, side, duration, areax, direction, opacitystart, opacityend) {
        this.Index = -1;
        this.X = 0;
        this.Y = 0;
        this.Control = null;
        this.Opacity = 0;
        this.IsPaused = false;
        this.Start = null;
        this.End = null;
        this.hasBegun = false;
        this.AnimType = type;
        this.AnimSide = side;
        this.AnimDuration = duration;
        this.AnimAreaX = areax;
        this.AnimDirection = direction;
        this.AnimOpacityStart = opacitystart;
        this.AnimOpacityEnd = opacityend;
        this._experience = experience;
    }
    Storyboard.prototype.Init = function (o) {
        var i = this.Index == -1 ? this._experience.Storyboards.length : this.Index;
        this._experience.Storyboards[i] = this;
        this.Index = i;
        this.Control = o;
        this.easer = new Easing.Easer({
            type: this.AnimType,
            side: this.AnimSide
        });
    };
    Storyboard.prototype.UnInit = function () {
        this._experience.Storyboards[this.Index] = null;
        this.Control = null;
        this.hasBegun = false;
    };
    Storyboard.prototype.Reset = function () {
        this.hasBegun = false;
    };
    Storyboard.prototype.Begin = function () {
        this.Start = this.Now();
        this.End = this.Start + this.AnimDuration * 1000;
        this.Opacity = this.AnimOpacityStart;
        this.hasBegun = true;
    };
    Storyboard.prototype.Now = function () {
        if(Date.now) {
            return Date.now();
        } else {
            return (new Date().getTime());
        }
    };
    Storyboard.prototype.NextFrame = function (interval_id) {
        if(this.IsPaused) {
            return;
        }
        if(!this.hasBegun) {
            this.Begin();
        }
        var e = this.easer, now = this.Now() - this.Start, end = this.End - this.Start;
        if(now > end) {
            now = end;
            return;
        }
        if(this.AnimDirection != null || this.AnimDirection != undefined) {
            if(this.AnimDirection == 'lefttoright') {
                this.X = e.ease(now, 0, this.AnimAreaX, end);
            } else if(this.AnimDirection == 'righttoleft') {
                this.X = this.AnimAreaX - e.ease(now, 0, this.AnimAreaX, end);
            } else if(this.AnimDirection == 'toptobottom') {
                this.Y = e.ease(now, 0, this.AnimAreaX, end);
            } else if(this.AnimDirection == 'bottomtotop') {
                this.Y = this.AnimAreaX - e.ease(now, 0, this.AnimAreaX, end);
            }
        } else {
            this.X = e.ease(now, 0, this.AnimAreaX, end);
        }
        this.Opacity = e.ease(now, this.AnimOpacityStart, this.AnimOpacityEnd, end);
        ;
    };
    return Storyboard;
})();
