/// <reference path="..\..\..\UIRenderer.ts"/>
/// <reference path="..\..\..\Debugger.ts"/>
/// <reference path="..\wysihtml5.ts"/>
/// <reference path="Sandbox.ts"/>
/// <reference path="Parse.ts"/>

declare var $;

class Dom  {
   
    
    private supportsClassList: any; // = wysihtml5.browser.supportsClassList(),
    private api: any;  //= wysihtml5.dom;
    private _wysihtml5: wysihtml5;
    public sandbox: Sandbox;
    public parser: Parser;

    private mapping = {
        "className": "class"
    };



    constructor(wysihtml5: wysihtml5) {
        this._wysihtml5 = wysihtml5;
        this.sandbox = new Sandbox(wysihtml5, null, null);
        this.parser = new Parser(wysihtml5);
    }


    public parse(elementOrHtml, rules, context, cleanUp) {
        this.parser.parse(elementOrHtml, rules, context, cleanUp);
    }













    public setAttributes(attributes) {
        return {
            on: function (element) {
                for (var i in attributes) {
                    element.setAttribute(this.mapping[i] || i, attributes[i]);
                }
            }
        }
    }










    public contains(container, element) {
        var documentElement = document.documentElement;
        if (documentElement.contains) {
            return function (container, element) {
                if (element.nodeType !== this.wysihtml5.ELEMENT_NODE) {
                    element = element.parentNode;
                }
                return container !== element && container.contains(element);
            };
        } else if (documentElement.compareDocumentPosition) {
            return function (container, element) {
                // https://developer.mozilla.org/en/DOM/Node.compareDocumentPosition
                return !!(container.compareDocumentPosition(element) & 16);
            };
        }

    }

















    public getAsDom(html, context) {

        var _innerHTMLShiv = function (html, context) {
            var tempElement = context.createElement("div");
            tempElement.style.display = "none";
            context.body.appendChild(tempElement);
            // IE throws an exception when trying to insert <frameset></frameset> via innerHTML
            try { tempElement.innerHTML = html; } catch (e) { }
            context.body.removeChild(tempElement);
            return tempElement;
        };

        /**
         * Make sure IE supports HTML5 tags, which is accomplished by simply creating one instance of each element
         */
        var _ensureHTML5Compatibility = function (context) {
            if (context._wysihtml5_supportsHTML5Tags) {
                return;
            }
            for (var i = 0, length = HTML5_ELEMENTS.length; i < length; i++) {
                context.createElement(HTML5_ELEMENTS[i]);
            }
            context._wysihtml5_supportsHTML5Tags = true;
        };


        /**
         * List of html5 tags
         * taken from http://simon.html5.org/html5-elements
         */
        var HTML5_ELEMENTS = [
          "abbr", "article", "aside", "audio", "bdi", "canvas", "command", "datalist", "details", "figcaption",
          "figure", "footer", "header", "hgroup", "keygen", "mark", "meter", "nav", "output", "progress",
          "rp", "rt", "ruby", "svg", "section", "source", "summary", "time", "track", "video", "wbr"
        ];

        return function (html, context) {
            context = context || document;
            var tempElement;
            if (typeof (html) === "object" && html.nodeType) {
                tempElement = context.createElement("div");
                tempElement.appendChild(html);
            } else if (this.wysihtml5.browser.supportsHTML5Tags(context)) {
                tempElement = context.createElement("div");
                tempElement.innerHTML = html;
            } else {
                _ensureHTML5Compatibility(context);
                tempElement = _innerHTMLShiv(html, context);
            }
            return tempElement;
        };
    }





















    public replaceWithChildNodes (node) {
        if (!node.parentNode) {
            return;
        }

        if (!node.firstChild) {
            node.parentNode.removeChild(node);
            return;
        }

        var fragment = node.ownerDocument.createDocumentFragment();
        while (node.firstChild) {
            fragment.appendChild(node.firstChild);
        }
        node.parentNode.replaceChild(fragment, node);
        node = fragment = null;
    }




    public addClass(element, className) {
        if (this.supportsClassList) {
            return element.classList.add(className);
        }
        if (this.hasClass(element, className)) {
            return;
        }
        element.className += " " + className;
    };

    public removeClass (element, className) {
        if (this.supportsClassList) {
            return element.classList.remove(className);
        }

        element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ");
    };

    public hasClass(element, className) {
        if (this.supportsClassList) {
            return element.classList.contains(className);
        }

        var elementClassName = element.className;
        return (elementClassName.length > 0 && (elementClassName == className || new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
    };




    /**
     * Method to set dom events
     *
     * @example
     *    wysihtml5.dom.observe(iframe.contentWindow.document.body, ["focus", "blur"], function() { ... });
     */
    public observe(element, eventNames, handler) {
        eventNames = typeof (eventNames) === "string" ? [eventNames] : eventNames;

        var handlerWrapper,
            eventName,
            i = 0,
            length = eventNames.length;

        for (; i < length; i++) {
            eventName = eventNames[i];
            if (element.addEventListener) {
                element.addEventListener(eventName, handler, false);
            } else {
                handlerWrapper = function (event) {
                    if (!("target" in event)) {
                        event.target = event.srcElement;
                    }
                    event.preventDefault = event.preventDefault || function () {
                        this.returnValue = false;
                    };
                    event.stopPropagation = event.stopPropagation || function () {
                        this.cancelBubble = true;
                    };
                    handler.call(element, event);
                };
                element.attachEvent("on" + eventName, handlerWrapper);
            }
        }

        return {
            stop: function () {
                var eventName,
                    i = 0,
                    length = eventNames.length;
                for (; i < length; i++) {
                    eventName = eventNames[i];
                    if (element.removeEventListener) {
                        element.removeEventListener(eventName, handler, false);
                    } else {
                        element.detachEvent("on" + eventName, handlerWrapper);
                    }
                }
            }
        };
    };


}

