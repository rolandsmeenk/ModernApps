/// <reference path="..\..\..\UIRenderer.ts"/>
/// <reference path="..\..\..\Debugger.ts"/>
/// <reference path="textarea.ts"/>
/// <reference path="synchronizer.ts"/>
/// <reference path="composer.ts"/>

declare var $;

class View  {
    public element: any;
    public name: string;
    public textarea: TextArea;
    public synchronizer: Synchronizer;
    public composer: Composer;

    constructor(public wysihtml5: wysi, public parent: any, public textareaElement: any, public config: any) {
        this.parent = parent;
        this.element = textareaElement;
        this.config = config;
        
        this.wysihtml5.Debugger.Log("View:constructor");
        

        this._observeViewChange();
        this.wysihtml5.Debugger.Log("View:constructor - _observeViewChange()");
    }


    public CreateTextAreaView(parent: any, textareaElement: any, config: any) {
        if(this.textarea== null)
            this.textarea = new TextArea(this.wysihtml5, parent, textareaElement, config);
        
        return this.textarea;
    }

    public CreateComposerView(parent: any, textareaElement: any, config: any) {
        if (this.composer == null)
            this.composer = new Composer(this.wysihtml5, parent, textareaElement, config);

        return this.composer;
    }


    public CreateSynchronizer(editor: any, textareaElement: any, composer: any) {
        
        this.synchronizer = new Synchronizer(editor, textareaElement, composer);

        return this.synchronizer;
    }


    private _observeViewChange() {
        this.wysihtml5.Debugger.Log("View:_observeViewChange");
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

