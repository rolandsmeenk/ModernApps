/// <reference path="..\..\UIRenderer.ts"/>
/// <reference path="..\..\Debugger.ts"/>
/// <reference path="..\FrameworkControl.ts"/>


declare var $;

class ModernIFrameControl extends FrameworkControl {
   
    private _shadowIFrame: any;
    private _overlay: any;
    private _loadUrlHandle: number;
    private _url: string;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string, public ParentUniqueID: string) {
        super(UIRenderer, Debugger, UniqueID, ParentUniqueID);

        this.UIRenderer.HideDiv(UniqueID);

        
    }

    public InitUI(startHeight: number) {
        this.Debugger.Log("ModernIFrameControl:InitUI");

        this._shadowIFrame = this.UIRenderer.LoadHTMLElement('modernIFrame', this._rootDiv, '<iframe id="modernIFrame" style="display:none;" />');
        this._overlay = this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
        this._overlay.css("display", "none");
    }

    public UpdateFromLayout(rect: any) {
        this.Debugger.Log("ModernIFrameControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);
        //$(".mceIframeContainer").height(rect.y2 - rect.y1 - 26);
    }

    public Enable() {
        this._overlay.css("display", "none");
    }

    public Disable() {
        this._overlay.css("display", "");
    }

    public Unload() {
        super.Unload();
    }


    public LoadUrl(url: string) {
        this.Debugger.Log("ModernIFrameControl:LoadUrl - " + url);

        this.Disable();
        this.TemporaryNotification("Loading", "loading '" + url + "'", "Loading");

        this._url = url;

        var self = this;

        this._loadUrlHandle = setInterval(function () {
            if (self._shadowIFrame.prop("readyState") == "complete") {
                clearInterval(self._loadUrlHandle);
                _bootup.Debugger.Log("finished loading - " + self._url);
                self.ClearTemporaryNotification("Loading");
                self.Enable();
            }
        }, 500);

        this._shadowIFrame.attr("src", url).show();


    }

    public TemporaryNotification(id: string, message: string, styleClass: string) {
        var loadingDiv = this.UIRenderer.LoadDivInParent(this.UniqueID + "_" + id, this.UniqueID);  //message, this.UniqueID + "_" + styleClass);
        loadingDiv.html(message);
        loadingDiv.addClass(styleClass);
    }

    public ClearTemporaryNotification(id: string) {
        this.UIRenderer.UnloadDiv(this.UniqueID + "_" + id);
    }
}

