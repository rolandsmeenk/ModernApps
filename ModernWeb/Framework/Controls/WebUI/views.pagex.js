var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PageX = (function (_super) {
    __extends(PageX, _super);
    function PageX(experience, Label, XCells, YCells, Slots, Controls) {
        _super.call(this, experience);
        this.Label = Label;
        this.XCells = XCells;
        this.YCells = YCells;
        this.Slots = Slots;
        this.Controls = Controls;
        this._cellWidth = 120;
        this._cellHeight = 120;
        this._cells = new Array();
        this._slotCells = new Array();
        this._drawSlotBorders = false;
        this._drawClickData = false;
        this._drawSlotData = false;
        this.Width = this.XCells * this._cellWidth + 200;
        this.Height = this.YCells * this._cellHeight + 200;
        ;
    }
    PageX.prototype.SpawnStandalone = function (x, y, url) {
        var instance = {
            "x": x,
            "y": y,
            "img": this.Preload(url)
        };
        return instance;
    };
    PageX.prototype.Initialize = function () {
        this.BuildGrid();
        this.BuildSlots();
        this.InitControls();
        this.zIndex += 3;
    };
    PageX.prototype.Update = function (tick) {
        this._tick = tick;
    };
    PageX.prototype.Draw = function (surface) {
        this.DrawGrid(surface);
        this.DrawControls(surface);
    };
    PageX.prototype.DrawSubPanel1 = function (surface) {
        var i1 = this.Experience.Interpolation.Normalize(this.Interpolator, 0.3, 1.0);
        var i2 = this.Experience.Interpolation.Normalize(this.Interpolator, 0.3, 1.5);
        var bg_interpolation = this.Experience.Interpolation.Normalize(this.Interpolator, 0, 0.25);
        var fg_interpolation = this.Experience.Interpolation.Normalize(this.Interpolator, 0.3, 0.5);
        var w = 920;
        var h = 700;
        var x_bg = 10;
        var y_bg = 10;
        surface.save();
        surface.translate(x_bg, y_bg);
        surface.globalAlpha = 1;
        var backgroundVisibility = this.Experience.Interpolation.Normalize(this.Interpolator, 0.5, 0.8);
        surface.restore();
        this.Experience.DrawCallCount += 4;
    };
    PageX.prototype.BuildGrid = function () {
        var gap = 5;
        var xStart = 30;
        var yStart = 10;
        var x, y;
        var CellIndex = 0;
        for(y = 0; y < this.YCells; y++) {
            for(x = 0; x < this.XCells; x++) {
                this._cells[CellIndex] = {
                    "x": (x * this._cellWidth) + (x * gap) + xStart,
                    "y": (y * this._cellHeight) + (y * gap) + yStart,
                    "width": this._cellWidth,
                    "height": this._cellHeight,
                    "vpx1": 0,
                    "vpx2": 0,
                    "vpy1": 0,
                    "vpy2": 0,
                    "vpx1o": 0,
                    "vpx2o": 0,
                    "vpy1o": 0,
                    "vpy2o": 0,
                    "id": this.pad(x, 2) + this.pad(y, 2),
                    "id2": CellIndex,
                    "clicked": 0,
                    "clickedprocessing": 0
                };
                CellIndex++;
            }
        }
    };
    PageX.prototype.BuildSlots = function () {
        var gap = 5;
        var CellIndex = 0;
        if(this.Slots != undefined) {
            var i;
            for(i = 0; i < this.Slots.length; i++) {
                var j = this.Slots[i];
                var k = eval(j);
                if(k.length == 2) {
                    this._slotCells[CellIndex] = this._cells[k[0]];
                    if(this._cells[k[1]].x > this._cells[k[0]].x) {
                        this._slotCells[CellIndex].width = (this._cells[k[1]].x - this._cells[k[0]].x) + this._cells[k[1]].width;
                    }
                    if(this._cells[k[1]].y > this._cells[k[0]].y) {
                        this._slotCells[CellIndex].height = (this._cells[k[1]].y - this._cells[k[0]].y) + this._cells[k[1]].height;
                    }
                    this._slotCells[CellIndex].id = this.pad(CellIndex, 4);
                    CellIndex++;
                } else {
                    this._slotCells[CellIndex] = this._cells[j];
                    this._slotCells[CellIndex].id = this.pad(CellIndex, 4);
                    CellIndex++;
                }
            }
        }
    };
    PageX.prototype.InitControls = function () {
        var SlotIndex = 0;
        if(this.Controls != undefined) {
            var i;
            for(i = 0; i < this.Controls.length; i++) {
                var j = this.Controls[i];
                try  {
                    j.SlotCell = this._slotCells[j.Slot];
                    j.ParentPageX = this.X;
                    j.ParentPageY = this.YCells;
                    j.ParentPage = this;
                    j.Initialize();
                } catch (err) {
                    j.Broken = true;
                }
            }
        }
    };
    PageX.prototype.pad = function (number, length) {
        var str = '' + number;
        while(str.length < length) {
            str = '0' + str;
        }
        return str;
    };
    PageX.prototype.DrawGrid = function (surface) {
        var gap = 5;
        var xStart = 30;
        var yStart = 90;
        var x, y;
        var paddingX = 55, paddingY = 68;
        if(!this.DisplayDebug) {
            paddingX = 35;
            paddingY = 48;
        }
        surface.font = "normal 12px sans-serif";
        var cell;
        var i;
        for(i = 0; i < this._slotCells.length; i++) {
            var cell = this._slotCells[i];
            if(this._drawSlotBorders) {
                surface.fillStyle = '#F9F9F9';
                surface.strokeStyle = '#D9D9D9';
                surface.lineWidth = 0;
                surface.fillRect(cell.x, cell.y, cell.width, cell.height);
                surface.fillStyle = "black";
                surface.fillText(cell.id, cell.x + paddingX, cell.y + paddingY - 20);
                surface.fillStyle = "black";
            }
            var newx1 = (parseFloat(this.X) + parseFloat(cell.x));
            cell.vpx1o = newx1.toFixed(0);
            newx1 = newx1 - this.Experience._ViewportX.toFixed(2);
            var newy1 = cell.y;
            cell.vpy1o = newy1.toFixed(0);
            newy1 = newy1 - this.Experience._ViewportY.toFixed(2);
            cell.vpx1 = newx1.toFixed(0);
            cell.vpy1 = newy1.toFixed(0);
            var newx2 = newx1 + cell.width;
            var newy2 = newy1 + cell.height;
            cell.vpx2 = newx2.toFixed(0);
            cell.vpx2o = newx2.toFixed(0);
            cell.vpy2 = newy2.toFixed(0);
            cell.vpy2o = newx2.toFixed(0);
            if(this._drawSlotData) {
                surface.fillText(cell.vpx1 + ", " + cell.vpy1, cell.x + paddingX, cell.y + paddingY);
                surface.fillText(cell.vpx2 + ", " + cell.vpy2, cell.x + paddingX, cell.y + paddingY + 20);
            }
            if(this.Experience._PanningActive == false && this.Experience._MousePointerDown.x >= newx1 && this.Experience._MousePointerDown.x <= newx2 && this.Experience._MousePointerDown.y >= newy1 && this.Experience._MousePointerDown.y <= newy2 && cell.clickedprocessing == 0) {
                cell.clickedprocessing = 1;
                $.doTimeout(cell.id, 100, function (state) {
                    if(this.Experience._PanningActive == false) {
                        state.clicked = state.clicked == 1 ? 0 : 1;
                    }
                    state.clickedprocessing = 0;
                }, cell);
            }
            if(this._drawClickData) {
                surface.fillText(cell.clicked, cell.x + paddingX + 5, cell.y + paddingY + 40);
            }
        }
    };
    PageX.prototype.DrawControls = function (surface) {
        var SlotIndex = 0;
        if(this.Controls != undefined) {
            var i;
            for(i = 0; i < this.Controls.length; i++) {
                var j = this.Controls[i];
                try  {
                    if(j.IsVisible(this.Experience._ViewportX, this.Experience._ViewportY, this.Experience.Width, this.Experience.Height)) {
                        j.Draw(surface);
                        this.Experience.DrawCallCount += 1;
                    }
                } catch (err) {
                    j.Broken = true;
                }
            }
        }
    };
    PageX.prototype.IsPageVisibleInCurrentViewport = function () {
        if(this.IsVisible(this.Experience._ViewportX, 0, this.Experience.Width, 0)) {
            return true;
        }
        return false;
    };
    return PageX;
})(PageBase);
