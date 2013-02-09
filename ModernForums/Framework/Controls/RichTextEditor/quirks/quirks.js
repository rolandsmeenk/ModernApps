var Quirks = (function () {
    function Quirks(wysihtml5) {
        this.TILDE_ESCAPED = "%7E";
        this.REDRAW_CLASS_NAME = "wysihtml5-quirks-redraw";
        this.USE_NATIVE_LINE_BREAK_WHEN_CARET_INSIDE_TAGS = [
            "LI", 
            "P", 
            "H1", 
            "H2", 
            "H3", 
            "H4", 
            "H5", 
            "H6"
        ];
        this.LIST_TAGS = [
            "UL", 
            "OL", 
            "MENU"
        ];
        this._wysihtml5 = wysihtml5;
        this._defaultRulesPastedHtml = {
            "a u": this._wysihtml5.dom.replaceWithChildNodes
        };
    }
    Quirks.prototype.insertLineBreakOnReturn = function (composer) {
        function unwrap(selectedNode) {
            var parentElement = this._wysihtml5.dom.getParentElement(selectedNode, {
                nodeName: [
                    "P", 
                    "DIV"
                ]
            }, 2);
            if(!parentElement) {
                return;
            }
            var invisibleSpace = document.createTextNode(this.INVISIBLE_SPACE);
            this._wysihtml5.dom.insert(invisibleSpace).before(parentElement);
            this._wysihtml5.dom.replaceWithChildNodes(parentElement);
            composer.selection.selectNode(invisibleSpace);
        }
        function keyDown(event) {
            var keyCode = event.keyCode;
            if(event.shiftKey || (keyCode !== this._wysihtml5.ENTER_KEY && keyCode !== this._wysihtml5.BACKSPACE_KEY)) {
                return;
            }
            var element = event.target, selectedNode = composer.selection.getSelectedNode(), blockElement = this._wysihtml5.dom.getParentElement(selectedNode, {
                nodeName: this.USE_NATIVE_LINE_BREAK_WHEN_CARET_INSIDE_TAGS
            }, 4);
            if(blockElement) {
                if(blockElement.nodeName === "LI" && (keyCode === this._wysihtml5.ENTER_KEY || keyCode === this._wysihtml5.BACKSPACE_KEY)) {
                    setTimeout(function () {
                        var selectedNode = composer.selection.getSelectedNode(), list, div;
                        if(!selectedNode) {
                            return;
                        }
                        list = this._wysihtml5.dom.getParentElement(selectedNode, {
                            nodeName: this.LIST_TAGS
                        }, 2);
                        if(list) {
                            return;
                        }
                        unwrap(selectedNode);
                    }, 0);
                } else if(blockElement.nodeName.match(/H[1-6]/) && keyCode === this._wysihtml5.ENTER_KEY) {
                    setTimeout(function () {
                        unwrap(composer.selection.getSelectedNode());
                    }, 0);
                }
                return;
            }
            if(keyCode === this._wysihtml5.ENTER_KEY && !this._wysihtml5.browser.insertsLineBreaksOnReturn()) {
                composer.commands.exec("insertLineBreak");
                event.preventDefault();
            }
        }
        this._wysihtml5.dom.observe(composer.element.ownerDocument, "keydown", keyDown);
    };
    Quirks.prototype.ensureProperClearing = function (composer) {
        var clearIfNecessary = function (event) {
            var element = this;
            setTimeout(function () {
                var innerHTML = element.innerHTML.toLowerCase();
                if(innerHTML == "<p>&nbsp;</p>" || innerHTML == "<p>&nbsp;</p><p>&nbsp;</p>") {
                    element.innerHTML = "";
                }
            }, 0);
        };
        return function (composer) {
            this._wysihtml5.dom.observe(composer.element, [
                "cut", 
                "keydown"
            ], clearIfNecessary);
        };
    };
    Quirks.prototype.ensureProperClearingOfLists = function (composer) {
        var ELEMENTS_THAT_CONTAIN_LI = [
            "OL", 
            "UL", 
            "MENU"
        ];
        var clearIfNecessary = function (element, contentEditableElement) {
            if(!contentEditableElement.firstChild || !this._wysihtml5.lang.array(ELEMENTS_THAT_CONTAIN_LI).contains(contentEditableElement.firstChild.nodeName)) {
                return;
            }
            var list = this._wysihtml5.dom.getParentElement(element, {
                nodeName: ELEMENTS_THAT_CONTAIN_LI
            });
            if(!list) {
                return;
            }
            var listIsFirstChildOfContentEditable = list == contentEditableElement.firstChild;
            if(!listIsFirstChildOfContentEditable) {
                return;
            }
            var hasOnlyOneListItem = list.childNodes.length <= 1;
            if(!hasOnlyOneListItem) {
                return;
            }
            var onlyListItemIsEmpty = list.firstChild ? list.firstChild.innerHTML === "" : true;
            if(!onlyListItemIsEmpty) {
                return;
            }
            list.parentNode.removeChild(list);
        };
        return function (composer) {
            this._wysihtml5.dom.observe(composer.element, "keydown", function (event) {
                if(event.keyCode !== this._wysihtml5.BACKSPACE_KEY) {
                    return;
                }
                var element = composer.selection.getSelectedNode();
                clearIfNecessary(element, composer.element);
            });
        };
    };
    Quirks.prototype.getCorrectInnerHTML = function (element) {
        var innerHTML = element.innerHTML;
        if(innerHTML.indexOf(this.TILDE_ESCAPED) === -1) {
            return innerHTML;
        }
        var elementsWithTilde = element.querySelectorAll("[href*='~'], [src*='~']"), url, urlToSearch, length, i;
        for(i = 0 , length = elementsWithTilde.length; i < length; i++) {
            url = elementsWithTilde[i].href || elementsWithTilde[i].src;
            urlToSearch = this._wysihtml5.lang.string(url).replace("~").by(this.TILDE_ESCAPED);
            innerHTML = this._wysihtml5.lang.string(innerHTML).replace(urlToSearch).by(url);
        }
        return innerHTML;
    };
    Quirks.prototype.redraw = function (element) {
        this._wysihtml5.dom.addClass(element, this.REDRAW_CLASS_NAME);
        this._wysihtml5.dom.removeClass(element, this.REDRAW_CLASS_NAME);
        try  {
            var doc = element.ownerDocument;
            doc.execCommand("italic", false, null);
            doc.execCommand("italic", false, null);
        } catch (e) {
        }
    };
    Quirks.prototype.cleanPastedHTML = function (elementOrHtml, rules, context) {
        rules = rules || this._defaultRulesPastedHtml;
        context = context || elementOrHtml.ownerDocument || document;
        var element, isString = typeof (elementOrHtml) === "string", method, matches, matchesLength, i, j = 0;
        if(isString) {
            element = this._wysihtml5.dom.getAsDom(elementOrHtml, context);
        } else {
            element = elementOrHtml;
        }
        for(i in rules) {
            matches = element.querySelectorAll(i);
            method = rules[i];
            matchesLength = matches.length;
            for(; j < matchesLength; j++) {
                method(matches[j]);
            }
        }
        matches = elementOrHtml = rules = null;
        return isString ? element.innerHTML : element;
    };
    return Quirks;
})();
