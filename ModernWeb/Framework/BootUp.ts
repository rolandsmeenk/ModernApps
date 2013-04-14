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


        this.Debugger.Start();
        this.Debugger.Log("BootUp:Start");
        

        this.SceneManager.NavigateToScene("WindowsHome01");
        //this.SceneManager.NavigateToScene("KeystoneRecordsHome01");


        
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



}


window.onload = StartBootup;
window.onunload = StopBootup;

var _bootup : BootUp;
function StartBootup() {
    _bootup = new BootUp("Black-Magic", $("#divRootUI"), $('head'));
    _bootup.Start();
    
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
