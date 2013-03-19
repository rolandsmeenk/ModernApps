var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ImageBasic = (function (_super) {
    __extends(ImageBasic, _super);
    function ImageBasic(experience, slot, bkgcolor, url, cropx, cropy, cropw, croph) {
        _super.call(this, experience);
        this._stateOfLoading = 0;
        this._loadedImage = new Image();
        this._bhButClick = new BehaviorClickAnimation(this);
        this.Slot = slot;
        this.Color = bkgcolor;
        this.ImageUrl = url;
        this.CropX = cropx;
        this.CropY = cropy;
        this.CropW = cropw;
        this.CropH = croph;
    }
    ImageBasic.prototype.Initialize = function () {
        _super.prototype.Initialize.call(this);
        this.zIndex += 3;
    };
    ImageBasic.prototype.MouseOver = function () {
        _super.prototype.MouseOver.call(this);
    };
    ImageBasic.prototype.MouseOut = function () {
        _super.prototype.MouseOut.call(this);
    };
    ImageBasic.prototype.Update = function (tick) {
        _super.prototype.Update.call(this, tick);
    };
    ImageBasic.prototype.Draw = function (surface) {
        _super.prototype.Draw.call(this, surface);
        if(this.IsVisible) {
            var co = this.ClickedOn();
            this._bhButClick.CalculateDelta(co);
            surface.fillStyle = this.Color;
            surface.globalAlpha = this.Opacity();
            if(this._stateOfLoading == 0 && (this.ImageUrl != undefined || this.ImageUrl != "")) {
                this._loadedImage.ib = this;
                this._loadedImage.src = this.ImageUrl;
                this._stateOfLoading = 1;
                this._loadedImage.onload = function () {
                    this._stateOfLoading = 2;
                };
            } else {
                if(this._stateOfLoading == 2) {
                    surface.drawImage(this._loadedImage, this.CropX, this.CropY, this.CropW, this.CropH, (this.X() + (this._bhButClick.Delta / 2) , this.Y() + (this._bhButClick.Delta / 2) , this.Width() - this._bhButClick.Delta , this.Height() - this._bhButClick.Delta));
                }
            }
        }
    };
    ImageBasic.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
    };
    return ImageBasic;
})(ControlBase);
