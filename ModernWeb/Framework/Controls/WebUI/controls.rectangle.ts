/// <reference path="controls.controlbase.ts"/>
/// <reference path="experience.ts"/>

declare var $;

class Rectangle extends ControlBase
{

    public Slot: number;
    public Color : string;
    public StoryboardOnLoad: number;

    public zIndex: number;


    constructor(experience: Experience, slot: number, bkgcolor: string, sbonload: any){
        super(experience);

        this.Slot = slot;
        this.Color = bkgcolor;
        this.StoryboardOnLoad = sbonload;
    }

    public Initialize()
    {
        super.Initialize();

        this.zIndex += 3;
        //bg.Print("Rectangle Initialize " + slot);
    }

    public Update(tick)
    {
        super.Update(tick);
    }

    public Draw(surface)
    {
        if (this.IsVisible)
        {
            super.Draw(surface);

            //Dbg.Print("this.Storyboard.AnimArea : " + this.Storyboard.AnimArea);
            surface.globalAlpha = this.Opacity();
            surface.fillStyle = this.Color;
            surface.fillRect(this.X(), this.Y(), this.Width(), this.Height());
            //Dbg.Print("this.Opacity() : " + this.Opacity());
            
        }
    }

    public Unload()
    {
        super.Unload();
    }


}