/// <reference path="..\..\..\UIRenderer.ts"/>
/// <reference path="..\..\..\Debugger.ts"/>
/// <reference path="..\wysihtml5.ts"/>

declare var $;

class Sandbox  {
   
    private doc: any;
      
    private windowProperties: any = [
      "parent", "top", "opener", "frameElement", "frames",
      "localStorage", "globalStorage", "sessionStorage", "indexedDB"
    ];
      
    private windowProperties2: any = [
      "open", "close", "openDialog", "showModalDialog",
      "alert", "confirm", "prompt",
      "openDatabase", "postMessage",
      "XMLHttpRequest", "XDomainRequest"
    ];
      
    private documentProperties: any = [
      "referrer",
      "write", "open", "close"
    ];

    private callback: any;
    private config: any;
    private iframe: any;
    private wysihtml5: wysihtml5;
    public loaded: bool = false;


    constructor(wysihtml5: wysihtml5, readyCallback: any, config: any) {
        this.wysihtml5 = wysihtml5;
        this.callback = readyCallback || wysihtml5.EMPTY_FUNCTION;
        this.config = wysihtml5.lang.object({}).merge(config).get();
        this.iframe = this._createIframe();
    }

    public insertInto(element) {
        if (typeof (element) === "string") {
            element = this.doc.getElementById(element);
        }

        element.appendChild(this.iframe);
    }

    public getIframe() {
        return this.iframe;
    }

    public getWindow() {
        this._readyError();
    }

    public getDocument() {
        this._readyError();
    }

    public destroy() {
        var iframe = this.getIframe();
        iframe.parentNode.removeChild(iframe);
    }

    public _readyError() {
        throw new Error("wysihtml5.Sandbox: Sandbox iframe isn't loaded yet");
    }

    public _createIframe() {
        var that = this,
            iframe = this.doc.createElement("iframe");
        iframe.className = "wysihtml5-sandbox";
        this.wysihtml5.dom.setAttributes({
            "security": "restricted",
            "allowtransparency": "true",
            "frameborder": 0,
            "width": 0,
            "height": 0,
            "marginwidth": 0,
            "marginheight": 0
        }).on(iframe);

        // Setting the src like this prevents ssl warnings in IE6
        if (this.wysihtml5.browser.throwsMixedContentWarningWhenIframeSrcIsEmpty()) {
            iframe.src = "javascript:'<html></html>'";
        }

        iframe.onload = function () {
            iframe.onreadystatechange = iframe.onload = null;
            that._onLoadIframe(iframe);
        };

        iframe.onreadystatechange = function () {
            if (/loaded|complete/.test(iframe.readyState)) {
                iframe.onreadystatechange = iframe.onload = null;
                that._onLoadIframe(iframe);
            }
        };

        return iframe;
    }

    public _onLoadIframe(iframe) {
        // don't resume when the iframe got unloaded (eg. by removing it from the dom)
        if (!this.wysihtml5.dom.contains(this.doc.documentElement, iframe)) {
            return;
        }

        var that = this,
            iframeWindow = iframe.contentWindow,
            iframeDocument = iframe.contentWindow.document,
            charset = this.doc.characterSet || this.doc.charset || "utf-8",
            sandboxHtml = this._getHtml({
                charset: charset,
                stylesheets: this.config.stylesheets
            });

        // Create the basic dom tree including proper DOCTYPE and charset
        iframeDocument.open("text/html", "replace");
        iframeDocument.write(sandboxHtml);
        iframeDocument.close();

        this.getWindow = function () { return iframe.contentWindow; };
        this.getDocument = function () { return iframe.contentWindow.document; };

        // Catch js errors and pass them to the parent's onerror event
        // addEventListener("error") doesn't work properly in some browsers
        // TODO: apparently this doesn't work in IE9!
        iframeWindow.onerror = function (errorMessage, fileName, lineNumber) {
            //throw new Error("wysihtml5.Sandbox: " + errorMessage, fileName, lineNumber);
            throw new Error("wysihtml5.Sandbox: " + errorMessage);
        };

        if (!this.wysihtml5.browser.supportsSandboxedIframes()) {
            // Unset a bunch of sensitive variables
            // Please note: This isn't hack safe!  
            // It more or less just takes care of basic attacks and prevents accidental theft of sensitive information
            // IE is secure though, which is the most important thing, since IE is the only browser, who
            // takes over scripts & styles into contentEditable elements when copied from external websites
            // or applications (Microsoft Word, ...)
            var i, length;
            for (i = 0, length = this.windowProperties.length; i < length; i++) {
                this._unset(iframeWindow, this.windowProperties[i], null, null);
            }
            for (i = 0, length = this.windowProperties2.length; i < length; i++) {
                this._unset(iframeWindow, this.windowProperties2[i], this.wysihtml5.EMPTY_FUNCTION, null);
            }
            for (i = 0, length = this.documentProperties.length; i < length; i++) {
                this._unset(iframeDocument, this.documentProperties[i], null, null);
            }
            // This doesn't work in Safari 5 
            // See http://stackoverflow.com/questions/992461/is-it-possible-to-override-document-cookie-in-webkit
            this._unset(iframeDocument, "cookie", "", true);
        }

        this.loaded = true;

        // Trigger the callback
        setTimeout(function () { that.callback(that); }, 0);
    }



    public _getHtml(templateVars) {
        var stylesheets = templateVars.stylesheets,
            html = "",
            i = 0,
            length;
        stylesheets = typeof (stylesheets) === "string" ? [stylesheets] : stylesheets;
        if (stylesheets) {
            length = stylesheets.length;
            for (; i < length; i++) {
                html += '<link rel="stylesheet" href="' + stylesheets[i] + '">';
            }
        }
        templateVars.stylesheets = html;

        return this.wysihtml5.lang.string(
          '<!DOCTYPE html><html><head>'
          + '<meta charset="#{charset}">#{stylesheets}</head>'
          + '<body></body></html>'
        ).interpolate(templateVars);
    }


    public _unset(object, property, value, setter) {
        try { object[property] = value; } catch (e) { }

        try { object.__defineGetter__(property, function () { return value; }); } catch (e) { }
        if (setter) {
            try { object.__defineSetter__(property, function () { }); } catch (e) { }
        }

        if (!this.wysihtml5.browser.crashesWhenDefineProperty(property)) {
            try {
                var config = {
                    get: function () { return value; },
                    set: function () { }
                };
                //if (setter) {
                //    config.set = function () { };
                //}
                Object.defineProperty(object, property, config);
            } catch (e) { }
        }
    }


}

