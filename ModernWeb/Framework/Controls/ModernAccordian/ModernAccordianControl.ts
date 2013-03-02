/// <reference path="..\..\UIRenderer.ts"/>
/// <reference path="..\..\Debugger.ts"/>
/// <reference path="..\FrameworkControl.ts"/>


declare var $;

class ModernAccordianControl extends FrameworkControl {
   
    private _shadowMenuItems: any;
    private _overlay: any;
    private _isDisabled: bool = false;
    private _data: string;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string, public ParentUniqueID: string) {
        super(UIRenderer, Debugger, UniqueID, ParentUniqueID);


        this.UIRenderer.HideDiv(UniqueID);
    }

    public InitUI(startHeight: number) {
        this.Debugger.Log("ModernAccordianControl:InitUI");

        this._shadowMenuItems = this.UIRenderer.LoadDivInParent("divModernAccordianItems", this.UniqueID);
        this._overlay = this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
        this._overlay.css("display", "none");
    }

    public UpdateFromLayout(rect: any) {
        this.Debugger.Log("ModernAccordianControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);
    }


    public Enable() {
        this.Debugger.Log("ModernAccordianControl:Disable ");
        this._isDisabled = false;
        this._overlay.css("display", "none");
    }

    public Disable(opacity: number) {
        this.Debugger.Log("ModernAccordianControl:Disable ");
        if (this._isDisabled) return;

        this._isDisabled = true;
        this._overlay.css("display", "");
        this._overlay.css("opacity", opacity);
    }


    public Unload() {
        super.Unload();
    }


    public LoadData(data: string, params: any) {
        this.Debugger.Log("ModernAccordianControl:LoadData - " + data);

        if (this._isDisabled) return;

        this._data = data;
        this.Disable(0.8);
        this.TemporaryNotification("loading ... ", "Loading");

        var self = this;


        //start loading the data
        _bootup.DataLoader.RetrieveData(
            data,
            "POST",
            params,
            "json",
            function (r: any) {
                _bootup.Debugger.Log("finished loading - " + self._data);

                self.ClearTemporaryNotification();
                self.Enable();

                $.each(r.result, function () {
                    self.UIRenderer.AppendToDiv(self._shadowMenuItems.attr("id"), this.name, "AR");
                });

            });
    }



}

