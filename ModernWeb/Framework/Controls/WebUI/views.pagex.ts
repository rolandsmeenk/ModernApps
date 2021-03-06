﻿/// <reference path="views.pagebase.ts"/>

//declare var $;

class PageX extends PageBase
{

    private _cellWidth: number = 120;
    private _cellHeight:number = 120;
    
    private _cells: any = new Array();
    private _slotCells: any = new Array();
    
    public Tick: any;
    private _drawSlotBorders: bool = true;
    private _drawClickData: bool = true;
    private _drawSlotData: bool = true;

    public Label: string;
    public XCells: number;
    public YCells: number;
    public Slots: any;
    public Controls: any;

    constructor(experience: Experience, label: string, xCells: number, yCells: number, slots: any, controls: any ) {
        super(experience);

        this.Label = label;
        this.XCells = xCells;
        this.YCells = yCells;
        this.Slots = slots;
        this.Controls = controls;

        this.Width = this.XCells * this._cellWidth + 200;
        this.Height = this.YCells * this._cellHeight + 200;;

    }



    public SpawnStandalone(x, y, url)
    {
        var instance = { "x": x, "y": y, "img": this.Preload(url) };
        return instance;
    }

    public Initialize() {
        super.Initialize();

        this._buildGrid();
        this._buildSlots();
        this._initControls();
        this.zIndex += 3;
    }

    public Update(tick)
    {
        super.Update(tick);
        this.Tick = tick;

        this._updateControls(tick);

    }

    // could disable this when off-screen
    public Draw(surface)
    {
        super.Draw(surface);

        this._drawGrid(surface);
        this._drawControls(surface);

        //Dbg.Surface.fillStyle = "#fff";
        //Dbg.Print(this.Label);
    }


    public _buildGrid()
    {
        var gap = 5; //gap between cells
        var xStart = 30;
        var yStart = 10;
        var x, y;

        var CellIndex = 0;
        for (y = 0; y < this.YCells; y++)
        {
            for (x = 0; x < this.XCells; x++)
            {
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

    }

    public _buildSlots()
    {
        var gap = 5; //gap between cells

        var CellIndex = 0;
        if (this.Slots != undefined)
        {
            var i;
            for (i = 0; i < this.Slots.length; i++)
            {
                var j = this.Slots[i];
                var k = eval(j);
                if (k.length == 2)
                {
                    this._slotCells[CellIndex] = this._cells[k[0]];

                    if (this._cells[k[1]].x > this._cells[k[0]].x)
                    {
                        this._slotCells[CellIndex].width = (this._cells[k[1]].x - this._cells[k[0]].x) + this._cells[k[1]].width;
                        //this.SlotCells[CellIndex].width += this.Cells[k[1]].width + gap;
                    }

                    if (this._cells[k[1]].y > this._cells[k[0]].y)
                    {
                        this._slotCells[CellIndex].height = (this._cells[k[1]].y - this._cells[k[0]].y) + this._cells[k[1]].height;
                        //this.SlotCells[CellIndex].height += this.Cells[k[1]].height + gap;
                    }

                    //alert(k[0]);
                    //alert(k[1]);
                    this._slotCells[CellIndex].id = this.pad(CellIndex, 4);
                    CellIndex++;
                }
                else
                {
                    this._slotCells[CellIndex] = this._cells[j];
                    this._slotCells[CellIndex].id = this.pad(CellIndex, 4);
                    CellIndex++;
                }
            }
        }
    }

    public _initControls() {

        //we want to link the slotcells to there relevant controls
        var SlotIndex = 0;
        if (this.Controls != undefined) {
            var i;
            for (i = 0; i < this.Controls.length; i++) {
                var j = this.Controls[i];

                try {
                    j.SlotCell = this._slotCells[j.Slot];
                    j.ParentPageX = this.X;
                    j.ParentPageY = this.YCells;
                    j.ParentPage = this;
                    j.Initialize();
                }
                catch (err) {	// this shouldn't ever happen as the base Draw() method wrapper will catch
                    // all draw errors
                    j.Broken = true;
                    //Dbg.Print("Page " + this.Label + " unhandled error in DrawControls(): " + err);
                }
            }
        }
    }

    public pad(number, length)
    {

        var str = '' + number;
        while (str.length < length)
        {
            str = '0' + str;
        }

        return str;

    }

    private _drawGrid(surface)
    {
        var gap = 5; //gap between cells
        var xStart = 30;
        var yStart = 90;
        var x, y;

        var paddingX = 55, paddingY = 68;
        if (!this.DisplayDebug) { paddingX = 35; paddingY = 48; }



        surface.font = "normal 12px sans-serif";

//                surface.fillRect(0, 0, 150, 50);
//                surface.strokeRect(0, 60, 150, 50);
//                surface.clearRect(30, 25, 90, 60);
//                surface.strokeRect(30, 25, 90, 60);

        var cell;
        var i;

        for (i = 0; i < this._slotCells.length; i++)
        {
            var cell = this._slotCells[i];

            if (this._drawSlotBorders)
            {
                surface.fillStyle = '#F9F9F9'; //'#F1F1F1';
                surface.strokeStyle = '#D9D9D9';
                surface.lineWidth = 1;
                surface.fillRect(cell.x, cell.y, cell.width, cell.height);

                surface.fillStyle = "black";
                surface.fillText(cell.id, cell.x + paddingX, cell.y + paddingY - 20);

                surface.fillStyle = "black";
            }

            var newx1 = (parseFloat(this.X.toString()) + parseFloat(cell.x));
            cell.vpx1o = newx1.toFixed(0);
            newx1 = newx1 - parseFloat(this.Experience.ViewportX.toFixed(2));  //<== this for some reason causes paralax

            var newy1:any = cell.y;
            cell.vpy1o = newy1.toFixed(0); //used for controls
            newy1 = newy1 - this.Experience.ViewportY.toFixed(2);  //<== this for some reason causes paralax

            
            cell.vpx1 = newx1.toFixed(0);
            cell.vpy1 = newy1.toFixed(0);
            var newx2 = newx1 + cell.width;
            var newy2 = newy1 + cell.height;
            cell.vpx2 = newx2.toFixed(0);
            cell.vpx2o = newx2.toFixed(0);
            cell.vpy2 = newy2.toFixed(0);
            cell.vpy2o = newx2.toFixed(0);
            cell.setTimeoutPointer = 0;
            if (this._drawSlotData)
            {
                surface.fillText(cell.vpx1 + ", " + cell.vpy1, cell.x + paddingX, cell.y + paddingY);
                surface.fillText(cell.vpx2 + ", " + cell.vpy2, cell.x + paddingX, cell.y + paddingY + 20);
            }

            // Click Logic
            if (
                this.Experience._PanningActive == false
                && this.Experience._MousePointerDown.x >= newx1
                && this.Experience._MousePointerDown.x <= newx2
                && this.Experience._MousePointerDown.y >= newy1
                && this.Experience._MousePointerDown.y <= newy2
                && cell.clickedprocessing == 0)
            {
                cell.clickedprocessing = 1;
                cell.clicked = cell.clicked == 0 ? 1 : 0;
                cell.clickedprocessing = 0;
            }

            if (this._drawClickData)
            {
                surface.fillText(cell.clicked, cell.x + paddingX + 5, cell.y + paddingY + 40);
            }
            //TextDraw.DrawBubbleNow(cell.id, cell.x+5, cell.y+5, 1);
        }
    }

    private _drawControls(surface)
    {
        var SlotIndex = 0;
        if (this.Controls != undefined)
        {
            var i;
            for (i = 0; i < this.Controls.length; i++)
            {
                var j = this.Controls[i];

                try
                {

                    //Dbg.Print(Experience.Instance.GetViewportX());
                    //Dbg.Print(Experience.Instance.Width);
                    //j.SlotCell = this.SlotCells[j.Slot];
                    //Dbg.Print(this.SlotCells[j.Slot].x);
                    if (j.IsVisible(this.Experience.ViewportX, this.Experience.ViewportY, this.Experience.Width, this.Experience.Height))
                    {
                        j.Draw(surface);
                        this.Experience.DrawCallCount += 1;
                    } 
//                    else
//                    {
//                        //DO WE WANT TO UNDRAW/CLEANUP SOME CONTROLS?
//                    }
                }
                catch (err)
                {	// this shouldn't ever happen as the base Draw() method wrapper will catch
                    // all draw errors
                    j.Broken = true;
                    //Dbg.Print("Page " + this.Label + " unhandled error in DrawControls(): " + err);
                }
            }
        }
    }


    private _updateControls(tick) {
        var SlotIndex = 0;
        if (this.Controls != undefined) {
            var i;
            for (i = 0; i < this.Controls.length; i++) {
                var j = this.Controls[i];

                try {
                    if (j.IsVisible(this.Experience.ViewportX, this.Experience.ViewportY, this.Experience.Width, this.Experience.Height)) {
                        j.Update(tick);
                    }
                }
                catch (err) {	

                }

            }
        }
    }

    public IsPageVisibleInCurrentViewport()
    {
        if (this.IsVisible(this.Experience.ViewportX, 0, this.Experience.Width, 0))
        {
            return true;
        }

        return false;
    }


    
}