var objectEx = (function () {
    function objectEx(wysi, obj) {
        this._wysihtml5 = wysi;
        this._obj = obj;
    }
    objectEx.prototype.merge = function (otherObj) {
        for(var i in otherObj) {
            this._obj[i] = otherObj[i];
        }
        return this;
    };
    objectEx.prototype.get = function () {
        return this._obj;
    };
    objectEx.prototype.clone = function () {
        var newObj = {
        }, i;
        for(i in this._obj) {
            newObj[i] = this._obj[i];
        }
        return newObj;
    };
    objectEx.prototype.isArray = function () {
        return Object.prototype.toString.call(this._obj) === "[object Array]";
    };
    return objectEx;
})();
