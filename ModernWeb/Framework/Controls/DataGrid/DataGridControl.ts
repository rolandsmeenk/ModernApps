/// <reference path="..\..\UIRenderer.ts"/>
/// <reference path="..\..\Debugger.ts"/>
/// <reference path="..\FrameworkControl.ts"/>


declare var $;

class DataGridControl extends FrameworkControl {
   
    private _shadowDataItems: any;
    private _overlay: any;
    private _isDisabled: bool = false;
    private _data: string;
    
    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string, public ParentUniqueID: string) {
        super(UIRenderer, Debugger, UniqueID, ParentUniqueID);

        this.UIRenderer.HideDiv(UniqueID);
    }

    public InitUI(startHeight: number) {
        this.Debugger.Log("DataGridControl:InitUI");

        this._shadowDataItems = this.UIRenderer.LoadDivInParent("divDataGridItems", this.UniqueID);
        this._overlay = this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
        this._overlay.css("display", "none");
    }

    public UpdateFromLayout(rect: any) {
        this.Debugger.Log("DataGridControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);
    }


    public Enable() {
        this.Debugger.Log("DataGridControl:Disable ");
        this._isDisabled = false;
        this._overlay.css("display", "none");
    }

    public Disable(opacity: number) {
        this.Debugger.Log("DataGridControl:Disable ");
        if (this._isDisabled) return;

        this._isDisabled = true;
        this._overlay.css("display", "");
        this._overlay.css("opacity", opacity);
    }


    public Unload() {
        super.Unload();
    }

    public LoadData(data: string, params: any) {
        this.Debugger.Log("DataGridControl:LoadData - " + data);

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
                    var nodeHtml: string = "";


                    nodeHtml += '<div class="DGR">';
                    nodeHtml += '<div class="col">' + this.col1 + '</div>';
                    nodeHtml += '<div class="col">' + this.col2 + '</div>';
                    nodeHtml += '<div class="col">' + this.col3 + '</div>';
                    nodeHtml += '<div class="col">' + this.col4 + '</div>';
                    nodeHtml += '<div class="col">' + this.col5 + '</div>';
                    nodeHtml += '<div class="col">' + this.col6 + '</div>';
                    nodeHtml += '<div class="col">' + this.col7 + '</div>';
                    nodeHtml += '</div>';

                    
                    self.UIRenderer.LoadHTMLElement(null, self._shadowDataItems, nodeHtml);
                });

            });
    }

}

