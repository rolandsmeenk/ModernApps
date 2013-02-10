var View = (function () {
    function View(wysihtml5, parent, textareaElement, config) {
        this.wysihtml5 = wysihtml5;
        this.parent = parent;
        this.textareaElement = textareaElement;
        this.config = config;
        this.parent = parent;
        this.element = textareaElement;
        this.config = config;
        this.wysihtml5.Debugger.Log("View:constructor");
        this._observeViewChange();
        this.wysihtml5.Debugger.Log("View:constructor - _observeViewChange()");
    }
    View.prototype.CreateTextAreaView = function (parent, textareaElement, config) {
        if(this.textarea == null) {
            this.textarea = new TextArea(this.wysihtml5, parent, textareaElement, config);
        }
        return this.textarea;
    };
    View.prototype.CreateComposerView = function (parent, textareaElement, config) {
        if(this.composer == null) {
            this.composer = new Composer(this.wysihtml5, parent, textareaElement, config);
        }
        return this.composer;
    };
    View.prototype.CreateSynchronizer = function (editor, textareaElement, composer) {
        this.synchronizer = new Synchronizer(editor, textareaElement, composer);
        return this.synchronizer;
    };
    View.prototype._observeViewChange = function () {
        this.wysihtml5.Debugger.Log("View:_observeViewChange");
        var that = this;
        this.parent.observe("beforeload", function () {
            that.parent.observe("change_view", function (view) {
                if(view === that.name) {
                    that.parent.currentView = that;
                    that.show();
                    setTimeout(function () {
                        that.focus();
                    }, 0);
                } else {
                    that.hide();
                }
            });
        });
    };
    View.prototype.focus = function () {
        if(this.element.ownerDocument.querySelector(":focus") === this.element) {
            return;
        }
        try  {
            this.element.focus();
        } catch (e) {
        }
    };
    View.prototype.hide = function () {
        this.element.style.display = "none";
    };
    View.prototype.show = function () {
        this.element.style.display = "";
    };
    View.prototype.disable = function () {
        this.element.setAttribute("disabled", "disabled");
    };
    View.prototype.enable = function () {
        this.element.removeAttribute("disabled");
    };
    return View;
})();
