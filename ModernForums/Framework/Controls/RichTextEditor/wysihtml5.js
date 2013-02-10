var wysi = (function () {
    function wysi(dbg) {
        this.version = "@VERSION";
        this.INVISIBLE_SPACE = "\uFEFF";
        this.EMPTY_FUNCTION = function () {
        };
        this.ELEMENT_NODE = 1;
        this.TEXT_NODE = 3;
        this.BACKSPACE_KEY = 8;
        this.ENTER_KEY = 13;
        this.ESCAPE_KEY = 27;
        this.SPACE_KEY = 32;
        this.DELETE_KEY = 46;
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
        this.views = new View(this, null, null, null);
        this.Debugger.Log("wysi:constructor - init views");
    }
    wysi.prototype.CreateEditor = function (textareaElement, config) {
        if(this.Editor == null) {
            this.Editor = new Editor(this, textareaElement, config);
        }
        return this.Editor;
    };
    return wysi;
})();
