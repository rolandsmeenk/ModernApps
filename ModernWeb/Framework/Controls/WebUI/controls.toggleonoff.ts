/// <reference path="controls.controlbase.ts"/>
/// <reference path="experience.ts"/>
/// <reference path="controls.behaviors.clickanimation.ts"/>

//declare var $;




class ToggleOnOff extends ControlBase 
{

    private _laststate: bool = false;
    
    public Slot:number;
    public ColorOn: string ;
    public ColorOff: string;

    public zIndex: number;


    constructor(experience: Experience, slot, oncolor, offcolor){
        super(experience);

        this.Slot = slot;
        this.ColorOn = oncolor;
        this.ColorOff = offcolor;

    }

    public Initialize()
    {
        super.Initialize();
        this.zIndex += 3;
    }

    public Update(tick)
    {
        super.Update(tick);
    }

    public Draw(surface)
    {
        super.Draw(surface);

        if (this._laststate != this.ClickedOn())
        {
            if (this.ClickedOn) surface.fillStyle = this.ColorOn;
            else surface.fillStyle = this.ColorOff;

            this._laststate = this.ClickedOn();
   
        }
        surface.fillRect(this.X(), this.Y(), this.Width(), this.Height());
    }

    public Unload()
    {
        super.Unload();

    }


}