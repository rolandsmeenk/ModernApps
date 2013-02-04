/// <reference path="Controls/LoadingControl.ts"/>
/// <reference path="Controls/AppBarControl.ts"/>
/// <reference path="Controls/MasterLayoutScreen.ts"/>

declare var $;

class ScreenManager {

    public MasterLayoutScreen: MasterLayoutScreen;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {
        this.MasterLayoutScreen = new MasterLayoutScreen(UIRenderer, Debugger);

        this.Debugger.Log("ScreenManager:Constructor");
    }

    

    public Start() {
        this.Debugger.Log("ScreenManager:Start");

        this.MasterLayoutScreen.Start();

    }

    public Stop() {
        this.Debugger.Log("ScreenManager:Stop");
        this.MasterLayoutScreen.Stop();
    }

}



