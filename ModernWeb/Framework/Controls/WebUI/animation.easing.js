var Easing = (function () {
    function Easing(o) {
        this.abs = Math.abs;
        this.asin = Math.asin;
        this.cos = Math.cos;
        this.pow = Math.pow;
        this.sin = Math.sin;
        this.sqrt = Math.sqrt;
        this.PI = Math.PI;
        this.HALF_PI = Math.PI / 2;
        this.VERSION = '0.1.0';
        this.DEFAULTS = {
            type: 'linear',
            side: 'none'
        };
        this.VALID = {
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
        alert(this[o.type]["ease_" + o.side]);
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
    return Easing;
})();
var linear = (function () {
    function linear(easing) {
        this._easing = easing;
    }
    linear.prototype.ease_none = function (t, b, c, d) {
        return c * t / d + b;
    };
    return linear;
})();
var back = (function () {
    function back(easing) {
        this.BACK_DEFAULT_S = 1.70158;
        this._easing = easing;
    }
    back.prototype.ease_in = function (t, b, c, d, s) {
        if(s == undefined) {
            s = this.BACK_DEFAULT_S;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    };
    back.prototype.ease_out = function (t, b, c, d, s) {
        if(s == undefined) {
            s = this.BACK_DEFAULT_S;
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    };
    back.prototype.ease_both = function (t, b, c, d, s) {
        if(s == undefined) {
            s = this.BACK_DEFAULT_S;
        }
        if((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    };
    return back;
})();
var bounce = (function () {
    function bounce(easing) {
        this.bounce_ratios = [
            1 / 2.75, 
            2 / 2.75, 
            2.5 / 2.75
        ];
        this.bounce_factors = [
            null, 
            1.5 / 2.75, 
            2.25 / 2.75, 
            2.625 / 2.75
        ];
        this._easing = easing;
    }
    bounce.prototype.ease_out = function (t, b, c, d) {
        if((t /= d) < (this.bounce_ratios[0])) {
            return c * (7.5625 * t * t) + b;
        } else if(t < (this.bounce_ratios[1])) {
            return c * (7.5625 * (t -= (this.bounce_factors[1])) * t + 0.75) + b;
        } else if(t < (this.bounce_ratios[2])) {
            return c * (7.5625 * (t -= (this.bounce_factors[2])) * t + 0.9375) + b;
        } else {
            return c * (7.5625 * (t -= (this.bounce_factors[3])) * t + 0.984375) + b;
        }
    };
    bounce.prototype.ease_in = function (t, b, c, d) {
        return c - this._easing.bounce.ease_out(d - t, 0, c, d) + b;
    };
    bounce.prototype.ease_both = function (t, b, c, d) {
        if(t < d / 2) {
            return this._easing.bounce.ease_in(t * 2, 0, c, d) * 0.5 + b;
        } else {
            return this._easing.bounce.ease_out(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
        }
    };
    return bounce;
})();
var circular = (function () {
    function circular(easing) {
        this._easing = easing;
    }
    circular.prototype.ease_in = function (t, b, c, d) {
        return -c * (this._easing.sqrt(1 - (t /= d) * t) - 1) + b;
    };
    circular.prototype.ease_out = function (t, b, c, d) {
        return c * this._easing.sqrt(1 - (t = t / d - 1) * t) + b;
    };
    circular.prototype.ease_both = function (t, b, c, d) {
        if((t /= d / 2) < 1) {
            return -c / 2 * (this._easing.sqrt(1 - t * t) - 1) + b;
        }
        return c / 2 * (this._easing.sqrt(1 - (t -= 2) * t) + 1) + b;
    };
    return circular;
})();
var cubic = (function () {
    function cubic(easing) {
        this._easing = easing;
    }
    cubic.prototype.ease_in = function (t, b, c, d) {
        return c * (t /= d) * t * t + b;
    };
    cubic.prototype.ease_out = function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    };
    cubic.prototype.ease_both = function (t, b, c, d) {
        if((t /= d / 2) < 1) {
            return c / 2 * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    };
    return cubic;
})();
var elastic = (function () {
    function elastic(easing) {
        this._easing = easing;
    }
    elastic.prototype.ease_in = function (t, b, c, d, a, p) {
        if(t == 0) {
            return b;
        }
        if((t /= d) == 1) {
            return b + c;
        }
        if(!p) {
            p = d * 0.3;
        }
        if(!a || a < this._easing.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * this._easing.PI) * this._easing.asin(c / a);
        }
        return -(a * this._easing.pow(2, 10 * (t -= 1)) * this._easing.sin((t * d - s) * (2 * this._easing.PI) / p)) + b;
    };
    elastic.prototype.ease_out = function (t, b, c, d, a, p) {
        if(t == 0) {
            return b;
        }
        if((t /= d) == 1) {
            return b + c;
        }
        if(!p) {
            p = d * 0.3;
        }
        if(!a || a < this._easing.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * this._easing.PI) * this._easing.asin(c / a);
        }
        return (a * this._easing.pow(2, -10 * t) * this._easing.sin((t * d - s) * (2 * this._easing.PI) / p) + c + b);
    };
    elastic.prototype.ease_both = function (t, b, c, d, a, p) {
        if(t == 0) {
            return b;
        }
        if((t /= d / 2) == 2) {
            return b + c;
        }
        if(!p) {
            p = d * (0.3 * 1.5);
        }
        if(!a || a < this._easing.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * this._easing.PI) * this._easing.asin(c / a);
        }
        if(t < 1) {
            return -0.5 * (a * this._easing.pow(2, 10 * (t -= 1)) * this._easing.sin((t * d - s) * (2 * this._easing.PI) / p)) + b;
        }
        return a * this._easing.pow(2, -10 * (t -= 1)) * this._easing.sin((t * d - s) * (2 * this._easing.PI) / p) * 0.5 + c + b;
    };
    return elastic;
})();
var exp = (function () {
    function exp(easing) {
        this._easing = easing;
    }
    exp.prototype.ease_in = function (t, b, c, d) {
        return (t == 0) ? b : c * this._easing.pow(2, 10 * (t / d - 1)) + b;
    };
    exp.prototype.ease_out = function (t, b, c, d) {
        return (t == d) ? b + c : c * (-this._easing.pow(2, -10 * t / d) + 1) + b;
    };
    exp.prototype.ease_both = function (t, b, c, d) {
        if(t == 0) {
            return b;
        }
        if(t == d) {
            return b + c;
        }
        if((t /= d / 2) < 1) {
            return c / 2 * this._easing.pow(2, 10 * (t - 1)) + b;
        }
        return c / 2 * (-this._easing.pow(2, -10 * --t) + 2) + b;
    };
    return exp;
})();
var quadratic = (function () {
    function quadratic(easing) {
        this._easing = easing;
    }
    quadratic.prototype.ease_in = function (t, b, c, d) {
        return c * (t /= d) * t + b;
    };
    quadratic.prototype.ease_out = function (t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    };
    quadratic.prototype.ease_both = function (t, b, c, d) {
        if((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    };
    return quadratic;
})();
var quartic = (function () {
    function quartic(easing) {
        this._easing = easing;
    }
    quartic.prototype.ease_in = function (t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    };
    quartic.prototype.ease_out = function (t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    };
    quartic.prototype.ease_both = function (t, b, c, d) {
        if((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    };
    return quartic;
})();
var sine = (function () {
    function sine(easing) {
        this._easing = easing;
    }
    sine.prototype.ease_in = function (t, b, c, d) {
        return -c * this._easing.cos(t / d * (this._easing.HALF_PI)) + c + b;
    };
    sine.prototype.ease_out = function (t, b, c, d) {
        return c * this._easing.sin(t / d * (this._easing.HALF_PI)) + b;
    };
    sine.prototype.ease_both = function (t, b, c, d) {
        return -c / 2 * (this._easing.cos(this._easing.PI * t / d) - 1) + b;
    };
    return sine;
})();
var quintic = (function () {
    function quintic(easing) {
        this._easing = easing;
    }
    quintic.prototype.ease_in = function (t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    };
    quintic.prototype.ease_out = function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    };
    quintic.prototype.ease_both = function (t, b, c, d) {
        if((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    };
    return quintic;
})();
