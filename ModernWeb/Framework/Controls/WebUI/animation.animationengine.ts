/// <reference path="experience.ts"/>

declare var $;

class AnimationEngine
{

    public AnimControl: any = null;
    public AnimatorsIndex: any = -1;

    public interval_id: any = null;

    private _experience: Experience;

    constructor(experience: Experience) {
        this._experience = experience;
    }

    public Run()
    {

        this.Stop();

        this.interval_id = setInterval(function ()
        {
            var i;
            for (i = 0; i < this._experience.Storyboards.length; i++)
            {
                //Dbg.Print("AS_Wave.Run.setInterval : " + Animators[i].Control);
                var ctl = this._experience.Storyboards[i].Control;
                //if (ctl.IsVisible(ctl.X(), ctl.Y(), ctl.Width(), ctl.Height()))
                if (ctl.ParentPage.IsPageVisibleInCurrentViewport())
                {
                    //Dbg.Print("AS_Wave.Run.setInterval : xxxx");
                    ctl.StoryboardOnLoad.NextFrame();
                }
            }

        }, 20);
    }

    public Stop()
    {
        if (this.interval_id) clearInterval(this.interval_id);
    }

}

