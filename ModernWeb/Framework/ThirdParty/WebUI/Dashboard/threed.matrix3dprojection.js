

function Matrix3DProjection(renderduration)
{
    this.Control = null;
 
    this.Init = function (o)
    {
        Dbg.Print("Matrix3DProjection.Init");
        this.Control = o;

    }

    this.UnInit = function ()
    {
        Dbg.Print("Matrix3DProjection.UnInit");
        this.Control = null;
    }

    this.Reset = function () {
        Dbg.Print("Matrix3DProjection.Reset");
    }


    var hasBegun = false;
    this.Begin = function ()
    {
        Dbg.Print("Matrix3DProjection.Begin");
        this.Start = this.Now();
        this.End = this.Start + this.RenderDuration * 1000;
        hasBegun = true;
    }


    this.Now = function ()
    {
        if (Date.now)
            return Date.now();
        else
            return (new Date().getTime());
    }


    this.NextFrame = function (interval_id)
    {
        //Dbg.Print("Animator.NextFrame hasBegun : " + hasBegun);
        if (!hasBegun) this.Begin();

        //Dbg.Print("Animator.NextFrame Start : " + this.Start);
        var e = this.easer,
            now = this.Now() - this.Start,
            end = this.End - this.Start;

        if (now > end)
        {
            // clamp to end time
            now = end;
            return;
        }

    }


    this.Start = null;
    this.End = null;
    this.RenderDuration = renderduration;
}


