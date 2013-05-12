/// <reference path="controls.controlbase.ts"/>
/// <reference path="experience.ts"/>
/// <reference path="controls.behaviors.clickanimation.ts"/>

//declare var $;




class ImageBasic extends ControlBase 
{
    private _stateOfLoading: number = 0; //0=nothing, 1=loading, 2=loaded
    private _loadedImage: any;
    private _bhButClick: BehaviorClickAnimation;

    public Slot: number;
    public Color: string ;
    public ImageUrl: string ;
    public CropX: number ;
    public CropY: number ;
    public CropW: number;
    public CropH: number ;

    public zIndex: number;

    constructor(experience: Experience, slot: number, bkgcolor: string, url: string, cropx: number, cropy: number, cropw: number, croph: number) {
        super(experience);

        this._loadedImage = new Image();
        this._bhButClick = new BehaviorClickAnimation(this)
        this.Slot = slot;
        this.Color = bkgcolor;
        this.ImageUrl = url;
        this.CropX = cropx;
        this.CropY = cropy;
        this.CropW = cropw;
        this.CropH = croph;
    }

    public Initialize()
    {
        super.Initialize();

        this.zIndex += 3;

    }

    public MouseOver () {
        super.MouseOver();
    }

    public MouseOut() {
        super.MouseOut();
    }

    public Update(tick)
    {
        super.Update(tick);
    }

    public Draw(surface)
    {
        super.Draw(surface);
        if (this.IsVisible)
        {

            var co = this.ClickedOn();
            this._bhButClick.CalculateDelta(co);

            surface.fillStyle = this.Color;
            surface.globalAlpha = this.Opacity();
            //surface.fillRect(this.X() + (bhButClick.Delta / 2), this.Y() + (bhButClick.Delta / 2), this.Width() - bhButClick.Delta, this.Height() - bhButClick.Delta);


            if (this._stateOfLoading == 0 && (this.ImageUrl != undefined || this.ImageUrl != ""))
            {
                this._loadedImage.ib = this;
                this._loadedImage.src = this.ImageUrl;
                this._stateOfLoading = 1;
                this._loadedImage.onload = function ()
                {
                    this._stateOfLoading = 2;
                };
            } else
            {
                if (this._stateOfLoading == 2) surface.drawImage(this._loadedImage, this.CropX, this.CropY, this.CropW, this.CropH, (this.X() + (this._bhButClick.Delta / 2), this.Y() + (this._bhButClick.Delta / 2), this.Width() - this._bhButClick.Delta, this.Height() - this._bhButClick.Delta));
            }



        }
    }

    public Unload ()
    {
        super.Unload();

    }



}