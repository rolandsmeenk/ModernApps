var BootUp = (function () {
    function BootUp(theme, rootUI, headUI) {
        this.UIRenderer = new UIRenderer(rootUI, headUI);
        this.Debugger = new Debugger(this.UIRenderer, 40);
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
        this.SceneManager.MasterLayoutScene.ShowLoading("Loading...");
        this.SceneManager.Start();
        this.DataLoader.RetrieveData("GetForums", "POST", {
            id: 100
        }, "html", function (result) {
            _bootup.SceneManager.MasterLayoutScene.HideLoading();
            _bootup.SceneManager.MasterLayoutScene.Show();
        });
    };
    BootUp.prototype.Stop = function () {
        this.Debugger.Log("BootUp:Stop");
        this.Debugger.Stop();
        this.SceneManager.Stop();
    };
    BootUp.prototype.Unload = function () {
        this.Debugger.Log("BootUp:Unload");
        this.SceneManager.Unload();
    };
    BootUp.prototype.InitSimpleEditor = function () {
        var wysihtml5ParserRules = {
            tags: {
                strong: {
                },
                b: {
                },
                i: {
                },
                em: {
                },
                br: {
                },
                p: {
                },
                div: {
                },
                span: {
                },
                ul: {
                },
                ol: {
                },
                li: {
                },
                a: {
                    set_attributes: {
                        target: "_blank",
                        rel: "nofollow"
                    },
                    check_attributes: {
                        href: "url"
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
        }).on("focus", function () {
            log.innerHTML += "<div>focus</div>";
        }).on("blur", function () {
            log.innerHTML += "<div>blur</div>";
        }).on("change", function () {
            log.innerHTML += "<div>change</div>";
        }).on("paste", function () {
            log.innerHTML += "<div>paste</div>";
        }).on("newword:composer", function () {
            log.innerHTML += "<div>newword:composer</div>";
        }).on("undo:composer", function () {
            log.innerHTML += "<div>undo:composer</div>";
        }).on("redo:composer", function () {
            log.innerHTML += "<div>redo:composer</div>";
        });
        this.Debugger.Log("Bootup: InitSimpleEditor - 5");
    };
    return BootUp;
})();
window.onload = StartBootup;
window.onunload = StopBootup;
var _bootup;
function StartBootup() {
    _bootup = new BootUp("Black-Magic", $("#divRootUI"), $('head'));
    _bootup.Start();
}
function StopBootup() {
    _bootup.Stop();
    _bootup.Unload();
}
