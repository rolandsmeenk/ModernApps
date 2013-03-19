/// <reference path="controls.controlbase.ts"/>
/// <reference path="experience.ts"/>
/// <reference path="controls.behaviors.clickanimation.ts"/>

declare var $;



class RectangleAnimatedWithText extends ControlBase
{
    private _bhButClick: BehaviorClickAnimation ;

    public Slot: number ;
    public Color : string;
    public Alpha : any;

    public DeltaPixel: number  ;
    public DeltaTime: number;
    public DeltaDirection: any;

    public Title: string;
    public TitleFillStyle: string;
    public TitleFont: string;

    public zIndex: number;


    private _movementX: number = 0;
    private _movementY: number = 0;
    private _movementH: number = 0;
    private _movementW: number = 0;
    private _xDirection: number = -1;
    private _yDirection: number = -1;
    private _stopAnimation: bool = false;

    constructor(experience: Experience, slot: number, bkgcolor: string, bkgalpha: any, deltapixel: number, deltatime: number, deltadirection: string, title: string, titlefont: string, titlefillstyle: string) {
    
        super(experience);

        this._bhButClick = new BehaviorClickAnimation(this);
        this.Slot = slot;
        this.Color = bkgcolor;
        this.Alpha = bkgalpha;
        this.DeltaPixel = deltapixel;
        this.DeltaTime = deltatime;
        this.DeltaDirection = deltadirection;

        this.Title = title;
        this.TitleFillStyle = titlefillstyle;
        this.TitleFont = titlefont;


    }


    public Initialize()
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

        var newChange = 0;

        if (this.IsVisible)
        {

            var co = this.ClickedOn();


            this._bhButClick.CalculateDelta(co);


            //PREPARE RECTANGLE
            if (this.DeltaPixel > 0 && !this._stopAnimation)
            {
                newChange = this.FrameLengthMsec / 1000;
                newChange = newChange / this.DeltaTime;
                newChange = newChange * this.DeltaPixel;

                this._movementY = this.Y();
                this._movementX = this.X();

                if (this.DeltaDirection == "FromBottom")
                {
                    this._movementW = this.Width();
                    if (this._yDirection == -1)
                    {
                        if (this._movementH >= this.DeltaPixel) this._yDirection = 1;
                        this._movementH = this._movementH + newChange;
                        this._movementY += (this.Height() - this._movementH);
                    }
                    else if (this._yDirection == 1)
                    {
                        this._stopAnimation = true;
                        if (this._movementH <= 0) this._yDirection = -1;
                        this._movementH = this._movementH - newChange;
                        this._movementY += (this.Height() - this._movementH);
                    }
                }
                else if (this.DeltaDirection == "FromTop")
                {
                    this._movementW = this.Width();
                    if (this._yDirection == -1)
                    {
                        if (this._movementH >= this.DeltaPixel) this._yDirection = 1;
                        this._movementH = this._movementH + newChange;
                        //movementY = this.Y();
                    }
                    else if (this._yDirection == 1)
                    {
                        this._stopAnimation = true;
                        if (this._movementH <= 0) this._yDirection = -1;
                        this._movementH = this._movementH - newChange;
                        //movementY = this.Y();
                    }
                }
                else if (this.DeltaDirection == "FromLeft")
                {
                    this._movementH = this.Height();
                    if (this._xDirection == -1)
                    {
                        if (this._movementW >= this.DeltaPixel) this._xDirection = 1;
                        this._movementW += newChange;
                        //movementY = this.Y();
                    }
                    else if (this._xDirection == 1)
                    {
                        this._stopAnimation = true;
                        if (this._movementW <= 0) this._xDirection = -1;
                        this._movementW -= newChange;
                        //movementY = this.Y();
                    }
                }
                else if (this.DeltaDirection == "FromRight")
                {
                    this._movementH = this.Height();
                    if (this._xDirection == -1)
                    {
                        if (this._movementW >= this.DeltaPixel) this._xDirection = 1;
                        this._movementW += newChange;
                        this._movementX += (this.Width() - this._movementW);
                    }
                    else if (this._xDirection == 1)
                    {
                        this._stopAnimation = true;
                        if (this._movementW <= 0) this._xDirection = -1;
                        this._movementW -= newChange;
                        this._movementX += (this.Width() - this._movementW);
                    }
                }

            }


            //RECTANGLE
            surface.save();
            surface.fillStyle = this.Color;
            surface.globalAlpha = this.Alpha;
            //surface.fillRect(this._movementX, this._movementY, this._movementW, this._movementH);
            surface.fillRect(this.X() + (this._bhButClick.Delta / 2), this.Y() + (this._bhButClick.Delta / 2), this._movementW - this._bhButClick.Delta, this._movementH - this._bhButClick.Delta);
            surface.restore();

            //TITLE
            if (this._stopAnimation)
            {
                surface.save();
                surface.font = this.TitleFont;
                surface.globalAlpha = 1.0;
                surface.fillStyle = this.TitleFillStyle;
                if (this.DeltaDirection == "FromBottom")
                    surface.fillText(this.Title, this.X() + 10, this.Y() + this.Height() - 20);
                else if (this.DeltaDirection == "FromTop")
                    surface.fillText(this.Title, this.X() + 10, this.Y() + 30);
                else if (this.DeltaDirection == "FromLeft")
                {
                    surface.translate(this.X() + 10, this.Y() + 10);
                    surface.rotate(90 * (Math.PI / 180)); //0.017453293);
                    surface.fillText(this.Title, 0, 0);
                }
                else if (this.DeltaDirection == "FromRight")
                {
                    surface.translate(this.X() + this.Width() - 10, this.Y() + this.Height() - 10);
                    surface.rotate(-90 * (Math.PI / 180)); //0.017453293);
                    surface.fillText(this.Title, 0, 0);
                }
                surface.restore();
            }

        }
    }

    public Unload()
    {
        super.Unload();

    }

}