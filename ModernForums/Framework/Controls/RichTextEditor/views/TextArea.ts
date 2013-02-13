/// <reference path="..\..\..\UIRenderer.ts"/>
/// <reference path="..\..\..\Debugger.ts"/>

/// <reference path="View.ts"/>
/// <reference path="..\wysihtml5.ts"/>

declare var $;

class TextArea extends View {
    
    //constructor(wysihtml5: wysi, parent: any, textareaElement: any, config: any) {
    //    super(wysihtml5, parent, textareaElement, config);
    //    this.wysihtml5.Debugger.Log("TextArea:constructor");
    //    this._observe();
    //}

    public clear() {
        this.wysihtml5.Debugger.Log("TextArea:clear");
        this.element.value = "";
    }

    public getValue(parse) {
        this.wysihtml5.Debugger.Log("TextArea:getValue");
        var value = this.isEmpty() ? "" : this.element.value;
        if (parse) {
            value = this.parent.parse(value);
        }
        return value;
    }

    public setValue(html, parse) {
        this.wysihtml5.Debugger.Log("TextArea:setValue");
        if (parse) {
            html = this.parent.parse(html);
        }
        this.element.value = html;
    }

    public hasPlaceholderSet() {
        this.wysihtml5.Debugger.Log("TextArea:hasPlaceholderSet");
        var supportsPlaceholder = this.wysihtml5.browser.supportsPlaceholderAttributeOn(this.element),
            placeholderText = this.element.getAttribute("placeholder") || null,
            value = this.element.value,
            isEmpty = !value;
        return (supportsPlaceholder && isEmpty) || (value === placeholderText);
    }

    public isEmpty() {
        this.wysihtml5.Debugger.Log("TextArea:isEmpty");
        return !this.wysihtml5.lang.string(this.element.value).trim() || this.hasPlaceholderSet();
    }

    private _observe() {
        this.wysihtml5.Debugger.Log("TextArea:_observe");
        var element = this.element,
            parent = this.parent,
            eventMapping = {
                focusin: "focus",
                focusout: "blur"
            },
            /**
             * Calling focus() or blur() on an element doesn't synchronously trigger the attached focus/blur events
             * This is the case for focusin and focusout, so let's use them whenever possible, kkthxbai
             */
            events = this.wysihtml5.browser.supportsEvent("focusin") ? ["focusin", "focusout", "change"] : ["focus", "blur", "change"];

        parent.observe("beforeload", function () {
            this._wysihtml5.dom.observe(element, events, function (event) {
                var eventName = eventMapping[event.type] || event.type;
                parent.fire(eventName).fire(eventName + ":textarea");
            });

            this._wysihtml5.dom.observe(element, ["paste", "drop"], function () {
                setTimeout(function () { parent.fire("paste").fire("paste:textarea"); }, 0);
            });
        });
    }


}

