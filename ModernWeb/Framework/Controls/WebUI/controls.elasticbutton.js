var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ElasticButton = (function (_super) {
    __extends(ElasticButton, _super);
    function ElasticButton(experience, slot, hovercolor, bkgcolor, sbonload, onclick, imgurl, title, titlefont, titlex, titley, titleBackgroundColor, titlecolor) {
        _super.call(this, experience);
        this._laststate = -99;
        this._stateOfLoading = 0;
        this._loadedImage = new Image();
        this._clickedState = false;
        this.ImageUrl = imgurl;
        this.Slot = slot;
        this.CurrentColor = bkgcolor;
        this.BkgColor = bkgcolor;
        this.HoverColor = hovercolor;
        this.StoryboardOnLoad = sbonload;
        this.CropX = 0;
        this.CropY = 0;
        this.CropW = 600;
        this.CropH = 600;
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
    ElasticButton.prototype.Initialize = function () {
        _super.prototype.Initialize.call(this);
        this.zIndex += 3;
    };
    ElasticButton.prototype.MouseOver = function () {
        this.CurrentColor = this.HoverColor;
    };
    ElasticButton.prototype.MouseOut = function () {
        this.CurrentColor = this.BkgColor;
    };
    ElasticButton.prototype.Update = function (tick) {
        _super.prototype.Update.call(this, tick);
    };
    ElasticButton.prototype.Clicked = function (state) {
        if(state == 1) {
            if(this._onClick != undefined) {
                var _self = this;
                setTimeout(function () {
                    eval(_self._onClick.replace('[imgurl]', _self.ImageUrl));
                }, 500);
            }
        } else {
        }
    };
    ElasticButton.prototype.Draw = function (surface) {
        _super.prototype.Draw.call(this, surface);
        if(this.IsVisible) {
            var co = this.ClickedOn();
            this._bhButClick.CalculateDelta(co);
            if(co != this._clickedState) {
                this._clickedState = co;
                this.Clicked(co);
            }
            surface.fillStyle = "WhiteSmoke";
            surface.fillRect(this.X() + (this._bhButClick.Delta / 2), this.Y() + (this._bhButClick.Delta / 2), this.Width() - this._bhButClick.Delta , this.Height() - this._bhButClick.Delta);
            surface.fillStyle = this.CurrentColor;
            surface.globalAlpha = this.Opacity();
            surface.fillRect(this.X() + (this._bhButClick.Delta / 2), this.Y() + (this._bhButClick.Delta / 2), this.Width() - this._bhButClick.Delta, this.Height() - this._bhButClick.Delta);
            if(this._stateOfLoading == 0 && (this.ImageUrl != undefined || this.ImageUrl != "")) {
                this._loadedImage.ib = this;
                this._loadedImage.src = this.ImageUrl;
                this._stateOfLoading = 1;
                this._loadedImage.onload = function () {
                    this._stateOfLoading = 2;
                };
            } else {
                if(this._stateOfLoading == 2) {
                    surface.drawImage(this._loadedImage, this.X() + (this._bhButClick.Delta / 2), this.Y() + (this._bhButClick.Delta / 2), this.Width() - this._bhButClick.Delta, this.Height() - this._bhButClick.Delta - 20);
                }
            }
            //if(this.Title != undefined && this.Opacity() > 0.5) {
            //    surface.font = this.TitleFont;
            //    surface.fillStyle = this.TitleBackgroundColor;
            //    var len = surface.measureText(this.Title);
            //    surface.fillRect(this.TitleX - 10, this.TitleY - 80 + this.GlobalPaddingTop, len.width + 20, 100);
            //    if(this.TitleColor != undefined) {
            //        surface.fillStyle = this.TitleColor;
            //    }
            //    surface.globalAlpha = this.Opacity();
            //    surface.fillText(this.Title, this.TitleX, this.TitleY + this.GlobalPaddingTop, this.Width());
            //    surface.globalAlpha = 1;
            //}
        }
    };
    ElasticButton.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
    };
    return ElasticButton;
})(ControlBase);
