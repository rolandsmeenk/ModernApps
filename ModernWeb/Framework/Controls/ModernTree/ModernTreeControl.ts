/// <reference path="..\..\UIRenderer.ts"/>
/// <reference path="..\..\Debugger.ts"/>
/// <reference path="..\FrameworkControl.ts"/>


declare var $;

class ModernTreeControl extends FrameworkControl {
   
    private _shadowCanvas: any;
    private _overlay: any;
    private _isDisabled: bool = false;


    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string, public ParentUniqueID: string) {
        super(UIRenderer, Debugger, UniqueID, ParentUniqueID);

        this.UIRenderer.HideDiv(UniqueID);

        
    }

    public InitUI(startHeight: number) {
        this.Debugger.Log("ModernTreeControl:InitUI");

        this._shadowCanvas = this.UIRenderer.LoadCanvasInParent("modernTree", this._rootDiv);
        this._overlay = this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
        this._overlay.css("display", "none");
        this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
    }

    public UpdateFromLayout(rect: any) {
        this.Debugger.Log("ModernTreeControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);
        //$(".mceIframeContainer").height(rect.y2 - rect.y1 - 26);
    }


    public Enable() {
        this.Debugger.Log("ModernTreeControl:Enable ");
        this._isDisabled = false;
        this._overlay.css("display", "none");
    }

    public Disable(opacity: number) {
        this.Debugger.Log("ModernTreeControl:Disable ");
        if (this._isDisabled) return;

        this._isDisabled = true;
        this._overlay.css("display", "");
        this._overlay.css("opacity", opacity);
    }


    public Unload() {

        this._overlay.remove();
        this._shadowCanvas.remove();

        super.Unload();
    }


}

