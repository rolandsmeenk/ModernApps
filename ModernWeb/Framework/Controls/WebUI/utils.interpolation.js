var Interpolation = (function () {
    function Interpolation() { }
    Interpolation.prototype.Normalize = function (interpolation, min, max) {
        var range = max - min;
        var piece = (Math.max(min, Math.min(max, interpolation)) - min) / range;
        return piece;
    };
    Interpolation.prototype.easeInQuad = function (pos) {
        return Math.pow(pos, 2);
    };
    Interpolation.prototype.easeOutQuad = function (pos) {
        return -(Math.pow((pos - 1), 2) - 1);
    };
    Interpolation.prototype.easeInCubic = function (pos) {
        return Math.pow(pos, 3);
    };
    Interpolation.prototype.easeOutCubic = function (pos) {
        return (Math.pow((pos - 1), 3) + 1);
    };
    Interpolation.prototype.easeInExpo = function (pos) {
        return (pos == 0) ? 0 : Math.pow(2, 10 * (pos - 1));
    };
    Interpolation.prototype.easeOutExpo = function (pos) {
        return (pos == 1) ? 1 : -Math.pow(2, -10 * pos) + 1;
    };
    return Interpolation;
})();
