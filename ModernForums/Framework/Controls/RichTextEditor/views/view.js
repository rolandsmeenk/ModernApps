var View = (function () {
    function View(wysihtml5, parent, textareaElement, config) {
        this.wysihtml5 = wysihtml5;
        this.parent = parent;
        this.textareaElement = textareaElement;
        this.config = config;
        wysihtml5.Debugger.Log("View:constructor");
        this._observeViewChange();
        wysihtml5.Debugger.Log("View:constructor - _observeViewChange()");
    }
    View.prototype.CreateTextAreaView = function (parent, textareaElement, config) {
        this.wysihtml5.Debugger.Log("View:CreateTextAreaView");
        this.parent = parent;
        this.element = textareaElement;
        this.config = config;
        if(this.textarea == null) {
            this.wysihtml5.Debugger.Log("View:CreateTextAreaView - start create textarea");
            this.textarea = new TextArea(this.wysihtml5, parent, textareaElement, config);
            this.wysihtml5.Debugger.Log("View:CreateTextAreaView - finish create textarea");
        }
        this._observeViewChange();
        return this.textarea;
    };
    View.prototype.CreateComposerView = function (parent, textareaElement, config) {
        this.wysihtml5.Debugger.Log("View:CreateComposerView");
        this.parent = parent;
        this.element = textareaElement;
        this.config = config;
        if(this.composer == null) {
            this.composer = new Composer(this.wysihtml5, parent, textareaElement, config);
        }
        this._observeViewChange();
        return this.composer;
    };
    View.prototype.CreateSynchronizer = function (editor, textareaElement, composer) {
        this.wysihtml5.Debugger.Log("View:CreateSynchronizer");
        this.synchronizer = new Synchronizer(editor, textareaElement, composer);
        this._observeViewChange();
        return this.synchronizer;
    };
    View.prototype._observeViewChange = function () {
        this.wysihtml5.Debugger.Log("View:_observeViewChange");
        var that = this;
        if(this.parent == null) {
            return;
        }
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
        this.wysihtml5.Debugger.Log("View:focus");
        if(this.element.ownerDocument.querySelector(":focus") === this.element) {
            return;
        }
        try  {
            this.element.focus();
        } catch (e) {
        }
    };
    View.prototype.hide = function () {
        this.wysihtml5.Debugger.Log("View:hide");
        this.element.style.display = "none";
    };
    View.prototype.show = function () {
        this.wysihtml5.Debugger.Log("View:show");
        this.element.style.display = "";
    };
    View.prototype.disable = function () {
        this.wysihtml5.Debugger.Log("View:disable");
        this.element.setAttribute("disabled", "disabled");
    };
    View.prototype.enable = function () {
        this.wysihtml5.Debugger.Log("View:enable");
        this.element.removeAttribute("disabled");
    };
    return View;
})();
