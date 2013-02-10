/// <reference path="..\..\..\UIRenderer.ts"/>
/// <reference path="..\..\..\Debugger.ts"/>
/// <reference path="..\wysihtml5.ts"/>

declare var $;

class Parser  {
   
    private NODE_TYPE_MAPPING: any;

      // Rename unknown tags to this
    private DEFAULT_NODE_NAME: string = "span";
    private WHITE_SPACE_REG_EXP: any = /\s+/;
    private defaultRules: any = { tags: {}, classes: {} };
    private currentRules:any = {};

    private wysihtml5: wysi;

    constructor(wysihtml5) {
        this.wysihtml5 = wysihtml5;

        this.wysihtml5.Debugger.Log("parse:constructor");

        this.HAS_GET_ATTRIBUTE_BUG = !wysihtml5.browser.supportsGetAttributeCorrectly();

        this.NODE_TYPE_MAPPING = {
            "1": this._handleElement,
            "3": this._handleText
        }

    }
    

    public parse(elementOrHtml, rules, context, cleanUp) {
        this.wysihtml5.lang.object(this.currentRules).merge(this.defaultRules).merge(rules).get();

        context = context || elementOrHtml.ownerDocument || document;
        var fragment = context.createDocumentFragment(),
            isString = typeof (elementOrHtml) === "string",
            element,
            newNode,
            firstChild;

        if (isString) {
            element = this.wysihtml5.dom.getAsDom(elementOrHtml, context);
        } else {
            element = elementOrHtml;
        }

        while (element.firstChild) {
            firstChild = element.firstChild;
            element.removeChild(firstChild);
            newNode = this._convert(firstChild, cleanUp);
            if (newNode) {
                fragment.appendChild(newNode);
            }
        }

        // Clear element contents
        element.innerHTML = "";

        // Insert new DOM tree
        element.appendChild(fragment);

        return isString ? this.wysihtml5.quirks.getCorrectInnerHTML(element) : element;
    }




    private _convert(oldNode, cleanUp) {
        var oldNodeType = oldNode.nodeType,
            oldChilds = oldNode.childNodes,
            oldChildsLength = oldChilds.length,
            newNode, 
            method = this.NODE_TYPE_MAPPING[oldNodeType],
            i = 0;

        newNode = method && method(oldNode);

        if (!newNode) {
            return null;
        }

        for (i = 0; i < oldChildsLength; i++) {
            var newChild = this._convert(oldChilds[i], cleanUp);
            if (newChild) {
                newNode.appendChild(newChild);
            }
        }

        // Cleanup senseless <span> elements
        if (cleanUp &&
            newNode.childNodes.length <= 1 &&
            newNode.nodeName.toLowerCase() === this.DEFAULT_NODE_NAME &&
            !newNode.attributes.length) {
            return newNode.firstChild;
        }

        return newNode;
    }

    private _handleElement(oldNode) {
        var rule,
            newNode,
            endTag,
            tagRules = this.currentRules.tags,
            nodeName = oldNode.nodeName.toLowerCase(),
            scopeName = oldNode.scopeName;

        /**
         * We already parsed that element
         * ignore it! (yes, this sometimes happens in IE8 when the html is invalid)
         */
        if (oldNode._wysihtml5) {
            return null;
        }
        oldNode._wysihtml5 = 1;

        if (oldNode.className === "wysihtml5-temp") {
            return null;
        }

        /**
         * IE is the only browser who doesn't include the namespace in the
         * nodeName, that's why we have to prepend it by ourselves
         * scopeName is a proprietary IE feature
         * read more here http://msdn.microsoft.com/en-us/library/ms534388(v=vs.85).aspx
         */
        if (scopeName && scopeName != "HTML") {
            nodeName = scopeName + ":" + nodeName;
        }

        /**
         * Repair node
         * IE is a bit bitchy when it comes to invalid nested markup which includes unclosed tags
         * A <p> doesn't need to be closed according HTML4-5 spec, we simply replace it with a <div> to preserve its content and layout
         */
        if ("outerHTML" in oldNode) {
            if (!this.wysihtml5.browser.autoClosesUnclosedTags() &&
                oldNode.nodeName === "P" &&
                oldNode.outerHTML.slice(-4).toLowerCase() !== "</p>") {
                nodeName = "div";
            }
        }

        if (nodeName in tagRules) {
            rule = tagRules[nodeName];
            if (!rule || rule.remove) {
                return null;
            }

            rule = typeof (rule) === "string" ? { rename_tag: rule } : rule;
        } else if (oldNode.firstChild) {
            rule = { rename_tag: this.DEFAULT_NODE_NAME };
        } else {
            // Remove empty unknown elements
            return null;
        }

        newNode = oldNode.ownerDocument.createElement(rule.rename_tag || nodeName);
        this._handleAttributes(oldNode, newNode, rule);

        oldNode = null;
        return newNode;
    }

    private _handleAttributes(oldNode, newNode, rule) {
        var attributes = {},                         // fresh new set of attributes to set on newNode
            setClass = rule.set_class,             // classes to set
            addClass = rule.add_class,             // add classes based on existing attributes
            setAttributes = rule.set_attributes,        // attributes to set on the current node
            checkAttributes = rule.check_attributes,      // check/convert values of attributes
            allowedClasses = this.currentRules.classes,
            i = 0,
            classes = [],
            newClasses = [],
            newUniqueClasses = [],
            oldClasses = [],
            classesLength,
            newClassesLength,
            currentClass,
            newClass,
            attributeName,
            newAttributeValue,
            method;

        if (setAttributes) {
            attributes = this.wysihtml5.lang.object(setAttributes).clone();
        }

        if (checkAttributes) {
            for (attributeName in checkAttributes) {
                method = this.attributeCheckMethods[checkAttributes[attributeName]];
                if (!method) {
                    continue;
                }
                newAttributeValue = method(this._getAttribute(oldNode, attributeName));
                if (typeof (newAttributeValue) === "string") {
                    attributes[attributeName] = newAttributeValue;
                }
            }
        }

        if (setClass) {
            classes.push(setClass);
        }

        if (addClass) {
            for (attributeName in addClass) {
                method = this.addClassMethods[addClass[attributeName]];
                if (!method) {
                    continue;
                }
                newClass = method(this._getAttribute(oldNode, attributeName));
                if (typeof (newClass) === "string") {
                    classes.push(newClass);
                }
            }
        }

        // make sure that wysihtml5 temp class doesn't get stripped out
        allowedClasses["_wysihtml5-temp-placeholder"] = 1;

        // add old classes last
        oldClasses = oldNode.getAttribute("class");
        if (oldClasses) {
            var oldClassName = oldClasses.toString();
            classes = classes.concat(oldClassName.split(this.WHITE_SPACE_REG_EXP));
        }
        classesLength = classes.length;
        for (; i < classesLength; i++) {
            currentClass = classes[i];
            if (allowedClasses[currentClass]) {
                newClasses.push(currentClass);
            }
        }

        // remove duplicate entries and preserve class specificity
        newClassesLength = newClasses.length;
        while (newClassesLength--) {
            currentClass = newClasses[newClassesLength];
            if (!this.wysihtml5.lang.array(newUniqueClasses).contains(currentClass)) {
                newUniqueClasses.unshift(currentClass);
            }
        }

        if (newUniqueClasses.length) {
            attributes["class"] = newUniqueClasses.join(" ");
        }

        // set attributes on newNode
        for (attributeName in attributes) {
            // Setting attributes can cause a js error in IE under certain circumstances
            // eg. on a <img> under https when it's new attribute value is non-https
            // TODO: Investigate this further and check for smarter handling
            try {
                newNode.setAttribute(attributeName, attributes[attributeName]);
            } catch (e) { }
        }

        // IE8 sometimes loses the width/height attributes when those are set before the "src"
        // so we make sure to set them again
        if (attributes["src"]) {
            if (typeof (attributes["width"]) !== "undefined") {
                newNode.setAttribute("width", attributes["width"]);
            }
            if (typeof (attributes["height"]) !== "undefined") {
                newNode.setAttribute("height", attributes["height"]);
            }
        }
    }









    private HAS_GET_ATTRIBUTE_BUG: any;
    private _getAttribute(node, attributeName) {
        attributeName = attributeName.toLowerCase();
        var nodeName = node.nodeName;
        if (nodeName == "IMG" && attributeName == "src" && this._isLoadedImage(node) === true) {
            // Get 'src' attribute value via object property since this will always contain the
            // full absolute url (http://...)
            // this fixes a very annoying bug in firefox (ver 3.6 & 4) and IE 8 where images copied from the same host
            // will have relative paths, which the sanitizer strips out (see attributeCheckMethods.url)
            return node.src;
        } else if (this.HAS_GET_ATTRIBUTE_BUG && "outerHTML" in node) {
            // Don't trust getAttribute/hasAttribute in IE 6-8, instead check the element's outerHTML
            var outerHTML = node.outerHTML.toLowerCase(),
                // TODO: This might not work for attributes without value: <input disabled>
                hasAttribute = outerHTML.indexOf(" " + attributeName + "=") != -1;

            return hasAttribute ? node.getAttribute(attributeName) : null;
        } else {
            return node.getAttribute(attributeName);
        }
    }





    private _isLoadedImage(node) {
        try {
            return node.complete && !node.mozMatchesSelector(":-moz-broken");
        } catch (e) {
            if (node.complete && node.readyState === "complete") {
                return true;
            }
        }
    }


    private _handleText(oldNode) {
        return oldNode.ownerDocument.createTextNode(oldNode.data);
    }



    private attributeCheckMethods: any = {
        url: (function () {
            var REG_EXP = /^https?:\/\//i;
            return function (attributeValue) {
                if (!attributeValue || !attributeValue.match(REG_EXP)) {
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
                if (!attributeValue) {
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



    private addClassMethods: any = {
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







}

