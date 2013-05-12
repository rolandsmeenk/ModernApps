/// <reference path="controls.controlbase.ts"/>
/// <reference path="experience.ts"/>
/// <reference path="controls.behaviors.clickanimation.ts"/>

//declare var $;

class ElasticButton extends ControlBase
{
    private _laststate:number = -99;

    private _bhButClick: BehaviorClickAnimation;
    private _stateOfLoading: number = 0; //0=nothing, 1=loading, 2=loaded
    private _loadedImage: any = new Image();
    private _clickedState: bool = false;

 
 


    public ImageUrl ;
    public Slot;
    public CurrentColor ;
    public BkgColor ;
    public HoverColor ;
    public StoryboardOnLoad ;
    public _onClick: any;

    public Title : string;
    public TitleColor : string;
    public TitleBackgroundColor : string;
    public TitleFont : string;
    public TitleX : number;
    public TitleY: number ;

    public CropX = 0;// cropx;
    public CropY = 0;// cropy;
    public CropW = 600;//  cropw;
    public CropH = 600;// croph;



    public zIndex: number;

    constructor(experience: Experience, slot: number, hovercolor: string, bkgcolor: string, sbonload: any, onclick: any, imgurl: string, title: string, titlefont: string, titlex: number, titley: number, titleBackgroundColor: string, titlecolor: string) {
        super(experience);

        this._bhButClick = new BehaviorClickAnimation(this);

        this.ImageUrl = imgurl;
        this.Slot = slot;
        this.CurrentColor = bkgcolor;
        this.BkgColor = bkgcolor;
        this.HoverColor = hovercolor;
        this.StoryboardOnLoad = sbonload;
        this._onClick = onclick;

        this.Title = title;
        this.TitleColor = titlecolor;
        this.TitleBackgroundColor = titleBackgroundColor;
        this.TitleFont = titlefont;
        this.TitleX = titlex;
        this.TitleY = titley;
    }

    public Initialize()
    {
        super.Initialize();
        this.zIndex += 3;
        //Dbg.Print("ElasticButton Initialize " + slot);
    }

    public MouseOver() {
        //Dbg.Print("ElasticButton - MouseOver");
        this.CurrentColor = this.HoverColor;
    }

    public MouseOut () {
        //Dbg.Print("ElasticButton - MouseOut");
        this.CurrentColor = this.BkgColor;
    }

    public Update(tick) {
        super.Update(tick);
    }

    public Clicked(state)
    {

        if (state == 1) //clicked
        {
            //Dbg.Print("ElasticButton [slot " + slot + "] Clicked");
            if (this._onClick != undefined)
            {
                var _self = this;
                setTimeout(function () { eval(_self._onClick.replace('[imgurl]', _self.ImageUrl)); }, 500); //giving click animation some time to showoff
            }
        }
        else //reset
        {
            //Dbg.Print("ElasticButton [slot " + slot + "] Reset to zero");
        }

    }

    public Draw(surface) {

        super.Draw(surface);

        if (this.IsVisible) {

            var co = this.ClickedOn();

            //Dbg.Print("ElasticButton [slot " + slot + "] " + co);

            this._bhButClick.CalculateDelta(co);

            if (co != this._clickedState) {
                this._clickedState = co;
                this.Clicked(co);
            }

            surface.fillStyle = "WhiteSmoke"; //"#A8BAC4";
            surface.fillRect(this.X() + (this._bhButClick.Delta / 2) , this.Y() + (this._bhButClick.Delta / 2) , this.Width() - this._bhButClick.Delta , this.Height() - this._bhButClick.Delta );







            surface.fillStyle = this.CurrentColor;
            surface.globalAlpha = this.Opacity();
            surface.fillRect(this.X() + (this._bhButClick.Delta / 2), this.Y() + (this._bhButClick.Delta / 2), this.Width() - this._bhButClick.Delta, this.Height() - this._bhButClick.Delta );

            if (this._stateOfLoading == 0 && (this.ImageUrl != undefined || this.ImageUrl != "")) {
                this._loadedImage.ib = this;
                this._loadedImage.src = this.ImageUrl;
                this._stateOfLoading = 1;
                this._loadedImage.onload = function () {
                    this._stateOfLoading = 2;
                };
            } else {
                if (this._stateOfLoading == 2) {
                    surface.drawImage(
                            this._loadedImage,
                            this.X() + (this._bhButClick.Delta / 2),
                            this.Y() + (this._bhButClick.Delta / 2),
                            this.Width() - this._bhButClick.Delta,
                            this.Height() - this._bhButClick.Delta - 20
                        );


                }

            }


            //if (this.Title != undefined && this.Opacity() > 0.50) {

            //    surface.font = this.TitleFont;

            //    //title background
            //    surface.fillStyle = this.TitleBackgroundColor;
            //    var len = surface.measureText(this.Title);
            //    surface.fillRect(this.TitleX - 10, this.TitleY - 80 + this.GlobalPaddingTop, len.width + 20, 100);

            //    //title
            //    if (this.TitleColor != undefined) surface.fillStyle = this.TitleColor;
            //    surface.globalAlpha = this.Opacity();
            //    surface.fillText(this.Title, this.TitleX, this.TitleY + this.GlobalPaddingTop, this.Width());
            //    surface.globalAlpha = 1;

            //}

        }

    }

    public Unload ()
    {
        super.Unload();
    }
    

}