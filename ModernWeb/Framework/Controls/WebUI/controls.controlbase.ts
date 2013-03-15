/// <reference path="experience.ts"/>

declare var $;

class ControlBase
{

    public Slot : any;
    public SlotCell : any;
    public ParentPageX : number = 0;
    public ParentPageY : number = 0;
    public ParentPage : number = 0;
    public StoryboardOnLoad : any;
    public GlobalPaddingTop : number = 100;

    private _isInitialized : bool = false;
    private _isBroken: bool = false;
    //this.Derived_Initialize = this.Initialize;


    private _visibilityChanged : bool = false;
    private _isVisible : bool = false;
    private _lastIsVisible : bool = false;

    private _experience: Experience;

    constructor(experience: Experience) 
    {
        this._experience = experience;

    }
    



    public Initialize()
    {
        if (!this._isInitialized)
        {
            //Dbg.Print("ControlBase::Initialize();");

            if (this.StoryboardOnLoad != null 
                || this.StoryboardOnLoad != undefined)
                this.StoryboardOnLoad.Init(this);

            //this.Derived_Initialize();
            this._isInitialized = true;
        }
    }



    //this.Derived_Update = this.Update;
    public Update(frameLengthMsec)
    {
        //this.Derived_Update(frameLengthMsec);
    }

    //this.Derived_Unload = this.Unload;
    public Unload()
    {
        //Dbg.Print("ControlBase::Unload();");
        //this.Derived_Unload();

    }

    //this.Derived_Draw = this.Draw;
    public Draw(surface) {
        
        surface.save();
        try {	// we can restore the drawing context here
            // so if the derived class messes up, this shouldn't destroy the entire experience
            this.DrawImpl(surface);
        }
        catch (err) {
            //Dbg.Print("Control " + this.Label + " unhandled inner-draw error: " + err);
            
            this._isBroken = true;
        }
        surface.restore();

        if (this._visibilityChanged) {
            if (this._isVisible) {
                this.StoryboardOnLoad.Reset();
                this.StoryboardOnLoad.IsPaused = false;
            }
            else {
                this.StoryboardOnLoad.IsPaused = true;
                this.StoryboardOnLoad.Reset();
            }
            this._visibilityChanged = false;
        }

    }


    public DrawImpl(surface)
    {
        //this.Derived_Draw(surface);
    }


    public IsVisible(x, y, w, h)
    {

        // if within bounds or close-enough to be within bounds
        //Dbg.Print(this.ParentPageX + " | " +  (parseFloat(this.SlotCell.vpx1) + parseFloat(this.SlotCell.width)) + " | " + x + " | " + this.SlotCell.vpx1 + " | " + (x + w));
        //Dbg.Print(parseFloat(this.SlotCell.vpx1) + " | " + (x + w) + " | " + this.ParentPageX);
        if (
            (parseFloat(this.SlotCell.vpx1) + parseFloat(this.SlotCell.width)) < 0
            || (parseFloat(this.SlotCell.vpx1) > this._experience.Width)
        ) {
            this._isVisible = false;
        }
        else {
            this._isVisible = true;
        }


        //Dbg.Print("false");
        //this.Derived_Unload();
        if (!this._isVisible) {
            //this.Derived_Unload();
            this.Unload();
            this._lastIsVisible = false;
            //this.HasMouseOver = false;
        }

        if (this._lastIsVisible != this._isVisible) this._visibilityChanged = true;

        this._lastIsVisible = this._isVisible;

        return this._isVisible;

    }

    public HitTest(x, y) {
        if (x >= ((this.X() + this.ParentPageX) - this._experience.ViewportX)
            && x <= ((this.X() + this.ParentPageX) - this._experience.ViewportX + this.Width())
            && y >= ((this.Y() + this.ParentPageY) - this._experience.ViewportY)
            && y <= ((this.Y() + this.ParentPageY) - this._experience.ViewportY + this.Height())) {
            return true;
        }

        return false;
    }

    //this.HasMouseOver = false;
    //this.Derived_MouseOver = this.MouseOver;
    public MouseOver() {
        //this.HasMouseOver = true;
        //if (this.Derived_MouseOver != undefined) this.Derived_MouseOver();
    }

    //this.Derived_MouseOut = this.MouseOut;
    public MouseOut() {
        //this.HasMouseOver = false;
        //if (this.Derived_MouseOut != undefined) this.Derived_MouseOut();
    }

    public Now() {
        if (Date.now) return Date.now();
        else return (new Date().getTime());
    }


    public X()
    {
        var x = this.SlotCell.vpx1o - this.ParentPageX;
        if (this.StoryboardOnLoad != null)
        {
            if (this.StoryboardOnLoad.AnimDirection == 'lefttoright')
                x += this.StoryboardOnLoad.X - this.StoryboardOnLoad.AnimAreaX;
            else if (this.StoryboardOnLoad.AnimDirection == 'righttoleft')
                x += this.StoryboardOnLoad.X;
            else  x += this.StoryboardOnLoad.X;
        }
        return x;
    }
    public Y ()
    {
        var y = this.SlotCell.vpy1o - this.ParentPageY;
        if (this.StoryboardOnLoad != null)
        {
            if (this.StoryboardOnLoad.AnimDirection == 'bottomtotop')
                y += this.StoryboardOnLoad.Y ;
            else if (this.StoryboardOnLoad.AnimDirection == 'toptobottom')
                y += this.StoryboardOnLoad.Y - this.StoryboardOnLoad.AnimAreaX;
            else y += this.StoryboardOnLoad.Y;
        }
        return y + this.GlobalPaddingTop;
    }
    public Width() { return this.SlotCell.width; }
    public Height() { return this.SlotCell.height ;  }
    public ClickedOn() { return this.SlotCell.clicked == 0 ? false : true; }
    public Opacity() { return this.StoryboardOnLoad.Opacity; }
    
}