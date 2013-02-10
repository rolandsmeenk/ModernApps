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
        //this.parent = parent;
        //this.element = textareaElement;
        //this.config = config;
        
        wysihtml5.Debugger.Log("View:constructor");
        

        this._observeViewChange();
        wysihtml5.Debugger.Log("View:constructor - _observeViewChange()");
    }


    public CreateTextAreaView(parent: any, textareaElement: any, config: any) {
        this.wysihtml5.Debugger.Log("View:CreateTextAreaView");
        this.parent = parent;
        this.element = textareaElement;
        this.config = config;

        if (this.textarea == null) {
            this.wysihtml5.Debugger.Log("View:CreateTextAreaView - start create textarea");
            this.textarea = new TextArea(this.wysihtml5, parent, textareaElement, config);
            this.wysihtml5.Debugger.Log("View:CreateTextAreaView - finish create textarea");
        }
        
        this._observeViewChange();
        
        return this.textarea;
    }

    public CreateComposerView(parent: any, textareaElement: any, config: any) {
        this.wysihtml5.Debugger.Log("View:CreateComposerView");
        this.parent = parent;
        this.element = textareaElement;
        this.config = config;
        if (this.composer == null)
            this.composer = new Composer(this.wysihtml5, parent, textareaElement, config);

        this._observeViewChange();

        return this.composer;
    }


    public CreateSynchronizer(editor: any, textareaElement: any, composer: any) {
        this.wysihtml5.Debugger.Log("View:CreateSynchronizer");

        this.synchronizer = new Synchronizer(editor, textareaElement, composer);

        this._observeViewChange();

        return this.synchronizer;
    }


    private _observeViewChange() {
        
        this.wysihtml5.Debugger.Log("View:_observeViewChange");
        
        var that = this;
        if (this.parent == null) return;
        
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
        this.wysihtml5.Debugger.Log("View:focus");
        if (this.element.ownerDocument.querySelector(":focus") === this.element) {
            return;
        }

        try { this.element.focus(); } catch (e) { }
    }

    public hide() {
        this.wysihtml5.Debugger.Log("View:hide");
        this.element.style.display = "none";
    }

    public show() {
        this.wysihtml5.Debugger.Log("View:show");
        this.element.style.display = "";
    }

    public disable() {
        this.wysihtml5.Debugger.Log("View:disable");
        this.element.setAttribute("disabled", "disabled");
    }

    public enable() {
        this.wysihtml5.Debugger.Log("View:enable");
        this.element.removeAttribute("disabled");
    }

}

