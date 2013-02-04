var Theme = (function () {
    function Theme(Theme, UIRenderer, Debugger) {
        this.Theme = Theme;
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UIRenderer.LoadCSS(this.Theme);
    }
    return Theme;
})();
