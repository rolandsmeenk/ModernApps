/// <reference path="..\..\UIRenderer.ts"/>
/// <reference path="..\..\Debugger.ts"/>
/// <reference path="..\FrameworkControl.ts"/>


declare var $;

class ModernIFrameControl extends FrameworkControl {
   
    private _shadowIFrame: any;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string, public ParentUniqueID: string) {
        super(UIRenderer, Debugger, UniqueID, ParentUniqueID);

        this._shadowIFrame = this.UIRenderer.LoadHTMLElement('modernIFrame', this._rootDiv, '<iframe id="modernIFrame" src="http://www.westpac.com.au" style="display:none;" />');
        
    }

    public InitUI(startHeight: number) {
        this.Debugger.Log("ModernIFrameControl:InitUI");

        this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
    }

    public UpdateFromLayout(rect: any) {
        this.Debugger.Log("ModernIFrameControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);
        //$(".mceIframeContainer").height(rect.y2 - rect.y1 - 26);
    }


    public Unload() {
        super.Unload();
    }


}

