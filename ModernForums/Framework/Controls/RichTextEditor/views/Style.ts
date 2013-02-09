/// <reference path="..\..\..\UIRenderer.ts"/>
/// <reference path="..\..\..\Debugger.ts"/>
/// <reference path="View.ts"/>
/// <reference path="..\wysihtml5.ts"/>
declare var $;

class ComposerStyle extends View {
   
    private dom: any;
    private doc: any;
    private win: any;
    private HOST_TEMPLATE: any;

    /**
       * Styles to copy from textarea to the composer element
       */
    private TEXT_FORMATTING: any = [
      "background-color",
      "color", "cursor",
      "font-family", "font-size", "font-style", "font-variant", "font-weight",
      "line-height", "letter-spacing",
      "text-align", "text-decoration", "text-indent", "text-rendering",
      "word-break", "word-wrap", "word-spacing"
    ];

    /**
       * Styles to copy from textarea to the iframe
       */
    private BOX_FORMATTING: any = [
      "background-color",
      "border-collapse",
      "border-bottom-color", "border-bottom-style", "border-bottom-width",
      "border-left-color", "border-left-style", "border-left-width",
      "border-right-color", "border-right-style", "border-right-width",
      "border-top-color", "border-top-style", "border-top-width",
      "clear", "display", "float",
      "margin-bottom", "margin-left", "margin-right", "margin-top",
      "outline-color", "outline-offset", "outline-width", "outline-style",
      "padding-left", "padding-right", "padding-top", "padding-bottom",
      "position", "top", "left", "right", "bottom", "z-index",
      "vertical-align", "text-align",
      "-webkit-box-sizing", "-moz-box-sizing", "-ms-box-sizing", "box-sizing",
      "-webkit-box-shadow", "-moz-box-shadow", "-ms-box-shadow", "box-shadow",
      "-webkit-border-top-right-radius", "-moz-border-radius-topright", "border-top-right-radius",
      "-webkit-border-bottom-right-radius", "-moz-border-radius-bottomright", "border-bottom-right-radius",
      "-webkit-border-bottom-left-radius", "-moz-border-radius-bottomleft", "border-bottom-left-radius",
      "-webkit-border-top-left-radius", "-moz-border-radius-topleft", "border-top-left-radius",
      "width", "height"
    ];

    /**
       * Styles to sync while the window gets resized
       */
    private RESIZE_STYLE: any = [
      "width", "height",
      "top", "left", "right", "bottom"
    ];

    private ADDITIONAL_CSS_RULES: any = [
        "html             { height: 100%; }",
        "body             { min-height: 100%; padding: 0; margin: 0; margin-top: -1px; padding-top: 1px; }",
        "._wysihtml5-temp { display: none; }",
        wysihtml5.browser.isGecko ?
          "body.placeholder { color: graytext !important; }" :
          "body.placeholder { color: #a9a9a9 !important; }",
        "body[disabled]   { background-color: #eee !important; color: #999 !important; cursor: default !important; }",
        // Ensure that user see's broken images and can delete them
        "img:-moz-broken  { -moz-force-broken-image-icon: 1; height: 24px; width: 24px; }"
    ];






    constructor(public wysihtml5: wysihtml5, public parent: any, public textareaElement: any, public config: any) {
        super(wysihtml5, parent, textareaElement, config);

        this.dom = wysihtml5.dom;
        this.doc = document;
        this.win = window;
        this.HOST_TEMPLATE = this.doc.createElement("div");


    }


   /**
   * With "setActive" IE offers a smart way of focusing elements without scrolling them into view:
   * http://msdn.microsoft.com/en-us/library/ms536738(v=vs.85).aspx
   *
   * Other browsers need a more hacky way: (pssst don't tell my mama)
   * In order to prevent the element being scrolled into view when focusing it, we simply
   * move it out of the scrollable area, focus it, and reset it's position
   */
    public focusWithoutScrolling(element) {
        if (element.setActive) {
            // Following line could cause a js error when the textarea is invisible
            // See https://github.com/xing/wysihtml5/issues/9
            try { element.setActive(); } catch (e) { }
        } else {
            var elementStyle = element.style,
                originalScrollTop = this.doc.documentElement.scrollTop || this.doc.body.scrollTop,
                originalScrollLeft = this.doc.documentElement.scrollLeft || this.doc.body.scrollLeft,
                originalStyles = {
                    position: elementStyle.position,
                    top: elementStyle.top,
                    left: elementStyle.left,
                    WebkitUserSelect: elementStyle.WebkitUserSelect
                };

            this.dom.setStyles({
                position: "absolute",
                top: "-99999px",
                left: "-99999px",
                // Don't ask why but temporarily setting -webkit-user-select to none makes the whole thing performing smoother
                WebkitUserSelect: "none"
            }).on(element);

            element.focus();

            this.dom.setStyles(originalStyles).on(element);

            if (this.win.scrollTo) {
                // Some browser extensions unset this method to prevent annoyances
                // "Better PopUp Blocker" for Chrome http://code.google.com/p/betterpopupblocker/source/browse/trunk/blockStart.js#100
                // Issue: http://code.google.com/p/betterpopupblocker/issues/detail?id=1
                this.win.scrollTo(originalScrollLeft, originalScrollTop);
            }
        }
    }







}

