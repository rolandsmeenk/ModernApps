/// <reference path="AssetLoader.ts"/>

/// <reference path="DataLoader.ts"/>
/// <reference path="Debugger.ts"/>

/// <reference path="LanguageResources.ts"/>

/// <reference path="ScreenManager.ts"/>
/// <reference path="Theme.ts"/>

/// <reference path="UsageStats.ts"/>
/// <reference path="UIRenderer.ts"/>


declare var $;

class BootUp {
    
    public AssetLoader: AssetLoader;
    public DataLoader: DataLoader;
    public Debugger: Debugger;
    public LanguageResources: LanguageResources;
    public ScreenManager: ScreenManager;
    public Theme: Theme;
    public UsageStats: UsageStats;
    public UIRenderer: UIRenderer;

    constructor(theme: string, rootUI: any, headUI: any) {

        this.UIRenderer = new UIRenderer(rootUI, headUI);
        this.Debugger = new Debugger(this.UIRenderer, 20);
        this.Theme = new Theme(theme, this.UIRenderer, this.Debugger);
        this.LanguageResources = new LanguageResources();
        this.ScreenManager = new ScreenManager(this.UIRenderer, this.Debugger);
        this.AssetLoader = new AssetLoader();
        this.DataLoader = new DataLoader(this.Debugger);
        this.UsageStats = new UsageStats();
        
    }

    public Start() {


        this.Debugger.Start();
        this.Debugger.Log("BootUp:Start");
        


        this.ScreenManager.MasterLayoutScreen.ShowLoading("Loading...");
        this.ScreenManager.Start();

        
        //start loading the forum details
        this.DataLoader.RetrieveData(
            "GetForums",
            "POST",
            { id: 100 },
            "html",
            function (result: any) {
                _bootup.ScreenManager.MasterLayoutScreen.HideLoading();
                
                _bootup.ScreenManager.MasterLayoutScreen.Show();

            });


        
    }

    public Stop() {
        this.Debugger.Log("BootUp:Stop");
        this.Debugger.Stop();

        this.ScreenManager.Stop();
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
}


