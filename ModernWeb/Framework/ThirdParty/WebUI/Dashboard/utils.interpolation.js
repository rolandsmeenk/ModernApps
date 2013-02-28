
function Interpolation() { }

// rips out a part of the interpolation factor, clamps, and renormalizes it
// keeping things linear
Interpolation.Normalize = function (interpolation, min, max)
{
    var range = max - min;
    var piece = (Math.max(min, Math.min(max, interpolation)) - min) / range;
    return piece;
}

// easing
// [0,1] -> non-linear [0,1]

Interpolation.easeInQuad = function (pos)
{
    return Math.pow(pos, 2);
}

Interpolation.easeOutQuad = function (pos)
{
    return -(Math.pow((pos - 1), 2) - 1);
}

Interpolation.easeInCubic = function (pos)
{
    return Math.pow(pos, 3);
}
Interpolation.easeOutCubic = function (pos)
{
    return (Math.pow((pos - 1), 3) + 1);
}
Interpolation.easeInExpo = function (pos)
{
    return (pos == 0) ? 0 : Math.pow(2, 10 * (pos - 1));
}
Interpolation.easeOutExpo = function (pos)
{
    return (pos == 1) ? 1 : -Math.pow(2, -10 * pos) + 1;
}