var View = (function () {
    function View(wysihtml5, parent, textareaElement, config) {
        this.wysihtml5 = wysihtml5;
        this.parent = parent;
        this.textareaElement = textareaElement;
        this.config = config;
        this.wysihtml5.Debugger.Log("View:constructor");
        this._observeViewChange();
        this.wysihtml5.Debugger.Log("View:constructor - _observeViewChange()");
    }
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
