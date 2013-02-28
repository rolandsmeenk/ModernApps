function RectangleAnimatedWithText(slot, bkgcolor,bkgalpha, deltapixel, deltatime, deltadirection, title, titlefont, titlefillstyle)
{
    var bhButClick = new BehaviorClickAnimation(this);

    this.Initialize = function ()
    {
        this.zIndex += 3;
    }

    this.Update = function (tick)
    {
    }

    var movementX = 0;
    var movementY = 0;
    var movementH = 0;
    var movementW = 0;
    var xDirection = -1;
    var yDirection = -1;
    var stopAnimation = false;


    this.Draw = function (surface)
    {
        var newChange = 0;

        if (this.IsVisible())
        {

            var co = this.ClickedOn();


            bhButClick.CalculateDelta(co);


            //PREPARE RECTANGLE
            if (this.DeltaPixel > 0 && !stopAnimation)
            {
                newChange = this.ParentPage.Tick / 1000;
                newChange = newChange / this.DeltaTime;
                newChange = newChange * this.DeltaPixel;

                movementY = this.Y();
                movementX = this.X();

                if (this.DeltaDirection == "FromBottom")
                {
                    movementW = this.Width();
                    if (yDirection == -1)
                    {
                        if (movementH >= this.DeltaPixel) yDirection = 1;
                        movementH = movementH + newChange;
                        movementY += (this.Height() - movementH);
                    }
                    else if (yDirection == 1)
                    {
                        stopAnimation = true;
                        if (movementH <= 0) yDirection = -1;
                        movementH = movementH - newChange;
                        movementY += (this.Height() - movementH);
                    }
                }
                else if (this.DeltaDirection == "FromTop")
                {
                    movementW = this.Width();
                    if (yDirection == -1)
                    {
                        if (movementH >= this.DeltaPixel) yDirection = 1;
                        movementH = movementH + newChange;
                        //movementY = this.Y();
                    }
                    else if (yDirection == 1)
                    {
                        stopAnimation = true;
                        if (movementH <= 0) yDirection = -1;
                        movementH = movementH - newChange;
                        //movementY = this.Y();
                    }
                }
                else if (this.DeltaDirection == "FromLeft")
                {
                    movementH = this.Height();
                    if (xDirection == -1)
                    {
                        if (movementW >= this.DeltaPixel) xDirection = 1;
                        movementW += newChange;
                        //movementY = this.Y();
                    }
                    else if (xDirection == 1)
                    {
                        stopAnimation = true;
                        if (movementW <= 0) xDirection = -1;
                        movementW -= newChange;
                        //movementY = this.Y();
                    }
                }
                else if (this.DeltaDirection == "FromRight")
                {
                    movementH = this.Height();
                    if (xDirection == -1)
                    {
                        if (movementW >= this.DeltaPixel) xDirection = 1;
                        movementW += newChange;
                        movementX += (this.Width() - movementW);
                    }
                    else if (xDirection == 1)
                    {
                        stopAnimation = true;
                        if (movementW <= 0) xDirection = -1;
                        movementW -= newChange;
                        movementX += (this.Width() - movementW);
                    }
                }

            }


            //RECTANGLE
            surface.save();
            surface.fillStyle = this.BkgColor;
            surface.globalAlpha = this.BkgAlpha;
            //surface.fillRect(movementX, movementY, movementW, movementH);
            surface.fillRect(this.X() + (bhButClick.Delta / 2), this.Y() + (bhButClick.Delta / 2), movementW - bhButClick.Delta, movementH - bhButClick.Delta);

            //surface.fillRect(this.X() + (bhButClick.Delta / 2), this.Y() + (bhButClick.Delta / 2), this.Width() - bhButClick.Delta, this.Height() - bhButClick.Delta);

            surface.restore();

            //TITLE
            if (stopAnimation)
            {
                surface.save();
                surface.font = this.TitleFont;
                surface.globalAlpha = 1.0;
                surface.fillStyle = this.TitleFillStyle;
                if (this.DeltaDirection == "FromBottom")
                    surface.fillText(this.Title, this.X() + 10, this.Y() + this.Height() - 20);
                else if (this.DeltaDirection == "FromTop")
                    surface.fillText(this.Title, this.X() + 10, this.Y() + 30);
                else if (this.DeltaDirection == "FromLeft")
                {
                    surface.translate(this.X() + 10, this.Y() + 10);
                    surface.rotate(90 * (Math.PI / 180)); //0.017453293);
                    surface.fillText(this.Title, 0, 0);
                }
                else if (this.DeltaDirection == "FromRight")
                {
                    surface.translate(this.X() + this.Width() - 10, this.Y() + this.Height() - 10);
                    surface.rotate(-90 * (Math.PI / 180)); //0.017453293);
                    surface.fillText(this.Title, 0, 0);
                }
                surface.restore();
            }

        }
    }

    this.Unload = function ()
    {


    }

    ControlBase.call(this); // inherit base

    this.Slot = slot;
    this.BkgColor = bkgcolor;
    this.BkgAlpha = bkgalpha;
    this.Title = title;
    this.TitleFont = titlefont;
    this.TitleFillStyle = titlefillstyle;

    this.DeltaPixel = deltapixel;
    this.DeltaTime = deltatime;
    this.DeltaDirection = deltadirection;
}