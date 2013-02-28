/// <reference path="..\..\UIRenderer.ts"/>
/// <reference path="..\..\Debugger.ts"/>
/// <reference path="..\FrameworkControl.ts"/>


declare var $;

class InfiniteCanvasControl extends FrameworkControl {
   
    private _shadowCanvas: any;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string, public ParentUniqueID: string) {
        super(UIRenderer, Debugger, UniqueID, ParentUniqueID);

        this._shadowCanvas = this.UIRenderer.LoadCanvasInParent("infiniteCanvas", this._rootDiv);
    }

    public InitUI(startHeight: number) {
        this.Debugger.Log("InfiniteCanvasControl:InitUI");

        this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
    }

    public UpdateFromLayout(rect: any) {
        this.Debugger.Log("InfiniteCanvasControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);
        //$(".mceIframeContainer").height(rect.y2 - rect.y1 - 26);
    }


    public Unload() {
        super.Unload();
    }


}

