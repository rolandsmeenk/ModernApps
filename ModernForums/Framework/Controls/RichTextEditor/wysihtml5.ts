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

declare var $;

class wysihtml5 {
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

    public INVISIBLE_SPACE: string = "\uFEFF";

    public EMPTY_FUNCTION: any = function () { };

    public ELEMENT_NODE: number = 1;
    public TEXT_NODE: number = 3;
    public BACKSPACE_KEY: number = 8;
    public ENTER_KEY: number = 13;
    public ESCAPE_KEY: number = 27;
    public SPACE_KEY: number = 32;
    public DELETE_KEY: number = 46;


    constructor() {
        this.commands = new Commands();
        this.dom = new Dom(this);
        this.quirks = new Quirks(this);
        this.toolbar = new Toolbar();
        this.lang = new Lang(this);
        this.selection = new TextSelection(this);
        this.views = new View(this, null, null, null);
        this.browser = new Browser();

    }

}

