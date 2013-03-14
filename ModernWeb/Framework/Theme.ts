/// <reference path="UIRenderer.ts"/>
/// <reference path="Debugger.ts"/>

declare var $;

class Theme {

    public AccentColor1: string;
    public AccentColor2: string;
    public AccentColor3: string;
    public AccentColor4: string;

    constructor(public Theme: string, public UIRenderer: UIRenderer, public Debugger: Debugger) {

        //this.Debugger.Log("Theme:Constructor");
        this.UIRenderer.LoadCSS(this.Theme);
        
    }

}

