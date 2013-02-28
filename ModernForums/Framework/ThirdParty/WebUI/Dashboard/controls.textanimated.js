function TextAnimated(slot, deltapixel, deltatime, deltadirection, title, titlefont, titlefillstyle, padding)
{
    
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
    this.Draw = function (surface) {
        var newChange = 0;


        //PREPARE RECTANGLE
        if (this.DeltaPixel > 0 && !stopAnimation) {
            newChange = this.ParentPage.Tick / 1000;
            newChange = newChange / this.DeltaTime;
            newChange = newChange * this.DeltaPixel;

            movementY = this.Y();
            movementX = this.X();

            if (this.DeltaDirection == "FromBottom") {
                movementW = this.Width();
                if (yDirection == -1) {
                    if (movementH >= this.DeltaPixel) yDirection = 1;
                    movementH = movementH + newChange;
                    movementY += (this.Height() - movementH);
                }
                else if (yDirection == 1) {
                    stopAnimation = true;
                    if (movementH <= 0) yDirection = -1;
                    movementH = movementH - newChange;
                    movementY += (this.Height() - movementH);
                }
            }
            else if (this.DeltaDirection == "FromTop") {
                movementW = this.Width();
                if (yDirection == -1) {
                    if (movementH >= this.DeltaPixel) yDirection = 1;
                    movementH = movementH + newChange;
                    //movementY = this.Y();
                }
                else if (yDirection == 1) {
                    stopAnimation = true;
                    if (movementH <= 0) yDirection = -1;
                    movementH = movementH - newChange;
                    //movementY = this.Y();
                }
            }
            else if (this.DeltaDirection == "FromLeft") {
                movementH = this.Height();
                if (xDirection == -1) {
                    if (movementW >= this.DeltaPixel) xDirection = 1;
                    movementW += newChange;
                    //movementY = this.Y();
                }
                else if (xDirection == 1) {
                    stopAnimation = true;
                    if (movementW <= 0) xDirection = -1;
                    movementW -= newChange;
                    //movementY = this.Y();
                }
            }
            else if (this.DeltaDirection == "FromRight") {
                movementH = this.Height();
                if (xDirection == -1) {
                    if (movementW >= this.DeltaPixel) xDirection = 1;
                    movementW += newChange;
                    movementX += (this.Width() - movementW);
                }
                else if (xDirection == 1) {
                    stopAnimation = true;
                    if (movementW <= 0) xDirection = -1;
                    movementW -= newChange;
                    movementX += (this.Width() - movementW);
                }
            }

        }


        //TITLE
        if (stopAnimation) {
            surface.save();
            surface.font = this.TitleFont;
            surface.globalAlpha = 1.0;
            surface.fillStyle = this.TitleFillStyle;
            var metrics = surface.measureText(this.Title);
            if (this.DeltaDirection == "FromBottom") {
                surface.translate(this.X() + (metrics.width / 2) + 10, this.Y() + this.Height() + this.Padding);
                surface.fillText(this.Title, 0, 0, this.Width());
            }
            else if (this.DeltaDirection == "FromTop") {
                surface.translate(this.X() + (metrics.width / 2) + 10, this.Y() + this.Padding);
                surface.fillText(this.Title, 0, 0, this.Width());
            } else if (this.DeltaDirection == "FromLeft") {
                surface.translate(this.X() + 10, this.Y() + (metrics.width / 2) + 10);
                surface.rotate(90 * (Math.PI / 180));
                surface.fillText(this.Title, 0, 0, this.Width());
            }
            else if (this.DeltaDirection == "FromRight") {
                surface.translate(this.X() + this.Width() - 10, this.Y() + this.Height() - (metrics.width / 2) - 10);
                surface.rotate(-90 * (Math.PI / 180));
                surface.fillText(this.Title, 0, 0, this.Width());
            }
            surface.restore();
        }


    }

    this.Unload = function ()
    {


    }

    ControlBase.call(this); // inherit base

    this.Slot = slot;
    this.Title = title;
    this.TitleFont = titlefont;
    this.TitleFillStyle = titlefillstyle;
    this.Padding = padding;

    this.DeltaTime = deltatime;
    this.DeltaPixel = deltapixel;
    this.DeltaDirection = deltadirection;
}