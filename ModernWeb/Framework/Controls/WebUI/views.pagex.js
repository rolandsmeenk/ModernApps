var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PageX = (function (_super) {
    __extends(PageX, _super);
    function PageX(experience, label, xCells, yCells, slots, controls) {
        _super.call(this, experience);
        this._cellWidth = 120;
        this._cellHeight = 120;
        this._cells = new Array();
        this._slotCells = new Array();
        this._drawSlotBorders = true;
        this._drawClickData = true;
        this._drawSlotData = true;
        this.Label = label;
        this.XCells = xCells;
        this.YCells = yCells;
        this.Slots = slots;
        this.Controls = controls;
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
        this._buildGrid();
        this._buildSlots();
        this._initControls();
        this.zIndex += 3;
    };
    PageX.prototype.Update = function (tick) {
        this._tick = tick;
    };
    PageX.prototype.Draw = function (surface) {
        this._drawGrid(surface);
        this._drawControls(surface);
    };
    PageX.prototype._buildGrid = function () {
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
    PageX.prototype._buildSlots = function () {
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
    PageX.prototype._initControls = function () {
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
    PageX.prototype._drawGrid = function (surface) {
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
                surface.lineWidth = 1;
                surface.fillRect(cell.x, cell.y, cell.width, cell.height);
                surface.fillStyle = "black";
                surface.fillText(cell.id, cell.x + paddingX, cell.y + paddingY - 20);
                surface.fillStyle = "black";
            }
            var newx1 = (parseFloat(this.X.toString()) + parseFloat(cell.x));
            cell.vpx1o = newx1.toFixed(0);
            newx1 = newx1 - parseFloat(this.Experience.ViewportX.toFixed(2));
            var newy1 = cell.y;
            cell.vpy1o = newy1.toFixed(0);
            newy1 = newy1 - this.Experience.ViewportY.toFixed(2);
            cell.vpx1 = newx1.toFixed(0);
            cell.vpy1 = newy1.toFixed(0);
            var newx2 = newx1 + cell.width;
            var newy2 = newy1 + cell.height;
            cell.vpx2 = newx2.toFixed(0);
            cell.vpx2o = newx2.toFixed(0);
            cell.vpy2 = newy2.toFixed(0);
            cell.vpy2o = newx2.toFixed(0);
            cell.setTimeoutPointer = 0;
            if(this._drawSlotData) {
                surface.fillText(cell.vpx1 + ", " + cell.vpy1, cell.x + paddingX, cell.y + paddingY);
                surface.fillText(cell.vpx2 + ", " + cell.vpy2, cell.x + paddingX, cell.y + paddingY + 20);
            }
            if(this.Experience._PanningActive == false && this.Experience._MousePointerDown.x >= newx1 && this.Experience._MousePointerDown.x <= newx2 && this.Experience._MousePointerDown.y >= newy1 && this.Experience._MousePointerDown.y <= newy2 && cell.clickedprocessing == 0) {
                cell.clickedprocessing = 1;
                cell.clicked = cell.clicked == 0 ? 1 : 0;
                cell.clickedprocessing = 0;
            }
            if(this._drawClickData) {
                surface.fillText(cell.clicked, cell.x + paddingX + 5, cell.y + paddingY + 40);
            }
        }
    };
    PageX.prototype._drawControls = function (surface) {
        var SlotIndex = 0;
        if(this.Controls != undefined) {
            var i;
            for(i = 0; i < this.Controls.length; i++) {
                var j = this.Controls[i];
                try  {
                    if(j.IsVisible(this.Experience.ViewportX, this.Experience.ViewportY, this.Experience.Width, this.Experience.Height)) {
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
        if(this.IsVisible(this.Experience.ViewportX, 0, this.Experience.Width, 0)) {
            return true;
        }
        return false;
    };
    return PageX;
})(PageBase);
