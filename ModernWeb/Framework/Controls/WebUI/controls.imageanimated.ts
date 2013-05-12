/// <reference path="controls.controlbase.ts"/>
/// <reference path="experience.ts"/>
/// <reference path="controls.behaviors.clickanimation.ts"/>

//declare var $;




class ImageAnimated extends ControlBase
{

    public zIndex: number;

    private _stateOfLoading: number = 0; //0=nothing, 1=loading, 2=loaded
    private _loadedImage: any;

    public Slot: number;
    public Color: string;
    public ImageUrl: string;

    //used to crop the the image
    public CropX: number;
    public CropY: number;
    public CropW: number;
    public CropH: number;

    //used to move the cropped image
    public DeltaX: number;
    public DeltaY: number;
    public DeltaW: number;
    public DeltaH: number;

    //speed at which to move the crop points
    public DeltaTime: number;

    //used to determine the max movement points of crop points
    public MaxDeltaX: number;
    public MaxDeltaY: number;
    public MaxDeltaW: number;
    public MaxDeltaH: number;


    private _movementX: number = 0;
    private _movementY: number = 0;
    private _movementW: number = 0;
    private _movementH: number = 0;
    private _xDirection: number = -1;
    private _yDirection: number = -1;
    private _wDirection: number = -1;
    private _hDirection: number = -1;


    constructor(experience: Experience, slot: number, bkgcolor: string, url: string,
        cropx: number, cropy: number, cropw: number, croph: number,
        deltax: number, deltay: number, deltaw: number, deltah: number,
        deltatime: number,
        maxdeltax: number, maxdeltay: number, maxdeltaw: number, maxdeltah: number) {
        super(experience);

        this._loadedImage = new Image();

        this.Slot = slot;
        this.Color = bkgcolor;
        this.ImageUrl = url;

        //used to crop the the image
        this.CropX = cropx;
        this.CropY = cropy;
        this.CropW = cropw;
        this.CropH = croph;

        //used to move the cropped image
        this.DeltaX = deltax;
        this.DeltaY = deltay;
        this.DeltaW = deltaw;
        this.DeltaH = deltah;

        //speed at which to move the crop points
        this.DeltaTime = deltatime;

        //used to determine the max movement points of crop points
        this.MaxDeltaX = maxdeltax;
        this.MaxDeltaY = maxdeltay;
        this.MaxDeltaW = maxdeltaw;
        this.MaxDeltaH = maxdeltah;


    }

    public Initialize ()
    {
        super.Initialize();
        this.zIndex += 3;

    }

    public Update(tick)
    {
        super.Update(tick);
    }

    
    public Draw(surface)
    {
        super.Draw(surface);

        surface.fillStyle = this.Color;
        surface.fillRect(this.X(), this.Y(), this.Width(), this.Height());

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
            if (this._stateOfLoading == 2)
            {
                //Dbg.Print(this.ParentPage.Tick);
                //Dbg.Print(Experience.Instance.DrawCallCount);
                var newX = 0;
                if (this.DeltaX > 0)
                {
                    //Dbg.Print(this.DeltaX / this.DeltaTime);
                    newX = this.FrameLengthMsec / 1000;
                    newX = newX / this.DeltaTime;
                    newX = newX * this.DeltaX;
                    //Dbg.Print(newX);

                    if (this._xDirection == -1)
                    {
                        if (this._movementX > this.MaxDeltaX) this._xDirection = 1;
                        this._movementX += newX;
                    }
                    else if (this._xDirection == 1)
                    {
                        if (this._movementX < 0) this._xDirection = -1;
                        this._movementX -= newX;
                    }

                    //Dbg.Print(movementX);
                }

                var newY = 0;
                if (this.DeltaY > 0)
                {
                    //Dbg.Print(this.DeltaX / this.DeltaTime);
                    newY = this.FrameLengthMsec / 1000;
                    newY = newY / this.DeltaTime;
                    newY = newY * this.DeltaY;
                    //Dbg.Print(newX);

                    if (this._yDirection == -1)
                    {
                        if (this._movementY > this.MaxDeltaY) this._yDirection = 1;
                        this._movementY += newY;
                    }
                    else if (this._yDirection == 1)
                    {
                        if (this._movementY < 0) this._yDirection = -1;
                        this._movementY -= newY;
                    }

                    //Dbg.Print(movementX);

                }

                var newW = 0;
                if (this.DeltaW > 0)
                {
                    newW = this.FrameLengthMsec / 1000;
                    newW = newW / this.DeltaTime;
                    newW = newW * this.DeltaW;

                    if (this._wDirection == -1)
                    {
                        if (this._movementW > this.MaxDeltaW) this._wDirection = 1;
                        this._movementW += newW;
                    }
                    else if (this._wDirection == 1)
                    {
                        if (this._movementW < 0) this._wDirection = -1;
                        this._movementW -= newW;
                    }
                }

                var newH = 0;
                if (this.DeltaH > 0)
                {
                    newH = this.FrameLengthMsec / 1000;
                    newH = newH / this.DeltaTime;
                    newH = newH * this.DeltaH;

                    if (this._hDirection == -1)
                    {
                        if (this._movementH > this.MaxDeltaH) this._hDirection = 1;
                        this._movementH += newH;
                    }
                    else if (this._hDirection == 1)
                    {
                        if (this._movementH < 0) this._hDirection = -1;
                        this._movementH -= newH;
                    }
                }


                //boundary checking & fixing
                //TODO : 


                surface.drawImage(
                    this._loadedImage,
                    this.CropX + this._movementX,
                    this.CropY + this._movementY,
                    this.CropW + this._movementW,
                    this.CropH + this._movementH,

                    this.X(),
                    this.Y(),
                    this.Width(),
                    this.Height()
                );

            }
        }
    }

    public Unload()
    {
        super.Unload();

    }

}