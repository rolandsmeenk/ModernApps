/// <reference path="UIRenderer.ts"/>
/// <reference path="Debugger.ts"/>

declare var $;

class Theme {

    constructor(public Theme: string, public UIRenderer: UIRenderer, public Debugger: Debugger) {

        //this.Debugger.Log("Theme:Constructor");
        this.UIRenderer.LoadCSS(this.Theme);
        
    }

}

