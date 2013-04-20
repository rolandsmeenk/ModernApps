var BootUp = (function () {
    function BootUp(theme, rootUI, headUI) {
        this.Storyboards = [];
        this.UIRenderer = new UIRenderer(rootUI, headUI);
        this.Debugger = new Debugger(this.UIRenderer, Math.round($(window).height() / 15));
        this.Theme = new Theme(theme, this.UIRenderer, this.Debugger);
        this.LanguageResources = new LanguageResources();
        this.SceneManager = new SceneManager(this.UIRenderer, this.Debugger);
        this.AssetLoader = new AssetLoader();
        this.DataLoader = new DataLoader(this.Debugger);
        this.UsageStats = new UsageStats();
    }
    BootUp.prototype.Start = function () {
        this.Debugger.Start();
        this.Debugger.Log("BootUp:Start");
        var foundPage = this._getQueryVariable("pg");
        if(foundPage == undefined) {
            this.SceneManager.NavigateToScene("WindowsHome01");
        } else {
            this.SceneManager.NavigateToScene(foundPage);
        }
    };
    BootUp.prototype.Stop = function () {
        this.Debugger.Log("BootUp:Stop");
        this.Debugger.Stop();
    };
    BootUp.prototype.Unload = function () {
        this.Debugger.Log("BootUp:Unload");
        this.SceneManager.Unload();
    };
    BootUp.prototype._getQueryVariable = function (variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for(var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if(decodeURIComponent(pair[0]) == variable) {
                return decodeURIComponent(pair[1]);
            }
        }
    };
    return BootUp;
})();
window.onload = StartBootup;
window.onunload = StopBootup;
var _bootup;
function StartBootup() {
    _bootup = new BootUp("Black-Magic", $("#divRootUI"), $('head'));
    _bootup.Start();
    document.onselectstart = function () {
        return false;
    };
    document.onmousedown = function () {
        return false;
    };
}
function StopBootup() {
    _bootup.Stop();
    _bootup.Unload();
}
function DoTimeout(id, ms, fn, state) {
    $.doTimeout(id, ms, fn, state);
}
var wysihtml5;
var wysihtml5ParserRules;
var tinyMCE;
