function AnimationEngine()
{

    this.AnimControl = null;
    this.AnimatorsIndex = -1;

    var interval_id = null;

    this.Run = function ()
    {

        this.Stop();

        this.interval_id = setInterval(function ()
        {
            var i;
            for (i = 0; i < Storyboards.length; i++)
            {
                //Dbg.Print("AS_Wave.Run.setInterval : " + Animators[i].Control);
                var ctl = Storyboards[i].Control;
                //if (ctl.IsVisible(ctl.X(), ctl.Y(), ctl.Width(), ctl.Height()))
                if (ctl.ParentPage.IsPageVisibleInCurrentViewport())
                {
                    //Dbg.Print("AS_Wave.Run.setInterval : xxxx");
                    ctl.StoryboardOnLoad.NextFrame();
                }
            }

        }, 20);
    }

    this.Stop = function ()
    {
        if (this.interval_id) clearInterval(this.interval_id);
    }

}

