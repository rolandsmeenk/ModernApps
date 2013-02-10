/// <reference path="AssetLoader.ts"/>

/// <reference path="DataLoader.ts"/>
/// <reference path="Debugger.ts"/>

/// <reference path="LanguageResources.ts"/>

/// <reference path="SceneManager.ts"/>
/// <reference path="Theme.ts"/>

/// <reference path="UsageStats.ts"/>
/// <reference path="UIRenderer.ts"/>

/// <reference path="controls\RichTextEditor\wysihtml5.ts"/>

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

    constructor(theme: string, rootUI: any, headUI: any) {

        this.UIRenderer = new UIRenderer(rootUI, headUI);
        this.Debugger = new Debugger(this.UIRenderer, 40);
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
        


        this.SceneManager.MasterLayoutScene.ShowLoading("Loading...");
        this.SceneManager.Start();

        
        //start loading the forum details
        this.DataLoader.RetrieveData(
            "GetForums",
            "POST",
            { id: 100 },
            "html",
            function (result: any) {
                _bootup.SceneManager.MasterLayoutScene.HideLoading();
                
                _bootup.SceneManager.MasterLayoutScene.Show();

            });

        
        setTimeout("_bootup.InitSimpleEditor();", 2000);
    }


    public Stop() {
        this.Debugger.Log("BootUp:Stop");
        this.Debugger.Stop();

        this.SceneManager.Stop();
    }

    public Unload() {
        this.Debugger.Log("BootUp:Unload");
        this.SceneManager.Unload();
    }



    public InitSimpleEditor() {
        var wysihtml5ParserRules = {
            tags: {
                strong: {},
                b: {},
                i: {},
                em: {},
                br: {},
                p: {},
                div: {},
                span: {},
                ul: {},
                ol: {},
                li: {},
                a: {
                    set_attributes: {
                        target: "_blank",
                        rel: "nofollow"
                    },
                    check_attributes: {
                        href: "url" // important to avoid XSS
                    }
                }
            }
        };


        this.Debugger.Log("Bootup: InitSimpleEditor - 1");
        var wysihtml5 = new wysi(this.Debugger);
        this.Debugger.Log("Bootup: InitSimpleEditor - 2");

        var editor = wysihtml5.CreateEditor("textarea", {
            toolbar: "toolbar",
            parserRules: wysihtml5ParserRules
        });
        this.Debugger.Log("Bootup: InitSimpleEditor - 3");

        var log = document.getElementById("log");

        this.Debugger.Log("Bootup: InitSimpleEditor - 4");

        editor.on("load", function () {
            log.innerHTML += "<div>load</div>";
        })
          .on("focus", function () {
              log.innerHTML += "<div>focus</div>";
          })
          .on("blur", function () {
              log.innerHTML += "<div>blur</div>";
          })
          .on("change", function () {
              log.innerHTML += "<div>change</div>";
          })
          .on("paste", function () {
              log.innerHTML += "<div>paste</div>";
          })
          .on("newword:composer", function () {
              log.innerHTML += "<div>newword:composer</div>";
          })
          .on("undo:composer", function () {
              log.innerHTML += "<div>undo:composer</div>";
          })
          .on("redo:composer", function () {
              log.innerHTML += "<div>redo:composer</div>";
          });

        this.Debugger.Log("Bootup: InitSimpleEditor - 5");
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




