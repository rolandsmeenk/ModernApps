/// <reference path="..\..\UIRenderer.ts"/>
/// <reference path="..\..\Debugger.ts"/>
/// <reference path="wysihtml5.ts"/>
/// <reference path="lang\Dispatcher.ts"/>

declare var $;


class undef { }

class Editor extends Dispatcher  {
    
    private defaultConfig: any;
    public Editor: any;

    private _textareaElement: any;
    private _config: any;

    private _textarea : TextArea;
    private _currentView: View;
    private _composer: Composer;
    private _isCompatible : bool;



    constructor(wysihtml5: wysi, textareaElement, config) {
        
        super(wysihtml5);
        this.wysihtml5.Debugger.Log("editor:constructor");

        this.defaultConfig = {
            // Give the editor a name, the name will also be set as class name on the iframe and on the iframe's body 
            name: undef,
            // Whether the editor should look like the textarea (by adopting styles)
            style: true,
            // Id of the toolbar element, pass falsey value if you don't want any toolbar logic
            toolbar: undef,
            // Whether urls, entered by the user should automatically become clickable-links
            autoLink: true,
            // Object which includes parser rules to apply when html gets inserted via copy & paste
            // See parser_rules/*.js for examples
            parserRules: { tags: { br: {}, span: {}, div: {}, p: {} }, classes: {} },
            // Parser method to use when the user inserts content via copy & paste
            parser: wysihtml5.dom.parse,
            // Class name which should be set on the contentEditable element in the created sandbox iframe, can be styled via the 'stylesheets' option
            composerClassName: "wysihtml5-editor",
            // Class name to add to the body when the wysihtml5 editor is supported
            bodyClassName: "wysihtml5-supported",
            // Array (or single string) of stylesheet urls to be loaded in the editor's iframe
            stylesheets: [],
            // Placeholder text to use, defaults to the placeholder attribute on the textarea element
            placeholderText: undef,
            // Whether the composer should allow the user to manually resize images, tables etc.
            allowObjectResizing: true,
            // Whether the rich text editor should be rendered on touch devices (wysihtml5 >= 0.3.0 comes with basic support for iOS 5)
            supportTouchDevices: true
        };



        this.wysihtml5.Debugger.Log("editor:constructor 1");
        this._textareaElement = typeof (textareaElement) === "string" ? document.getElementById(textareaElement) : textareaElement;

        this.wysihtml5.Debugger.Log("editor:constructor 2");
        this._config = this.wysihtml5.lang.object({}).merge(this.defaultConfig).merge(config).get();

        this.wysihtml5.Debugger.Log("editor:constructor 3");
        //this._textarea = this.wysihtml5.views.CreateTextAreaView(this, this._textareaElement, this._config);
        try {
            this._textarea = new TextArea(this.wysihtml5, this, this._textareaElement, this._config);
        } catch (e) { alert(e.message); }

        this.wysihtml5.Debugger.Log("editor:constructor 4");
        this._currentView = this._textarea;

        this.wysihtml5.Debugger.Log("editor:constructor 5");
        this._isCompatible = this.wysihtml5.browser.supported();

        // Sort out unsupported/unwanted browsers here
        this.wysihtml5.Debugger.Log("editor:constructor 6");
        if (!this._isCompatible || (!this._config.supportTouchDevices && wysihtml5.browser.isTouchDevice())) {
            var that = this;
            setTimeout(function () { that.fire("beforeload", null).fire("load", null); }, 0);
            return;
        }

        // Add class name to body, to indicate that the editor is supported
        this.wysihtml5.Debugger.Log("editor:constructor 7");
        this.wysihtml5.dom.addClass(document.body, this._config.bodyClassName);

        this.wysihtml5.Debugger.Log("editor:constructor 8");
        //this._composer = this.wysihtml5.views.CreateComposerView(this, this._textareaElement, this._config);
        this._composer = new Composer(this.wysihtml5, this, this._textareaElement, this._config);
        
        this._currentView = this._composer;

        this.wysihtml5.Debugger.Log("editor:constructor 9");
        if (typeof (this._config.parser) === "function") {
            this._initParser();
        }

        this.wysihtml5.Debugger.Log("editor:constructor 10");
        this.observe("beforeload", function () {
            
            this.synchronizer = this.wysihtml5.views.CreateSynchronizer(this, this._textarea, this._composer);
            if (this.config.toolbar) {
                this.toolbar = new this.wysihtml5.toolbar.Toolbar(this, this.config.toolbar);
            }
        });

        this.wysihtml5.Debugger.Log("editor:constructor 11");

    }


    public isCompatible() {
        this.wysihtml5.Debugger.Log("editor:isCompatible");
        return this._isCompatible;
    }

    public clear() {
        this.wysihtml5.Debugger.Log("editor:clear");
        //this._currentView.clear();
        //return this;
        this._composer.clear();
    }

    public getValue(parse) {
        this.wysihtml5.Debugger.Log("editor:getValue");
        //return this._currentView.getValue(parse);
        this._composer.getValue(parse);
    }

    public setValue(html, parse) {
        this.wysihtml5.Debugger.Log("editor:setValue");
        if (!html) {
            return this.clear();
        }
        // this._currentView.setValue(html, parse);
        this._composer.setValue(html, parse);
        return this;
    }

    public focus(setToEnd) {
        this.wysihtml5.Debugger.Log("editor:focus");
        //this._currentView.setfocus(setToEnd);
        this._composer.setfocus(setToEnd);
        return this;
    }

    public disable() {
        this.wysihtml5.Debugger.Log("editor:disable");
        this._currentView.disable();
        return this;
    }

    public enable() {
        this.wysihtml5.Debugger.Log("editor:enable");
        this._currentView.enable();
        return this;
    }

    public isEmpty() {
        this.wysihtml5.Debugger.Log("editor:isEmpty");
        //return this._currentView.isEmpty();
        return this._composer.isEmpty();
    }

    public hasPlaceholderSet() {
        this.wysihtml5.Debugger.Log("editor:hasPlaceholderSet");
        //return this._currentView.hasPlaceholderSet();
        return this._composer.hasPlaceholderSet();
    }

    public parse(htmlOrElement) {
        this.wysihtml5.Debugger.Log("editor:parse");
        var returnValue = this._config.parser(htmlOrElement, this._config.parserRules, this._composer.sandbox.getDocument(), true);
        if (typeof (htmlOrElement) === "object") {
            this.wysihtml5.quirks.redraw(htmlOrElement);
        }
        return returnValue;
    }

    private _initParser() {
        this.wysihtml5.Debugger.Log("editor:_initParser");
        this.observe("paste:composer", function () {
            var keepScrollPosition = true,
                that = this;
            that.composer.selection.executeAndRestore(function () {
                this.wysihtml5.quirks.cleanPastedHTML(that.composer.element);
                that.parse(that.composer.element);
            }, keepScrollPosition);
        });

        this.observe("paste:textarea", function () {
            var value = this.textarea.getValue(),
                newValue;
            newValue = this.parse(value);
            this.textarea.setValue(newValue);
        });
    }


}

