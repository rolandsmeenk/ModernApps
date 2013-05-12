/// <reference path="..\..\UIRenderer.ts"/>
/// <reference path="..\..\Debugger.ts"/>
/// <reference path="..\FrameworkControl.ts"/>
/// <reference path="..\..\BootUp.ts"/>


//declare var $;

class DataGridControl extends FrameworkControl {
   
    private _shadowDataItems: any;
    private _shadowColHeaderDataItems: any;
    private _overlay: any;
    private _isDisabled: bool = false;
    private _data: string;
    private _selectedItem: any;
    private _isLoadedWithData: bool = false;
    private _currentPage: number = 1;
    private _advancedSearchShowing: bool = false;
    private _lastSelected: any;


    //1 = normal (everything showing)
    //100 = only showing top toolbar
    public VisualState: number = 0;  

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

        $("#" + this.UniqueID + " .DGCHR").css("width", this._rootDiv.width() - 10);
        $("#" + this.UniqueID + " .DGPFOOTER").css("width", this._rootDiv.width() - 25);
        $("#" + this.UniqueID + " .DGPFOOTER").css("margin-top", this._rootDiv.height() - 52);
        $("#" + this.UniqueID + " .DGSRCH").css("left", this._rootDiv.width() - 230);
        $("#" + this.UniqueID + " .DGAVSRCH").css("left", this._rootDiv.width() - 360);

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

    public LoadPage(page: string) {
        this.Debugger.Log("DataGridControl:LoadPage - " + page);

        this.AnimateOutPage();
        this.AnimateInPage();
    }

    public LoadData(data: string, params: any) {
        this.Debugger.Log("DataGridControl:LoadData - " + data);

        if (this._isDisabled) return;

        this._data = data;
        this.Disable(0.8);
        this.TemporaryNotification("loading ... ", "Loading");

        var self = this;

        if (this._isLoadedWithData) this.AnimateOut();

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

                
                //LEFT TOOLBAR (CREATE)
                //data-do-old="action|location|ReaderPreviewMessage01|XNEW1"
                var colHHtml : string = '<div class="DGCHR">';
                colHHtml += '<div class="TB">';
                colHHtml += '   <div class="TBB TBNew" data-do="action|execute|add rss|ReaderComposeRss01|Reader/">Rss</div>';
                colHHtml += '   <div class="TBB TBReply" data-do="action|execute|add favourite|ReaderComposeFavorite01|Reader/">Favorite</div>';
                colHHtml += '   <div class="TBB TBReplyAll" data-do="action|execute|add music|ReaderComposeMusic01|Reader/">Music</div>';
                colHHtml += '   <div class="TBB TBUpdateFwd" data-do="action|execute|add pic|ReaderComposePicture01|Reader/">Pics</div>';
                colHHtml += '   <div class="TBB TBSendAs" data-do="action|execute|add mail|ReaderComposeMail01|Reader/">Mail</div>';
                colHHtml += '   <div class="TBB TBMore" data-do="action|execute|add calendar|ReaderComposeCalendar01|Reader/">Calendar</div>';
                colHHtml += '   <div class="TBB TBSupport" data-do="action|execute|add video|ReaderComposeVideo01|Reader/">Video</div>';
                colHHtml += '</div>';
                colHHtml += '</div>';
                self.UIRenderer.LoadHTMLElement(null, self._shadowColHeaderDataItems, colHHtml);


                //LEFT TOOLBAR (CLICK)
                var p = $("#" + self.UniqueID + " .TBB").each(function () {
                    $(this).off("click").on("click", this, function (e) {
                        self.ProcessActionSceneAct($(this).data("do"));


                        //hide advanced search if showing
                        if (self._advancedSearchShowing) {
                            $("#" + self.UniqueID + " .DGSRCH .TBSRCHText").first().click();
                        }
                    });
                });

                
                
                //RIGHT SEARCH (CREATE)
                var srcHtml: string = '<div class="DGSRCH">';
                srcHtml += '   <div class="TBSRCHText"><input type="text" value="Start your search" /></div>';
                srcHtml += '   <div class="TBSRCH" data-do="action|execute|filter page|5"></div>';
                srcHtml += '</div>';
                self.UIRenderer.LoadHTMLElement(null, self._shadowColHeaderDataItems, srcHtml);


                //RIGHT SEARCH (COLORS)
                $("#" + self.UniqueID + " .DGSRCH .TBSRCHText input").css("color", _bootup.Theme.AccentColor2);
                $("#" + self.UniqueID + " .DGSRCH .TBSRCHText").css("background-color", _bootup.Theme.AccentColor3);
                $("#" + self.UniqueID + " .DGSRCH .TBSRCH").css("background-color", _bootup.Theme.AccentColor3);



                //RIGHT SEARCH (SEARCH CLICKED)
                var p = $("#" + self.UniqueID + " .DGSRCH .TBSRCH").each(function () {
                    $(this).off("click").on("click", this, function (e) {

                        //unselect if there was one
                        if (self._selectedItem != null) {
                            self._selectedItem.css("background", "").css("color", "black");
                        };

                        //do action
                        self.ProcessActionSceneAct($(this).data("do"));

                        //for demo lets set the first selectable item to selected
                        setTimeout(function () {
                            var foundRow = $("#" + self.UniqueID + " div[data-isdefault='true']");
                            foundRow.first().click();
                        }, 500);


                        //hide advanced search if showing
                        if (self._advancedSearchShowing) {
                            $("#" + self.UniqueID + " .DGSRCH .TBSRCHText").first().click();
                        }
                    });
                });


                //RIGHT SEARCH (ADVANCED SEARCH CLICKED)
                var p = $("#" + self.UniqueID + " .DGSRCH .TBSRCHText").each(function () {
                    $(this).off("click").on("click", this, function (e) {

                        if (self._advancedSearchShowing) $("#" + self.UniqueID + " .DGAVSRCH").animate({ opacity: 0, height: "0px" }, 300);
                        else $("#" + self.UniqueID + " .DGAVSRCH").animate({opacity:1, height: "180px"}, 300);

                        self._advancedSearchShowing = !self._advancedSearchShowing;

                    });
                });





                //RIGHT ADVANCED SEARCH (CREATE)
                var srcHtml: string = '<div class="DGAVSRCH">';
                srcHtml += '</div>';
                self.UIRenderer.LoadHTMLElement(null, self._shadowColHeaderDataItems, srcHtml);


                //RIGHT ADVANCED SEARCH (COLORS)
                $("#" + self.UniqueID + " .DGAVSRCH").css("background-color", _bootup.Theme.AccentColor3);

                








                //DATAGRID (CREATE)
                var nodeHtml: string = "";

                //first 2 rows are blank to make up for top toolbar
                nodeHtml += '<div class="DGRHidden"></div>';
                nodeHtml += '<div class="DGRHidden"></div>';

                $.each(r.result, function () {
                    
                    nodeHtml += '<div class="DGR" data-id="' + this.id + '"'
                        + ' data-action= "action|execute|preview|' + this.id + '"'
                        + ' data-dblaction="action|location2|ReaderPreviewMessage01|Reader/|' + this.id + '"'
                        + ' data-isdefault= "' + this.isDefault + '" > ';
                    nodeHtml += '<div ><input type="checkbox" class="colChecked" /></div>';
                    nodeHtml += '<div class="col">' + this.col1 + '</div>';
                    nodeHtml += '<div class="col">' + this.col2 + '</div>';
                    nodeHtml += '<div class="col">' + this.col3 + '</div>';
                    nodeHtml += '<div class="col">' + this.col4 + '</div>';
                    nodeHtml += '<div class="col">' + this.col5 + '</div>';
                    nodeHtml += '<div class="col">' + this.col6 + '</div>';
                    nodeHtml += '<div class="col">' + this.col7 + '</div>';
                    nodeHtml += '</div>';

                });

                //last 2 nodes are for the paging toolbar area
                nodeHtml += '<div class="DGRHidden"></div>';
                nodeHtml += '<div class="DGRHidden"></div>';

                self.UIRenderer.LoadHTMLElement(null, self._shadowDataItems, nodeHtml);



                //DATAGRID (CLICK/DBLCLICK)
                var p = $("#" + self.UniqueID + " div[data-id]").each(function () {
                    $(this).off("click").off("dblclick").on("click", this, function (e) {

                        var that = this;
                        setTimeout(function () {
                            var dblclick = parseInt($(that).data('double'), 10);
                            if (dblclick > 0) {
                                $(that).data('double', dblclick - 1);
                            } else {
                                //START - DO SINGLE CLICK 
                                if (self._selectedItem != null) {
                                    self._selectedItem.css("background", "").css("color", "black");
                                }

                                self._selectedItem = $(that);

                                self._selectedItem.css("background", _bootup.Theme.AccentColor2).css("color", "white");
                                self.Debugger.Log("DataGridControl Item Clicked ID-" + $(that).data("id"));

                                _bootup.SceneManager.CurrentScene.ExecuteAction($(that).data("action"));


                                //hide advanced search if showing
                                if (self._advancedSearchShowing) {
                                    $("#" + self.UniqueID + " .DGSRCH .TBSRCHText").first().click();
                                }

                                //END
                            }
                        }, 200);

                    }).on("dblclick", this, function (e) {

                        $(this).data('double', 2);
                        //self._doubleClick.call(this, e);

                        self.ProcessActionSceneAct($(this).data("dblaction"));

                        //hide advanced search if showing
                        if (self._advancedSearchShowing) {
                            $("#" + self.UniqueID + " .DGSRCH .TBSRCHText").first().click();
                        }
                    });


                    //ROW - TOUCH EVENTS
                    $(this).on("MSGestureStart MSInertiaStart MSGestureTap MSPointerDown", function () {
                        $(this).off("MSGestureStart MSInertiaStart MSGestureTap MSPointerDown");
                        //alert("here");
                    });


                });


                




                //DATAGRID (CHECKBOX CLICK)
                var p = $("#" + self.UniqueID + " input.colChecked:checkbox").each(function () {
                    $(this).off("click").on("click", this, function (e) {

                        try {
                            var e = window.event;
                            if (!e) e = window.event;
                            if (e) {
                                //e.returnValue = false;
                                e.cancelBubble = true;
                                
                            }
                        } catch (c) { }


                        //hide advanced search if showing
                        if (self._advancedSearchShowing) {
                            $("#" + self.UniqueID + " .DGSRCH .TBSRCHText").first().click();
                        }

                    });

                });

                


                
                //PAGING TOOLBAR (CREATE)
                var pagingHtml: string = '<div class="DGPFOOTER">';
                pagingHtml += '<div class="TBP">';
                
                pagingHtml += '   <div class="TBPBAn TBBox">50</div>';
                pagingHtml += '   <div class="TBPBAn TBPlaceHolder">Show</div>';
                pagingHtml += '   <div class="TBPBAn TBPB TBR2"></div>';
                pagingHtml += '   <div class="TBPBAn TBPB TBR1"></div>';
                pagingHtml += '   <div class="TBPBAn TBPlaceHolder">of &nbsp;&nbsp; 100</div>';
                pagingHtml += '   <div class="TBPBAn TBBox" id="CurrentPage" >1</div>';
                pagingHtml += '   <div class="TBPBAn TBPlaceHolder">Page</div>';
                pagingHtml += '   <div class="TBPBAn TBPB TBL1"></div>';
                pagingHtml += '   <div class="TBPBAn TBPB TBL2"></div>';

                pagingHtml += '</div>';
                pagingHtml += '</div>';
                self.UIRenderer.LoadHTMLElement(null, self._shadowColHeaderDataItems, pagingHtml);

                var p = $("#" + self.UniqueID + " .DGPFOOTER .TBP .TBPB").each(function () {
                    $(this).off("click").on("click", this, function (e) {
                        
                        if ($(this).hasClass("TBR1")) {
                            self._currentPage++;
                            if (self._currentPage > 100) self._currentPage = 100;
                        } else if ($(this).hasClass("TBR2")) {
                            self._currentPage = 100;
                        } else if ($(this).hasClass("TBL1")) {
                            self._currentPage--;
                            if (self._currentPage < 1 ) self._currentPage = 1;
                        } else if ($(this).hasClass("TBL2")) {
                            self._currentPage = 1;
                        }

                        _bootup.SceneManager.CurrentScene.ExecuteAction("action|execute|filter page|" + self._currentPage);

                        //PAGING TOOLBAR - UPDATE CURRENT PAGE
                        var pageDiv = $("#" + self.UniqueID + " #CurrentPage");
                        pageDiv.html(self._currentPage);

                        //unselect if there was one
                        if (self._selectedItem != null) {
                            self._selectedItem.css("background", "").css("color", "black");
                        };


                        //for demo lets set the first selectable item to selected
                        setTimeout(function () {
                            self.SelectFirst();
                            //var foundRow = $("#" + self.UniqueID + " div[data-isdefault='true']");
                            //foundRow.first().click();
                        }, 500);


                    });
                });

                



                //SIZING 
                $("#" + self.UniqueID + " .DGCHR").css("width", self._rootDiv.width() - 25);
                $("#" + self.UniqueID + " .DGPFOOTER").css("width", self._rootDiv.width() - 25);
                $("#" + self.UniqueID + " .DGPFOOTER").css("margin-top", self._rootDiv.height() - 52);
                $("#" + self.UniqueID + " .DGSRCH").css("left", self._rootDiv.width() - 230);
                $("#" + self.UniqueID + " .DGAVSRCH").css("left", self._rootDiv.width() - 360);



                self._isLoadedWithData = true;

                self.AnimateIn();

                self.VisualState = 1;

                ////for demo lets set the first selectable item to selected
                //var foundRow = $("#" + self.UniqueID + " div[data-isdefault='true']");
                //foundRow.first().click();
                self.SelectFirst();
            });
    }




    public AnimateIn() {
        var incrementerAnim: number = 50;
        var p = $("#" + this.UniqueID + " .TBB").each(function () {
            incrementerAnim += 15;

            $(this).animate({ opacity: 1.0, marginLeft: "0" }, 600 + incrementerAnim);
        });

        incrementerAnim = 50;
        var p = $("#" + this.UniqueID + " .TBPBAn").each(function () {
            $(this).animate({ opacity: 1.0, marginLeft: "0" }, 800 + incrementerAnim);
        });

        this.AnimateInPage();

        var p = $("#" + this.UniqueID + " .DGSRCH").each(function () {
            $(this).animate({ opacity: 1.0, marginTop: "10px" }, 500);
        });


    }

    public AnimateOut() {
        var p = $("#" + this.UniqueID + " .TBB").each(function () {
            $(this).animate({ opacity: 0, marginLeft: "-10px" }, 600);
        });

        var p = $("#" + this.UniqueID + " .TBPBAn").each(function () {
            $(this).animate({ opacity: 0, marginBottom: "0px" }, 600);
        });

        
        this.AnimateOutPage();

        var p = $("#" + this.UniqueID + " .DGSRCH").each(function () {
            $(this).animate({ opacity: 0, marginLeft: "-20px" }, 400);
        });

        $("#" + this.UniqueID + " .DGCHR").remove();
        $("#" + this.UniqueID + " .DGPFOOTER").remove();
        $("#" + this.UniqueID + " .DGSRCH").remove();
        $("#" + this.UniqueID + " .DGRHidden").each(function () { $(this).remove(); });
        $("#" + this.UniqueID + " .DGR").each(function () { $(this).remove(); });
    }

    public AnimateInPage() {
        var incrementerAnim: number = 10;

        var p = $("#" + this.UniqueID + " .DGR").each(function () {
            $(this).animate({ opacity: 1.0, marginLeft: "0" }, 400 + incrementerAnim);
        });


    }


    public AnimateOutPage() {
        
        var p = $("#" + this.UniqueID + " .DGR").each(function () {
            $(this).animate({ opacity: 0, marginLeft: "-20px" }, 200);
        });


    }

    public AnimateTopToolbarIn() {
        this.AnimateOutPage();

        var p = $("#" + this.UniqueID + " .DGSRCH").each(function () {
            $(this).animate({ opacity: 0, marginLeft: "-20px" }, 400);
        });

        var p = $("#" + this.UniqueID + " .DGPFOOTER").each(function () {
            $(this).animate({ opacity: 0 }, 400, function () { $(this).hide(); });
        });

        this.VisualState = 100;
    }

    public AnimateTopToolbarOut() {
        this.AnimateInPage();

        var p = $("#" + this.UniqueID + " .DGSRCH").each(function () {
            $(this).animate({ opacity: 1, marginLeft: "0px" }, 400);
        });

        var p = $("#" + this.UniqueID + " .DGPFOOTER").each(function () {
            $(this).animate({ opacity: 1 }, 400, function () { $(this).show(); });
        });

        this.VisualState = 1;
    }

    public SelectFirst() {
        //for demo lets set the first selectable item to selected
        var foundRow = $("#" + this.UniqueID + " div[data-isdefault='true']");
        foundRow.first().click();

    }
}

