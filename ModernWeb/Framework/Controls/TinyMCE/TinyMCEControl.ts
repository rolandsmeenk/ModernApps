/// <reference path="..\..\UIRenderer.ts"/>
/// <reference path="..\..\Debugger.ts"/>
/// <reference path="..\FrameworkControl.ts"/>


declare var $;

class TinyMCEControl extends FrameworkControl {
   
    private _shadowTextArea: any;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string, public ParentUniqueID: string) {
        super(UIRenderer, Debugger, UniqueID, ParentUniqueID);

        this._shadowTextArea = this.UIRenderer.LoadTextAreaInParent("elm1", this._rootDiv);
    }

    public InitUI(startHeight: number) {
        this.Debugger.Log("TinyMCEControl:InitUI");
        tinyMCE.init({
            mode: "textareas",
            theme: "simple"
        });
        this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);

        //wait 15ms till control is finished loading then redimension it
        setTimeout(function () {
            $(".mceIframeContainer").height(startHeight - 26);
        }, 15);
        
    }


    private _rect: any;
    public UpdateFromLayout(rect: any) {
        this.Debugger.Log("TinyMCEControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rect = rect;
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1 - 35);
        $(".mceIframeContainer").height(rect.y2 - rect.y1 - 26);
    }


    public Unload() {
        super.Unload();
    }


}

