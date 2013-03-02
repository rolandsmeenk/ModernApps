/// <reference path="Controls/LoadingControl.ts"/>
/// <reference path="Controls/AppBarControl.ts"/>
/// <reference path="Layouts/MasterLayout.ts"/>
/// <reference path="Scenes/DemoModernIFrame.ts"/>

declare var $;

class SceneManager {

    public CurrentScene: MasterLayout;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {
        this.CurrentScene = new DemoModernIFrame(UIRenderer, Debugger);

        this.Debugger.Log("SceneManager:Constructor");
    }

    

    public Start() {
        this.Debugger.Log("SceneManager:Start");

        this.CurrentScene.Start();

    }

    public Stop() {
        this.Debugger.Log("SceneManager:Stop");
        this.CurrentScene.Stop();
    }

    public Unload() {
        this.CurrentScene.Unload();
    }

}



