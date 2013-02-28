function CanvasHost(slot, bkgcolor, uid, mthd)
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

                divHost = $("<div id=\'" + this.Uid + "\' style='position:absolute;' ><div id=\'" +
                this.Uid + "_cc\' style='position:absolute;width:" + this.Width() + "px;height:" +
                this.Height() + "px;' ><canvas id=\'" + this.Uid + "_mc\' class='canvashost' ></canvas><div id=\'" 
                + this.Uid + "_op\'></div></div></div>");
                $("body").prepend(divHost);

                setTimeout(this.MethodToExecute + "(\'" + this.Uid + "\', \'" + this.X() + "\', \'" + this.Y() 
                + "\', \'" + this.Width() + "\', \'" + this.Height() + "\')", 100);

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
    this.Uid = uid;
    this.MethodToExecute = mthd;

}