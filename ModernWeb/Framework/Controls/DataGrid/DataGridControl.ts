/// <reference path="..\..\UIRenderer.ts"/>
/// <reference path="..\..\Debugger.ts"/>
/// <reference path="..\FrameworkControl.ts"/>
/// <reference path="..\..\BootUp.ts"/>


declare var $;

class DataGridControl extends FrameworkControl {
   
    private _shadowDataItems: any;
    private _shadowColHeaderDataItems: any;
    private _overlay: any;
    private _isDisabled: bool = false;
    private _data: string;
    private _selectedItem: any;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string, public ParentUniqueID: string) {
        super(UIRenderer, Debugger, UniqueID, ParentUniqueID);

        this.UIRenderer.HideDiv(UniqueID);
    }

    public InitUI(startHeight: number) {
        this.Debugger.Log("DataGridControl:InitUI");

        this._shadowDataItems = this.UIRenderer.LoadDivInParent("divDataGridItems", this.UniqueID);
        this._shadowColHeaderDataItems = this.UIRenderer.LoadDivInParent("divDataGridHeaderItems", this.UniqueID);
        this._overlay = this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
        this._overlay.css("display", "none");
    }

    public UpdateFromLayout(rect: any) {
        this.Debugger.Log("DataGridControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);

        $("#" + this.UniqueID + " .DGCHR").css("width", rect.x2 - rect.x1 - 55);
    }


    public Enable() {
        this.Debugger.Log("DataGridControl:Enable ");
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

                var colHHtml : string = '<div class="DGCHR">';
                //colHHtml += '<div class="colh">' + "Header 1" + '</div>';
                //colHHtml += '<div class="colh">' + "Header 2" + '</div>';
                //colHHtml += '<div class="colh">' + "Header 3" + '</div>';
                //colHHtml += '<div class="colh">' + "Header 4" + '</div>';
                //colHHtml += '<div class="colh">' + "Header 5" + '</div>';
                //colHHtml += '<div class="colh">' + "Header 6" + '</div>';
                //colHHtml += '<div class="colh">' + "Header 7" + '</div>';
                colHHtml += '</div>';
                self.UIRenderer.LoadHTMLElement(null, self._shadowColHeaderDataItems, colHHtml);



                var nodeHtml: string = "";
                nodeHtml += '<div class="DGR"></div>'; //blank first row for headers
                $.each(r.result, function () {
                    
                    nodeHtml += '<div class="DGR" data-id="' + this.id + '">';
                    nodeHtml += '<div class="col">' + this.col1 + '</div>';
                    nodeHtml += '<div class="col">' + this.col2 + '</div>';
                    nodeHtml += '<div class="col">' + this.col3 + '</div>';
                    nodeHtml += '<div class="col">' + this.col4 + '</div>';
                    nodeHtml += '<div class="col">' + this.col5 + '</div>';
                    nodeHtml += '<div class="col">' + this.col6 + '</div>';
                    nodeHtml += '<div class="col">' + this.col7 + '</div>';
                    nodeHtml += '</div>';

                });
                self.UIRenderer.LoadHTMLElement(null, self._shadowDataItems, nodeHtml);

                var p = $("#" + self.UniqueID + " div[data-id]").each(function () {
                    $(this).off("click").on("click", this, function (e) {
                        if (self._selectedItem != null) {
                            //self._selectedItem.removeClass("ACSEL");
                            self._selectedItem.css("background", "").css("color", "black");
                        }

                        self._selectedItem = $(this);
                        //self._selectedItem.addClass("ACSEL");
                        self._selectedItem.css("background", "Orange").css("color", "white");
                        self.Debugger.Log("DataGridControl Item Clicked ID-" + $(this).data("id"));

                        _bootup.SceneManager.CurrentScene.RaiseNotification("notify1", '<div id="notify1">NOTIFICATION ' + $(this).data("id") + '</div>', 5000);


                    });
                });

            });
    }

}

