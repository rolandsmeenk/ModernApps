/// <reference path="controls.controlbase.ts"/>
/// <reference path="experience.ts"/>
/// <reference path="controls.behaviors.clickanimation.ts"/>

//declare var $;




class TextAnimated extends ControlBase
{
    private _movementX: number = 0;
    private _movementY: number = 0;
    private _movementH: number = 0;
    private _movementW: number = 0;
    private _xDirection: number = -1;
    private _yDirection: number = -1;
    private _stopAnimation: bool = false;

    public Slot: number;
    public Title: string;
    public TitleFont: string;
    public TitleFillStyle: string;
    public Padding: string;

    public DeltaTime: any;
    public DeltaPixel: number;
    public DeltaDirection: string;

    public zIndex: number;

    constructor(experience: Experience, slot: number, deltapixel: number, deltatime: number, deltadirection: string, title: string, titlefont:string , titlefillstyle: string, padding: string) {
        super(experience);

        this.Slot = slot;
        this.Title = title;
        this.TitleFont = titlefont;
        this.TitleFillStyle = titlefillstyle;
        this.Padding = padding;

        this.DeltaTime = deltatime;
        this.DeltaPixel = deltapixel;
        this.DeltaDirection = deltadirection;
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


    public Draw(surface) {
        super.Draw(surface);

        var newChange = 0;


        //PREPARE RECTANGLE
        if (this.DeltaPixel > 0 && !this._stopAnimation) {
            newChange = this.FrameLengthMsec / 1000;
            newChange = newChange / this.DeltaTime;
            newChange = newChange * this.DeltaPixel;

            this._movementY = this.Y();
            this._movementX = this.X();

            if (this.DeltaDirection == "FromBottom") {
                this._movementW = this.Width();
                if (this._yDirection == -1) {
                    if (this._movementH >= this.DeltaPixel) this._yDirection = 1;
                    this._movementH = this._movementH + newChange;
                    this._movementY += (this.Height() - this._movementH);
                }
                else if (this._yDirection == 1) {
                    this._stopAnimation = true;
                    if (this._movementH <= 0) this._yDirection = -1;
                    this._movementH = this._movementH - newChange;
                    this._movementY += (this.Height() - this._movementH);
                }
            }
            else if (this.DeltaDirection == "FromTop") {
                this._movementW = this.Width();
                if (this._yDirection == -1) {
                    if (this._movementH >= this.DeltaPixel) this._yDirection = 1;
                    this._movementH = this._movementH + newChange;
                    //movementY = this.Y();
                }
                else if (this._yDirection == 1) {
                    this._stopAnimation = true;
                    if (this._movementH <= 0) this._yDirection = -1;
                    this._movementH = this._movementH - newChange;
                    //movementY = this.Y();
                }
            }
            else if (this.DeltaDirection == "FromLeft") {
                this._movementH = this.Height();
                if (this._xDirection == -1) {
                    if (this._movementW >= this.DeltaPixel) this._xDirection = 1;
                    this._movementW += newChange;
                    //movementY = this.Y();
                }
                else if (this._xDirection == 1) {
                    this._stopAnimation = true;
                    if (this._movementW <= 0) this._xDirection = -1;
                    this._movementW -= newChange;
                    //movementY = this.Y();
                }
            }
            else if (this.DeltaDirection == "FromRight") {
                this._movementH = this.Height();
                if (this._xDirection == -1) {
                    if (this._movementW >= this.DeltaPixel) this._xDirection = 1;
                    this._movementW += newChange;
                    this._movementX += (this.Width() - this._movementW);
                }
                else if (this._xDirection == 1) {
                    this._stopAnimation = true;
                    if (this._movementW <= 0) this._xDirection = -1;
                    this._movementW -= newChange;
                    this._movementX += (this.Width() - this._movementW);
                }
            }

        }


        //TITLE
        if (this._stopAnimation) {
            surface.save();
            surface.font = this.TitleFont;
            surface.globalAlpha = 1.0;
            surface.fillStyle = this.TitleFillStyle;
            var metrics = surface.measureText(this.Title);
            if (this.DeltaDirection == "FromBottom") {
                surface.translate(this.X() + (metrics.width / 2) + 10, this.Y() + this.Height() + this.Padding);
                surface.fillText(this.Title, 0, 0, this.Width());
            }
            else if (this.DeltaDirection == "FromTop") {
                surface.translate(this.X() + (metrics.width / 2) + 10, this.Y() + this.Padding);
                surface.fillText(this.Title, 0, 0, this.Width());
            } else if (this.DeltaDirection == "FromLeft") {
                surface.translate(this.X() + 10, this.Y() + (metrics.width / 2) + 10);
                surface.rotate(90 * (Math.PI / 180));
                surface.fillText(this.Title, 0, 0, this.Width());
            }
            else if (this.DeltaDirection == "FromRight") {
                surface.translate(this.X() + this.Width() - 10, this.Y() + this.Height() - (metrics.width / 2) - 10);
                surface.rotate(-90 * (Math.PI / 180));
                surface.fillText(this.Title, 0, 0, this.Width());
            }
            surface.restore();
        }


    }

    public Unload()
    {
        super.Unload();

    }


}