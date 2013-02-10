var Dom = (function () {
    function Dom(wysihtml5) {
        this.mapping = {
            "className": "class"
        };
        this._wysihtml5 = wysihtml5;
        this._wysihtml5.Debugger.Log("dom:constructor");
    }
    Dom.prototype.Start = function () {
        this.sandbox = new Sandbox(this._wysihtml5, null, null);
        this._wysihtml5.Debugger.Log("dom:Start - init sandbox");
        this.parser = new Parser(this._wysihtml5);
        this._wysihtml5.Debugger.Log("dom:Start - init parser");
        this.sandbox.Start();
        this._wysihtml5.Debugger.Log("dom:Start - sandbox started ...");
    };
    Dom.prototype.parse = function (elementOrHtml, rules, context, cleanUp) {
        this.parser.parse(elementOrHtml, rules, context, cleanUp);
    };
    Dom.prototype.setAttributes = function (attributes) {
        return {
            on: function (element) {
                for(var i in attributes) {
                    element.setAttribute(i, attributes[i]);
                }
            }
        };
    };
    Dom.prototype.contains = function (container, element) {
        var documentElement = document.documentElement;
        if(documentElement.contains) {
            return function (container, element) {
                if(element.nodeType !== this.wysihtml5.ELEMENT_NODE) {
                    element = element.parentNode;
                }
                return container !== element && container.contains(element);
            };
        } else if(documentElement.compareDocumentPosition) {
            return function (container, element) {
                return !!(container.compareDocumentPosition(element) & 16);
            };
        }
    };
    Dom.prototype.getAsDom = function (html, context) {
        var _innerHTMLShiv = function (html, context) {
            var tempElement = context.createElement("div");
            tempElement.style.display = "none";
            context.body.appendChild(tempElement);
            try  {
                tempElement.innerHTML = html;
            } catch (e) {
            }
            context.body.removeChild(tempElement);
            return tempElement;
        };
        var _ensureHTML5Compatibility = function (context) {
            if(context._wysihtml5_supportsHTML5Tags) {
                return;
            }
            for(var i = 0, length = HTML5_ELEMENTS.length; i < length; i++) {
                context.createElement(HTML5_ELEMENTS[i]);
            }
            context._wysihtml5_supportsHTML5Tags = true;
        };
        var HTML5_ELEMENTS = [
            "abbr", 
            "article", 
            "aside", 
            "audio", 
            "bdi", 
            "canvas", 
            "command", 
            "datalist", 
            "details", 
            "figcaption", 
            "figure", 
            "footer", 
            "header", 
            "hgroup", 
            "keygen", 
            "mark", 
            "meter", 
            "nav", 
            "output", 
            "progress", 
            "rp", 
            "rt", 
            "ruby", 
            "svg", 
            "section", 
            "source", 
            "summary", 
            "time", 
            "track", 
            "video", 
            "wbr"
        ];
        return function (html, context) {
            context = context || document;
            var tempElement;
            if(typeof (html) === "object" && html.nodeType) {
                tempElement = context.createElement("div");
                tempElement.appendChild(html);
            } else if(this.wysihtml5.browser.supportsHTML5Tags(context)) {
                tempElement = context.createElement("div");
                tempElement.innerHTML = html;
            } else {
                _ensureHTML5Compatibility(context);
                tempElement = _innerHTMLShiv(html, context);
            }
            return tempElement;
        };
    };
    Dom.prototype.replaceWithChildNodes = function (node) {
        if(!node.parentNode) {
            return;
        }
        if(!node.firstChild) {
            node.parentNode.removeChild(node);
            return;
        }
        var fragment = node.ownerDocument.createDocumentFragment();
        while(node.firstChild) {
            fragment.appendChild(node.firstChild);
        }
        node.parentNode.replaceChild(fragment, node);
        node = fragment = null;
    };
    Dom.prototype.addClass = function (element, className) {
        if(this.supportsClassList) {
            return element.classList.add(className);
        }
        if(this.hasClass(element, className)) {
            return;
        }
        element.className += " " + className;
    };
    Dom.prototype.removeClass = function (element, className) {
        if(this.supportsClassList) {
            return element.classList.remove(className);
        }
        element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ");
    };
    Dom.prototype.hasClass = function (element, className) {
        if(this.supportsClassList) {
            return element.classList.contains(className);
        }
        var elementClassName = element.className;
        return (elementClassName.length > 0 && (elementClassName == className || new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
    };
    Dom.prototype.observe = function (element, eventNames, handler) {
        eventNames = typeof (eventNames) === "string" ? [
            eventNames
        ] : eventNames;
        var handlerWrapper, eventName, i = 0, length = eventNames.length;
        for(; i < length; i++) {
            eventName = eventNames[i];
            if(element.addEventListener) {
                element.addEventListener(eventName, handler, false);
            } else {
                handlerWrapper = function (event) {
                    if(!("target" in event)) {
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
                var eventName, i = 0, length = eventNames.length;
                for(; i < length; i++) {
                    eventName = eventNames[i];
                    if(element.removeEventListener) {
                        element.removeEventListener(eventName, handler, false);
                    } else {
                        element.detachEvent("on" + eventName, handlerWrapper);
                    }
                }
            }
        };
    };
    return Dom;
})();
