/// <reference path="..\..\UIRenderer.ts"/>
/// <reference path="..\..\Debugger.ts"/>
/// <reference path="..\FrameworkControl.ts"/>


declare var $;

class ModernAccordianControl extends FrameworkControl {
   
    private _shadowMenuItems: any;
    private _overlay: any;
    private _isDisabled: bool = false;
    private _data: string;
    private _selectedItem: any;

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
        this.Debugger.Log("ModernAccordianControl:Unload ");
        this._shadowMenuItems.remove();
        this._overlay.remove();

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
                    var nodeHtml: string = "";

                    nodeHtml += '<div class="AR">';
                    nodeHtml += this.name;
                    nodeHtml += '</div>';

                    var parentNode = this;
                    if (this.children != null) {
                        $.each(this.children, function () {

                            var tdata = "";
                            if (this.data != null) tdata = this.data;

                            nodeHtml += '<div class="ARC" data-id="' + this.id + '" data-parent="' + parentNode.id + '" data-dat="' + tdata + '" >';
                            nodeHtml += '<div class="childname">' + this.name + '</div>';

                            if (this.count != null) {
                                nodeHtml += '<div class="count">' + this.count + '</div>';
                            }

                            nodeHtml += '</div>';

                        });
                    }
                    
                    self.UIRenderer.LoadHTMLElement(null, self._shadowMenuItems, nodeHtml);

                });

                var p = $("#" + self.UniqueID + " div[data-parent]").each(function () {
                    $(this).off("click").on("click", this, function (e) {
                        if (self._selectedItem != null) {
                            //self._selectedItem.removeClass("ACSEL");
                            self._selectedItem.css("background", "").css("color", "black");
                        }
                        
                        self._selectedItem = $(this);
                        //self._selectedItem.addClass("ACSEL");
                        self._selectedItem.css("background", "Orange").css("color", "white");
                        self.Debugger.Log("Accordian Item Clicked ID-" + $(this).data("id") + " , ParentID-" + $(this).data("parent") + " , Data-" + $(this).data("dat"));

                        self.ProcessActionSceneAct($(this).data("dat"));
                    });
                });
                self.Debugger.Log("#" + self.UniqueID + " div[data-parent]" + " - " + p.length);

            });


        

    }



}

