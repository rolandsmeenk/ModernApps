

class Easing
{
    
    // import math functions to speed up ease callbacks
    public abs: any = Math.abs;
    public asin: any = Math.asin;
    public cos: any = Math.cos;
    public pow: any = Math.pow;
    public sin: any = Math.sin;
    public sqrt: any = Math.sqrt;
    public PI: any = Math.PI;
    public HALF_PI: any = Math.PI / 2;


    public VERSION: string = '0.1.0';

    /**
    * Default options for Easer.
    * @static
    */
    public DEFAULTS: any = {
        type: 'linear',
            side: 'none'
    };

    /**
    * Hash of valid types and sides.
    * @static
    */
    public VALID: any = {
        type: {
            linear: true,
            bounce: true,
            circular: true,
            cubic: true,
            elastic: true,
            exp: true,
            quadratic: true,
            quartic: true,
            quintic: true,
            sine: true
        },

        side: {
            none: true,
            'in': true,
            out: true,
            both: true
        }
    };

    public linear: linear;
    public back: back;
    public bounce: bounce;
    public circular: circular;
    public cubic: cubic;
    public elastic: elastic;
    public exp: exp;
    public quadratic: quadratic;
    public quartic: quartic;
    //public Easer: Easer;
    public sine: sine;
    public quintic: quintic;

    private _o: any;

    constructor(o: any) {
        //this.Easer = new Easer(this, o, fn);
        this._o = o;
        //alert(this[o.type]["ease_" + o.side]);

        this.linear = new linear(this);
        this.back = new back(this);
        this.bounce = new bounce(this);
        this.circular = new circular(this);
        this.cubic = new cubic(this);
        this.elastic = new elastic(this);
        this.exp = new exp(this);
        this.quadratic = new quadratic(this);
        this.quartic = new quartic(this);
        this.sine = new sine(this);
        this.quintic = new quintic(this);
    }



    public ease(time_now, begin_val, change_val, time_dur) {
        return this[this._o.type]["ease_" + this._o.side].apply(this,arguments);
        //return this._fn.apply(this, arguments);
    }

}

class linear {

    private _easing: Easing;


    constructor(easing: Easing) {
        this._easing = easing;
    }

    public ease_none(t, b, c, d) {
        return c * t / d + b;
    };

}

class back {

    private _easing: Easing;


    constructor(easing: Easing) {
        this._easing = easing;
    }

    private BACK_DEFAULT_S: number = 1.70158;

    public ease_in(t, b, c, d, s) {
        if (s == undefined) s = this.BACK_DEFAULT_S;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    };

    public ease_out(t, b, c, d, s) {
        if (s == undefined) s = this.BACK_DEFAULT_S;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    };

    public ease_both(t, b, c, d, s) {
        if (s == undefined) s = this.BACK_DEFAULT_S;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    };

}

class bounce {

    private _easing: Easing;


    constructor(easing: Easing) {
        this._easing = easing;
    }

    private bounce_ratios: any = [
    1 / 2.75,
    2 / 2.75,
    2.5 / 2.75
    ];

    private bounce_factors :any = [
    null,
    1.5 / 2.75,
    2.25 / 2.75,
    2.625 / 2.75
    ];

    private ease_out(t, b, c, d) {
        if ((t /= d) < (this.bounce_ratios[0])) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (this.bounce_ratios[1])) {
            return c * (7.5625 * (t -= (this.bounce_factors[1])) * t + .75) + b;
        } else if (t < (this.bounce_ratios[2])) {
            return c * (7.5625 * (t -= (this.bounce_factors[2])) * t + .9375) + b;
        } else {
            return c * (7.5625 * (t -= (this.bounce_factors[3])) * t + .984375) + b;
        }
    };

    public ease_in(t, b, c, d) {
        return c - this._easing.bounce.ease_out(d - t, 0, c, d) + b;
    };

    public ease_both(t, b, c, d) {
        if (t < d / 2) return this._easing.bounce.ease_in(t * 2, 0, c, d) * .5 + b;
        else return this._easing.bounce.ease_out(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    };


}

class circular {

    private _easing: Easing;


    constructor(easing: Easing) {
        this._easing = easing;
    }

   
    public ease_in(t, b, c, d) {
        return -c * (this._easing.sqrt(1 - (t /= d) * t) - 1) + b;
    };

    public ease_out(t, b, c, d) {
        return c * this._easing.sqrt(1 - (t = t / d - 1) * t) + b;
    };

    public ease_both(t, b, c, d) {
        if ((t /= d / 2) < 1) return -c / 2 * (this._easing.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (this._easing.sqrt(1 - (t -= 2) * t) + 1) + b;
    };

}

class cubic {

    private _easing: Easing;


    constructor(easing: Easing) {
        this._easing = easing;
    }

    public ease_in(t, b, c, d) {
        return c * (t /= d) * t * t + b;
    }

    public ease_out(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    }

    public ease_both(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    }


}



//class Easer {

//    private _easing: Easing;

//    private _fn: any;

//    constructor(easing: Easing, o: any, fn: any) {
//        this._easing = easing;
//        this._fn = fn;
//        var key;
//        // set defaults

//        for (key in this._easing.DEFAULTS)
//            this[key] = this._easing.DEFAULTS[key];

//        this.reset(o);
//    }

//    public reset = function (o: any) {
//        var key, name, type, side, err;
//        for (key in o)
//            this[key] = o[key];

//        // get/check type
//        type = (this.side != 'none') ? this.type : 'linear';
//        if (!this._easing.VALID.type[type])
//            throw new Error("unknown type: " + this.type);

//        // get/check side
//        side = (type != 'linear') ? this.side : 'none';
//        if (!this._easing.VALID.side[side])
//            throw new Error("unknown side: " + this.side);

//        // build callback name
//        name = ['ease', side].join('_');
//        this.fn = E[type] && E[type][name];

//        // make sure callback exists
//        if (!this._fn) {
//            err = "type = " + this.type + ", side = " + this.side;
//            throw new Error("unknown ease: " + err);
//        }
//    }

//    public ease(time_now, begin_val, change_val, time_dur) {
//        return this._fn.apply(this, arguments);
//    }
//};

class elastic {

    private _easing: Easing;


    constructor(easing: Easing) {
        this._easing = easing;
    }

    public ease_in(t, b, c, d, a, p) {
        if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
        if (!a || a < this._easing.abs(c)) { a = c; var s = p / 4; }
        else var s = p / (2 * this._easing.PI) * this._easing.asin(c / a);
        return -(a * this._easing.pow(2, 10 * (t -= 1)) * this._easing.sin((t * d - s) * (2 * this._easing.PI) / p)) + b;
    };

    public ease_out(t, b, c, d, a, p) {
        if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
        if (!a || a < this._easing.abs(c)) { a = c; var s = p / 4; }
        else var s = p / (2 * this._easing.PI) * this._easing.asin(c / a);
        return (a * this._easing.pow(2, -10 * t) * this._easing.sin((t * d - s) * (2 * this._easing.PI) / p) + c + b);
    };

    public ease_both(t, b, c, d, a, p) {
        if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5);
        if (!a || a < this._easing.abs(c)) { a = c; var s = p / 4; }
        else var s = p / (2 * this._easing.PI) * this._easing.asin(c / a);
        if (t < 1) return -.5 * (a * this._easing.pow(2, 10 * (t -= 1)) * this._easing.sin((t * d - s) * (2 * this._easing.PI) / p)) + b;
        return a * this._easing.pow(2, -10 * (t -= 1)) * this._easing.sin((t * d - s) * (2 * this._easing.PI) / p) * .5 + c + b;
    };

}

class exp {

    private _easing: Easing;


    constructor(easing: Easing) {
        this._easing = easing;
    }

    public ease_in(t, b, c, d) {
        return (t == 0) ? b : c * this._easing.pow(2, 10 * (t / d - 1)) + b;
    };

    public ease_out(t, b, c, d) {
        return (t == d) ? b + c : c * (-this._easing.pow(2, -10 * t / d) + 1) + b;
    };

    public ease_both(t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * this._easing.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-this._easing.pow(2, -10 * --t) + 2) + b;
    };

}

class quadratic {

    private _easing: Easing;


    constructor(easing: Easing) {
        this._easing = easing;
    }

    public ease_in(t, b, c, d) {
        return c * (t /= d) * t + b;
    };

    public ease_out(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    };

    public ease_both(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    };

}

class quartic {

    private _easing: Easing;


    constructor(easing: Easing) {
        this._easing = easing;
    }

    

    public ease_in(t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    };

    public ease_out(t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    };

    public ease_both(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    };

}

class sine {

    private _easing: Easing;


    constructor(easing: Easing) {
        this._easing = easing;
    }

    public ease_in(t, b, c, d) {
        return -c * this._easing.cos(t / d * (this._easing.HALF_PI)) + c + b;
    }

    public ease_out(t, b, c, d) {
        return c * this._easing.sin(t / d * (this._easing.HALF_PI)) + b;
    }

    public ease_both (t, b, c, d) {
        return -c / 2 * (this._easing.cos(this._easing.PI * t / d) - 1) + b;
    }

}

class quintic {

    private _easing: Easing;


    constructor(easing: Easing) {
        this._easing = easing;
    }


    public ease_in(t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    };

    public ease_out(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    };

    public ease_both(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    };

}