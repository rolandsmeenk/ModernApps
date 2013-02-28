function ImageAnimated(slot, bkgcolor, url,
    cropx, cropy, cropw, croph,
    deltax, deltay, deltaw, deltah,
    deltatime, 
    maxdeltax, maxdeltay, maxdeltaw, maxdeltah)
{
    var stateOfLoading = 0; //0=nothing, 1=loading, 2=loaded
    var loadedImage = new Image();

    this.Initialize = function ()
    {
        
        this.zIndex += 3;

    }

    this.Update = function (tick)
    {
        
    }

    var movementX = 0 ;
    var movementY = 0;
    var movementW = 0;
    var movementH = 0;
    var xDirection = -1;
    var yDirection = -1;
    var wDirection = -1;
    var hDirection = -1;
    this.Draw = function (surface)
    {
        surface.fillStyle = this.Color;
        surface.fillRect(this.X(), this.Y(), this.Width(), this.Height());

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
            if (stateOfLoading == 2)
            {
                //Dbg.Print(this.ParentPage.Tick);
                //Dbg.Print(Experience.Instance.DrawCallCount);
                var newX = 0;
                if (this.DeltaX > 0)
                {
                    //Dbg.Print(this.DeltaX / this.DeltaTime);
                    newX = this.ParentPage.Tick / 1000;
                    newX = newX / this.DeltaTime;
                    newX = newX * this.DeltaX;
                    //Dbg.Print(newX);

                    if (xDirection == -1)
                    {
                        if (movementX > this.MaxDeltaX) xDirection = 1;
                        movementX += newX;
                    }
                    else if (xDirection == 1)
                    {
                        if (movementX < 0) xDirection = -1;
                        movementX -= newX;
                    }

                    //Dbg.Print(movementX);
                }

                var newY = 0;
                if (this.DeltaY > 0)
                {
                    //Dbg.Print(this.DeltaX / this.DeltaTime);
                    newY = this.ParentPage.Tick / 1000;
                    newY = newY / this.DeltaTime;
                    newY = newY * this.DeltaY;
                    //Dbg.Print(newX);

                    if (yDirection == -1)
                    {
                        if (movementY > this.MaxDeltaY) yDirection = 1;
                        movementY += newY;
                    }
                    else if (yDirection == 1)
                    {
                        if (movementY < 0) yDirection = -1;
                        movementY -= newY;
                    }

                    //Dbg.Print(movementX);

                }

                var newW = 0;
                if (this.DeltaW > 0)
                {
                    newW = this.ParentPage.Tick / 1000;
                    newW = newW / this.DeltaTime;
                    newW = newW * this.DeltaW;

                    if (wDirection == -1)
                    {
                        if (movementW > this.MaxDeltaW) wDirection = 1;
                        movementW += newW;
                    }
                    else if (wDirection == 1)
                    {
                        if (movementW < 0) wDirection = -1;
                        movementW -= newW;
                    }
                }

                var newH = 0;
                if (this.DeltaH > 0)
                {
                    newH = this.ParentPage.Tick / 1000;
                    newH = newH / this.DeltaTime;
                    newH = newH * this.DeltaH;

                    if (hDirection == -1)
                    {
                        if (movementH > this.MaxDeltaH) hDirection = 1;
                        movementH += newH;
                    }
                    else if (hDirection == 1)
                    {
                        if (movementH < 0) hDirection = -1;
                        movementH -= newH;
                    }
                }


                //boundary checking & fixing
                //TODO : 


                surface.drawImage(
                    loadedImage,
                    this.CropX + movementX,
                    this.CropY + movementY,
                    this.CropW + movementW,
                    this.CropH + movementH,

                    this.X(),
                    this.Y(),
                    this.Width(),
                    this.Height()
                );

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

    //used to crop the the image
    this.CropX = cropx;
    this.CropY = cropy;
    this.CropW = cropw;
    this.CropH = croph;

    //used to move the cropped image
    this.DeltaX = deltax;
    this.DeltaY = deltay;
    this.DeltaW = deltaw;
    this.DeltaH = deltah;

    //speed at which to move the crop points
    this.DeltaTime = deltatime;

    //used to determine the max movement points of crop points
    this.MaxDeltaX = maxdeltax;
    this.MaxDeltaY = maxdeltay;
    this.MaxDeltaW = maxdeltaw;
    this.MaxDeltaH = maxdeltah;
}