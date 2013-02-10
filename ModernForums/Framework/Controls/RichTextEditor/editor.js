var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var undef = (function () {
    function undef() { }
    return undef;
})();
var Editor = (function (_super) {
    __extends(Editor, _super);
    function Editor(wysihtml5, textareaElement, config) {
        _super.call(this, wysihtml5);
        this.wysihtml5.Debugger.Log("editor:constructor");
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
        this.wysihtml5.Debugger.Log("editor:constructor 1");
        this._textareaElement = typeof (textareaElement) === "string" ? document.getElementById(textareaElement) : textareaElement;
        this.wysihtml5.Debugger.Log("editor:constructor 2");
        this._config = this.wysihtml5.lang.object({
        }).merge(this.defaultConfig).merge(config).get();
        this.wysihtml5.Debugger.Log("editor:constructor 3");
        this._textarea = this.wysihtml5.views.CreateTextAreaView(this, this._textareaElement, this._config);
        this.wysihtml5.Debugger.Log("editor:constructor 4");
        this._currentView = this._textarea;
        this.wysihtml5.Debugger.Log("editor:constructor 5");
        this._isCompatible = this.wysihtml5.browser.supported();
        this.wysihtml5.Debugger.Log("editor:constructor 6");
        if(!this._isCompatible || (!this._config.supportTouchDevices && wysihtml5.browser.isTouchDevice())) {
            var that = this;
            setTimeout(function () {
                that.fire("beforeload", null).fire("load", null);
            }, 0);
            return;
        }
        this.wysihtml5.Debugger.Log("editor:constructor 7");
        this.wysihtml5.dom.addClass(document.body, this._config.bodyClassName);
        this.wysihtml5.Debugger.Log("editor:constructor 8");
        this._composer = this.wysihtml5.views.CreateComposerView(this, this._textareaElement, this._config);
        this._currentView = this._composer;
        this.wysihtml5.Debugger.Log("editor:constructor 9");
        if(typeof (this._config.parser) === "function") {
            this._initParser();
        }
        this.wysihtml5.Debugger.Log("editor:constructor 10");
        this.observe("beforeload", function () {
            this.synchronizer = this.wysihtml5.views.CreateSynchronizer(this, this._textarea, this._composer);
            if(this.config.toolbar) {
                this.toolbar = new this.wysihtml5.toolbar.Toolbar(this, this.config.toolbar);
            }
        });
        this.wysihtml5.Debugger.Log("editor:constructor 11");
    }
    Editor.prototype.isCompatible = function () {
        this.wysihtml5.Debugger.Log("editor:isCompatible");
        return this._isCompatible;
    };
    Editor.prototype.clear = function () {
        this.wysihtml5.Debugger.Log("editor:clear");
        this._composer.clear();
    };
    Editor.prototype.getValue = function (parse) {
        this.wysihtml5.Debugger.Log("editor:getValue");
        this._composer.getValue(parse);
    };
    Editor.prototype.setValue = function (html, parse) {
        this.wysihtml5.Debugger.Log("editor:setValue");
        if(!html) {
            return this.clear();
        }
        this._composer.setValue(html, parse);
        return this;
    };
    Editor.prototype.focus = function (setToEnd) {
        this.wysihtml5.Debugger.Log("editor:focus");
        this._composer.setfocus(setToEnd);
        return this;
    };
    Editor.prototype.disable = function () {
        this.wysihtml5.Debugger.Log("editor:disable");
        this._currentView.disable();
        return this;
    };
    Editor.prototype.enable = function () {
        this.wysihtml5.Debugger.Log("editor:enable");
        this._currentView.enable();
        return this;
    };
    Editor.prototype.isEmpty = function () {
        this.wysihtml5.Debugger.Log("editor:isEmpty");
        return this._composer.isEmpty();
    };
    Editor.prototype.hasPlaceholderSet = function () {
        this.wysihtml5.Debugger.Log("editor:hasPlaceholderSet");
        return this._composer.hasPlaceholderSet();
    };
    Editor.prototype.parse = function (htmlOrElement) {
        this.wysihtml5.Debugger.Log("editor:parse");
        var returnValue = this._config.parser(htmlOrElement, this._config.parserRules, this._composer.sandbox.getDocument(), true);
        if(typeof (htmlOrElement) === "object") {
            this.wysihtml5.quirks.redraw(htmlOrElement);
        }
        return returnValue;
    };
    Editor.prototype._initParser = function () {
        this.wysihtml5.Debugger.Log("editor:_initParser");
        this.observe("paste:composer", function () {
            var keepScrollPosition = true, that = this;
            that.composer.selection.executeAndRestore(function () {
                this.wysihtml5.quirks.cleanPastedHTML(that.composer.element);
                that.parse(that.composer.element);
            }, keepScrollPosition);
        });
        this.observe("paste:textarea", function () {
            var value = this.textarea.getValue(), newValue;
            newValue = this.parse(value);
            this.textarea.setValue(newValue);
        });
    };
    return Editor;
})(Dispatcher);
