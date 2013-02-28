function Banner(slot, hovercolor, bkgcolor, sbonload, onclick, imgurl, title, titlefont, titlex, titley, titleBackgroundColor, titlecolor)
{
    var laststate = -99;

    var bhButClick = new BehaviorClickAnimation(this);
    var stateOfLoading = 0; //0=nothing, 1=loading, 2=loaded
    var loadedImage = new Image();
    var _clickedState = false;

    this.Initialize = function ()
    {
        this.zIndex += 3;
        Dbg.Print("Banner Initialize " + slot);
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



    }

    this.Draw = function (surface) {

        if (this.IsVisible()) {

            //Dbg.Print("Banner [slot " + slot + "] " + co);



            surface.fillStyle = "#333333"; //"#A8BAC4";
            surface.fillRect(this.X() -5 , this.Y() -5 , this.Width() + 10, this.Height() +10 );







            surface.fillStyle = this.CurrentColor;
            surface.globalAlpha = this.Opacity();
            surface.fillRect(this.X() , this.Y() , this.Width() , this.Height() );

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
                            this.X() ,
                            this.Y() ,
                            this.Width() ,
                            this.Height() 
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