/// <reference path="Controls/LoadingControl.ts"/>
/// <reference path="Controls/AppBarControl.ts"/>
/// <reference path="Layouts/MasterLayout.ts"/>

declare var $;

class SceneManager {

    public CurrentScene: MasterLayout;
    public CurrentAct: any;

    private _animationDurationMs: number = 450;


    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {
        
        this.Debugger.Log("SceneManager:Constructor");

        //this.CurrentScene = new DemoLogin01(this.UIRenderer, this.Debugger);
    }

    public NavigateToScene(to: string) {
        this.Debugger.Log("SceneManager:NavigateToScene - " + to);

        var _self = this;

        
        if (this.CurrentScene != null) {
            //there is already a scene in view so uload it in a nice user friendly way 

            this.CurrentScene.HideAppBar();

            //wait several ms while current UI nicely animates out of existence, in the mean time
            //fade out the UI
            this.UIRenderer.RootUI.animate(
                {
                    opacity: 0,
                    top: "-=100"
                },
                this._animationDurationMs,
                function () {
                    //the current UI has had time to fade out and various UI bits have had time to 
                    //nicely animate out (whichever way they want to)

                    //now physically unload previous scene
                    _self.CurrentScene.Stop();
                    _self.CurrentScene.Unload();
                    _self.CurrentScene = null;

                    //load new scene
                    _self._loadScene(to, _self, true);
                }
            );

        } else {

            //nothing is currently loaded so load the new scene
            this._loadScene(to, _self, false);
        }


    }


    private _loadScene(to: string, _self: any, showMainUI: bool) {
        this.Debugger.Log("SceneManager:_loadScene - " + to);

        //load new scene
        $.getScript('/Framework/Scenes/' + to + '.js', function () {
            eval('_self.CurrentScene = new ' + to + '(_self.UIRenderer, _self.Debugger);_self._start();');
            if (showMainUI) _self.ShowMainUI(_self._animationDurationMs);
        });
    }




    public ShowMainUI(timeMs: number) {
        this.Debugger.Log("SceneManager:ShowMainUI - " + timeMs);
        this.UIRenderer.RootUI.animate(
            {
                opacity: 1.0,
                top: "+=100"
            },
            timeMs,
            function () {
              
            }
        );
    }


    public NavigateToAct(to: string) {
        this.Debugger.Log("SceneManager:NavigateToAct - " + to);

    

    }



    private _start() {
        this.Debugger.Log("SceneManager:Start");

        this.CurrentScene.Start();
        this.CurrentScene.ShowLoading("Loading...");


        var _self = this;
        setTimeout(function () {
            _self.CurrentScene.HideLoading();
            _self.CurrentScene.Show([],[]);
        }, 100);


    }

    private _stop() {
        this.Debugger.Log("SceneManager:Stop");
        this.CurrentScene.Stop();
    }

    public Unload() {
        this.CurrentScene.Stop();
        this.CurrentScene.Unload();
    }

}



