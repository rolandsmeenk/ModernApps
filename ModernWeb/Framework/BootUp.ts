/// <reference path="AssetLoader.ts"/>

/// <reference path="DataLoader.ts"/>
/// <reference path="Debugger.ts"/>

/// <reference path="LanguageResources.ts"/>

/// <reference path="SceneManager.ts"/>
/// <reference path="Theme.ts"/>

/// <reference path="UsageStats.ts"/>
/// <reference path="UIRenderer.ts"/>



declare var $;

class BootUp {
    
    public AssetLoader: AssetLoader;
    public DataLoader: DataLoader;
    public Debugger: Debugger;
    public LanguageResources: LanguageResources;
    public SceneManager: SceneManager;
    public Theme: Theme;
    public UsageStats: UsageStats;
    public UIRenderer: UIRenderer;
    public Storyboards: any = [];

    constructor(theme: string, rootUI: any, headUI: any) {

        this.UIRenderer = new UIRenderer(rootUI, headUI);
        this.Debugger = new Debugger(this.UIRenderer, Math.round($(window).height() / 15 ));
        this.Theme = new Theme(theme, this.UIRenderer, this.Debugger);
        this.LanguageResources = new LanguageResources();
        this.SceneManager = new SceneManager(this.UIRenderer, this.Debugger);
        this.AssetLoader = new AssetLoader();
        this.DataLoader = new DataLoader(this.Debugger);
        this.UsageStats = new UsageStats();
        
    }

    public Start() {



        var debugOn = this._getQueryVariable("dbg");
        if (debugOn != undefined) {
            if (debugOn =="true") this.Debugger.Start();
        }
        else this.Debugger.Log("BootUp:Start");


        this.Debugger.Log("BootUp:Start");
        

        //find pg in query string and route to that
        var foundPage = this._getQueryVariable("pg");
        
        if (foundPage == undefined) this.SceneManager.NavigateToScene("WindowsHome01");
        else  this.SceneManager.NavigateToScene(foundPage);

        
    }


    public Stop() {
        this.Debugger.Log("BootUp:Stop");
        this.Debugger.Stop();

        //this.SceneManager.Stop();
    }

    public Unload() {
        this.Debugger.Log("BootUp:Unload");
        this.SceneManager.Unload();
    }



    private _getQueryVariable(variable: string) { var query = window.location.search.substring(1); var vars =  query.split('&'); for (var i = 0; i < vars.length; i++) { var pair = vars[i].split('='); if (decodeURIComponent(pair[0]) == variable) { return decodeURIComponent(pair[1]); } } }

}


window.onload = StartBootup;
window.onunload = StopBootup;




var _bootup : BootUp;
function StartBootup() {
    _bootup = new BootUp("Black-Magic", $("#divRootUI"), $('head'));
    _bootup.Start();

    //disable text content selection document wide, fixes chrome issue
    document.onselectstart = function () { return false; } // ie
    document.onmousedown = function () { return false; } // mozilla

    
}

function StopBootup() {
    _bootup.Stop();
    _bootup.Unload();
}

function DoTimeout(id: string, ms: number, fn: any, state: any) {
    $.doTimeout(id, ms, fn, state);
}



var wysihtml5;
var wysihtml5ParserRules;
var tinyMCE;
