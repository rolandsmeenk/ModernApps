var undef = (function () {
    function undef() { }
    return undef;
})();
var editor = (function () {
    function editor(wysihtml5, textareaElement, config) {
        this._wysihtml5 = wysihtml5;
        this.defaultConfig = {
            name: undef,
            style: true,
            toolbar: undef,
            autoLink: true,
            parserRules: {
                tags: {
                    br: {
                    },
                    span: {
                    },
                    div: {
                    },
                    p: {
                    }
                },
                classes: {
                }
            },
            parser: wysihtml5.dom.parse,
            composerClassName: "wysihtml5-editor",
            bodyClassName: "wysihtml5-supported",
            stylesheets: [],
            placeholderText: undef,
            allowObjectResizing: true,
            supportTouchDevices: true
        };
        this._textareaElement = typeof (textareaElement) === "string" ? document.getElementById(textareaElement) : textareaElement;
        this._config = wysihtml5.lang.object({
        }).merge(this.defaultConfig).merge(config).get();
        this._textarea = new wysihtml5.views.Textarea(this, this.textareaElement, this.config);
        this._currentView = this.textarea;
        this._isCompatible = wysihtml5.browser.supported();
        if(!this._isCompatible || (!this.config.supportTouchDevices && wysihtml5.browser.isTouchDevice())) {
            var that = this;
            setTimeout(function () {
                that.fire("beforeload").fire("load");
            }, 0);
            return;
        }
        wysihtml5.dom.addClass(document.body, this.config.bodyClassName);
        this.composer = new wysihtml5.views.Composer(this, this.textareaElement, this.config);
        this.currentView = this.composer;
        if(typeof (this.config.parser) === "function") {
            this._initParser();
        }
        this.observe("beforeload", function () {
            this.synchronizer = new wysihtml5.views.Synchronizer(this, this.textarea, this.composer);
            if(this.config.toolbar) {
                this.toolbar = new wysihtml5.toolbar.Toolbar(this, this.config.toolbar);
            }
        });
        try  {
            console.log("Heya! This page is using wysihtml5 for rich text editing. Check out https://github.com/xing/wysihtml5");
        } catch (e) {
        }
    }
    return editor;
})();
