/// <reference path="..\..\UIRenderer.ts"/>
/// <reference path="..\..\Debugger.ts"/>


declare var $;

class Browser  {
   // Static variable needed, publicly accessible, to be able override it in unit tests
    public USER_AGENT;


    public testElement;

    // Browser sniffing is unfortunately needed since some behaviors are impossible to feature detect
    public isIE ;
    public isGecko;
    public isWebKit;
    public isChrome;
    public isOpera ;


    constructor() {
        this.USER_AGENT = navigator.userAgent;
        this.testElement = document.createElement("div");
        this.isIE = this.USER_AGENT.indexOf("MSIE") !== -1 && this.USER_AGENT.indexOf("Opera") === -1;
        this.isGecko = this.USER_AGENT.indexOf("Gecko") !== -1 && this.USER_AGENT.indexOf("KHTML") === -1;
        this.isWebKit = this.USER_AGENT.indexOf("AppleWebKit/") !== -1;
        this.isChrome = this.USER_AGENT.indexOf("Chrome/") !== -1;
        this.isOpera = this.USER_AGENT.indexOf("Opera/") !== -1;
    }



    public iosVersion(userAgent) {
        return ((/ipad|iphone|ipod/.test(userAgent) && this.USER_AGENT.match(/ os (\d+).+? like mac os x/)) || [, 0])[1];
    }




    /**
         * Exclude browsers that are not capable of displaying and handling
         * contentEditable as desired:
         *    - iPhone, iPad (tested iOS 4.2.2) and Android (tested 2.2) refuse to make contentEditables focusable
         *    - IE < 8 create invalid markup and crash randomly from time to time
         *
         * @return {Boolean}
         */
    public supported() {
        var userAgent = this.USER_AGENT.toLowerCase(),
            // Essential for making html elements editable
            hasContentEditableSupport = "contentEditable" in this.testElement,
            // Following methods are needed in order to interact with the contentEditable area
            hasEditingApiSupport = document.execCommand && document.queryCommandSupported && document.queryCommandState,
            // document selector apis are only supported by IE 8+, Safari 4+, Chrome and Firefox 3.5+
            hasQuerySelectorSupport = document.querySelector && document.querySelectorAll,
            // contentEditable is unusable in mobile browsers (tested iOS 4.2.2, Android 2.2, Opera Mobile, WebOS 3.05)
            isIncompatibleMobileBrowser = (this.isIos() && this.iosVersion(userAgent) < 5) || userAgent.indexOf("opera mobi") !== -1 || userAgent.indexOf("hpwos/") !== -1;

        return hasContentEditableSupport
          && hasEditingApiSupport
          && hasQuerySelectorSupport
          && !isIncompatibleMobileBrowser;
    }

    public isTouchDevice(){
        return this.supportsEvent("touchmove");
    }

    public isIos() {
        var userAgent = this.USER_AGENT.toLowerCase();
        return userAgent.indexOf("webkit") !== -1 && userAgent.indexOf("mobile") !== -1;
    }



    /**
     * Whether the browser supports sandboxed iframes
     * Currently only IE 6+ offers such feature <iframe security="restricted">
     *
     * http://msdn.microsoft.com/en-us/library/ms534622(v=vs.85).aspx
     * http://blogs.msdn.com/b/ie/archive/2008/01/18/using-frames-more-securely.aspx
     *
     * HTML5 sandboxed iframes are still buggy and their DOM is not reachable from the outside (except when using postMessage)
     */
    public supportsSandboxedIframes() {
        return this.isIE;
    }


    /**
     * IE6+7 throw a mixed content warning when the src of an iframe
     * is empty/unset or about:blank
     * window.querySelector is implemented as of IE8
     */
    public throwsMixedContentWarningWhenIframeSrcIsEmpty() {
        return !("querySelector" in document);
    }



    /**
     * Whether the caret is correctly displayed in contentEditable elements
     * Firefox sometimes shows a huge caret in the beginning after focusing
     */
    public displaysCaretInEmptyContentEditableCorrectly() {
        return !this.isGecko;
    }


    /**
     * Opera and IE are the only browsers who offer the css value
     * in the original unit, thx to the currentStyle object
     * All other browsers provide the computed style in px via window.getComputedStyle
     */
    public hasCurrentStyleProperty() {
        return "currentStyle" in this.testElement;
    }

    public insertsLineBreaksOnReturn() {
        return this.isGecko;
    }

    public supportsPlaceholderAttributeOn(element) {
        return "placeholder" in element;
    }

    public supportsEvent(eventName) {
        return "on" + eventName in this.testElement || (function () {
            this.testElement.setAttribute("on" + eventName, "return;");
            return typeof (this.testElement["on" + eventName]) === "function";
        })();
    }


    /**
     * Opera doesn't correctly fire focus/blur events when clicking in- and outside of iframe
     */
    public supportsEventsInIframeCorrectly() {
        return !this.isOpera;
    }



    /**
     * Chrome & Safari only fire the ondrop/ondragend/... events when the ondragover event is cancelled
     * with event.preventDefault
     * Firefox 3.6 fires those events anyway, but the mozilla doc says that the dragover/dragenter event needs
     * to be cancelled
     */
    public firesOnDropOnlyWhenOnDragOverIsCancelled() {
        return this.isWebKit || this.isGecko;
    }




    /**
     * Whether the browser supports the event.dataTransfer property in a proper way
     */
    public supportsDataTransfer() {
        try {
        // Firefox doesn't support dataTransfer in a safe way, it doesn't strip script code in the html payload (like Chrome does)
            //return this.isWebKit && (window.clipboardData ||  window.DataTransfer).prototype.getData;
            return false;
        } catch (e) {
            return false;
        }
    }



    /**
     * Everything below IE9 doesn't know how to treat HTML5 tags
     *
     * @param {Object} context The document object on which to check HTML5 support
     *
     * @example
     *    wysihtml5.browser.supportsHTML5Tags(document);
     */
    public supportsHTML5Tags(context) {
        var element = context.createElement("div"),
            html5 = "<article>foo</article>";
        element.innerHTML = html5;
        return element.innerHTML.toLowerCase() === html5;
    }



    /**
     * Checks whether a document supports a certain queryCommand
     * In particular, Opera needs a reference to a document that has a contentEditable in it's dom tree
     * in oder to report correct results
     *
     * @param {Object} doc Document object on which to check for a query command
     * @param {String} command The query command to check for
     * @return {Boolean}
     *
     * @example
     *    wysihtml5.browser.supportsCommand(document, "bold");
     */
    public supportsCommand(doc, command) {
        // Following commands are supported but contain bugs in some browsers
        var buggyCommands = {
            // formatBlock fails with some tags (eg. <blockquote>)
            "formatBlock": this.isIE,
            // When inserting unordered or ordered lists in Firefox, Chrome or Safari, the current selection or line gets
            // converted into a list (<ul><li>...</li></ul>, <ol><li>...</li></ol>)
            // IE and Opera act a bit different here as they convert the entire content of the current block element into a list
            "insertUnorderedList": this.isIE || this.isOpera || this.isWebKit,
            "insertOrderedList": this.isIE || this.isOpera || this.isWebKit
        };

        // Firefox throws errors for queryCommandSupported, so we have to build up our own object of supported commands
        var supported = {
            "insertHTML": this.isGecko
        };

        
        var isBuggy = buggyCommands[command];
        if (!isBuggy) {
            // Firefox throws errors when invoking queryCommandSupported or queryCommandEnabled
            try {
                return doc.queryCommandSupported(command);
            } catch (e1) { }

            try {
                return doc.queryCommandEnabled(command);
            } catch (e2) {
                return !!supported[command];
            }
        }
        return false;
        
    }


    /**
     * IE: URLs starting with:
     *    www., http://, https://, ftp://, gopher://, mailto:, new:, snews:, telnet:, wasis:, file://,
     *    nntp://, newsrc:, ldap://, ldaps://, outlook:, mic:// and url:
     * will automatically be auto-linked when either the user inserts them via copy&paste or presses the
     * space bar when the caret is directly after such an url.
     * This behavior cannot easily be avoided in IE < 9 since the logic is hardcoded in the mshtml.dll
     * (related blog post on msdn
     * http://blogs.msdn.com/b/ieinternals/archive/2009/09/17/prevent-automatic-hyperlinking-in-contenteditable-html.aspx).
     */
    public doesAutoLinkingInContentEditable() {
        return this.isIE;
    }



    /**
     * As stated above, IE auto links urls typed into contentEditable elements
     * Since IE9 it's possible to prevent this behavior
     */
    public canDisableAutoLinking() {
        return this.supportsCommand(document, "AutoUrlDetect");
    }


    /**
     * IE leaves an empty paragraph in the contentEditable element after clearing it
     * Chrome/Safari sometimes an empty <div>
     */
    public clearsContentEditableCorrectly() {
        return this.isGecko || this.isOpera || this.isWebKit;
    }


    /**
     * IE gives wrong results for getAttribute
     */
    public supportsGetAttributeCorrectly() {
        var td = document.createElement("td");
        return td.getAttribute("rowspan") != "1";
    }



    /**
     * When clicking on images in IE, Opera and Firefox, they are selected, which makes it easy to interact with them.
     * Chrome and Safari both don't support this
     */
    public canSelectImagesInContentEditable() {
        return this.isGecko || this.isIE || this.isOpera;
    }


    /**
     * When the caret is in an empty list (<ul><li>|</li></ul>) which is the first child in an contentEditable container
     * pressing backspace doesn't remove the entire list as done in other browsers
     */
    public clearsListsInContentEditableCorrectly() {
        return this.isGecko || this.isIE || this.isWebKit;
    }


    /**
     * All browsers except Safari and Chrome automatically scroll the range/caret position into view
     */
    public autoScrollsToCaret() {
        return !this.isWebKit;
    }





    /**
     * Check whether the browser automatically closes tags that don't need to be opened
     */
    public autoClosesUnclosedTags() {
        var clonedTestElement = this.testElement.cloneNode(false),
            returnValue,
            innerHTML;

        clonedTestElement.innerHTML = "<p><div></div>";
        innerHTML = clonedTestElement.innerHTML.toLowerCase();
        returnValue = innerHTML === "<p></p><div></div>" || innerHTML === "<p><div></div></p>";

        // Cache result by overwriting current function
        this.autoClosesUnclosedTags = function () { return returnValue; };

        return returnValue;
    }


    /**
     * Whether the browser supports the native document.getElementsByClassName which returns live NodeLists
     */
    public supportsNativeGetElementsByClassName() {
        return String(document.getElementsByClassName).indexOf("[native code]") !== -1;
    }


    /**
     * As of now (19.04.2011) only supported by Firefox 4 and Chrome
     * See https://developer.mozilla.org/en/DOM/Selection/modify
     */
    public supportsSelectionModify() {
        return "getSelection" in window && "modify" in window.getSelection();
    }



    /**
     * Whether the browser supports the classList object for fast className manipulation
     * See https://developer.mozilla.org/en/DOM/element.classList
     */
    public supportsClassList() {
        return "classList" in this.testElement;
    }


    /**
     * Opera needs a white space after a <br> in order to position the caret correctly
     */
    public needsSpaceAfterLineBreak() {
        return this.isOpera;
    }




    /**
     * Whether the browser supports the speech api on the given element
     * See http://mikepultz.com/2011/03/accessing-google-speech-api-chrome-11/
     *
     * @example
     *    var input = document.createElement("input");
     *    if (wysihtml5.browser.supportsSpeechApiOn(input)) {
     *      // ...
     *    }
     */
    public supportsSpeechApiOn(input) {
        var chromeVersion = this.USER_AGENT.match(/Chrome\/(\d+)/) || [, 0];
        return chromeVersion[1] >= 11 && ("onwebkitspeechchange" in input || "speech" in input);
    }



    /**
     * IE9 crashes when setting a getter via Object.defineProperty on XMLHttpRequest or XDomainRequest
     * See https://connect.microsoft.com/ie/feedback/details/650112
     * or try the POC http://tifftiff.de/ie9_crash/
     */
    public crashesWhenDefineProperty(property) {
        return this.isIE && (property === "XMLHttpRequest" || property === "XDomainRequest");
    }

     /**
     * IE is the only browser who fires the "focus" event not immediately when .focus() is called on an element
     */
    public doesAsyncFocus() {
        return this.isIE;
    }


    /**
     * In IE it's impssible for the user and for the selection library to set the caret after an <img> when it's the lastChild in the document
     */
    public hasProblemsSettingCaretAfterImg() {
        return this.isIE;
    }

    public hasUndoInContextMenu() {
        return this.isGecko || this.isChrome || this.isOpera;
    }
}

