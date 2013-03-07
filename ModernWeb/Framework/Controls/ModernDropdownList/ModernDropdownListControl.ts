/// <reference path="..\..\UIRenderer.ts"/>
/// <reference path="..\..\Debugger.ts"/>
/// <reference path="..\FrameworkControl.ts"/>


declare var $;

class ModernDropdownListControl extends FrameworkControl {
   
    private _shadowTextBox: any;
    private _shadowIcon: any;
    private _shadowPopup : any;

    private _rect: any;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string, public ParentUniqueID: string) {
        super(UIRenderer, Debugger, UniqueID, ParentUniqueID);

        this._shadowTextBox = this.UIRenderer.LoadHTMLElement(this.UniqueID + "_TB", this._rootDiv, '<input id="' + this.UniqueID + "_TB" + '" type="text" />');
        
        this.UIRenderer.LoadHTMLElement(null, this._rootDiv, '<img src="/Content/Icons/Light/feature.search.png"  class="icoSearch" />');
        this._shadowIcon = this.UIRenderer.FindHTMLElementInParentByClass("icoSearch", this.UniqueID);

        this._shadowPopup = this.UIRenderer.LoadHTMLElement(this.UniqueID + "_popup", this._rootDiv, '<div id="' + this.UniqueID + "_popup" + '" />');



        var _self = this;
        this._shadowTextBox.off("focus").on("focus", function (event) {
            if (_self._shadowTextBox.val().length > 0) {
                _self._shadowIcon.hide();
                _self._shadowPopup.show();
            } else {
                _self._shadowIcon.show();
                _self._shadowPopup.hide();
            }
        });
        this._shadowTextBox.off("input").on("input", function (event) {
            if (_self._shadowTextBox.val().length > 0) {
                _self._shadowIcon.hide();
                _self._shadowPopup.show();
            } else {
                _self._shadowIcon.show();
                _self._shadowPopup.hide();
            }
        });
        this._shadowTextBox.off("blur").on("blur", function (event) {
            _self._shadowIcon.show();
            _self._shadowPopup.hide();
        });
    }

    public InitUI(startHeight: number) {
        this.Debugger.Log("ModernFilterBoxControl:InitUI");
        
        //this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
    }

    public UpdateFromLayout(rect: any) {
        this.Debugger.Log("ModernFilterBoxControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rect = rect;

        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);
        this._shadowTextBox.width(rect.x2 - rect.x1 - 35);
        this._shadowIcon.css("left", rect.x2 - 60).css("top", "5px").show();

        this._shadowPopup.css("left", "10px").css("top", "55px").width(rect.x2 - rect.x1 - 35);

        //$(".mceIframeContainer").height(rect.y2 - rect.y1 - 26);
    }


    public Unload() {
        this.Debugger.Log("ModernDropdownListControl:Unload ");


        this._shadowTextBox.off("focus");
        this._shadowTextBox.off("input");
        this._shadowTextBox.off("blur");

        
        this._shadowTextBox.remove();
        this._shadowIcon.remove();
        this._shadowPopup.remove();

        super.Unload();

    }


}

