/// <reference path="..\..\UIRenderer.ts"/>
/// <reference path="..\..\Debugger.ts"/>
/// <reference path="wysihtml5.ts"/>

declare var $;


class undef { }

class editor  {
    private _wysihtml5: wysihtml5;
    private defaultConfig: any;
    public Editor: any;

    private _textareaElement: any;
    private _config: any;

    constructor(wysihtml5: wysihtml5, textareaElement, config) {
        this._wysihtml5 = wysihtml5;


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




        this._textareaElement = typeof (textareaElement) === "string" ? document.getElementById(textareaElement) : textareaElement;
        this._config = wysihtml5.lang.object({}).merge(this.defaultConfig).merge(config).get();
        this._textarea = new wysihtml5.views.Textarea(this, this.textareaElement, this.config);
        this._currentView = this.textarea;
        this._isCompatible = wysihtml5.browser.supported();

        // Sort out unsupported/unwanted browsers here
        if (!this._isCompatible || (!this.config.supportTouchDevices && wysihtml5.browser.isTouchDevice())) {
            var that = this;
            setTimeout(function () { that.fire("beforeload").fire("load"); }, 0);
            return;
        }

        // Add class name to body, to indicate that the editor is supported
        wysihtml5.dom.addClass(document.body, this.config.bodyClassName);

        this.composer = new wysihtml5.views.Composer(this, this.textareaElement, this.config);
        this.currentView = this.composer;

        if (typeof (this.config.parser) === "function") {
            this._initParser();
        }

        this.observe("beforeload", function () {
            this.synchronizer = new wysihtml5.views.Synchronizer(this, this.textarea, this.composer);
            if (this.config.toolbar) {
                this.toolbar = new wysihtml5.toolbar.Toolbar(this, this.config.toolbar);
            }
        });

        try {
            console.log("Heya! This page is using wysihtml5 for rich text editing. Check out https://github.com/xing/wysihtml5");
        } catch (e) { }



    }

}

