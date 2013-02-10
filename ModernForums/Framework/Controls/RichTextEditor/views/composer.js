var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Composer = (function (_super) {
    __extends(Composer, _super);
    function Composer(wysihtml5, parent, textareaElement, config) {
        _super.call(this, wysihtml5, parent, textareaElement, config);
        this.name = "composer";
        this.CARET_HACK = "<br>";
        this.wysihtml5.Debugger.Log("Composer:constructor");
        this.dom = wysihtml5.dom;
        this.browser = wysihtml5.browser;
        this.style = new ComposerStyle(wysihtml5, parent, textareaElement, config);
        this.textarea = parent.textarea;
        this._initSandbox();
    }
    Composer.prototype.clear = function () {
        this.wysihtml5.Debugger.Log("Composer:clear");
        this.element.innerHTML = this.browser.displaysCaretInEmptyContentEditableCorrectly() ? "" : this.CARET_HACK;
    };
    Composer.prototype.getValue = function (parse) {
        this.wysihtml5.Debugger.Log("Composer:getValue");
        var value = this.isEmpty() ? "" : this.wysihtml5.quirks.getCorrectInnerHTML(this.element);
        if(parse) {
            value = this.parent.parse(value);
        }
        value = this.wysihtml5.lang.string(value).replace(this.wysihtml5.INVISIBLE_SPACE).by("");
        return value;
    };
    Composer.prototype.setValue = function (html, parse) {
        this.wysihtml5.Debugger.Log("Composer:setValue");
        if(parse) {
            html = this.parent.parse(html);
        }
        this.element.innerHTML = html;
    };
    Composer.prototype.show = function () {
        this.wysihtml5.Debugger.Log("Composer:show");
        this.iframe.style.display = this._displayStyle || "";
        this.disable();
        this.enable();
    };
    Composer.prototype.hide = function () {
        this.wysihtml5.Debugger.Log("Composer:hide");
        this._displayStyle = this.dom.getStyle("display").from(this.iframe);
        if(this._displayStyle === "none") {
            this._displayStyle = null;
        }
        this.iframe.style.display = "none";
    };
    Composer.prototype.disable = function () {
        this.wysihtml5.Debugger.Log("Composer:disable");
        this.element.removeAttribute("contentEditable");
    };
    Composer.prototype.enable = function () {
        this.wysihtml5.Debugger.Log("Composer:enable");
        this.element.setAttribute("contentEditable", "true");
    };
    Composer.prototype.setfocus = function (setToEnd) {
        this.wysihtml5.Debugger.Log("Composer:setfocus");
        if(this.wysihtml5.browser.doesAsyncFocus() && this.hasPlaceholderSet()) {
            this.clear();
        }
        var lastChild = this.element.lastChild;
        if(setToEnd && lastChild) {
            if(lastChild.nodeName === "BR") {
                this.selection.setBefore(this.element.lastChild);
            } else {
                this.selection.setAfter(this.element.lastChild);
            }
        }
    };
    Composer.prototype.getTextContent = function () {
        this.wysihtml5.Debugger.Log("Composer:getTextContent");
        return this.dom.getTextContent(this.element);
    };
    Composer.prototype.hasPlaceholderSet = function () {
        this.wysihtml5.Debugger.Log("Composer:hasPlaceholderSet");
        return this.getTextContent() == this.textarea.element.getAttribute("placeholder");
    };
    Composer.prototype.isEmpty = function () {
        this.wysihtml5.Debugger.Log("Composer:isEmpty");
        var innerHTML = this.element.innerHTML, elementsWithVisualValue = "blockquote, ul, ol, img, embed, object, table, iframe, svg, video, audio, button, input, select, textarea";
        return innerHTML === "" || innerHTML === this.CARET_HACK || this.hasPlaceholderSet() || (this.getTextContent() === "" && !this.element.querySelector(elementsWithVisualValue));
    };
    Composer.prototype._initSandbox = function () {
        this.wysihtml5.Debugger.Log("Composer:_initSandbox");
        var that = this;
        this.sandbox = new this.dom.Sandbox(function () {
            that._create();
        }, {
            stylesheets: this.config.stylesheets
        });
        this.iframe = this.sandbox.getIframe();
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", "_wysihtml5_mode");
        hiddenField.setAttribute("value", "1");
        var textareaElement = this.textarea.element;
        this.dom.insert(this.iframe).after(textareaElement);
        this.dom.insert(hiddenField).after(textareaElement);
    };
    Composer.prototype._create = function () {
        this.wysihtml5.Debugger.Log("Composer:_create");
        var that = this;
        this.doc = this.sandbox.getDocument();
        this.element = this.doc.body;
        this.textarea = this.parent.textarea;
        this.element.innerHTML = this.textarea.getValue(true);
        this.enable();
        this.dom.copyAttributes([
            "className", 
            "spellcheck", 
            "title", 
            "lang", 
            "dir", 
            "accessKey"
        ]).from(this.textarea.element).to(this.element);
        this.dom.addClass(this.element, this.config.composerClassName);
        var name = this.config.name;
        if(name) {
            this.dom.addClass(this.element, name);
            this.dom.addClass(this.iframe, name);
        }
        var placeholderText = typeof (this.config.placeholder) === "string" ? this.config.placeholder : this.textarea.element.getAttribute("placeholder");
        if(placeholderText) {
            this.dom.simulatePlaceholder(this.parent, this, placeholderText);
        }
        this.commands.exec("styleWithCSS", false);
        this._initAutoLinking();
        this._initObjectResizing();
        this._initUndoManager();
        if(this.textarea.element.hasAttribute("autofocus") || document.querySelector(":focus") == this.textarea.element) {
            setTimeout(function () {
                that.focus();
            }, 100);
        }
        this.wysihtml5.quirks.insertLineBreakOnReturn(this);
        if(!this.browser.clearsContentEditableCorrectly()) {
            this.wysihtml5.quirks.ensureProperClearing(this);
        }
        if(!this.browser.clearsListsInContentEditableCorrectly()) {
            this.wysihtml5.quirks.ensureProperClearingOfLists(this);
        }
        this.textarea.hide();
        this.parent.fire("beforeload").fire("load");
    };
    Composer.prototype._initAutoLinking = function () {
        this.wysihtml5.Debugger.Log("Composer:_initAutoLinking");
        var that = this, supportsDisablingOfAutoLinking = this.browser.canDisableAutoLinking(), supportsAutoLinking = this.browser.doesAutoLinkingInContentEditable();
        if(supportsDisablingOfAutoLinking) {
            this.commands.exec("autoUrlDetect", false);
        }
        if(!this.config.autoLink) {
            return;
        }
        if(!supportsAutoLinking || (supportsAutoLinking && supportsDisablingOfAutoLinking)) {
            this.parent.observe("newword:composer", function () {
                that.selection.executeAndRestore(function (startContainer, endContainer) {
                    this.dom.autoLink(endContainer.parentNode);
                });
            });
        }
        var links = this.sandbox.getDocument().getElementsByTagName("a"), urlRegExp = this.dom.autoLink.URL_REG_EXP, getTextContent = function (element) {
            var textContent = this.wysihtml5.lang.string(this.dom.getTextContent(element)).trim();
            if(textContent.substr(0, 4) === "www.") {
                textContent = "http://" + textContent;
            }
            return textContent;
        };
        this.dom.observe(this.element, "keydown", function (event) {
            if(!links.length) {
                return;
            }
            var selectedNode = that.selection.getSelectedNode(event.target.ownerDocument), link = this.dom.getParentElement(selectedNode, {
                nodeName: "A"
            }, 4), textContent;
            if(!link) {
                return;
            }
            textContent = getTextContent(link);
            setTimeout(function () {
                var newTextContent = getTextContent(link);
                if(newTextContent === textContent) {
                    return;
                }
                if(newTextContent.match(urlRegExp)) {
                    link.setAttribute("href", newTextContent);
                }
            }, 0);
        });
    };
    Composer.prototype._initObjectResizing = function () {
        this.wysihtml5.Debugger.Log("Composer:_initObjectResizing");
        var properties = [
            "width", 
            "height"
        ], propertiesLength = properties.length, element = this.element;
        this.commands.exec("enableObjectResizing", this.config.allowObjectResizing);
        if(this.config.allowObjectResizing) {
            if(this.browser.supportsEvent("resizeend")) {
                this.dom.observe(element, "resizeend", function (event) {
                    var target = event.target || event.srcElement, style = target.style, i = 0, property;
                    for(; i < propertiesLength; i++) {
                        property = properties[i];
                        if(style[property]) {
                            target.setAttribute(property, parseInt(style[property], 10));
                            style[property] = "";
                        }
                    }
                    this.wysihtml5.quirks.redraw(element);
                });
            }
        } else {
            if(this.browser.supportsEvent("resizestart")) {
                this.dom.observe(element, "resizestart", function (event) {
                    event.preventDefault();
                });
            }
        }
    };
    Composer.prototype._initUndoManager = function () {
        this.wysihtml5.Debugger.Log("Composer:_initUndoManager");
        this.wysihtml5.UndoManager = new UndoManager(this.wysihtml5, this.parent);
    };
    return Composer;
})(View);
