/// <reference path="Controls/LoadingControl.ts"/>
/// <reference path="Controls/AppBarControl.ts"/>
/// <reference path="Scenes/MasterLayoutScene.ts"/>

declare var $;

class SceneManager {

    public MasterLayoutScene: MasterLayoutScene;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {
        this.MasterLayoutScene = new MasterLayoutScene(UIRenderer, Debugger);

        this.Debugger.Log("SceneManager:Constructor");
    }

    

    public Start() {
        this.Debugger.Log("SceneManager:Start");

        this.MasterLayoutScene.Start();

    }

    public Stop() {
        this.Debugger.Log("SceneManager:Stop");
        this.MasterLayoutScene.Stop();
    }

}



