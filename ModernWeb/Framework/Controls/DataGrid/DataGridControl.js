var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DataGridControl = (function (_super) {
    __extends(DataGridControl, _super);
    function DataGridControl(UIRenderer, Debugger, UniqueID, ParentUniqueID) {
        _super.call(this, UIRenderer, Debugger, UniqueID, ParentUniqueID);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this.ParentUniqueID = ParentUniqueID;
        this._isDisabled = false;
        this._isLoadedWithData = false;
        this._currentPage = 1;
        this._advancedSearchShowing = false;
        this.VisualState = 0;
        this.UIRenderer.HideDiv(UniqueID);
    }
    DataGridControl.prototype.InitUI = function (startHeight) {
        this.Debugger.Log("DataGridControl:InitUI");
        this._shadowDataItems = this.UIRenderer.LoadDivInParent("divDataGridItems", this.UniqueID);
        this._shadowColHeaderDataItems = this.UIRenderer.LoadDivInParent("divDataGridHeaderItems", this.UniqueID);
        this._overlay = this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
        this._overlay.css("display", "none");
    };
    DataGridControl.prototype.UpdateFromLayout = function (rect) {
        this.Debugger.Log("DataGridControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);
        $("#" + this.UniqueID + " .DGCHR").css("width", this._rootDiv.width() - 10);
        $("#" + this.UniqueID + " .DGPFOOTER").css("width", this._rootDiv.width() - 25);
        $("#" + this.UniqueID + " .DGPFOOTER").css("margin-top", this._rootDiv.height() - 52);
        $("#" + this.UniqueID + " .DGSRCH").css("left", this._rootDiv.width() - 230);
        $("#" + this.UniqueID + " .DGAVSRCH").css("left", this._rootDiv.width() - 360);
    };
    DataGridControl.prototype.Enable = function () {
        this.Debugger.Log("DataGridControl:Enable ");
        this._isDisabled = false;
        this._overlay.css("display", "none");
    };
    DataGridControl.prototype.Disable = function (opacity) {
        this.Debugger.Log("DataGridControl:Disable ");
        if (this._isDisabled) {
            return;
        }
        this._isDisabled = true;
        this._overlay.css("display", "");
        this._overlay.css("opacity", opacity);
    };
    DataGridControl.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
    };
    DataGridControl.prototype.LoadPage = function (page) {
        this.Debugger.Log("DataGridControl:LoadPage - " + page);
        this.AnimateOutPage();
        this.AnimateInPage();
    };
    DataGridControl.prototype.LoadData = function (data, params) {
        this.Debugger.Log("DataGridControl:LoadData - " + data);
        if (this._isDisabled) {
            return;
        }
        this._data = data;
        this.Disable(0.8);
        this.TemporaryNotification("loading ... ", "Loading");
        var self = this;
        if (this._isLoadedWithData) {
            this.AnimateOut();
        }
        _bootup.DataLoader.RetrieveData(data, "POST", params, "json", function (r) {
            _bootup.Debugger.Log("finished loading - " + self._data);
            self.ClearTemporaryNotification();
            self.Enable();
            var colHHtml = '<div class="DGCHR">';
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
            var p = $("#" + self.UniqueID + " .TBB").each(function () {
                $(this).off("click").on("click", this, function (e) {
                    self.ProcessActionSceneAct($(this).data("do"));
                    if (self._advancedSearchShowing) {
                        $("#" + self.UniqueID + " .DGSRCH .TBSRCHText").first().click();
                    }
                });
            });
            var srcHtml = '<div class="DGSRCH">';
            srcHtml += '   <div class="TBSRCHText"><input type="text" value="Start your search" /></div>';
            srcHtml += '   <div class="TBSRCH" data-do="action|execute|filter page|5"></div>';
            srcHtml += '</div>';
            self.UIRenderer.LoadHTMLElement(null, self._shadowColHeaderDataItems, srcHtml);
            $("#" + self.UniqueID + " .DGSRCH .TBSRCHText input").css("color", _bootup.Theme.AccentColor2);
            $("#" + self.UniqueID + " .DGSRCH .TBSRCHText").css("background-color", _bootup.Theme.AccentColor3);
            $("#" + self.UniqueID + " .DGSRCH .TBSRCH").css("background-color", _bootup.Theme.AccentColor3);
            var p = $("#" + self.UniqueID + " .DGSRCH .TBSRCH").each(function () {
                $(this).off("click").on("click", this, function (e) {
                    if (self._selectedItem != null) {
                        self._selectedItem.css("background", "").css("color", "black");
                    }
                    ;
                    self.ProcessActionSceneAct($(this).data("do"));
                    setTimeout(function () {
                        var foundRow = $("#" + self.UniqueID + " div[data-isdefault='true']");
                        foundRow.first().click();
                    }, 500);
                    if (self._advancedSearchShowing) {
                        $("#" + self.UniqueID + " .DGSRCH .TBSRCHText").first().click();
                    }
                });
            });
            var p = $("#" + self.UniqueID + " .DGSRCH .TBSRCHText").each(function () {
                $(this).off("click").on("click", this, function (e) {
                    if (self._advancedSearchShowing) {
                        $("#" + self.UniqueID + " .DGAVSRCH").animate({
                            opacity: 0,
                            height: "0px"
                        }, 300);
                    } else {
                        $("#" + self.UniqueID + " .DGAVSRCH").animate({
                            opacity: 1,
                            height: "180px"
                        }, 300);
                    }
                    self._advancedSearchShowing = !self._advancedSearchShowing;
                });
            });
            var srcHtml = '<div class="DGAVSRCH">';
            srcHtml += '</div>';
            self.UIRenderer.LoadHTMLElement(null, self._shadowColHeaderDataItems, srcHtml);
            $("#" + self.UniqueID + " .DGAVSRCH").css("background-color", _bootup.Theme.AccentColor3);
            var nodeHtml = "";
            nodeHtml += '<div class="DGRHidden"></div>';
            nodeHtml += '<div class="DGRHidden"></div>';
            $.each(r.result, function () {
                nodeHtml += '<div class="DGR" data-id="' + this.id + '"' + ' data-action= "action|execute|preview|' + this.id + '"' + ' data-dblaction="action|location2|ReaderPreviewMessage01|Reader/|' + this.id + '"' + ' data-isdefault= "' + this.isDefault + '" > ';
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
            nodeHtml += '<div class="DGRHidden"></div>';
            nodeHtml += '<div class="DGRHidden"></div>';
            self.UIRenderer.LoadHTMLElement(null, self._shadowDataItems, nodeHtml);
            var p = $("#" + self.UniqueID + " div[data-id]").each(function () {
                $(this).off("click").off("dblclick").on("click", this, function (e) {
                    var that = this;
                    setTimeout(function () {
                        var dblclick = parseInt($(that).data('double'), 10);
                        if (dblclick > 0) {
                            $(that).data('double', dblclick - 1);
                        } else {
                            if (self._selectedItem != null) {
                                self._selectedItem.css("background", "").css("color", "black");
                            }
                            self._selectedItem = $(that);
                            self._selectedItem.css("background", _bootup.Theme.AccentColor2).css("color", "white");
                            self.Debugger.Log("DataGridControl Item Clicked ID-" + $(that).data("id"));
                            _bootup.SceneManager.CurrentScene.ExecuteAction($(that).data("action"));
                            if (self._advancedSearchShowing) {
                                $("#" + self.UniqueID + " .DGSRCH .TBSRCHText").first().click();
                            }
                        }
                    }, 200);
                }).on("dblclick", this, function (e) {
                    $(this).data('double', 2);
                    self.ProcessActionSceneAct($(this).data("dblaction"));
                    if (self._advancedSearchShowing) {
                        $("#" + self.UniqueID + " .DGSRCH .TBSRCHText").first().click();
                    }
                });
                $(this).on("MSGestureStart MSInertiaStart MSGestureTap MSPointerDown", function () {
                    $(this).off("MSGestureStart MSInertiaStart MSGestureTap MSPointerDown");
                });
            });
            var p = $("#" + self.UniqueID + " input.colChecked:checkbox").each(function () {
                $(this).off("click").on("click", this, function (e) {
                    try  {
                        var e = window.event;
                        if (!e) {
                            e = window.event;
                        }
                        if (e) {
                            e.cancelBubble = true;
                        }
                    } catch (c) {
                    }
                    if (self._advancedSearchShowing) {
                        $("#" + self.UniqueID + " .DGSRCH .TBSRCHText").first().click();
                    }
                });
            });
            var pagingHtml = '<div class="DGPFOOTER">';
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
                        if (self._currentPage > 100) {
                            self._currentPage = 100;
                        }
                    } else if ($(this).hasClass("TBR2")) {
                        self._currentPage = 100;
                    } else if ($(this).hasClass("TBL1")) {
                        self._currentPage--;
                        if (self._currentPage < 1) {
                            self._currentPage = 1;
                        }
                    } else if ($(this).hasClass("TBL2")) {
                        self._currentPage = 1;
                    }
                    _bootup.SceneManager.CurrentScene.ExecuteAction("action|execute|filter page|" + self._currentPage);
                    var pageDiv = $("#" + self.UniqueID + " #CurrentPage");
                    pageDiv.html(self._currentPage);
                    if (self._selectedItem != null) {
                        self._selectedItem.css("background", "").css("color", "black");
                    }
                    ;
                    setTimeout(function () {
                        self.SelectFirst();
                    }, 500);
                });
            });
            $("#" + self.UniqueID + " .DGCHR").css("width", self._rootDiv.width() - 25);
            $("#" + self.UniqueID + " .DGPFOOTER").css("width", self._rootDiv.width() - 25);
            $("#" + self.UniqueID + " .DGPFOOTER").css("margin-top", self._rootDiv.height() - 52);
            $("#" + self.UniqueID + " .DGSRCH").css("left", self._rootDiv.width() - 230);
            $("#" + self.UniqueID + " .DGAVSRCH").css("left", self._rootDiv.width() - 360);
            self._isLoadedWithData = true;
            self.AnimateIn();
            self.VisualState = 1;
            self.SelectFirst();
        });
    };
    DataGridControl.prototype.AnimateIn = function () {
        var incrementerAnim = 50;
        var p = $("#" + this.UniqueID + " .TBB").each(function () {
            incrementerAnim += 15;
            $(this).animate({
                opacity: 1.0,
                marginLeft: "0"
            }, 600 + incrementerAnim);
        });
        incrementerAnim = 50;
        var p = $("#" + this.UniqueID + " .TBPBAn").each(function () {
            $(this).animate({
                opacity: 1.0,
                marginLeft: "0"
            }, 800 + incrementerAnim);
        });
        this.AnimateInPage();
        var p = $("#" + this.UniqueID + " .DGSRCH").each(function () {
            $(this).animate({
                opacity: 1.0,
                marginTop: "10px"
            }, 500);
        });
    };
    DataGridControl.prototype.AnimateOut = function () {
        var p = $("#" + this.UniqueID + " .TBB").each(function () {
            $(this).animate({
                opacity: 0,
                marginLeft: "-10px"
            }, 600);
        });
        var p = $("#" + this.UniqueID + " .TBPBAn").each(function () {
            $(this).animate({
                opacity: 0,
                marginBottom: "0px"
            }, 600);
        });
        this.AnimateOutPage();
        var p = $("#" + this.UniqueID + " .DGSRCH").each(function () {
            $(this).animate({
                opacity: 0,
                marginLeft: "-20px"
            }, 400);
        });
        $("#" + this.UniqueID + " .DGCHR").remove();
        $("#" + this.UniqueID + " .DGPFOOTER").remove();
        $("#" + this.UniqueID + " .DGSRCH").remove();
        $("#" + this.UniqueID + " .DGRHidden").each(function () {
            $(this).remove();
        });
        $("#" + this.UniqueID + " .DGR").each(function () {
            $(this).remove();
        });
    };
    DataGridControl.prototype.AnimateInPage = function () {
        var incrementerAnim = 10;
        var p = $("#" + this.UniqueID + " .DGR").each(function () {
            $(this).animate({
                opacity: 1.0,
                marginLeft: "0"
            }, 400 + incrementerAnim);
        });
    };
    DataGridControl.prototype.AnimateOutPage = function () {
        var p = $("#" + this.UniqueID + " .DGR").each(function () {
            $(this).animate({
                opacity: 0,
                marginLeft: "-20px"
            }, 200);
        });
    };
    DataGridControl.prototype.AnimateTopToolbarIn = function () {
        this.AnimateOutPage();
        var p = $("#" + this.UniqueID + " .DGSRCH").each(function () {
            $(this).animate({
                opacity: 0,
                marginLeft: "-20px"
            }, 400);
        });
        var p = $("#" + this.UniqueID + " .DGPFOOTER").each(function () {
            $(this).animate({
                opacity: 0
            }, 400, function () {
                $(this).hide();
            });
        });
        this.VisualState = 100;
    };
    DataGridControl.prototype.AnimateTopToolbarOut = function () {
        this.AnimateInPage();
        var p = $("#" + this.UniqueID + " .DGSRCH").each(function () {
            $(this).animate({
                opacity: 1,
                marginLeft: "0px"
            }, 400);
        });
        var p = $("#" + this.UniqueID + " .DGPFOOTER").each(function () {
            $(this).animate({
                opacity: 1
            }, 400, function () {
                $(this).show();
            });
        });
        this.VisualState = 1;
    };
    DataGridControl.prototype.SelectFirst = function () {
        var foundRow = $("#" + this.UniqueID + " div[data-isdefault='true']");
        foundRow.first().click();
    };
    return DataGridControl;
})(FrameworkControl);
