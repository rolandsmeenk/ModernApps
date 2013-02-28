function RectangleAnimated(slot, bkgcolor, bkgalpha, deltapixel, deltatime, deltadirection, stopatmax)
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
                    if (this.StopAtMax) stopAnimation = true;
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
                    if (this.StopAtMax) stopAnimation = true;
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
                    if (this.StopAtMax) stopAnimation = true;
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
                    if (this.StopAtMax) stopAnimation = true;
                    if (movementW <= 0) xDirection = -1;
                    movementW -= newChange;
                    movementX += (this.Width() - movementW);
                }
            }

            
            
        }


        surface.fillStyle = this.Color;
        surface.globalAlpha = this.Alpha;
        surface.fillRect(movementX, movementY, movementW, movementH);
            
    }

    this.Unload = function ()
    {


    }

    ControlBase.call(this); // inherit base

    this.Slot = slot;
    this.Color = bkgcolor;
    this.Alpha = bkgalpha;
    this.StopAtMax = stopatmax;  //this will make the animation stop when the rectangle reaches its maximum point

    this.DeltaPixel = deltapixel;
    this.DeltaTime = deltatime;
    this.DeltaDirection = deltadirection;
}