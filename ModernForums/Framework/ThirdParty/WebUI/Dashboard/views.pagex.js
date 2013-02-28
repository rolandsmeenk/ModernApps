function PageX(label, xcells, ycells, slots, controls)
{
    this.Label = label;
    this.XCells = xcells;
    this.YCells = ycells;
    this.CellWidth = 120;
    this.CellHeight = 120;
    // local member variables
    this.Cells = new Array();
    this.Slots = slots;
    this.SlotCells = new Array() ;
    this.Controls = controls;
    this.Tick;
    this.DrawSlotBorders = false;
    this.DrawClickData = false;
    this.DrawSlotData = false;


    this.SpawnStandalone = function (x, y, url)
    {
        var instance = { "x": x, "y": y, "img": this.Preload(url) };
        return instance;
    }

    this.Initialize = function () {
        this.BuildGrid();
        this.BuildSlots();
        this.InitControls();
        this.zIndex += 3;
    }

    this.Update = function (tick)
    {
        this.Tick = tick;
    }

    // could disable this when off-screen
    this.Draw = function (surface)
    {

        //this.DrawSubPanel1(surface);
        this.DrawGrid(surface);
        this.DrawControls(surface);

        Dbg.Surface.fillStyle = "#fff";
        //Dbg.Print(this.Label);
    }

    this.DrawSubPanel1 = function (surface)
    {
        var i1 = Interpolation.Normalize(this.Interpolator, 0.3, 1.0);
        var i2 = Interpolation.Normalize(this.Interpolator, 0.3, 1.5);

        var bg_interpolation = Interpolation.Normalize(this.Interpolator, 0, .25);
        var fg_interpolation = Interpolation.Normalize(this.Interpolator, .3, .5);

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
        var backgroundVisibility = Interpolation.Normalize(this.Interpolator, .5, .8);

        //TextDraw.DrawBubbleNow("x=0;y=0;", 0, 0, 1);
        //TextDraw.DrawBubbleNow("x=" + (this.Width - 80) + ";y=0;", this.Width - 80, 0, 1);

        surface.restore();

        Experience.Instance.DrawCallCount += 4;
    }

    this.BuildGrid = function ()
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
                this.Cells[CellIndex] = {
                    "x": (x * this.CellWidth) + (x * gap) + xStart,
                    "y": (y * this.CellHeight) + (y * gap) + yStart,
                    "width": this.CellWidth,
                    "height": this.CellHeight,
                    "vpx1": 0,
                    "vpx2": 0,
                    "vpy1": 0,
                    "vpy2": 0,
                    "vpx1o": 0,
                    "vpx2o": 0,
                    "vpy1o": 0,
                    "vpy2o": 0,
                    "id": pad(x, 2) + pad(y, 2),
                    "id2": CellIndex,
                    "clicked": 0,
                    "clickedprocessing": 0
                };

                CellIndex++;
            }
        }

    }

    this.BuildSlots = function ()
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
                    this.SlotCells[CellIndex] = this.Cells[k[0]];

                    if (this.Cells[k[1]].x > this.Cells[k[0]].x)
                    {
                        this.SlotCells[CellIndex].width = (this.Cells[k[1]].x - this.Cells[k[0]].x) + this.Cells[k[1]].width;
                        //this.SlotCells[CellIndex].width += this.Cells[k[1]].width + gap;
                    }

                    if (this.Cells[k[1]].y > this.Cells[k[0]].y)
                    {
                        this.SlotCells[CellIndex].height = (this.Cells[k[1]].y - this.Cells[k[0]].y) + this.Cells[k[1]].height;
                        //this.SlotCells[CellIndex].height += this.Cells[k[1]].height + gap;
                    }

                    //alert(k[0]);
                    //alert(k[1]);
                    this.SlotCells[CellIndex].id = pad(CellIndex, 4);
                    CellIndex++;
                }
                else
                {
                    this.SlotCells[CellIndex] = this.Cells[j];
                    this.SlotCells[CellIndex].id = pad(CellIndex, 4);
                    CellIndex++;
                }
            }
        }
    }

    this.InitControls = function () {

        //we want to link the slotcells to there relevant controls
        var SlotIndex = 0;
        if (this.Controls != undefined) {
            var i;
            for (i = 0; i < this.Controls.length; i++) {
                var j = this.Controls[i];

                try {
                    j.SlotCell = this.SlotCells[j.Slot];
                    j.ParentPageX = this.X;
                    j.ParentPageY = this.YCells;
                    j.ParentPage = this;
                    j.Initialize();
                }
                catch (err) {	// this shouldn't ever happen as the base Draw() method wrapper will catch
                    // all draw errors
                    j.Broken = true;
                    Dbg.Print("Page " + this.Label + " unhandled error in DrawControls(): " + err);
                }
            }
        }
    }

    function pad(number, length)
    {

        var str = '' + number;
        while (str.length < length)
        {
            str = '0' + str;
        }

        return str;

    }

    this.DrawGrid = function (surface)
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

        for (i = 0; i < this.SlotCells.length; i++)
        {
            var cell = this.SlotCells[i];

            if (this.DrawSlotBorders)
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
            newx1 = newx1 - Experience.Instance.GetViewportX().toFixed(2);  //<== this for some reason causes paralax

            var newy1 = cell.y;
            cell.vpy1o = newy1.toFixed(0); //used for controls
            newy1 = newy1 - Experience.Instance.GetViewportY().toFixed(2);  //<== this for some reason causes paralax

            
            cell.vpx1 = newx1.toFixed(0);
            cell.vpy1 = newy1.toFixed(0);
            var newx2 = newx1 + cell.width;
            var newy2 = newy1 + cell.height;
            cell.vpx2 = newx2.toFixed(0);
            cell.vpx2o = newx2.toFixed(0);
            cell.vpy2 = newy2.toFixed(0);
            cell.vpy2o = newx2.toFixed(0);
            if (this.DrawSlotData)
            {
                surface.fillText(cell.vpx1 + ", " + cell.vpy1, cell.x + paddingX, cell.y + paddingY);
                surface.fillText(cell.vpx2 + ", " + cell.vpy2, cell.x + paddingX, cell.y + paddingY + 20);
            }
            // Click Logic
            if (
                Experience.Instance.GetPanningActive() == false
                && Experience.Instance.GetMousePositionDown().x >= newx1
                && Experience.Instance.GetMousePositionDown().x <= newx2
                && Experience.Instance.GetMousePositionDown().y >= newy1
                && Experience.Instance.GetMousePositionDown().y <= newy2
                && cell.clickedprocessing == 0)
            {
                cell.clickedprocessing = 1;
                Dbg.Print("click check started (" + cell.id + ")");


                $.doTimeout(cell.id, 100, function (state)
                {
                    //$.doTimeout(cell.id);
                    if (Experience.Instance.GetPanningActive() == false)
                    {
                        state.clicked = state.clicked == 1 ? 0 : 1;
                        Dbg.Print("click check result (" + state.id + "  :  " + state.clicked + ")");
                    }
                    Dbg.Print("click check finished (" + state.id + ")");

                    state.clickedprocessing = 0;

                }, cell);

            }

            if (this.DrawClickData)
            {
                surface.fillText(cell.clicked, cell.x + paddingX + 5, cell.y + paddingY + 40);
            }
            //TextDraw.DrawBubbleNow(cell.id, cell.x+5, cell.y+5, 1);
        }
    }

    this.DrawControls = function (surface)
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
                    if (j.IsVisible(Experience.Instance.GetViewportX(), Experience.Instance.GetViewportY(), Experience.Instance.Width, Experience.Instance.Height))
                    {
                        j.Draw(surface);
                        Experience.Instance.DrawCallCount += 1;
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
                    Dbg.Print("Page " + this.Label + " unhandled error in DrawControls(): " + err);
                }
            }
        }
    }

    this.IsPageVisibleInCurrentViewport = function ()
    {
        if (this.IsVisible(Experience.Instance.GetViewportX(), 0, Experience.Instance.Width, 0))
        {
            return true;
        }

        return false;
    }


    PageBase.call(this); // inherit base

    this.Width = this.XCells * this.CellWidth + 200;
    this.Height = this.YCells * this.CellHeight + 200; ;
}