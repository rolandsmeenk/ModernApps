var Sandbox = (function () {
    function Sandbox(wysihtml5, readyCallback, config) {
        this.windowProperties = [
            "parent", 
            "top", 
            "opener", 
            "frameElement", 
            "frames", 
            "localStorage", 
            "globalStorage", 
            "sessionStorage", 
            "indexedDB"
        ];
        this.windowProperties2 = [
            "open", 
            "close", 
            "openDialog", 
            "showModalDialog", 
            "alert", 
            "confirm", 
            "prompt", 
            "openDatabase", 
            "postMessage", 
            "XMLHttpRequest", 
            "XDomainRequest"
        ];
        this.documentProperties = [
            "referrer", 
            "write", 
            "open", 
            "close"
        ];
        this.loaded = false;
        this.wysihtml5 = wysihtml5;
        this.callback = readyCallback || wysihtml5.EMPTY_FUNCTION;
        this.config = wysihtml5.lang.object({
        }).merge(config).get();
        this.iframe = this._createIframe();
    }
    Sandbox.prototype.insertInto = function (element) {
        if(typeof (element) === "string") {
            element = this.doc.getElementById(element);
        }
        element.appendChild(this.iframe);
    };
    Sandbox.prototype.getIframe = function () {
        return this.iframe;
    };
    Sandbox.prototype.getWindow = function () {
        this._readyError();
    };
    Sandbox.prototype.getDocument = function () {
        this._readyError();
    };
    Sandbox.prototype.destroy = function () {
        var iframe = this.getIframe();
        iframe.parentNode.removeChild(iframe);
    };
    Sandbox.prototype._readyError = function () {
        throw new Error("wysihtml5.Sandbox: Sandbox iframe isn't loaded yet");
    };
    Sandbox.prototype._createIframe = function () {
        var that = this, iframe = this.doc.createElement("iframe");
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
        if(this.wysihtml5.browser.throwsMixedContentWarningWhenIframeSrcIsEmpty()) {
            iframe.src = "javascript:'<html></html>'";
        }
        iframe.onload = function () {
            iframe.onreadystatechange = iframe.onload = null;
            that._onLoadIframe(iframe);
        };
        iframe.onreadystatechange = function () {
            if(/loaded|complete/.test(iframe.readyState)) {
                iframe.onreadystatechange = iframe.onload = null;
                that._onLoadIframe(iframe);
            }
        };
        return iframe;
    };
    Sandbox.prototype._onLoadIframe = function (iframe) {
        if(!this.wysihtml5.dom.contains(this.doc.documentElement, iframe)) {
            return;
        }
        var that = this, iframeWindow = iframe.contentWindow, iframeDocument = iframe.contentWindow.document, charset = this.doc.characterSet || this.doc.charset || "utf-8", sandboxHtml = this._getHtml({
            charset: charset,
            stylesheets: this.config.stylesheets
        });
        iframeDocument.open("text/html", "replace");
        iframeDocument.write(sandboxHtml);
        iframeDocument.close();
        this.getWindow = function () {
            return iframe.contentWindow;
        };
        this.getDocument = function () {
            return iframe.contentWindow.document;
        };
        iframeWindow.onerror = function (errorMessage, fileName, lineNumber) {
            throw new Error("wysihtml5.Sandbox: " + errorMessage);
        };
        if(!this.wysihtml5.browser.supportsSandboxedIframes()) {
            var i, length;
            for(i = 0 , length = this.windowProperties.length; i < length; i++) {
                this._unset(iframeWindow, this.windowProperties[i], null, null);
            }
            for(i = 0 , length = this.windowProperties2.length; i < length; i++) {
                this._unset(iframeWindow, this.windowProperties2[i], this.wysihtml5.EMPTY_FUNCTION, null);
            }
            for(i = 0 , length = this.documentProperties.length; i < length; i++) {
                this._unset(iframeDocument, this.documentProperties[i], null, null);
            }
            this._unset(iframeDocument, "cookie", "", true);
        }
        this.loaded = true;
        setTimeout(function () {
            that.callback(that);
        }, 0);
    };
    Sandbox.prototype._getHtml = function (templateVars) {
        var stylesheets = templateVars.stylesheets, html = "", i = 0, length;
        stylesheets = typeof (stylesheets) === "string" ? [
            stylesheets
        ] : stylesheets;
        if(stylesheets) {
            length = stylesheets.length;
            for(; i < length; i++) {
                html += '<link rel="stylesheet" href="' + stylesheets[i] + '">';
            }
        }
        templateVars.stylesheets = html;
        return this.wysihtml5.lang.string('<!DOCTYPE html><html><head>' + '<meta charset="#{charset}">#{stylesheets}</head>' + '<body></body></html>').interpolate(templateVars);
    };
    Sandbox.prototype._unset = function (object, property, value, setter) {
        try  {
            object[property] = value;
        } catch (e) {
        }
        try  {
            object.__defineGetter__(property, function () {
                return value;
            });
        } catch (e) {
        }
        if(setter) {
            try  {
                object.__defineSetter__(property, function () {
                });
            } catch (e) {
            }
        }
        if(!this.wysihtml5.browser.crashesWhenDefineProperty(property)) {
            try  {
                var config = {
                    get: function () {
                        return value;
                    },
                    set: function () {
                    }
                };
                Object.defineProperty(object, property, config);
            } catch (e) {
            }
        }
    };
    return Sandbox;
})();
