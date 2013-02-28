function Rectangle(slot, bkgcolor, sbonload)
{

    this.Initialize = function ()
    {
        this.zIndex += 3;
        Dbg.Print("Rectangle Initialize " + slot);
    }

    this.Update = function (tick)
    {
    }

    this.Draw = function (surface)
    {
        if (this.IsVisible())
        {

            //Dbg.Print("this.Storyboard.AnimArea : " + this.Storyboard.AnimArea);
            surface.globalAlpha = this.Opacity();
            surface.fillStyle = this.Color;
            surface.fillRect(this.X(), this.Y(), this.Width(), this.Height());
            //Dbg.Print("this.Opacity() : " + this.Opacity());
            
        }
    }

    this.Unload = function ()
    {

    }

    ControlBase.call(this); // inherit base

    this.Slot = slot;
    this.Color = bkgcolor;
    this.StoryboardOnLoad = sbonload;


}