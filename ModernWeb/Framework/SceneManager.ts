/// <reference path="Controls/LoadingControl.ts"/>
/// <reference path="Controls/AppBarControl.ts"/>
/// <reference path="Layouts/MasterLayout.ts"/>

declare var $;

class SceneManager {

    public CurrentScene: MasterLayout;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {
        
        this.Debugger.Log("SceneManager:Constructor");

        //this.CurrentScene = new DemoLogin01(this.UIRenderer, this.Debugger);
    }

    public NavigateToScene(to: string) {
        this.Debugger.Log("SceneManager:NavigateTo - " + to);

        //unload current scene
        if (this.CurrentScene != null) {
            this.CurrentScene.Stop(); 
            this.CurrentScene.Unload();
            this.CurrentScene = null;
        }

        //load new scene
        var _self = this;
        $.getScript('/Framework/Scenes/' + to + '.js', function () {
            eval('_self.CurrentScene = new ' + to + '(_self.UIRenderer, _self.Debugger);_self._start();');
        });



    }


    public NavigateToAct(to: string) {

    }


    private _start() {
        this.Debugger.Log("SceneManager:Start");

        this.CurrentScene.Start();
        this.CurrentScene.ShowLoading("Loading...");


        var _self = this;
        setTimeout(function () {
            _self.CurrentScene.HideLoading();
            _self.CurrentScene.Show();
        }, 300);


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



