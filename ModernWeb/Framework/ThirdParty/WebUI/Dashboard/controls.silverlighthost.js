function SilverlightHost(slot, bkgcolor, xapurl, uid)
{
    var stateOfLoading = 0; //0=nothing, 1=loaded
    var loadedImage = new Image();

    this.Initialize = function ()
    {
        
        //this.zIndex += 3;

    }

    this.Update = function (tick)
    {
    }

    var divHost;
    this.Draw = function (surface)
    {
        if (this.IsVisible)
        {
            surface.fillStyle = this.Color;
            surface.fillRect(this.X(), this.Y(), this.Width(), this.Height());

            if (stateOfLoading == 0 && (this.XapUrl != undefined || this.XapUrl != ""))
            {
                //            loadedImage.ib = this;
                //            loadedImage.src = this.ImageUrl;
                stateOfLoading = 1;

                //if (divHost == null || divhost == undefined)
                //{
                divHost = $("<div id=\'" + this.Uid + "\' style='position:absolute;'>");
                $("body").prepend(divHost);
                //}


                setTimeout('createSilverlight(' + this.Width() + ',' + this.Height() + ',\'' + this.XapUrl + '\', \'' + this.Uid + '\')', 100);

            } else
            {
                if (stateOfLoading == 1)
                {

                    divHost.css('left', (parseFloat(this.SlotCell.vpx1) + 8) + 'px');
                    divHost.css('top', (parseFloat(this.SlotCell.vpy1) + 8) + 'px');
                }
            }
        }
    }

    this.Unload = function ()
    {

        if (stateOfLoading == 1)
        {
            divHost.remove();
            divHost.html = null;
            stateOfLoading = 0;
        }
    }


    ControlBase.call(this); // inherit base

    this.Slot = slot;
    this.Color = bkgcolor;
    this.XapUrl = xapurl;
    this.Uid = uid;

}