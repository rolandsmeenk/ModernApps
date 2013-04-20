/// <reference path="UIRenderer.ts"/>
/// <reference path="Debugger.ts"/>

declare var $;

class Theme {

    public AccentColor1: string;
    public AccentColor2: string;
    public AccentColor3: string;
    public AccentColor4: string;
    public BackgroundColor: string;
    public ForegroundColor: string;

    constructor(public Theme: string, public UIRenderer: UIRenderer, public Debugger: Debugger) {

        //this.Debugger.Log("Theme:Constructor");
        this.UIRenderer.LoadCSS(this.Theme);
        
    }


    public GetTheme(code: string) {

        var ret = {
            "accent1": "#0281d5",
            "accent2": "#2a91d5",
            "accent3": "#56a4d8",
            "accent4": "#77b5de",
            "backgroundColor": "#fff",
            "foregroundColor": "#000",
        };

        switch (code) {
            case "10":
                ret.accent1 = "#0281d5";
                ret.accent2 = "#2a91d5";
                ret.accent3 = "#87b5d3";
                ret.backgroundColor = "#0281d5";
                break;
            case "20":
                ret.accent1 = "#ff5e23";
                ret.accent2 = "#d55221";
                ret.accent3 = "#d99278";
                ret.backgroundColor = "#ff5e23";
                break;
            case "30":
                ret.accent1 = "#7e00a9";
                ret.accent2 = "#590176";
                ret.accent3 = "#7c4d8b";
                ret.backgroundColor = "#7e00a9";
                break;
            case "40":
                ret.accent1 = "#228500";
                ret.accent2 = "#1b6800";
                ret.accent3 = "#6c965e";
                ret.backgroundColor = "#228500";
                break;
            case "50":
                ret.accent1 = "#dd00ff";
                ret.accent2 = "#a700c1";
                ret.accent3 = "#be82c7";
                ret.backgroundColor = "#dd00ff";
                break;
            case "60":
                ret.accent1 = "#d33a00";
                ret.accent2 = "#a72e00";
                ret.accent3 = "#cb876d";
                ret.backgroundColor = "#d33a00";
                break;
            case "70":
                ret.accent1 = "#ffa500";
                ret.accent2 = "#d38800";
                ret.accent3 = "#e2b665";
                ret.backgroundColor = "#ffa500";
                break;
            default:
                ret.accent1 = "#0281d5";
                ret.accent2 = "#2a91d5";
                ret.accent3 = "#89bbdc";
                ret.backgroundColor = "#0281d5";
                break;
        }

        return ret;

    }
}

