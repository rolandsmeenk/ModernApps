var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ComposerStyle = (function (_super) {
    __extends(ComposerStyle, _super);
    function ComposerStyle(wysihtml5, parent, textareaElement, config) {
        _super.call(this, wysihtml5, parent, textareaElement, config);
        this.wysihtml5 = wysihtml5;
        this.parent = parent;
        this.textareaElement = textareaElement;
        this.config = config;
        this.TEXT_FORMATTING = [
            "background-color", 
            "color", 
            "cursor", 
            "font-family", 
            "font-size", 
            "font-style", 
            "font-variant", 
            "font-weight", 
            "line-height", 
            "letter-spacing", 
            "text-align", 
            "text-decoration", 
            "text-indent", 
            "text-rendering", 
            "word-break", 
            "word-wrap", 
            "word-spacing"
        ];
        this.BOX_FORMATTING = [
            "background-color", 
            "border-collapse", 
            "border-bottom-color", 
            "border-bottom-style", 
            "border-bottom-width", 
            "border-left-color", 
            "border-left-style", 
            "border-left-width", 
            "border-right-color", 
            "border-right-style", 
            "border-right-width", 
            "border-top-color", 
            "border-top-style", 
            "border-top-width", 
            "clear", 
            "display", 
            "float", 
            "margin-bottom", 
            "margin-left", 
            "margin-right", 
            "margin-top", 
            "outline-color", 
            "outline-offset", 
            "outline-width", 
            "outline-style", 
            "padding-left", 
            "padding-right", 
            "padding-top", 
            "padding-bottom", 
            "position", 
            "top", 
            "left", 
            "right", 
            "bottom", 
            "z-index", 
            "vertical-align", 
            "text-align", 
            "-webkit-box-sizing", 
            "-moz-box-sizing", 
            "-ms-box-sizing", 
            "box-sizing", 
            "-webkit-box-shadow", 
            "-moz-box-shadow", 
            "-ms-box-shadow", 
            "box-shadow", 
            "-webkit-border-top-right-radius", 
            "-moz-border-radius-topright", 
            "border-top-right-radius", 
            "-webkit-border-bottom-right-radius", 
            "-moz-border-radius-bottomright", 
            "border-bottom-right-radius", 
            "-webkit-border-bottom-left-radius", 
            "-moz-border-radius-bottomleft", 
            "border-bottom-left-radius", 
            "-webkit-border-top-left-radius", 
            "-moz-border-radius-topleft", 
            "border-top-left-radius", 
            "width", 
            "height"
        ];
        this.RESIZE_STYLE = [
            "width", 
            "height", 
            "top", 
            "left", 
            "right", 
            "bottom"
        ];
        this.ADDITIONAL_CSS_RULES = [
            "html             { height: 100%; }", 
            "body             { min-height: 100%; padding: 0; margin: 0; margin-top: -1px; padding-top: 1px; }", 
            "._wysihtml5-temp { display: none; }", 
            wysihtml5.browser.isGecko ? "body.placeholder { color: graytext !important; }" : "body.placeholder { color: #a9a9a9 !important; }", 
            "body[disabled]   { background-color: #eee !important; color: #999 !important; cursor: default !important; }", 
            "img:-moz-broken  { -moz-force-broken-image-icon: 1; height: 24px; width: 24px; }"
        ];
        this.dom = wysihtml5.dom;
        this.doc = document;
        this.win = window;
        this.HOST_TEMPLATE = this.doc.createElement("div");
    }
    ComposerStyle.prototype.focusWithoutScrolling = function (element) {
        if(element.setActive) {
            try  {
                element.setActive();
            } catch (e) {
            }
        } else {
            var elementStyle = element.style, originalScrollTop = this.doc.documentElement.scrollTop || this.doc.body.scrollTop, originalScrollLeft = this.doc.documentElement.scrollLeft || this.doc.body.scrollLeft, originalStyles = {
                position: elementStyle.position,
                top: elementStyle.top,
                left: elementStyle.left,
                WebkitUserSelect: elementStyle.WebkitUserSelect
            };
            this.dom.setStyles({
                position: "absolute",
                top: "-99999px",
                left: "-99999px",
                WebkitUserSelect: "none"
            }).on(element);
            element.focus();
            this.dom.setStyles(originalStyles).on(element);
            if(this.win.scrollTo) {
                this.win.scrollTo(originalScrollLeft, originalScrollTop);
            }
        }
    };
    return ComposerStyle;
})(View);
