/// <reference path="..\..\UIRenderer.ts"/>
/// <reference path="..\..\Debugger.ts"/>
/// <reference path="..\FrameworkControl.ts"/>


declare var $;

class NotificationCenterControl extends FrameworkControl {
   
    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string, public ParentUniqueID: string) {
        super(UIRenderer, Debugger, UniqueID, ParentUniqueID);

        
    }

    public InitUI(startHeight: number) {
        this.Debugger.Log("NotificationCenterControl:InitUI");

        this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
    }

    public UpdateFromLayout(left: number) {
        this.Debugger.Log("NotificationCenterControl:UpdateFromLayout " + left);
        //this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);
        this._rootDiv.css("left", left);
    }

    public Unload() {
        this.Debugger.Log("NotificationCenterControl:Unload ");
        super.Unload();
    }

    public Show(id: string, htmlMessage:string, durationms: number) {
        super.Show(null, null, null);
        this.Debugger.Log("NotificationCenterControl:Show " + id);
        var newItem = this.UIRenderer.LoadHTMLElement(id, this._rootDiv, htmlMessage);
        newItem.fadeTo(0, 0);
        newItem.fadeTo(400, 1);

        setTimeout("_bootup.SceneManager.CurrentScene.CloseNotification('" + id + "')", durationms);

    }

    public UnloadItem(id) {
        this.Debugger.Log("NotificationCenterControl:UnloadItem - " + id);
        var _self = this;
        this.UIRenderer.FindDiv(id).fadeTo(400, 0, function () {
            _self.UIRenderer.UnloadDiv(id);
        });
        
    }

}

