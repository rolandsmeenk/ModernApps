var Lang = (function () {
    function Lang(wysihtml5) {
        this.WHITE_SPACE_START = /^\s+/;
        this.WHITE_SPACE_END = /\s+$/;
        this._wysihtml5 = wysihtml5;
        this._wysihtml5.Debugger.Log("lang:constructor");
        this.array = function (arr) {
            return {
                contains: function (needle) {
                    if(arr.indexOf) {
                        return arr.indexOf(needle) !== -1;
                    } else {
                        for(var i = 0, length = arr.length; i < length; i++) {
                            if(arr[i] === needle) {
                                return true;
                            }
                        }
                        return false;
                    }
                },
                without: function (arrayToSubstract) {
                    arrayToSubstract = wysihtml5.lang.array(arrayToSubstract);
                    var newArr = [], i = 0, length = arr.length;
                    for(; i < length; i++) {
                        if(!arrayToSubstract.contains(arr[i])) {
                            newArr.push(arr[i]);
                        }
                    }
                    return newArr;
                },
                get: function () {
                    var i = 0, length = arr.length, newArray = [];
                    for(; i < length; i++) {
                        newArray.push(arr[i]);
                    }
                    return newArray;
                }
            };
        };
        this.string = function (str) {
            str = String(str);
            return {
                trim: function () {
                    return str.replace(this.WHITE_SPACE_START, "").replace(this.WHITE_SPACE_END, "");
                },
                interpolate: function (vars) {
                    for(var i in vars) {
                        str = this.replace("#{" + i + "}").by(vars[i]);
                    }
                    return str;
                },
                replace: function (search) {
                    return {
                        by: function (replace) {
                            return str.split(search).join(replace);
                        }
                    };
                }
            };
        };
    }
    Lang.prototype.object = function (obj) {
        return new objectEx(this._wysihtml5, obj);
    };
    return Lang;
})();
