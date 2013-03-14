/// <reference path="views.pagebase.ts"/>

declare var $;

class PageX extends PageBase
{

    private _cellWidth: number = 120;
    private _cellHeight:number = 120;
    
    private _cells: any = new Array();
    private _slotCells: any = new Array() ;
    
    private _tick: any;
    private _drawSlotBorders: bool = false;
    private _drawClickData: bool = false;
    private _drawSlotData: bool = false;


    constructor(experience: Experience, public Label: string, public XCells: number, public YCells: number, public Slots: any, public Controls: any ) {
        super(experience);


        this.Width = this.XCells * this._cellWidth + 200;
        this.Height = this.YCells * this._cellHeight + 200;;

    }



    public SpawnStandalone(x, y, url)
    {
        var instance = { "x": x, "y": y, "img": this.Preload(url) };
        return instance;
    }

    public Initialize() {
        this.BuildGrid();
        this.BuildSlots();
        this.InitControls();
        this.zIndex += 3;
    }

    public Update(tick)
    {
        this._tick = tick;
    }

    // could disable this when off-screen
    public Draw(surface)
    {

        //this.DrawSubPanel1(surface);
        this.DrawGrid(surface);
        this.DrawControls(surface);

        //Dbg.Surface.fillStyle = "#fff";
        //Dbg.Print(this.Label);
    }

    public DrawSubPanel1(surface)
    {
        var i1 = this.Experience.Interpolation.Normalize(this.Interpolator, 0.3, 1.0);
        var i2 = this.Experience.Interpolation.Normalize(this.Interpolator, 0.3, 1.5);

        var bg_interpolation = this.Experience.Interpolation.Normalize(this.Interpolator, 0, .25);
        var fg_interpolation = this.Experience.Interpolation.Normalize(this.Interpolator, .3, .5);

        //Dbg.Print(i1 + " | " + i2 + " | " + bg_interpolation + " | " + fg_interpolation);

        var w = 920;
        var h = 700;  

        // for bg, sprites, and glow
        var x_bg = 10;
        var y_bg = 10;

        surface.save();
        surface.translate(x_bg, y_bg);
        surface.globalAlpha = 1;
        //        surface.fillStyle = "#000";
        //        surface.fillRect(-6, -6, w + 12, h + 12);

        // full background
        var backgroundVisibility = this.Experience.Interpolation.Normalize(this.Interpolator, .5, .8);

        //TextDraw.DrawBubbleNow("x=0;y=0;", 0, 0, 1);
        //TextDraw.DrawBubbleNow("x=" + (this.Width - 80) + ";y=0;", this.Width - 80, 0, 1);

        surface.restore();

        this.Experience.DrawCallCount += 4;
    }

    public BuildGrid()
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

    public BuildSlots()
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

    public InitControls() {

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

    public DrawGrid(surface)
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
                surface.lineWidth = 0;
                surface.fillRect(cell.x, cell.y, cell.width, cell.height);

                surface.fillStyle = "black";
                surface.fillText(cell.id, cell.x + paddingX, cell.y + paddingY - 20);

                surface.fillStyle = "black";
            }

            var newx1 = (parseFloat(this.X) + parseFloat(cell.x));
            cell.vpx1o = newx1.toFixed(0);
            newx1 = newx1 - this.Experience._ViewportX.toFixed(2);  //<== this for some reason causes paralax

            var newy1 = cell.y;
            cell.vpy1o = newy1.toFixed(0); //used for controls
            newy1 = newy1 - this.Experience._ViewportY.toFixed(2);  //<== this for some reason causes paralax

            
            cell.vpx1 = newx1.toFixed(0);
            cell.vpy1 = newy1.toFixed(0);
            var newx2 = newx1 + cell.width;
            var newy2 = newy1 + cell.height;
            cell.vpx2 = newx2.toFixed(0);
            cell.vpx2o = newx2.toFixed(0);
            cell.vpy2 = newy2.toFixed(0);
            cell.vpy2o = newx2.toFixed(0);
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
                //Dbg.Print("click check started (" + cell.id + ")");


                $.doTimeout(cell.id, 100, function (state)
                {
                    //$.doTimeout(cell.id);
                    if (this.Experience._PanningActive == false)
                    {
                        state.clicked = state.clicked == 1 ? 0 : 1;
                        //Dbg.Print("click check result (" + state.id + "  :  " + state.clicked + ")");
                    }
                    //Dbg.Print("click check finished (" + state.id + ")");

                    state.clickedprocessing = 0;

                }, cell);

            }

            if (this._drawClickData)
            {
                surface.fillText(cell.clicked, cell.x + paddingX + 5, cell.y + paddingY + 40);
            }
            //TextDraw.DrawBubbleNow(cell.id, cell.x+5, cell.y+5, 1);
        }
    }

    public DrawControls(surface)
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
                    if (j.IsVisible(this.Experience._ViewportX, this.Experience._ViewportY, this.Experience.Width, this.Experience.Height))
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

    public IsPageVisibleInCurrentViewport()
    {
        if (this.IsVisible(this.Experience._ViewportX, 0, this.Experience.Width, 0))
        {
            return true;
        }

        return false;
    }


    
}