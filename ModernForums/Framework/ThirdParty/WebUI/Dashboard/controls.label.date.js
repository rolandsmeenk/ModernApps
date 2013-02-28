function LabelDate(slot, deltapixel, deltatime, day, month, year, titlefontfamily, titlefillstyle, padding) {

    this.Initialize = function () {
        this.zIndex += 3;
    }

    this.Update = function (tick) {
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


        surface.fillStyle = 'Black';
        surface.fillRect(this.X(), this.Y() + 10, this.Width(), this.Height()- 10);

        //TITLE
        if (stopAnimation) {
            surface.save();
            surface.font = "26px " + this.TitleFontFamily;
            surface.globalAlpha = 1.0;
            surface.fillStyle = this.TitleFillStyle;

            var metrics = surface.measureText(this.Month);

            
            surface.translate(this.X(), this.Y() + this.Height() );
                
            surface.fillText(this.Month, this.Width() - metrics.width -5 , 0 - this.Height() + 26 + 10, this.Width());

            surface.font = "18px " + this.TitleFontFamily;
            metrics = surface.measureText(this.Year);
            surface.fillText(this.Year, this.Width() - metrics.width - 5, - 18 + 10, this.Width());

            surface.font = "60px " + this.TitleFontFamily;
            var metrics = surface.measureText(this.Day);
            surface.fillText(this.Day, this.Width() - metrics.width - 5, - 35 + 5 , this.Width());
           

            surface.restore();
        }


    }

    this.Unload = function () {


    }

    ControlBase.call(this); // inherit base

    this.Slot = slot;
    this.Day = day;
    this.Month = month;
    this.Year = year;
    this.TitleFontFamily = titlefontfamily;
    this.TitleFillStyle = titlefillstyle;
    this.Padding = padding;

    this.DeltaTime = deltatime;
    this.DeltaPixel = deltapixel;
}