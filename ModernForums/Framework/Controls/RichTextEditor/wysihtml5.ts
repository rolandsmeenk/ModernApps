/// <reference path="..\..\UIRenderer.ts"/>
/// <reference path="..\..\Debugger.ts"/>

/// <reference path="commands.ts"/>
/// <reference path="dom\dom.ts"/>
/// <reference path="quirks\quirks.ts"/>
/// <reference path="toolbar\toolbar.ts"/>
/// <reference path="lang\lang.ts"/>
/// <reference path="selection\selection.ts"/>
/// <reference path="views\view.ts"/>
/// <reference path="browser.ts"/>
/// <reference path="undomanager.ts"/>
/// <reference path="editor.ts"/>

declare var $;

class wysi {
    public version: string = "@VERSION";

    public commands: Commands;
    public dom: Dom;
    public quirks: Quirks;
    public toolbar: Toolbar;
    public lang: Lang;
    public selection: TextSelection;
    public views: View;
    public browser: Browser;
    public UndoManager: UndoManager;
    public Editor: Editor;
    public Debugger: Debugger;

    public INVISIBLE_SPACE: string = "\uFEFF";

    public EMPTY_FUNCTION: any = function () { };

    public ELEMENT_NODE: number = 1;
    public TEXT_NODE: number = 3;
    public BACKSPACE_KEY: number = 8;
    public ENTER_KEY: number = 13;
    public ESCAPE_KEY: number = 27;
    public SPACE_KEY: number = 32;
    public DELETE_KEY: number = 46;


    constructor(dbg: Debugger) {
        this.Debugger = dbg;

        this.browser = new Browser();
        this.Debugger.Log("wysi:constructor - init browser");

        this.commands = new Commands();
        this.Debugger.Log("wysi:constructor - init commands");

        this.lang = new Lang(this);
        this.Debugger.Log("wysi:constructor - init lang");

        this.dom = new Dom(this);
        this.Debugger.Log("wysi:constructor - init dom");

        this.dom.Start();
        this.Debugger.Log("wysi:constructor - start dom");

        this.quirks = new Quirks(this);
        this.Debugger.Log("wysi:constructor - init quirks");

        this.toolbar = new Toolbar();
        this.Debugger.Log("wysi:constructor - init toolbar");

        this.selection = new TextSelection(this);
        this.Debugger.Log("wysi:constructor - init selection");

        //this.views = new View(this, null, null, null);
        //this.Debugger.Log("wysi:constructor - init views");
        

    }

    public CreateEditor(textareaElement: any, config: any) {
        
        if (this.Editor == null)
            this.Editor = new Editor(this, textareaElement, config);

        return this.Editor;
    }

}



