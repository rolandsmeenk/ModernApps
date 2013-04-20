var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ModernAccordianControl = (function (_super) {
    __extends(ModernAccordianControl, _super);
    function ModernAccordianControl(UIRenderer, Debugger, UniqueID, ParentUniqueID) {
        _super.call(this, UIRenderer, Debugger, UniqueID, ParentUniqueID);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this.UniqueID = UniqueID;
        this.ParentUniqueID = ParentUniqueID;
        this._isDisabled = false;
        this.UIRenderer.HideDiv(UniqueID);
    }
    ModernAccordianControl.prototype.InitUI = function (startHeight) {
        this.Debugger.Log("ModernAccordianControl:InitUI");
        this._shadowMenuItems = this.UIRenderer.LoadDivInParent("divModernAccordianItems", this.UniqueID);
        this._overlay = this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);
        this._overlay.css("display", "none");
    };
    ModernAccordianControl.prototype.UpdateFromLayout = function (rect) {
        this.Debugger.Log("ModernAccordianControl:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1 + 10).height(rect.y2 - rect.y1);
    };
    ModernAccordianControl.prototype.Enable = function () {
        this.Debugger.Log("ModernAccordianControl:Disable ");
        this._isDisabled = false;
        this._overlay.css("display", "none");
    };
    ModernAccordianControl.prototype.Disable = function (opacity) {
        this.Debugger.Log("ModernAccordianControl:Disable ");
        if(this._isDisabled) {
            return;
        }
        this._isDisabled = true;
        this._overlay.css("display", "");
        this._overlay.css("opacity", opacity);
    };
    ModernAccordianControl.prototype.Unload = function () {
        this.Debugger.Log("ModernAccordianControl:Unload ");
        this._shadowMenuItems.remove();
        this._overlay.remove();
        _super.prototype.Unload.call(this);
    };
    ModernAccordianControl.prototype.LoadData = function (data, params) {
        this.Debugger.Log("ModernAccordianControl:LoadData - " + data);
        if(this._isDisabled) {
            return;
        }
        this._data = data;
        this.Disable(0.8);
        this.TemporaryNotification("loading ... ", "Loading");
        var self = this;
        _bootup.DataLoader.RetrieveData(data, "POST", params, "json", function (r) {
            _bootup.Debugger.Log("finished loading - " + self._data);
            self.ClearTemporaryNotification();
            self.Enable();
            $.each(r.result, function () {
                var nodeHtml = "";
                nodeHtml += '<div class="AR" data-highlightonclick="false"';
                if(this.children != null) {
                    nodeHtml += ' data-haschildren="true">';
                } else {
                    nodeHtml += ' data-haschildren="false">';
                }
                nodeHtml += this.name;
                nodeHtml += '</div>';
                var parentNode = this;
                if(this.children != null) {
                    $.each(this.children, function () {
                        var tdata = "";
                        if(this.data != null) {
                            tdata = this.data;
                        }
                        var hasCreateInstance = this.hasCreateInstance;
                        hasCreateInstance = hasCreateInstance == undefined ? false : hasCreateInstance;
                        var isDefault = this.isDefault;
                        isDefault = isDefault == undefined ? false : isDefault;
                        var highightOnClick1 = false;
                        nodeHtml += '<div class="ARC ' + this.ico + '"' + ' data-id="' + this.id + '"' + ' data-parent="' + parentNode.id + '"' + ' data-dat="' + tdata + '"' + ' data-highlightonclick="' + highightOnClick1 + '" ' + ' data-isdefault="' + isDefault + '" ' + ' data-hascreateinstance="' + hasCreateInstance + '">';
                        nodeHtml += '<div class="childname">' + this.name + '</div>';
                        if(hasCreateInstance == "true" || hasCreateInstance) {
                            nodeHtml += '<div class="addinst"' + ' data-parent="' + parentNode.id + '"' + ' data-action="' + this.createInstanceAction + '"' + ' ></div>';
                        }
                        nodeHtml += '</div>';
                        var parentThis = this;
                        if(this.children != null) {
                            $.each(this.children, function () {
                                var tdata2 = "";
                                if(this.data != null) {
                                    tdata2 = this.data;
                                }
                                var highlightOnClick2 = true;
                                var hasDynamicFilter2 = this.hasDynamicFilter;
                                hasDynamicFilter2 = hasDynamicFilter2 == undefined ? false : hasDynamicFilter2;
                                var isDefault = this.isDefault;
                                isDefault = isDefault == undefined ? false : isDefault;
                                nodeHtml += '<div class="ARCC ' + this.ico + '"' + ' data-id="' + this.id + '"' + ' data-parent="' + parentThis.id + '"' + ' data-dat="' + tdata2 + '"' + ' data-highlightonclick="' + highlightOnClick2 + '"' + ' data-hasdynamicfilter="' + hasDynamicFilter2 + '"' + ' data-isdefault="' + isDefault + '" ' + ' data-hascreateinstance="' + hasCreateInstance + '">';
                                nodeHtml += '<div class="childname">' + this.name + '</div>';
                                nodeHtml += '</div>';
                                var parentThis4 = this;
                                if(this.children != null) {
                                    $.each(this.children, function () {
                                        var tdata4 = "";
                                        if(this.data != null) {
                                            tdata4 = this.data;
                                        }
                                        var highlightOnClick4 = true;
                                        var hasDynamicFilter4 = this.hasDynamicFilter;
                                        hasDynamicFilter4 = hasDynamicFilter4 == undefined ? false : hasDynamicFilter4;
                                        var isDefault4 = this.isDefault;
                                        isDefault4 = isDefault4 == undefined ? false : isDefault4;
                                        nodeHtml += '<div class="ARCCC ' + this.ico + '"' + ' data-id="' + this.id + '"' + ' data-parent="' + parentThis4.id + '"' + ' data-dat="' + tdata4 + '"' + ' data-highlightonclick="' + highlightOnClick4 + '"' + ' data-hasdynamicfilter="' + hasDynamicFilter4 + '"' + ' data-isdefault="' + isDefault4 + '" ' + ' data-hascreateinstance="' + hasCreateInstance + '">';
                                        nodeHtml += '<div class="childname">' + this.name + '</div>';
                                        nodeHtml += '</div>';
                                        var parentThis5 = this;
                                        if(this.children != null) {
                                            $.each(this.children, function () {
                                                var tdata5 = "";
                                                if(this.data != null) {
                                                    tdata5 = this.data;
                                                }
                                                var highlightOnClick5 = true;
                                                var hasDynamicFilter5 = this.hasDynamicFilter;
                                                hasDynamicFilter5 = hasDynamicFilter5 == undefined ? false : hasDynamicFilter5;
                                                var isDefault5 = this.isDefault;
                                                isDefault5 = isDefault5 == undefined ? false : isDefault5;
                                                nodeHtml += '<div class="ARCCCC ' + this.ico + '"' + ' data-id="' + this.id + '"' + ' data-parent="' + parentThis5.id + '"' + ' data-dat="' + tdata5 + '"' + ' data-highlightonclick="' + highlightOnClick5 + '"' + ' data-hasdynamicfilter="' + hasDynamicFilter5 + '"' + ' data-isdefault="' + isDefault5 + '" ' + ' data-hascreateinstance="' + hasCreateInstance + '">';
                                                nodeHtml += '<div class="childname">' + this.name + '</div>';
                                                nodeHtml += '</div>';
                                                var parentThis6 = this;
                                                if(this.children != null) {
                                                    $.each(this.children, function () {
                                                        var tdata6 = "";
                                                        if(this.data != null) {
                                                            tdata6 = this.data;
                                                        }
                                                        var highlightOnClick6 = true;
                                                        var hasDynamicFilter6 = this.hasDynamicFilter;
                                                        hasDynamicFilter6 = hasDynamicFilter6 == undefined ? false : hasDynamicFilter6;
                                                        var isDefault6 = this.isDefault;
                                                        isDefault6 = isDefault6 == undefined ? false : isDefault6;
                                                        nodeHtml += '<div class="ARCCCCC ' + this.ico + '"' + ' data-id="' + this.id + '"' + ' data-parent="' + parentThis6.id + '"' + ' data-dat="' + tdata6 + '"' + ' data-highlightonclick="' + highlightOnClick6 + '"' + ' data-hasdynamicfilter="' + hasDynamicFilter6 + '"' + ' data-isdefault="' + isDefault6 + '" ' + ' data-hascreateinstance="' + hasCreateInstance + '">';
                                                        nodeHtml += '<div class="childname">' + this.name + '</div>';
                                                        nodeHtml += '</div>';
                                                        var parentThis7 = this;
                                                        if(this.children != null) {
                                                            $.each(this.children, function () {
                                                                var tdata7 = "";
                                                                if(this.data != null) {
                                                                    tdata7 = this.data;
                                                                }
                                                                var highlightOnClick7 = true;
                                                                var hasDynamicFilter7 = this.hasDynamicFilter;
                                                                hasDynamicFilter7 = hasDynamicFilter7 == undefined ? false : hasDynamicFilter7;
                                                                var isDefault7 = this.isDefault;
                                                                isDefault7 = isDefault7 == undefined ? false : isDefault7;
                                                                nodeHtml += '<div class="ARCCCCCC ' + this.ico + '"' + ' data-id="' + this.id + '"' + ' data-parent="' + parentThis7.id + '"' + ' data-dat="' + tdata7 + '"' + ' data-highlightonclick="' + highlightOnClick7 + '"' + ' data-hasdynamicfilter="' + hasDynamicFilter7 + '"' + ' data-isdefault="' + isDefault7 + '" ' + ' data-hascreateinstance="' + hasCreateInstance + '">';
                                                                nodeHtml += '<div class="childname">' + this.name + '</div>';
                                                                nodeHtml += '</div>';
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                self.UIRenderer.LoadHTMLElement(null, self._shadowMenuItems, nodeHtml);
            });
            var p = $("#" + self.UniqueID + " div[data-parent]").each(function () {
                $(this).off("click").on("click", this, function (e) {
                    if($(this).data("hasdynamicfilter") != undefined && $(this).data("hasdynamicfilter") == true) {
                        try  {
                            var e = window.event;
                            if(!e) {
                                e = window.event;
                            }
                            if(e) {
                                e.returnValue = false;
                                e.cancelBubble = true;
                            }
                        } catch (c) {
                        }
                        if(self._selectedItem1 != null && self._selectedItem1.data("id") == $(this).data("id")) {
                            return;
                        }
                        var newDiv = $("<div data-dynamicfiltercreated='true' style='width:100%;background-color:" + _bootup.Theme.AccentColor2 + ";' class='dfc' ><div>Category 1</div><div>Category 2</div><div>Category 3</div><div>Category 4</div></div>").hide();
                        newDiv.appendTo($(this)).slideDown();
                        var p = $(newDiv).find("div").each(function () {
                            $(this).off("click").on("click", this, function (e) {
                                if(self._selectedItem2 != null) {
                                    self._selectedItem2.css("background-color", "");
                                }
                                self._selectedItem2 = $(this);
                                self._selectedItem2.css("background-color", _bootup.Theme.AccentColor3);
                                self.ProcessActionSceneAct("action|execute|filter|20");
                            });
                        });
                    }
                    if($(this).data("action") != undefined) {
                        try  {
                            var e = window.event;
                            if(!e) {
                                e = window.event;
                            }
                            if(e) {
                                e.returnValue = false;
                                e.cancelBubble = true;
                            }
                        } catch (c) {
                        }
                        self.ProcessActionSceneAct($(this).data("action"));
                        return;
                    }
                    if(self._selectedItem1 != null) {
                        if($(self._selectedItem1.children()[1]).data("dynamicfiltercreated")) {
                            $(self._selectedItem1.children()[1]).slideUp("normal", function () {
                                $(this).parent().css("background-color", "").css("color", "black");
                                $(this).remove();
                            });
                        } else {
                            self._selectedItem1.css("background-color", "").css("color", "black");
                        }
                    }
                    self._selectedItem1 = $(this);
                    if($(this).data("highlightonclick") == true) {
                        self._selectedItem1.css("background-color", _bootup.Theme.AccentColor2).css("color", "white");
                        self.Debugger.Log("Accordian Item Clicked ID-" + $(this).data("id") + " , ParentID-" + $(this).data("parent") + " , Data-" + $(this).data("dat"));
                        self.ProcessActionSceneAct($(this).data("dat"));
                    }
                });
            });
            self.Debugger.Log("#" + self.UniqueID + " div[data-parent]" + " - " + p.length);
            var found = $("#" + self.UniqueID + " div[data-isdefault='true']");
            found.first().click();
        });
    };
    return ModernAccordianControl;
})(FrameworkControl);
