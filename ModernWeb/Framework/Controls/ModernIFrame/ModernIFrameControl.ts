/// <reference path="..\..\UIRenderer.ts"/>
/// <reference path="..\..\Debugger.ts"/>
/// <reference path="..\FrameworkControl.ts"/>


declare var $;

class ModernIFrameControl extends FrameworkControl {
   
    private _shadowIFrame: any;
    private _overlay: any;
    private _loadUrlHandle: number;
    private _url: string;
    private _isDisabled: bool = false;
    private _shortCircuit = 9; //9 intervals then force a stop
    private _isLoadedWithData: bool = false;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string, public ParentUniqueID: string) {
        super(UIRenderer, Debugger, UniqueID, ParentUniqueID);

        this.UIRenderer.HideDiv(UniqueID);

        
    }

    public InitUI(startHeight: number) {
        this.Debugger.Log("ModernIFrameControl:InitUI");

        this._shadowIFrame = this.UIRenderer.LoadHTMLElement('modernIFrame', this._rootDiv, '<iframe id="modernIFrame" name="modernIFrame"  style="display:none;" />');
        this._overlay = this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
        this._overlay.css("display", "none");
    }

    public UpdateFromLayout(rect: any) {
        this.Debugger.Log("ModernIFrameControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);
        //$(".mceIframeContainer").height(rect.y2 - rect.y1 - 26);
    }

    public Enable() {
        this.Debugger.Log("ModernIFrameControl:Disable ");
        this._isDisabled = false;
        this._overlay.css("display", "none");
    }

    public Disable(opacity: number) {
        this.Debugger.Log("ModernIFrameControl:Disable ");
        if (this._isDisabled) return;

        this._isDisabled = true;
        this._overlay.css("display", "");
        this._overlay.css("opacity", opacity);
    }

    public Unload() {
        this.Debugger.Log("ModernIFrameControl:Unload ");

        this._shadowIFrame.remove();
        this._overlay.remove();

        super.Unload();
    }


    public LoadUrl(url: string) {
        this.Debugger.Log("ModernIFrameControl:LoadUrl - " + url);

        if(this._isDisabled) return;

        if (this._isLoadedWithData) this.AnimateOut();

        this._shortCircuit = 2;
        this.Disable(0.8);
        //this.TemporaryNotification("loading '" + url + "'", "Loading");

        this._url = url;

        var self = this;

        this._loadUrlHandle = setInterval(function () {
            self._shortCircuit--;
            if (self._shadowIFrame.prop("readyState") == "complete" || self._shortCircuit == 0) {
                clearInterval(self._loadUrlHandle);
                _bootup.Debugger.Log("finished loading - " + self._url);
                //self.ClearTemporaryNotification();
                self.Enable();
            }
        }, 500);

        this._shadowIFrame.attr("src", url).show();

        this._isLoadedWithData = true;

        this.AnimateIn();
    }


    public AnimateIn() {
        var p = $("#" + this.UniqueID).animate({ opacity: 1.0, marginLeft: "0" }, 600 );
    }

    public AnimateOut() {
        this._isLoadedWithData = false;
        var p = $("#" + this.UniqueID).animate({ opacity: 0, marginLeft: "-50px" }, 100);
    }

}

