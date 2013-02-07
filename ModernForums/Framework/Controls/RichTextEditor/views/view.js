var View = (function () {
    function View(parent, textareaElement, config) {
        this.parent = parent;
        this.textareaElement = textareaElement;
        this.config = config;
        this.parent = parent;
        this.element = textareaElement;
        this.config = config;
        this._observeViewChange();
    }
    View.prototype._observeViewChange = function () {
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
