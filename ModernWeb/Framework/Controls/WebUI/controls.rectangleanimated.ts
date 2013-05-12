/// <reference path="controls.controlbase.ts"/>
/// <reference path="experience.ts"/>

//declare var $;

class RectangleAnimated extends ControlBase
{
    private _movementX : number = 0;
    private _movementY: number = 0;
    private _movementH: number = 0;
    private _movementW: number = 0;
    private _xDirection: number = -1;
    private _yDirection: number = -1;
    private _stopAnimation : bool = false;

    public Slot: number ;
    public Color : string;
    public Alpha : any;
    public StopAtMax : bool = true ;  //this will make the animation stop when the rectangle reaches its maximum point

    public DeltaPixel: number  ;
    public DeltaTime: number;
    public DeltaDirection: any;

    public zIndex: number;


    constructor(experience: Experience, slot: number, bkgcolor: string, bkgalpha: any, deltapixel: number, deltatime: number, deltadirection: string, stopatmax:bool) {
        super(experience);

        this.Slot = slot;
        this.Color = bkgcolor;
        this.Alpha = bkgalpha;
        this.DeltaPixel = deltapixel;
        this.DeltaTime = deltatime;
        this.DeltaDirection = deltadirection;
        this.StopAtMax = stopatmax;

    }


    public Initialize()
    {
        this.Initialize();
        this.zIndex += 3;
    }

    public Update(tick)
    {
        super.Update(tick);
    }


    public Draw(surface) {
        super.Draw(surface);

        var newChange = 0;
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
                    if (this.StopAtMax) this._stopAnimation = true;
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
                    if (this.StopAtMax) this._stopAnimation = true;
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
                    if (this.StopAtMax) this._stopAnimation = true;
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
                    if (this.StopAtMax) this._stopAnimation = true;
                    if (this._movementW <= 0) this._xDirection = -1;
                    this._movementW -= newChange;
                    this._movementX += (this.Width() - this._movementW);
                }
            }

            
            
        }


        surface.fillStyle = this.Color;
        surface.globalAlpha = this.Alpha;
        surface.fillRect(this._movementX, this._movementY, this._movementW, this._movementH);
            
    }

    public Unload()
    {
        super.Unload();

    }


}