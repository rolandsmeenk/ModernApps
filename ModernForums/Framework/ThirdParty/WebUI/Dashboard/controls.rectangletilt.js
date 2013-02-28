function RectangleTilt(slot, bkgcolor, planetilt, planetheta)
{
    

    this.Initialize = function ()
    {
        this.zIndex += 3;
    }

    this.Update = function (tick)
    {
    }

    this.Draw = function (surface)
    {
        surface.fillStyle = this.Color;
        surface.fillRect(this.X(), this.Y(), this.Width(), this.Height());
    }

    this.Unload = function ()
    {


    }

    ControlBase.call(this); // inherit base

    this.Slot = slot;
    this.Color = bkgcolor;


}






function Plane(centerX, centerY, planeLength, planeWidth, planeTilt, planeTheta)
{
    this.centerX = centerX;
    this.centerY = centerY;
    this.planeLength = planeLength;
    this.planeTheta = planeTheta;

    var lastPerspectiveX = null;
    var lastPerspectiveX2 = null;
    var planeNextCornerAngle = 2 * Math.asin(planeWidth / planeLength);

    this.rotate = function (newTheta)
    {
        planeTheta = newTheta - planeNextCornerAngle / 2;
    }

    this.translate = function (newCenterX, newCenterY)
    {
        centerX = newCenterX;
        centerY = newCenterY;
    }

    this.generate = function ()
    {
        var ovalLength = planeLength;
        var ovalWidth = ovalLength * planeTilt;

        var perspectiveX = (ovalLength / 2) * Math.cos(planeTheta);
        var perspectiveY = (ovalWidth / 2) * Math.sin(planeTheta);
        var perspectiveX2 = (ovalLength / 2) * Math.cos(planeTheta + planeNextCornerAngle);
        var perspectiveY2 = (ovalWidth / 2) * Math.sin(planeTheta + planeNextCornerAngle);

        this.topLeftX = (perspectiveX * 1) + centerX;
        this.topLeftY = (perspectiveY * -1) + centerY;
        this.bottomRightX = (perspectiveX * -1) + centerX;
        this.bottomRightY = (perspectiveY * 1) + centerY
        this.topRightX = (perspectiveX2 * 1) + centerX;
        this.topRightY = (perspectiveY2 * -1) + centerY;
        this.bottomLeftX = (perspectiveX2 * -1) + centerX;
        this.bottomLeftY = (perspectiveY2 * 1) + centerY;
    }
}	