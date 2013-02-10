/// <reference path="..\..\..\UIRenderer.ts"/>
/// <reference path="..\..\..\Debugger.ts"/>

/// <reference path="..\wysihtml5.ts"/>

declare var $;

class objectEx  {
    private _wysihtml5: wysi;
    private _obj: any;

    constructor(wysi, obj) {
        this._wysihtml5 = wysi;
        this._obj = obj;
    }

    public merge(otherObj) {
        for (var i in otherObj) {
            this._obj[i] = otherObj[i];
        }
        return this;
    }

    public get () {

        return this._obj;
    }

    public clone() {
        var newObj = {},
            i;
        for (i in this._obj) {
            newObj[i] = this._obj[i];
        }
        return newObj;
    }

    public isArray() {
        return Object.prototype.toString.call(this._obj) === "[object Array]";
    }



}



