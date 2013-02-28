function ToggleOnOff(slot, oncolor, offcolor)
{
    var laststate = -99;

    this.Initialize = function ()
    {
        this.zIndex += 3;
    }

    this.Update = function (tick)
    {
    }

    this.Draw = function (surface)
    {
        
        if (laststate != this.ClickedOn())
        {
            if (this.ClickedOn()) surface.fillStyle = this.ColorOn;
            else surface.fillStyle = this.ColorOff;

            laststate = this.ClickedOn();
   
        }
        surface.fillRect(this.X(), this.Y(), this.Width(), this.Height());
    }

    this.Unload = function ()
    {


    }

    ControlBase.call(this); // inherit base

    this.Slot = slot;
    this.ColorOn = oncolor;
    this.ColorOff = offcolor;

}