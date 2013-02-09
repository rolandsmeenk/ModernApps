var Synchronizer = (function () {
    function Synchronizer(editor, textarea, composer) {
        this.INTERVAL = 400;
        this.editor = editor;
        this.textarea = textarea;
        this.composer = composer;
        this._observe();
    }
    Synchronizer.prototype.fromComposerToTextarea = function (shouldParseHtml) {
        this.textarea.setValue(this.wysihtml5.lang.string(this.composer.getValue()).trim(), shouldParseHtml);
    };
    Synchronizer.prototype.fromTextareaToComposer = function (shouldParseHtml) {
        var textareaValue = this.textarea.getValue();
        if(textareaValue) {
            this.composer.setValue(textareaValue, shouldParseHtml);
        } else {
            this.composer.clear();
            this.editor.fire("set_placeholder");
        }
    };
    Synchronizer.prototype.sync = function (shouldParseHtml) {
        if(this.editor.currentView.name === "textarea") {
            this.fromTextareaToComposer(shouldParseHtml);
        } else {
            this.fromComposerToTextarea(shouldParseHtml);
        }
    };
    Synchronizer.prototype._observe = function () {
        var interval, that = this, form = this.textarea.element.form, startInterval = function () {
            interval = setInterval(function () {
                that.fromComposerToTextarea(false);
            }, this.INTERVAL);
        }, stopInterval = function () {
            clearInterval(interval);
            interval = null;
        };
        startInterval();
        if(form) {
            this.wysihtml5.dom.observe(form, "submit", function () {
                that.sync(true);
            });
            this.wysihtml5.dom.observe(form, "reset", function () {
                setTimeout(function () {
                    that.fromTextareaToComposer(false);
                }, 0);
            });
        }
        this.editor.observe("change_view", function (view) {
            if(view === "composer" && !interval) {
                that.fromTextareaToComposer(true);
                startInterval();
            } else if(view === "textarea") {
                that.fromComposerToTextarea(true);
                stopInterval();
            }
        });
        this.editor.observe("destroy:composer", stopInterval);
    };
    return Synchronizer;
})();
