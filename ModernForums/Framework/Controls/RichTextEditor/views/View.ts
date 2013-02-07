/// <reference path="..\..\..\UIRenderer.ts"/>
/// <reference path="..\..\..\Debugger.ts"/>


declare var $;

class View  {
    public element: any;
    public name: string;

    constructor(public parent: any, public textareaElement: any, public config: any) {
        this.parent = parent;
        this.element = textareaElement;
        this.config = config;

        this._observeViewChange();
    } 

    _observeViewChange() {
        var that = this;
        this.parent.observe("beforeload", function () {
            that.parent.observe("change_view", function (view) {
                if (view === that.name) {
                    that.parent.currentView = that;
                    that.show();
                    // Using tiny delay here to make sure that the placeholder is set before focusing
                    setTimeout(function () { that.focus(); }, 0);
                } else {
                    that.hide();
                }
            });
        });
    }

    public focus() {
        if (this.element.ownerDocument.querySelector(":focus") === this.element) {
            return;
        }

        try { this.element.focus(); } catch (e) { }
    }

    public hide() {
        this.element.style.display = "none";
    }

    public show() {
        this.element.style.display = "";
    }

    public disable() {
        this.element.setAttribute("disabled", "disabled");
    }

    public enable() {
        this.element.removeAttribute("disabled");
    }

}

