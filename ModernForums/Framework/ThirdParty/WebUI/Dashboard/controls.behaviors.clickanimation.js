function BehaviorClickAnimation(control)
{
    
    var _clickEffectOn = true;
    var _clickAnimMousDwn = false;
    var _clickAnimMousUp = false;
    var _clickInProgress = false;
    var _clickDelta = 0;
    var _clickEaser = new Easing.Easer({ type: 'quadratic', side: 'both' });
    var _clickStart = null;
    var _clickEnd = null;
    



    this.CalculateDelta = function (clickedon) {

        
        if (clickedon == true) {

            if (_clickEffectOn && !_clickInProgress) {
                _clickAnimMousDwn = true;
                _clickStart = this.Control.Now();
                _clickEnd = _clickStart + 0.2 * 1000;
                _clickInProgress = true;
                //Dbg.Print(this.Start + " | " + this.End);
            }

        }

        if (_clickEffectOn) {
            if (_clickAnimMousDwn) {
                var e = _clickEaser,
                now = this.Control.Now() - _clickStart,
                end = _clickEnd - _clickStart;

                //Dbg.Print(now + " | " + end);

                if (now > end) {
                    now = end;
                    _clickAnimMousDwn = false;
                    _clickAnimMousUp = true;
                    _clickStart = this.Control.Now();
                    _clickEnd = _clickStart + 0.15 * 1000;
                }
                else {
                    _clickDelta = e.ease(now, 0, 25, end);
                }
            }
            else if (_clickAnimMousUp) {
                var e = _clickEaser,
                now = this.Control.Now() - _clickStart,
                end = _clickEnd - _clickStart;

                if (now > end) {
                    now = end;
                    _clickAnimMousUp = false;

                    //end animation
                    _clickDelta = 0;
                    _clickInProgress = false;
                    this.Control.SlotCell.clicked = 0;
                }
                else {
                    _clickDelta = e.ease(now, 0, 15, end);
                    _clickDelta = 12 - _clickDelta;
                }
            }
        }

        this.Delta = _clickDelta;

        

    }


    this.Delta = 0;
    this.Control = control;

}