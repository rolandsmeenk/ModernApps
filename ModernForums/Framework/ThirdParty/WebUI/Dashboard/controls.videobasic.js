function VideoBasic(slot, bkgcolor, uid, src)
{
    var stateOfLoading = 0; //0=nothing, 1=loaded

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

            if (stateOfLoading == 0 && (this.Uid != undefined || this.Uid != ""))
            {
                stateOfLoading = 1;

                divHost = $("<div id=\'" + this.Uid + "_main\' style='position:absolute;' ><div id=\'" +
                this.Uid + "_cc\' style='position:absolute;width:" + this.Width() + "px;height:" +
                this.Height() + "px;' ><video  id=\'" + this.Uid + "\' src='" + this.Src
                + "' class='videohost'" + " /></div></div>");
                $("body").prepend(divHost);

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
            document.getElementById(this.Uid).onreadystatechange = null;
            divHost.remove();
            divHost.html = null;
            stateOfLoading = 0;
        }
    }


    ControlBase.call(this); // inherit base

    this.Slot = slot;
    this.Color = bkgcolor;
    this.Uid = uid;
    this.Src = src;

}