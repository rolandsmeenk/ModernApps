/// <reference path="..\..\UIRenderer.ts"/>
/// <reference path="..\..\Debugger.ts"/>
/// <reference path="..\AppBarItemControl.ts"/>

//declare var $;

class AppBarUsersControl extends FrameworkControl {
    private _itemCounter: number = 0;
    private _items = [];

    public IsShowing: bool = false;
    private _selectedItem: any;
    private _selectedUserId: string;


    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string) {
        
        super(UIRenderer, Debugger, UniqueID, null);

    }



    public Show(eventData: any) {
        this.Debugger.Log("AppBarUsersControl:Show");

        this._eventData = eventData;

        this.UIRenderer.AnimateDiv(this.UniqueID, { top: "+=355", display: "" }, 600);

        this.IsShowing = true;

        //override the FrameworkControl implementation so that we dont wire up the click for this control

        this._selectedUserId = this.GetQueryVariable("uid");

        this.LoadData("GetReaderUserListData", { id: 10 });


        //replace css hover color
        var stylesheet1 :any = document.styleSheets[0], selector = "#divAppBarUsers .ABUsers div:hover", rule = "{ background-color:" + _bootup.Theme.AccentColor3 + "; }";

        if (stylesheet1.insertRule) {
            stylesheet1.insertRule(selector + rule, stylesheet1.cssRules.length);
        } else if (stylesheet1.addRule) {
            stylesheet1.addRule(selector, rule, -1);
        }




    }

    public Hide() {
        this.Debugger.Log("AppBarUsersControl:Hide");
        //this.UIRenderer.HideDiv(this.UniqueID);
        this.UIRenderer.AnimateDiv(this.UniqueID, { top: "-=355", display: "none" }, 600);
        this.IsShowing = false;
        this._rootDiv.off('click');
    }



    public Unload() {
        this.Debugger.Log("AppBarUsersControl:Unload");
        this.IsShowing = false;
        for (var i = 0; i < this._items.length; i++) {
            this._items[i].Unload();
        }

        super.Unload();
    }


    public AddItem(id: string, text: string, eventData: any, iconStyle: string) {
        this.Debugger.Log("AppBarUsersControl:AddItem");
        try {
            var newToolbarItem : any = new AppBarItemControl(this.UIRenderer, this.Debugger, id, this.UniqueID);
            newToolbarItem._rootDiv.attr("style", iconStyle);
            newToolbarItem.Show(this._parentObject, this._parentClickCallback, eventData);
            newToolbarItem.UpdateContent(text);
            this._items.push(newToolbarItem);
            this._itemCounter++;
        } catch (ex) {

            alert(ex.message);
        }
    }


    public LoadData(data: string, params: any) {
        this.Debugger.Log("AppBarUsersControl:LoadData - " + data);

        this.TemporaryNotification("loading ... ", "Loading");

        var self = this;


        //start loading the data
        _bootup.DataLoader.RetrieveData(
            data,
            "POST",
            params,
            "json",
            function (r: any) {
                _bootup.Debugger.Log("finished loading - " );

                

                self.ClearTemporaryNotification();
                //self.Enable();
                self.UIRenderer.UnloadDiv("divABUsersList");


                //USERLIST
                var userListHtml: string = '<div id="divABUsersList" class="ABUsers">';

                $.each(r.result, function () {
                    userListHtml += '<div data-do="action|change user|' + this.gid + '|' + this.name + '|' + this.id + '" data-uid="' + this.id + '">' + this.name + '</div>';
                });

                userListHtml += '</div>';
                self.UIRenderer.LoadHTMLElement(null, self._rootDiv, userListHtml);

                

                var p = $("#" + self.UniqueID + " .ABUsers div").each(function () {
                    $(this).off("click").on("click", this, function (e) {

                        //START - DO SINGLE CLICK 
                        if (self._selectedItem != null) {
                            self._selectedItem.css("background", "");
                        }

                        self._selectedItem = $(this);

                        self._selectedItem.css("background", _bootup.Theme.AccentColor2);
                        self.Debugger.Log("AppBarUsersControl Item Clicked ID-" + $(this).data("id"));

                        self.ProcessActionSceneAct($(this).data("do"));
                    });
                });



                //if user already selected then set it
                if (self._selectedUserId != undefined) {

                    var found = $("#" + self.UniqueID + " #divABUsersList div[data-uid='" + self._selectedUserId + "']").each(function () {
                        self._selectedItem = $(this);
                        self._selectedItem.css("background", _bootup.Theme.AccentColor2);
                    });
                }



                //Last minute UI quirk cleanup
                //$("#" + self.UniqueID + " .DGPFOOTER").css("margin-top", self._rootDiv.height() - 66);
                //$("#" + self.UniqueID + " .DGSRCH").css("left", self._rootDiv.width() - 250);



            });
    }

}

