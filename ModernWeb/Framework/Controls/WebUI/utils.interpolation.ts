//declare var $;

class Interpolation
{
    // rips out a part of the interpolation factor, clamps, and renormalizes it
    // keeping things linear
    public Normalize(interpolation, min, max) {
        var range = max - min;
        var piece = (Math.max(min, Math.min(max, interpolation)) - min) / range;
        return piece;
    }

    // easing
    // [0,1] -> non-linear [0,1]

    public easeInQuad(pos) {
        return Math.pow(pos, 2);
    }

    public easeOutQuad(pos) {
        return -(Math.pow((pos - 1), 2) - 1);
    }

    public easeInCubic(pos) {
        return Math.pow(pos, 3);
    }

    public easeOutCubic(pos) {
        return (Math.pow((pos - 1), 3) + 1);
    }

    public easeInExpo(pos) {
        return (pos == 0) ? 0 : Math.pow(2, 10 * (pos - 1));
    }

    public easeOutExpo(pos) {
        return (pos == 1) ? 1 : -Math.pow(2, -10 * pos) + 1;
    }

}
