var Browser = (function () {
    function Browser() {
        this.USER_AGENT = navigator.userAgent;
        this.testElement = document.createElement("div");
        this.isIE = this.USER_AGENT.indexOf("MSIE") !== -1 && this.USER_AGENT.indexOf("Opera") === -1;
        this.isGecko = this.USER_AGENT.indexOf("Gecko") !== -1 && this.USER_AGENT.indexOf("KHTML") === -1;
        this.isWebKit = this.USER_AGENT.indexOf("AppleWebKit/") !== -1;
        this.isChrome = this.USER_AGENT.indexOf("Chrome/") !== -1;
        this.isOpera = this.USER_AGENT.indexOf("Opera/") !== -1;
    }
    Browser.prototype.iosVersion = function (userAgent) {
        return ((/ipad|iphone|ipod/.test(userAgent) && this.USER_AGENT.match(/ os (\d+).+? like mac os x/)) || [
            , 
            0
        ])[1];
    };
    Browser.prototype.supported = function () {
        var userAgent = this.USER_AGENT.toLowerCase(), hasContentEditableSupport = "contentEditable" in this.testElement, hasEditingApiSupport = document.execCommand && document.queryCommandSupported && document.queryCommandState, hasQuerySelectorSupport = document.querySelector && document.querySelectorAll, isIncompatibleMobileBrowser = (this.isIos() && this.iosVersion(userAgent) < 5) || userAgent.indexOf("opera mobi") !== -1 || userAgent.indexOf("hpwos/") !== -1;
        return hasContentEditableSupport && hasEditingApiSupport && hasQuerySelectorSupport && !isIncompatibleMobileBrowser;
    };
    Browser.prototype.isTouchDevice = function () {
        return this.supportsEvent("touchmove");
    };
    Browser.prototype.isIos = function () {
        var userAgent = this.USER_AGENT.toLowerCase();
        return userAgent.indexOf("webkit") !== -1 && userAgent.indexOf("mobile") !== -1;
    };
    Browser.prototype.supportsSandboxedIframes = function () {
        return this.isIE;
    };
    Browser.prototype.throwsMixedContentWarningWhenIframeSrcIsEmpty = function () {
        return !("querySelector" in document);
    };
    Browser.prototype.displaysCaretInEmptyContentEditableCorrectly = function () {
        return !this.isGecko;
    };
    Browser.prototype.hasCurrentStyleProperty = function () {
        return "currentStyle" in this.testElement;
    };
    Browser.prototype.insertsLineBreaksOnReturn = function () {
        return this.isGecko;
    };
    Browser.prototype.supportsPlaceholderAttributeOn = function (element) {
        return "placeholder" in element;
    };
    Browser.prototype.supportsEvent = function (eventName) {
        return "on" + eventName in this.testElement || (function () {
            this.testElement.setAttribute("on" + eventName, "return;");
            return typeof (this.testElement["on" + eventName]) === "function";
        })();
    };
    Browser.prototype.supportsEventsInIframeCorrectly = function () {
        return !this.isOpera;
    };
    Browser.prototype.firesOnDropOnlyWhenOnDragOverIsCancelled = function () {
        return this.isWebKit || this.isGecko;
    };
    Browser.prototype.supportsDataTransfer = function () {
        try  {
            return false;
        } catch (e) {
            return false;
        }
    };
    Browser.prototype.supportsHTML5Tags = function (context) {
        var element = context.createElement("div"), html5 = "<article>foo</article>";
        element.innerHTML = html5;
        return element.innerHTML.toLowerCase() === html5;
    };
    Browser.prototype.supportsCommand = function (doc, command) {
        var buggyCommands = {
            "formatBlock": this.isIE,
            "insertUnorderedList": this.isIE || this.isOpera || this.isWebKit,
            "insertOrderedList": this.isIE || this.isOpera || this.isWebKit
        };
        var supported = {
            "insertHTML": this.isGecko
        };
        var isBuggy = buggyCommands[command];
        if(!isBuggy) {
            try  {
                return doc.queryCommandSupported(command);
            } catch (e1) {
            }
            try  {
                return doc.queryCommandEnabled(command);
            } catch (e2) {
                return !!supported[command];
            }
        }
        return false;
    };
    Browser.prototype.doesAutoLinkingInContentEditable = function () {
        return this.isIE;
    };
    Browser.prototype.canDisableAutoLinking = function () {
        return this.supportsCommand(document, "AutoUrlDetect");
    };
    Browser.prototype.clearsContentEditableCorrectly = function () {
        return this.isGecko || this.isOpera || this.isWebKit;
    };
    Browser.prototype.supportsGetAttributeCorrectly = function () {
        var td = document.createElement("td");
        return td.getAttribute("rowspan") != "1";
    };
    Browser.prototype.canSelectImagesInContentEditable = function () {
        return this.isGecko || this.isIE || this.isOpera;
    };
    Browser.prototype.clearsListsInContentEditableCorrectly = function () {
        return this.isGecko || this.isIE || this.isWebKit;
    };
    Browser.prototype.autoScrollsToCaret = function () {
        return !this.isWebKit;
    };
    Browser.prototype.autoClosesUnclosedTags = function () {
        var clonedTestElement = this.testElement.cloneNode(false), returnValue, innerHTML;
        clonedTestElement.innerHTML = "<p><div></div>";
        innerHTML = clonedTestElement.innerHTML.toLowerCase();
        returnValue = innerHTML === "<p></p><div></div>" || innerHTML === "<p><div></div></p>";
        this.autoClosesUnclosedTags = function () {
            return returnValue;
        };
        return returnValue;
    };
    Browser.prototype.supportsNativeGetElementsByClassName = function () {
        return String(document.getElementsByClassName).indexOf("[native code]") !== -1;
    };
    Browser.prototype.supportsSelectionModify = function () {
        return "getSelection" in window && "modify" in window.getSelection();
    };
    Browser.prototype.supportsClassList = function () {
        return "classList" in this.testElement;
    };
    Browser.prototype.needsSpaceAfterLineBreak = function () {
        return this.isOpera;
    };
    Browser.prototype.supportsSpeechApiOn = function (input) {
        var chromeVersion = this.USER_AGENT.match(/Chrome\/(\d+)/) || [
            , 
            0
        ];
        return chromeVersion[1] >= 11 && ("onwebkitspeechchange" in input || "speech" in input);
    };
    Browser.prototype.crashesWhenDefineProperty = function (property) {
        return this.isIE && (property === "XMLHttpRequest" || property === "XDomainRequest");
    };
    Browser.prototype.doesAsyncFocus = function () {
        return this.isIE;
    };
    Browser.prototype.hasProblemsSettingCaretAfterImg = function () {
        return this.isIE;
    };
    Browser.prototype.hasUndoInContextMenu = function () {
        return this.isGecko || this.isChrome || this.isOpera;
    };
    return Browser;
})();
