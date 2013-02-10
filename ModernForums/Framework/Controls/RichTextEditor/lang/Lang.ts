/// <reference path="..\..\..\UIRenderer.ts"/>
/// <reference path="..\..\..\Debugger.ts"/>

/// <reference path="..\wysihtml5.ts"/>
/// <reference path="object.ts"/>


declare var $;

class Lang  {
    private _wysihtml5: wysi;
    public array: any;
    public string: any;
    public Dispatcher: any;


    private WHITE_SPACE_START : any = /^\s+/;
    private WHITE_SPACE_END : any = /\s+$/;


    constructor(wysihtml5: wysi) {
        this._wysihtml5 = wysihtml5;
        this._wysihtml5.Debugger.Log("lang:constructor");
        this.array = function(arr) {
            return {
                /**
                 * Check whether a given object exists in an array
                 *
                 * @example
                 *    wysihtml5.lang.array([1, 2]).contains(1);
                 *    // => true
                 */
                contains: function (needle) {
                    if (arr.indexOf) {
                        return arr.indexOf(needle) !== -1;
                    } else {
                        for (var i = 0, length = arr.length; i < length; i++) {
                            if (arr[i] === needle) { return true; }
                        }
                        return false;
                    }
                },

                /**
                 * Substract one array from another
                 *
                 * @example
                 *    wysihtml5.lang.array([1, 2, 3, 4]).without([3, 4]);
                 *    // => [1, 2]
                 */
                without: function (arrayToSubstract) {
                    arrayToSubstract = wysihtml5.lang.array(arrayToSubstract);
                    var newArr = [],
                        i = 0,
                        length = arr.length;
                    for (; i < length; i++) {
                        if (!arrayToSubstract.contains(arr[i])) {
                            newArr.push(arr[i]);
                        }
                    }
                    return newArr;
                },

                /**
                 * Return a clean native array
                 * 
                 * Following will convert a Live NodeList to a proper Array
                 * @example
                 *    var childNodes = wysihtml5.lang.array(document.body.childNodes).get();
                 */
                get: function () {
                    var i = 0,
                        length = arr.length,
                        newArray = [];
                    for (; i < length; i++) {
                        newArray.push(arr[i]);
                    }
                    return newArray;
                }
            };
        };





        this.string = function (str) {
            str = String(str);
            return {
                /**
                 * @example
                 *    wysihtml5.lang.string("   foo   ").trim();
                 *    // => "foo"
                 */
                trim: function () {
                    return str.replace(this.WHITE_SPACE_START, "").replace(this.WHITE_SPACE_END, "");
                },

                /**
                 * @example
                 *    wysihtml5.lang.string("Hello #{name}").interpolate({ name: "Christopher" });
                 *    // => "Hello Christopher"
                 */
                interpolate: function (vars) {
                    for (var i in vars) {
                        str = this.replace("#{" + i + "}").by(vars[i]);
                    }
                    return str;
                },

                /**
                 * @example
                 *    wysihtml5.lang.string("Hello Tom").replace("Tom").with("Hans");
                 *    // => "Hello Hans"
                 */
                replace: function (search) {
                    return {
                        by: function (replace) {
                            return str.split(search).join(replace);
                        }
                    }
                }
            };
        };






        






        //this.Dispatcher = Base.extend(
        //  /** @scope wysihtml5.lang.Dialog.prototype */ {
        //      observe: function (eventName, handler) {
        //          this.events = this.events || {};
        //          this.events[eventName] = this.events[eventName] || [];
        //          this.events[eventName].push(handler);
        //          return this;
        //      },

        //      on: function () {
        //          return this.observe.apply(this, wysihtml5.lang.array(arguments).get());
        //      },

        //      fire: function (eventName, payload) {
        //          this.events = this.events || {};
        //          var handlers = this.events[eventName] || [],
        //              i = 0;
        //          for (; i < handlers.length; i++) {
        //              handlers[i].call(this, payload);
        //          }
        //          return this;
        //      },

        //      stopObserving: function (eventName, handler) {
        //          this.events = this.events || {};
        //          var i = 0,
        //              handlers,
        //              newHandlers;
        //          if (eventName) {
        //              handlers = this.events[eventName] || [],
        //              newHandlers = [];
        //              for (; i < handlers.length; i++) {
        //                  if (handlers[i] !== handler && handler) {
        //                      newHandlers.push(handlers[i]);
        //                  }
        //              }
        //              this.events[eventName] = newHandlers;
        //          } else {
        //              // Clean up all events
        //              this.events = {};
        //          }
        //          return this;
        //      }
        //  });










    }

    public object(obj) {
        return new objectEx(this._wysihtml5, obj);
    }


}



