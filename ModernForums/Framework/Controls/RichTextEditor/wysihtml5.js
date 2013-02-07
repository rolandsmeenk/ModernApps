var wysihtml5 = (function () {
    function wysihtml5() {
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
        this.commands = new Commands();
        this.dom = new Dom();
        this.quirks = new Quirks();
        this.toolbar = new Toolbar();
        this.lang = new Lang(this);
        this.selection = new TextSelection();
        this.browser = new Browser();
    }
    return wysihtml5;
})();
