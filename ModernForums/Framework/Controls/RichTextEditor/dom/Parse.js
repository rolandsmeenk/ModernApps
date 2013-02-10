var Parser = (function () {
    function Parser(wysihtml5) {
        this.DEFAULT_NODE_NAME = "span";
        this.WHITE_SPACE_REG_EXP = /\s+/;
        this.defaultRules = {
            tags: {
            },
            classes: {
            }
        };
        this.currentRules = {
        };
        this.attributeCheckMethods = {
            url: (function () {
                var REG_EXP = /^https?:\/\//i;
                return function (attributeValue) {
                    if(!attributeValue || !attributeValue.match(REG_EXP)) {
                        return null;
                    }
                    return attributeValue.replace(REG_EXP, function (match) {
                        return match.toLowerCase();
                    });
                };
            })(),
            alt: (function () {
                var REG_EXP = /[^ a-z0-9_\-]/gi;
                return function (attributeValue) {
                    if(!attributeValue) {
                        return "";
                    }
                    return attributeValue.replace(REG_EXP, "");
                };
            })(),
            numbers: (function () {
                var REG_EXP = /\D/g;
                return function (attributeValue) {
                    attributeValue = (attributeValue || "").replace(REG_EXP, "");
                    return attributeValue || null;
                };
            })()
        };
        this.addClassMethods = {
            align_img: (function () {
                var mapping = {
                    left: "wysiwyg-float-left",
                    right: "wysiwyg-float-right"
                };
                return function (attributeValue) {
                    return mapping[String(attributeValue).toLowerCase()];
                };
            })(),
            align_text: (function () {
                var mapping = {
                    left: "wysiwyg-text-align-left",
                    right: "wysiwyg-text-align-right",
                    center: "wysiwyg-text-align-center",
                    justify: "wysiwyg-text-align-justify"
                };
                return function (attributeValue) {
                    return mapping[String(attributeValue).toLowerCase()];
                };
            })(),
            clear_br: (function () {
                var mapping = {
                    left: "wysiwyg-clear-left",
                    right: "wysiwyg-clear-right",
                    both: "wysiwyg-clear-both",
                    all: "wysiwyg-clear-both"
                };
                return function (attributeValue) {
                    return mapping[String(attributeValue).toLowerCase()];
                };
            })(),
            size_font: (function () {
                var mapping = {
                    "1": "wysiwyg-font-size-xx-small",
                    "2": "wysiwyg-font-size-small",
                    "3": "wysiwyg-font-size-medium",
                    "4": "wysiwyg-font-size-large",
                    "5": "wysiwyg-font-size-x-large",
                    "6": "wysiwyg-font-size-xx-large",
                    "7": "wysiwyg-font-size-xx-large",
                    "-": "wysiwyg-font-size-smaller",
                    "+": "wysiwyg-font-size-larger"
                };
                return function (attributeValue) {
                    return mapping[String(attributeValue).charAt(0)];
                };
            })()
        };
        this.wysihtml5 = wysihtml5;
        this.wysihtml5.Debugger.Log("parse:constructor");
        this.HAS_GET_ATTRIBUTE_BUG = !wysihtml5.browser.supportsGetAttributeCorrectly();
        this.NODE_TYPE_MAPPING = {
            "1": this._handleElement,
            "3": this._handleText
        };
    }
    Parser.prototype.parse = function (elementOrHtml, rules, context, cleanUp) {
        this.wysihtml5.lang.object(this.currentRules).merge(this.defaultRules).merge(rules).get();
        context = context || elementOrHtml.ownerDocument || document;
        var fragment = context.createDocumentFragment(), isString = typeof (elementOrHtml) === "string", element, newNode, firstChild;
        if(isString) {
            element = this.wysihtml5.dom.getAsDom(elementOrHtml, context);
        } else {
            element = elementOrHtml;
        }
        while(element.firstChild) {
            firstChild = element.firstChild;
            element.removeChild(firstChild);
            newNode = this._convert(firstChild, cleanUp);
            if(newNode) {
                fragment.appendChild(newNode);
            }
        }
        element.innerHTML = "";
        element.appendChild(fragment);
        return isString ? this.wysihtml5.quirks.getCorrectInnerHTML(element) : element;
    };
    Parser.prototype._convert = function (oldNode, cleanUp) {
        var oldNodeType = oldNode.nodeType, oldChilds = oldNode.childNodes, oldChildsLength = oldChilds.length, newNode, method = this.NODE_TYPE_MAPPING[oldNodeType], i = 0;
        newNode = method && method(oldNode);
        if(!newNode) {
            return null;
        }
        for(i = 0; i < oldChildsLength; i++) {
            var newChild = this._convert(oldChilds[i], cleanUp);
            if(newChild) {
                newNode.appendChild(newChild);
            }
        }
        if(cleanUp && newNode.childNodes.length <= 1 && newNode.nodeName.toLowerCase() === this.DEFAULT_NODE_NAME && !newNode.attributes.length) {
            return newNode.firstChild;
        }
        return newNode;
    };
    Parser.prototype._handleElement = function (oldNode) {
        var rule, newNode, endTag, tagRules = this.currentRules.tags, nodeName = oldNode.nodeName.toLowerCase(), scopeName = oldNode.scopeName;
        if(oldNode._wysihtml5) {
            return null;
        }
        oldNode._wysihtml5 = 1;
        if(oldNode.className === "wysihtml5-temp") {
            return null;
        }
        if(scopeName && scopeName != "HTML") {
            nodeName = scopeName + ":" + nodeName;
        }
        if("outerHTML" in oldNode) {
            if(!this.wysihtml5.browser.autoClosesUnclosedTags() && oldNode.nodeName === "P" && oldNode.outerHTML.slice(-4).toLowerCase() !== "</p>") {
                nodeName = "div";
            }
        }
        if(nodeName in tagRules) {
            rule = tagRules[nodeName];
            if(!rule || rule.remove) {
                return null;
            }
            rule = typeof (rule) === "string" ? {
                rename_tag: rule
            } : rule;
        } else if(oldNode.firstChild) {
            rule = {
                rename_tag: this.DEFAULT_NODE_NAME
            };
        } else {
            return null;
        }
        newNode = oldNode.ownerDocument.createElement(rule.rename_tag || nodeName);
        this._handleAttributes(oldNode, newNode, rule);
        oldNode = null;
        return newNode;
    };
    Parser.prototype._handleAttributes = function (oldNode, newNode, rule) {
        var attributes = {
        }, setClass = rule.set_class, addClass = rule.add_class, setAttributes = rule.set_attributes, checkAttributes = rule.check_attributes, allowedClasses = this.currentRules.classes, i = 0, classes = [], newClasses = [], newUniqueClasses = [], oldClasses = [], classesLength, newClassesLength, currentClass, newClass, attributeName, newAttributeValue, method;
        if(setAttributes) {
            attributes = this.wysihtml5.lang.object(setAttributes).clone();
        }
        if(checkAttributes) {
            for(attributeName in checkAttributes) {
                method = this.attributeCheckMethods[checkAttributes[attributeName]];
                if(!method) {
                    continue;
                }
                newAttributeValue = method(this._getAttribute(oldNode, attributeName));
                if(typeof (newAttributeValue) === "string") {
                    attributes[attributeName] = newAttributeValue;
                }
            }
        }
        if(setClass) {
            classes.push(setClass);
        }
        if(addClass) {
            for(attributeName in addClass) {
                method = this.addClassMethods[addClass[attributeName]];
                if(!method) {
                    continue;
                }
                newClass = method(this._getAttribute(oldNode, attributeName));
                if(typeof (newClass) === "string") {
                    classes.push(newClass);
                }
            }
        }
        allowedClasses["_wysihtml5-temp-placeholder"] = 1;
        oldClasses = oldNode.getAttribute("class");
        if(oldClasses) {
            var oldClassName = oldClasses.toString();
            classes = classes.concat(oldClassName.split(this.WHITE_SPACE_REG_EXP));
        }
        classesLength = classes.length;
        for(; i < classesLength; i++) {
            currentClass = classes[i];
            if(allowedClasses[currentClass]) {
                newClasses.push(currentClass);
            }
        }
        newClassesLength = newClasses.length;
        while(newClassesLength--) {
            currentClass = newClasses[newClassesLength];
            if(!this.wysihtml5.lang.array(newUniqueClasses).contains(currentClass)) {
                newUniqueClasses.unshift(currentClass);
            }
        }
        if(newUniqueClasses.length) {
            attributes["class"] = newUniqueClasses.join(" ");
        }
        for(attributeName in attributes) {
            try  {
                newNode.setAttribute(attributeName, attributes[attributeName]);
            } catch (e) {
            }
        }
        if(attributes["src"]) {
            if(typeof (attributes["width"]) !== "undefined") {
                newNode.setAttribute("width", attributes["width"]);
            }
            if(typeof (attributes["height"]) !== "undefined") {
                newNode.setAttribute("height", attributes["height"]);
            }
        }
    };
    Parser.prototype._getAttribute = function (node, attributeName) {
        attributeName = attributeName.toLowerCase();
        var nodeName = node.nodeName;
        if(nodeName == "IMG" && attributeName == "src" && this._isLoadedImage(node) === true) {
            return node.src;
        } else if(this.HAS_GET_ATTRIBUTE_BUG && "outerHTML" in node) {
            var outerHTML = node.outerHTML.toLowerCase(), hasAttribute = outerHTML.indexOf(" " + attributeName + "=") != -1;
            return hasAttribute ? node.getAttribute(attributeName) : null;
        } else {
            return node.getAttribute(attributeName);
        }
    };
    Parser.prototype._isLoadedImage = function (node) {
        try  {
            return node.complete && !node.mozMatchesSelector(":-moz-broken");
        } catch (e) {
            if(node.complete && node.readyState === "complete") {
                return true;
            }
        }
    };
    Parser.prototype._handleText = function (oldNode) {
        return oldNode.ownerDocument.createTextNode(oldNode.data);
    };
    return Parser;
})();
