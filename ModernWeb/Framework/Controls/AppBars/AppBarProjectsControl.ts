/// <reference path="..\..\UIRenderer.ts"/>
/// <reference path="..\..\Debugger.ts"/>
/// <reference path="..\AppBarItemControl.ts"/>

//declare var $;

class AppBarProjectsControl extends FrameworkControl {
    private _itemCounter: number = 0;
    private _items = [];

    public IsShowing: bool = false;
    private _selectedItem: any;
    private _selectedProjectCode: string;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string) {
        
        super(UIRenderer, Debugger, UniqueID, null);

    }



    public Show(eventData: any) {
        this.Debugger.Log("AppBarProjectsControl:Show");

        this._eventData = eventData;

        this.UIRenderer.AnimateDiv(this.UniqueID, { top: "+=355", display: "" }, 600);

        this.IsShowing = true;

        //override the FrameworkControl implementation so that we dont wire up the click for this control

        this._selectedProjectCode = this.GetQueryVariable("prjc");

        this.LoadData("GetReaderProjectListData", { id: 10 });


        //replace css hover color
        var stylesheet1: any = document.styleSheets[0], selector = "#divAppBarProjects .ABProjects div:hover", rule = "{ background-color:" + _bootup.Theme.AccentColor3 + "; }";

        if (stylesheet1.insertRule) {
            stylesheet1.insertRule(selector + rule, stylesheet1.cssRules.length);
        } else if (stylesheet1.addRule) {
            stylesheet1.addRule(selector, rule, -1);
        }

        //replace css hover color
        var stylesheet2: any = document.styleSheets[0], selector = "#divABProjectsListFilter div:hover", rule = "{ background-color:" + _bootup.Theme.AccentColor3 + "; }";

        if (stylesheet2.insertRule) {
            stylesheet2.insertRule(selector + rule, stylesheet2.cssRules.length);
        } else if (stylesheet2.addRule) {
            stylesheet2.addRule(selector, rule, -1);
        }

    }

    public Hide() {
        this.Debugger.Log("AppBarProjectsControl:Hide");
        //this.UIRenderer.HideDiv(this.UniqueID);
        this.UIRenderer.AnimateDiv(this.UniqueID, { top: "-=355", display: "none" }, 600);
        this.IsShowing = false;
        this._rootDiv.off('click');
    }



    public Unload() {
        this.Debugger.Log("AppBarProjectsControl:Unload");
        this.IsShowing = false;
        for (var i = 0; i < this._items.length; i++) {
            this._items[i].Unload();
        }

        super.Unload();
    }


    public AddItem(id: string, text: string, eventData: any, iconStyle: string) {
        this.Debugger.Log("AppBarProjectsControl:AddItem");
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
        this.Debugger.Log("AppBarProjectsControl:LoadData - " + data);

        this.TemporaryNotification("loading ... ", "Loading");

        var self = this;


        //start loading the data
        _bootup.DataLoader.RetrieveData(
            data,
            "POST",
            params,
            "json",
            function (r: any) {
                _bootup.Debugger.Log("finished loading - ");



                self.ClearTemporaryNotification();
                //self.Enable();
                self.UIRenderer.UnloadDiv("divABProjectsList");


                //USERLIST (create)
                var userListHtml: string = '<div id="divABProjectsList" class="ABProjects">';

                $.each(r.result, function () {
                    userListHtml += '<div data-do="action|change project|' + this.id + '|' + this.name + '" data-pc="' + this.id + '">' + this.name + '</div>';
                });

                userListHtml += '</div>';
                self.UIRenderer.LoadHTMLElement(null, self._rootDiv, userListHtml);


                //USERLIST (click)
                var p = $("#" + self.UniqueID + " .ABProjects div").each(function () {
                    $(this).off("click").on("click", this, function (e) {
                        
                        if (self._selectedItem != null) {
                            self._selectedItem.css("background", "");
                        }

                        self._selectedItem = $(this);

                        self._selectedItem.css("background", _bootup.Theme.AccentColor2);
                        self.Debugger.Log("AppBarProjectsControl Item Clicked ID-" + $(this).data("id"));


                        self.ProcessActionSceneAct($(this).data("do"));

                    });
                });



                //FILTER LIST (create)
                var filterListHtml: string = '<div id="divABProjectsListFilter">';
                filterListHtml += "<div>A</div>";
                filterListHtml += "<div>B</div>";
                filterListHtml += "<div>C</div>";
                filterListHtml += "<div>D</div>";
                filterListHtml += "<div>E</div>";
                filterListHtml += "<div>F</div>";
                filterListHtml += "<div>G</div>";
                filterListHtml += "<div>H</div>";
                filterListHtml += "<div>I</div>";
                filterListHtml += "<div>J</div>";
                filterListHtml += "<div>K</div>";
                filterListHtml += "<div>L</div>";
                filterListHtml += "<div>M</div>";
                filterListHtml += "<div>N</div>";
                filterListHtml += "<div>O</div>";
                filterListHtml += "<div>P</div>";
                filterListHtml += "<div>Q</div>";
                filterListHtml += "<div>R</div>";
                filterListHtml += "<div>S</div>";
                filterListHtml += "<div>T</div>";
                filterListHtml += "<div>U</div>";
                filterListHtml += "<div>V</div>";
                filterListHtml += "<div>W</div>";
                filterListHtml += "<div>X</div>";
                filterListHtml += "<div>Y</div>";
                filterListHtml += "<div>Z</div>";
                filterListHtml += '</div>';
                self.UIRenderer.LoadHTMLElement(null, self._rootDiv, filterListHtml);





                //if project already selected then set it
                if (self._selectedProjectCode != undefined) {

                    var found = $("#" + self.UniqueID + " #divABProjectsList div[data-pc='" + self._selectedProjectCode + "']").each(function () {
                        self._selectedItem = $(this);
                        self._selectedItem.css("background", _bootup.Theme.AccentColor2);
                    });
                }





            });
    }

}

