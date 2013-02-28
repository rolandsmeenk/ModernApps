function LabelTitle(slot, deltapixel, deltatime, title1, title2, titlefontfamily, titlefillstyle, titlebkgfillstyle, padding) {

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

        if (!this.IsVisible()) return;



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


        var fontHeight = 26;

        //TITLE
        if (stopAnimation) {
            surface.save();
            surface.font = fontHeight + "px " + this.TitleFontFamily;
            surface.globalAlpha = 1.0;




            //TITLE 1
            var metrics1 = surface.measureText(this.Title1);

            surface.rotate(-0.03);
            surface.fillStyle = this.TitleBkgFillStyle;
            surface.fillRect(this.X() - 25, this.Y() + 20, metrics1.width + 10, fontHeight + 10);


            surface.translate(this.X() - 25 + 5, this.Y() + fontHeight);
            surface.fillStyle = this.TitleFillStyle;
            surface.fillText(this.Title1, 0, +20, this.Width());

            //TITLE 2
            var metrics2 = surface.measureText(this.Title2);

            surface.rotate(0.03);
            surface.fillStyle = this.TitleBkgFillStyle;
            //surface.fillRect(this.X() - 25, this.Y() + fontHeight + 20, metrics.width + 10, fontHeight + 10);
            surface.fillRect(-5, fontHeight, metrics2.width + 10, fontHeight + 10);

            //surface.translate(this.X() - 25 + 5, this.Y() + fontHeight + fontHeight);
            surface.fillStyle = this.TitleFillStyle;
            surface.fillText(this.Title2, 0, fontHeight + 20 + 5, this.Width());

            surface.restore();
        }


    }

    this.Unload = function () {


    }

    ControlBase.call(this); // inherit base

    this.Slot = slot;
    this.Title1 = title1;
    this.Title2 = title2;
    this.TitleFontFamily = titlefontfamily;
    this.TitleFillStyle = titlefillstyle;
    this.TitleBkgFillStyle = titlebkgfillstyle;
    this.Padding = padding;

    this.DeltaTime = deltatime;
    this.DeltaPixel = deltapixel;
}