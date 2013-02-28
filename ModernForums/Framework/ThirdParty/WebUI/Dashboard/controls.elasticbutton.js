function ElasticButton(slot, hovercolor, bkgcolor, sbonload, onclick, imgurl, title, titlefont, titlex, titley, titleBackgroundColor, titlecolor)
{
    var laststate = -99;

    var bhButClick = new BehaviorClickAnimation(this);
    var stateOfLoading = 0; //0=nothing, 1=loading, 2=loaded
    var loadedImage = new Image();
    var _clickedState = false;

    this.Initialize = function ()
    {
        this.zIndex += 3;
        Dbg.Print("ElasticButton Initialize " + slot);
    }

    this.MouseOver = function () {
        //Dbg.Print("ElasticButton - MouseOver");
        this.CurrentColor = this.HoverColor;
    }

    this.MouseOut = function () {
        //Dbg.Print("ElasticButton - MouseOut");
        this.CurrentColor = this.BkgColor;
    }

    this.Update = function (tick) {

    }

    this.Clicked = function (state)
    {

        if (state == 1) //clicked
        {
            Dbg.Print("ElasticButton [slot " + slot + "] Clicked");
            if (onclick != undefined)
            {
                setTimeout(function () { eval(onclick.replace('[imgurl]', imgurl)); }, 500); //giving click animation some time to showoff
            }
        }
        else //reset
        {
            Dbg.Print("ElasticButton [slot " + slot + "] Reset to zero");
        }

    }

    this.Draw = function (surface) {

        if (this.IsVisible()) {

            var co = this.ClickedOn();

            //Dbg.Print("ElasticButton [slot " + slot + "] " + co);

            bhButClick.CalculateDelta(co);

            if (co != _clickedState) {
                _clickedState = co;
                this.Clicked(co);
            }

            surface.fillStyle = "#333333"; //"#A8BAC4";
            surface.fillRect(this.X() + (bhButClick.Delta / 2) - 5, this.Y() + (bhButClick.Delta / 2) - 5, this.Width() - bhButClick.Delta + 10, this.Height() - bhButClick.Delta - 10);







            surface.fillStyle = this.CurrentColor;
            surface.globalAlpha = this.Opacity();
            surface.fillRect(this.X() + (bhButClick.Delta / 2), this.Y() + (bhButClick.Delta / 2), this.Width() - bhButClick.Delta, this.Height() - bhButClick.Delta - 20);

            if (stateOfLoading == 0 && (this.url != undefined || this.url != "")) {
                loadedImage.ib = this;
                loadedImage.src = this.ImageUrl;
                stateOfLoading = 1;
                loadedImage.onload = function () {
                    stateOfLoading = 2;
                };
            } else {
                if (stateOfLoading == 2) {
                    surface.drawImage(
                            loadedImage,
                            this.X() + (bhButClick.Delta / 2),
                            this.Y() + (bhButClick.Delta / 2),
                            this.Width() - bhButClick.Delta,
                            this.Height() - bhButClick.Delta - 20
                        );


                }

            }


            if (this.Title != undefined && this.Opacity() > 0.50) {

                surface.font = this.TitleFont;

                //title background
                surface.fillStyle = this.TitleBackgroundColor;
                var len = surface.measureText(this.Title);
                surface.fillRect(this.TitleX - 10, this.TitleY - 80 + this.GlobalPaddingTop, len.width + 20, 100);

                //title
                if (this.TitleColor != undefined) surface.fillStyle = this.TitleColor;
                surface.globalAlpha = this.Opacity();
                surface.fillText(this.Title, this.TitleX, this.TitleY + this.GlobalPaddingTop, this.Width());
                surface.globalAlpha = 1;




            }

        }

    }

    this.Unload = function ()
    {

    }
    

    ControlBase.call(this); // inherit base

    this.ImageUrl = imgurl;  
    this.Slot = slot;
    this.CurrentColor = bkgcolor;
    this.BkgColor =  bkgcolor;
    this.HoverColor = hovercolor;
    this.StoryboardOnLoad = sbonload;

    this.Title = title;
    this.TitleColor = titlecolor;
    this.TitleBackgroundColor = titleBackgroundColor;
    this.TitleFont = titlefont;
    this.TitleX = titlex;
    this.TitleY = titley;

    this.CropX = 0;// cropx;
    this.CropY = 0;// cropy;
    this.CropW = 600;//  cropw;
    this.CropH = 600;// croph;
}