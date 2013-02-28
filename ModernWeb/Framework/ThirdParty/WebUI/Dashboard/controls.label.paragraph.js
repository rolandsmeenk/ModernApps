function LabelParagraph(slot, deltapixel, deltatime, titlefontfamily, titlefontsize, titlefillstyle, titlebkgfillstyle, paddingword, paddingparagraph, paragraphtext) {

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


        var fontHeight = this.TitleFontSize;


        surface.translate(this.X(), this.Y() + fontHeight);


        var newYPosition = 0;
        var currentLine = 0;
        for (var _paragraphIndex = 0; _paragraphIndex < this.ParagraphText.length; _paragraphIndex++) {

            var _paragraph = this.ParagraphText[_paragraphIndex];
            var words = _paragraph.split(' ');

            //Dbg.Print("Paragraph : words.length = " + words.length);

            if (stopAnimation) {


                surface.save();
                surface.font = fontHeight + "px " + this.TitleFontFamily;
                surface.globalAlpha = 1.0;




                var currentXPosition = 0;
                var newXPosition = 0;

                for (var wordIndex = 0; wordIndex < words.length ; wordIndex++) {

                    var word = words[wordIndex];
                    var metrics1 = surface.measureText(word);

                    //Dbg.Print("Paragraph : word = " + word);

                    surface.fillStyle = this.TitleFillStyle;
                    //surface.fillText(word, newXPosition, newYPosition);
                    surface.fillText(word, newXPosition, newYPosition);


                    //determine new X position of the next word
                    newXPosition += metrics1.width + this.PaddingWord;

                    if (newXPosition > this.Width()) {
                        currentLine++;
                        newXPosition = 0;

                        surface.translate(0, fontHeight - 10);
                    }

                    newYPosition = currentLine * fontHeight;
                }

                //Dbg.Print("Paragraph : this.Width() = " + this.Width());

                surface.restore();
            }


            //next paragraph
            currentLine++;
            currentLine += this.PaddingParagraph;
            newXPosition = 0;
            newYPosition = currentLine * fontHeight;

            //surface.translate(0, fontHeight - 10);



        }
    }

    this.Unload = function () {


    }

    ControlBase.call(this); // inherit base

    this.Slot = slot;
    this.ParagraphText = paragraphtext;
    this.TitleFontFamily = titlefontfamily;
    this.TitleFontSize = titlefontsize;
    this.TitleFillStyle = titlefillstyle;
    this.TitleBkgFillStyle = titlebkgfillstyle;
    this.PaddingWord = paddingword;
    this.PaddingParagraph = paddingparagraph;

    this.DeltaTime = deltatime;
    this.DeltaPixel = deltapixel;
}