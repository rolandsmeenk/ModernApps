function VideoControlsBasic(slot, oncolor, offcolor, vidplayerid, onimageurl, offimageurl)
{
    var laststate = -99;
    var state = 0; //0=stopped; 1=playing
    this.LoadedImage = new Image();
    var stateOfLoadingImage = 0; //0=nothing, 1=loading, 2=loaded
    var tSurface;
    var tColorToUse = offcolor;

    this.Initialize = function ()
    {
        this.zIndex += 3;


        this.LoadedImage.ib = this;
        this.LoadedImage.onload = function ()
        {
            if (this.ib.LoadedImage != undefined)
            {
                Dbg.Print('vidCtrl Init');
                stateOfLoadingImage = 2;
            }
        };

    }

    this.Update = function (tick)
    {
    }

    this.Draw = function (surface)
    {
        tSurface = surface;

        if (laststate != this.ClickedOn())
        {
            //Dbg.Print(laststate);
            if (this.ClickedOn())
            {
                tColorToUse = this.ColorOn;
                state = 1;
                stateOfLoadingImage = 1;
                this.LoadedImage.src = this.OnImageUrl;

                try{ document.getElementById(vidplayerid).play(); }catch(e){}
                
            }
            else
            {
                tColorToUse = this.ColorOff;
                state = 0;
                this.LoadedImage.src = this.OffImageUrl;

                try { document.getElementById(vidplayerid).pause(); } catch (e) { }
            }
            laststate = this.ClickedOn();


        }

        surface.fillStyle = tColorToUse;
        surface.fillRect(this.X(), this.Y(), this.Width(), this.Height());
        if (this.LoadedImage != null || this.LoadedImage != undefined)
        {
            surface.drawImage(this.LoadedImage, this.X() + ((this.Width() - 88) / 2), this.Y() + ((this.Height() - 88) / 2));
        }

    }

    this.Unload = function ()
    {


    }

    ControlBase.call(this); // inherit base

    this.Slot = slot;
    this.ColorOn = oncolor;
    this.ColorOff = offcolor;
    this.VideoPlayerId = vidplayerid;
    this.OnImageUrl = onimageurl;
    this.OffImageUrl = offimageurl;

}