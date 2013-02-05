/// <reference path="Controls/LoadingControl.ts"/>
/// <reference path="Controls/AppBarControl.ts"/>
/// <reference path="Controls/MasterLayoutScreen.ts"/>

declare var $;

class SceneManager {

    public MasterLayoutScreen: MasterLayoutScreen;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {
        this.MasterLayoutScreen = new MasterLayoutScreen(UIRenderer, Debugger);

        this.Debugger.Log("SceneManager:Constructor");
    }

    

    public Start() {
        this.Debugger.Log("SceneManager:Start");

        this.MasterLayoutScreen.Start();

    }

    public Stop() {
        this.Debugger.Log("SceneManager:Stop");
        this.MasterLayoutScreen.Stop();
    }

}



