Easing = (function () {
    var E = {
    };
    var abs = Math.abs, asin = Math.asin, cos = Math.cos, pow = Math.pow, sin = Math.sin, sqrt = Math.sqrt, PI = Math.PI, HALF_PI = Math.PI / 2;
    E = {
        VERSION: '0.1.0',
        DEFAULTS: {
            type: 'linear',
            side: 'none'
        },
        VALID: {
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
        }
    };
    E.Easer = function (o) {
        var key;
        for(key in E.DEFAULTS) {
            this[key] = E.DEFAULTS[key];
        }
        this.reset(o);
    };
    E.Easer.prototype.reset = function (o) {
        var key, name, type, side, err;
        for(key in o) {
            this[key] = o[key];
        }
        type = (this.side != 'none') ? this.type : 'linear';
        if(!E.VALID.type[type]) {
            throw new Error("unknown type: " + this.type);
        }
        side = (type != 'linear') ? this.side : 'none';
        if(!E.VALID.side[side]) {
            throw new Error("unknown side: " + this.side);
        }
        name = [
            'ease', 
            side
        ].join('_');
        this.fn = E[type] && E[type][name];
        if(!this.fn) {
            err = "type = " + this.type + ", side = " + this.side;
            throw new Error("unknown ease: " + err);
        }
    };
    E.Easer.prototype.ease = function (time_now, begin_val, change_val, time_dur) {
        return this.fn.apply(this, arguments);
    };
    E.linear = {
    };
    E.linear.ease_none = function (t, b, c, d) {
        return c * t / d + b;
    };
    E.back = {
    };
    var BACK_DEFAULT_S = 1.70158;
    E.back.ease_in = function (t, b, c, d, s) {
        if(s == undefined) {
            s = BACK_DEFAULT_S;
        }
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    };
    E.back.ease_out = function (t, b, c, d, s) {
        if(s == undefined) {
            s = BACK_DEFAULT_S;
        }
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    };
    E.back.ease_both = function (t, b, c, d, s) {
        if(s == undefined) {
            s = BACK_DEFAULT_S;
        }
        if((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    };
    E.bounce = {
    };
    var bounce_ratios = [
        1 / 2.75, 
        2 / 2.75, 
        2.5 / 2.75
    ];
    var bounce_factors = [
        null, 
        1.5 / 2.75, 
        2.25 / 2.75, 
        2.625 / 2.75
    ];
    E.bounce.ease_out = function (t, b, c, d) {
        if((t /= d) < (bounce_ratios[0])) {
            return c * (7.5625 * t * t) + b;
        } else if(t < (bounce_ratios[1])) {
            return c * (7.5625 * (t -= (bounce_factors[1])) * t + 0.75) + b;
        } else if(t < (bounce_ratios[2])) {
            return c * (7.5625 * (t -= (bounce_factors[2])) * t + 0.9375) + b;
        } else {
            return c * (7.5625 * (t -= (bounce_factors[3])) * t + 0.984375) + b;
        }
    };
    E.bounce.ease_in = function (t, b, c, d) {
        return c - E.bounce.ease_out(d - t, 0, c, d) + b;
    };
    E.bounce.ease_both = function (t, b, c, d) {
        if(t < d / 2) {
            return E.bounce.ease_in(t * 2, 0, c, d) * 0.5 + b;
        } else {
            return E.bounce.ease_out(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
        }
    };
    E.circular = {
    };
    E.circular.ease_in = function (t, b, c, d) {
        return -c * (sqrt(1 - (t /= d) * t) - 1) + b;
    };
    E.circular.ease_out = function (t, b, c, d) {
        return c * sqrt(1 - (t = t / d - 1) * t) + b;
    };
    E.circular.ease_both = function (t, b, c, d) {
        if((t /= d / 2) < 1) {
            return -c / 2 * (sqrt(1 - t * t) - 1) + b;
        }
        return c / 2 * (sqrt(1 - (t -= 2) * t) + 1) + b;
    };
    E.cubic = {
    };
    E.cubic.ease_in = function (t, b, c, d) {
        return c * (t /= d) * t * t + b;
    };
    E.cubic.ease_out = function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    };
    E.cubic.ease_both = function (t, b, c, d) {
        if((t /= d / 2) < 1) {
            return c / 2 * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    };
    E.elastic = {
    };
    E.elastic.ease_in = function (t, b, c, d, a, p) {
        if(t == 0) {
            return b;
        }
        if((t /= d) == 1) {
            return b + c;
        }
        if(!p) {
            p = d * 0.3;
        }
        if(!a || a < abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * PI) * asin(c / a);
        }
        return -(a * pow(2, 10 * (t -= 1)) * sin((t * d - s) * (2 * PI) / p)) + b;
    };
    E.elastic.ease_out = function (t, b, c, d, a, p) {
        if(t == 0) {
            return b;
        }
        if((t /= d) == 1) {
            return b + c;
        }
        if(!p) {
            p = d * 0.3;
        }
        if(!a || a < abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * PI) * asin(c / a);
        }
        return (a * pow(2, -10 * t) * sin((t * d - s) * (2 * PI) / p) + c + b);
    };
    E.elastic.ease_both = function (t, b, c, d, a, p) {
        if(t == 0) {
            return b;
        }
        if((t /= d / 2) == 2) {
            return b + c;
        }
        if(!p) {
            p = d * (0.3 * 1.5);
        }
        if(!a || a < abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p / (2 * PI) * asin(c / a);
        }
        if(t < 1) {
            return -0.5 * (a * pow(2, 10 * (t -= 1)) * sin((t * d - s) * (2 * PI) / p)) + b;
        }
        return a * pow(2, -10 * (t -= 1)) * sin((t * d - s) * (2 * PI) / p) * 0.5 + c + b;
    };
    E.exp = {
    };
    E.exp.ease_in = function (t, b, c, d) {
        return (t == 0) ? b : c * pow(2, 10 * (t / d - 1)) + b;
    };
    E.exp.ease_out = function (t, b, c, d) {
        return (t == d) ? b + c : c * (-pow(2, -10 * t / d) + 1) + b;
    };
    E.exp.ease_both = function (t, b, c, d) {
        if(t == 0) {
            return b;
        }
        if(t == d) {
            return b + c;
        }
        if((t /= d / 2) < 1) {
            return c / 2 * pow(2, 10 * (t - 1)) + b;
        }
        return c / 2 * (-pow(2, -10 * --t) + 2) + b;
    };
    E.quadratic = {
    };
    E.quadratic.ease_in = function (t, b, c, d) {
        return c * (t /= d) * t + b;
    };
    E.quadratic.ease_out = function (t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    };
    E.quadratic.ease_both = function (t, b, c, d) {
        if((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    };
    E.quartic = {
    };
    E.quartic.ease_in = function (t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    };
    E.quartic.ease_out = function (t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    };
    E.quartic.ease_both = function (t, b, c, d) {
        if((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    };
    E.quintic = {
    };
    E.quintic.ease_in = function (t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    };
    E.quintic.ease_out = function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    };
    E.quintic.ease_both = function (t, b, c, d) {
        if((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    };
    E.sine = {
    };
    E.sine.ease_in = function (t, b, c, d) {
        return -c * cos(t / d * (HALF_PI)) + c + b;
    };
    E.sine.ease_out = function (t, b, c, d) {
        return c * sin(t / d * (HALF_PI)) + b;
    };
    E.sine.ease_both = function (t, b, c, d) {
        return -c / 2 * (cos(PI * t / d) - 1) + b;
    };
    return E;
})();
