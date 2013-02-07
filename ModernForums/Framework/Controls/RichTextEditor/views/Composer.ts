/// <reference path="..\..\..\UIRenderer.ts"/>
/// <reference path="..\..\..\Debugger.ts"/>
/// <reference path="View.ts"/>
/// <reference path="..\wysihtml5.ts"/>
declare var $;

class Composer extends View  {
    private wysihtml5: wysihtml5;
    private dom: any ;
    private browser: any;
    private name: string = "composer";
    private CARET_HACK: string = "<br>";


    constructor(wysihtml5: wysihtml5, parent: any, textareaElement: any, config: any) {
        super(parent, textareaElement, config);

        this.wysihtml5 = wysihtml5;
        this.dom = wysihtml5.dom;
        this.browser = wysihtml5.browser;


        this.textarea = parent.textarea;
        this._initSandbox();
    }

    public clear() {
        this.element.innerHTML = this.browser.displaysCaretInEmptyContentEditableCorrectly() ? "" : this.CARET_HACK;
    }

    public getValue(parse) {
        var value = this.isEmpty() ? "" : this.wysihtml5.quirks.getCorrectInnerHTML(this.element);

        if (parse) {
            value = this.parent.parse(value);
        }

        // Replace all "zero width no breaking space" chars
        // which are used as hacks to enable some functionalities
        // Also remove all CARET hacks that somehow got left
        value = this.wysihtml5.lang.string(value).replace(this.wysihtml5.INVISIBLE_SPACE).by("");

        return value;
    }

    public setValue(html, parse) {
        if (parse) {
            html = this.parent.parse(html);
        }
        this.element.innerHTML = html;
    }

    public show() {
        this.iframe.style.display = this._displayStyle || "";

        // Firefox needs this, otherwise contentEditable becomes uneditable
        this.disable();
        this.enable();
    }

    public hide() {
        this._displayStyle = dom.getStyle("display").from(this.iframe);
        if (this._displayStyle === "none") {
            this._displayStyle = null;
        }
        this.iframe.style.display = "none";
    }

    public disable() {
        this.element.removeAttribute("contentEditable");
        //this.base();
    }

    public enable() {
        this.element.setAttribute("contentEditable", "true");
       // this.base();
    }

    public setfocus(setToEnd: bool) {
        // IE 8 fires the focus event after .focus()
        // This is needed by our simulate_placeholder.js to work
        // therefore we clear it ourselves this time
        if (this.wysihtml5.browser.doesAsyncFocus() && this.hasPlaceholderSet()) {
            this.clear();
        }

        //this.base();

        var lastChild = this.element.lastChild;
        if (setToEnd && lastChild) {
            if (lastChild.nodeName === "BR") {
                this.selection.setBefore(this.element.lastChild);
            } else {
                this.selection.setAfter(this.element.lastChild);
            }
        }
    }


    getTextContent() {
        return this.dom.getTextContent(this.element);
    }

    public hasPlaceholderSet() {
        return this.getTextContent() == this.textarea.element.getAttribute("placeholder");
    }

    public isEmpty() {
        var innerHTML = this.element.innerHTML,
            elementsWithVisualValue = "blockquote, ul, ol, img, embed, object, table, iframe, svg, video, audio, button, input, select, textarea";
        return innerHTML === "" ||
               innerHTML === this.CARET_HACK ||
               this.hasPlaceholderSet() ||
               (this.getTextContent() === "" && !this.element.querySelector(elementsWithVisualValue));
    }

    public _initSandbox() {
        var that = this;

        this.sandbox = new this.dom.Sandbox(function () {
            that._create();
        }, {
            stylesheets: this.config.stylesheets
        });
        this.iframe = this.sandbox.getIframe();

        // Create hidden field which tells the server after submit, that the user used an wysiwyg editor
        var hiddenField = document.createElement("input");
        hiddenField.type = "hidden";
        hiddenField.name = "_wysihtml5_mode";
        hiddenField.value = 1;

        // Store reference to current wysihtml5 instance on the textarea element
        var textareaElement = this.textarea.element;
        this.dom.insert(this.iframe).after(textareaElement);
        this.dom.insert(hiddenField).after(textareaElement);
    }

    public _create() {
        var that = this;

        this.doc = this.sandbox.getDocument();
        this.element = this.doc.body;
        this.textarea = this.parent.textarea;
        this.element.innerHTML = this.textarea.getValue(true);
        this.enable();

        // Make sure our selection handler is ready
        this.selection = new this.wysihtml5.Selection(this.parent);

        // Make sure commands dispatcher is ready
        this.commands = new this.wysihtml5.Commands(this.parent);

        this.dom.copyAttributes([
          "className", "spellcheck", "title", "lang", "dir", "accessKey"
        ]).from(this.textarea.element).to(this.element);

        this.dom.addClass(this.element, this.config.composerClassName);

        // Make the editor look like the original textarea, by syncing styles
        if (this.config.style) {
            this.style();
        }

        this.observe();

        var name = this.config.name;
        if (name) {
            this.dom.addClass(this.element, name);
            this.dom.addClass(this.iframe, name);
        }

        // Simulate html5 placeholder attribute on contentEditable element
        var placeholderText = typeof (this.config.placeholder) === "string"
          ? this.config.placeholder
          : this.textarea.element.getAttribute("placeholder");
        if (placeholderText) {
            this.dom.simulatePlaceholder(this.parent, this, placeholderText);
        }

        // Make sure that the browser avoids using inline styles whenever possible
        this.commands.exec("styleWithCSS", false);

        this._initAutoLinking();
        this._initObjectResizing();
        this._initUndoManager();

        // Simulate html5 autofocus on contentEditable element
        if (this.textarea.element.hasAttribute("autofocus") || document.querySelector(":focus") == this.textarea.element) {
            setTimeout(function () { that.focus(); }, 100);
        }

        this.wysihtml5.quirks.insertLineBreakOnReturn(this);

        // IE sometimes leaves a single paragraph, which can't be removed by the user
        if (!this.browser.clearsContentEditableCorrectly()) {
            this.wysihtml5.quirks.ensureProperClearing(this);
        }

        if (!this.browser.clearsListsInContentEditableCorrectly()) {
            this.wysihtml5.quirks.ensureProperClearingOfLists(this);
        }

        // Set up a sync that makes sure that textarea and editor have the same content
        if (this.initSync && this.config.sync) {
            this.initSync();
        }

        // Okay hide the textarea, we are ready to go
        this.textarea.hide();

        // Fire global (before-)load event
        this.parent.fire("beforeload").fire("load");
    }


    public _initAutoLinking() {
        var that = this,
            supportsDisablingOfAutoLinking = this.browser.canDisableAutoLinking(),
            supportsAutoLinking = this.browser.doesAutoLinkingInContentEditable();
        if (supportsDisablingOfAutoLinking) {
            this.commands.exec("autoUrlDetect", false);
        }

        if (!this.config.autoLink) {
            return;
        }

        // Only do the auto linking by ourselves when the browser doesn't support auto linking
        // OR when he supports auto linking but we were able to turn it off (IE9+)
        if (!supportsAutoLinking || (supportsAutoLinking && supportsDisablingOfAutoLinking)) {
            this.parent.observe("newword:composer", function () {
                that.selection.executeAndRestore(function (startContainer, endContainer) {
                    this.dom.autoLink(endContainer.parentNode);
                });
            });
        }

        // Assuming we have the following:
        //  <a href="http://www.google.de">http://www.google.de</a>
        // If a user now changes the url in the innerHTML we want to make sure that
        // it's synchronized with the href attribute (as long as the innerHTML is still a url)
        var // Use a live NodeList to check whether there are any links in the document
            links = this.sandbox.getDocument().getElementsByTagName("a"),
            // The autoLink helper method reveals a reg exp to detect correct urls
            urlRegExp = this.dom.autoLink.URL_REG_EXP,
            getTextContent = function (element) {
                var textContent = this.wysihtml5.lang.string(this.dom.getTextContent(element)).trim();
                if (textContent.substr(0, 4) === "www.") {
                    textContent = "http://" + textContent;
                }
                return textContent;
            };

        this.dom.observe(this.element, "keydown", function (event) {
            if (!links.length) {
                return;
            }

            var selectedNode = that.selection.getSelectedNode(event.target.ownerDocument),
                link = this.dom.getParentElement(selectedNode, { nodeName: "A" }, 4),
                textContent;

            if (!link) {
                return;
            }

            textContent = getTextContent(link);
            // keydown is fired before the actual content is changed
            // therefore we set a timeout to change the href
            setTimeout(function () {
                var newTextContent = getTextContent(link);
                if (newTextContent === textContent) {
                    return;
                }

                // Only set href when new href looks like a valid url
                if (newTextContent.match(urlRegExp)) {
                    link.setAttribute("href", newTextContent);
                }
            }, 0);
        });

    }

    public _initObjectResizing() {
        var properties = ["width", "height"],
            propertiesLength = properties.length,
            element = this.element;

        this.commands.exec("enableObjectResizing", this.config.allowObjectResizing);

        if (this.config.allowObjectResizing) {
            // IE sets inline styles after resizing objects
            // The following lines make sure that the width/height css properties
            // are copied over to the width/height attributes
            if (this.browser.supportsEvent("resizeend")) {
                this.dom.observe(element, "resizeend", function (event) {
                    var target = event.target || event.srcElement,
                        style = target.style,
                        i = 0,
                        property;
                    for (; i < propertiesLength; i++) {
                        property = properties[i];
                        if (style[property]) {
                            target.setAttribute(property, parseInt(style[property], 10));
                            style[property] = "";
                        }
                    }
                    // After resizing IE sometimes forgets to remove the old resize handles
                    this.wysihtml5.quirks.redraw(element);
                });
            }
        } else {
            if (this.browser.supportsEvent("resizestart")) {
                this.dom.observe(element, "resizestart", function (event) { event.preventDefault(); });
            }
        }
    }

    public _initUndoManager() {
        this.wysihtml5.UndoManager = new UndoManager(this.wysihtml5, this.parent);
    }


}

