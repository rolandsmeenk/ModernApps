/// <reference path="..\..\UIRenderer.ts"/>
/// <reference path="..\..\Debugger.ts"/>
/// <reference path="..\FrameworkControl.ts"/>

/// <reference path="..\WebUI\application.appcontainer.ts"/>



declare var $;

class InfiniteCanvasControl extends FrameworkControl {
   
    private _shadowCanvas: any;

    private _AppContainer: AppContainer;


    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string, public ParentUniqueID: string) {
        super(UIRenderer, Debugger, UniqueID, ParentUniqueID);

        this._shadowCanvas = this.UIRenderer.LoadCanvasInParent("infiniteCanvas", this._rootDiv);
        this._AppContainer = new AppContainer();
        this._AppContainer.CheckBrowserCompatibility(this._shadowCanvas);
    }

    public InitUI(startHeight: number) {
        this.Debugger.Log("InfiniteCanvasControl:InitUI");

        this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
    }

    public InitTheme(theme: Theme) {
        this._shadowCanvas.css("background-color", theme.AccentColor1);
    }


    public UpdateFromLayout(rect: any) {
        this.Debugger.Log("InfiniteCanvasControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);
        this._shadowCanvas.attr("width", rect.x2 - rect.x1).attr("height", rect.y2 - rect.y1);
        this._AppContainer.LayoutUpdated();
        //$(".mceIframeContainer").height(rect.y2 - rect.y1 - 26);

    }


    public Unload() {

        this._AppContainer.Unload();

        this._shadowCanvas.remove();

        super.Unload();
    }


}

