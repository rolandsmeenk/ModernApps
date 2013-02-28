function ImageBasic(slot, bkgcolor, url, cropx, cropy, cropw, croph)
{
    var stateOfLoading = 0; //0=nothing, 1=loading, 2=loaded
    var loadedImage = new Image();
    //var bhButClick = new BehaviorClickAnimation(this);

    this.Initialize = function ()
    {
        
        this.zIndex += 3;

    }

    this.MouseOver = function () {
    
    }

    this.MouseOut = function () {
    
    }

    this.Update = function (tick)
    {
    }

    this.Draw = function (surface)
    {
        
        if (this.IsVisible())
        {

            var co = this.ClickedOn();
            //bhButClick.CalculateDelta(co);

            surface.fillStyle = this.Color;
            surface.globalAlpha = this.Opacity();
            //surface.fillRect(this.X() + (bhButClick.Delta / 2), this.Y() + (bhButClick.Delta / 2), this.Width() - bhButClick.Delta, this.Height() - bhButClick.Delta);


            if (stateOfLoading == 0 && (this.url != undefined || this.url != ""))
            {
                loadedImage.ib = this;
                loadedImage.src = this.ImageUrl;
                stateOfLoading = 1;
                loadedImage.onload = function ()
                {
                    stateOfLoading = 2;
                };
            } else
            {
                if (stateOfLoading == 2) surface.drawImage(loadedImage, this.CropX, this.CropY, this.CropW, this.CropH, (this.X() + (bhButClick.Delta / 2), this.Y() + (bhButClick.Delta / 2), this.Width() - bhButClick.Delta, this.Height() - bhButClick.Delta));
            }



        }
    }

    this.Unload = function ()
    {


    }

    ControlBase.call(this); // inherit base

    this.Slot = slot;
    this.Color = bkgcolor;
    this.ImageUrl = url;
    this.CropX = cropx;
    this.CropY = cropy;
    this.CropW = cropw;
    this.CropH = croph;

}