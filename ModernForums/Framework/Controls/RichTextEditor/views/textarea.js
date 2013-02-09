var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TextArea = (function (_super) {
    __extends(TextArea, _super);
    function TextArea(wysihtml5, parent, textareaElement, config) {
        _super.call(this, wysihtml5, parent, textareaElement, config);
        this.wysihtml5 = wysihtml5;
        this.parent = parent;
        this.textareaElement = textareaElement;
        this.config = config;
        this._observe();
    }
    TextArea.prototype.clear = function () {
        this.element.value = "";
    };
    TextArea.prototype.getValue = function (parse) {
        var value = this.isEmpty() ? "" : this.element.value;
        if(parse) {
            value = this.parent.parse(value);
        }
        return value;
    };
    TextArea.prototype.setValue = function (html, parse) {
        if(parse) {
            html = this.parent.parse(html);
        }
        this.element.value = html;
    };
    TextArea.prototype.hasPlaceholderSet = function () {
        var supportsPlaceholder = this.wysihtml5.browser.supportsPlaceholderAttributeOn(this.element), placeholderText = this.element.getAttribute("placeholder") || null, value = this.element.value, isEmpty = !value;
        return (supportsPlaceholder && isEmpty) || (value === placeholderText);
    };
    TextArea.prototype.isEmpty = function () {
        return !this.wysihtml5.lang.string(this.element.value).trim() || this.hasPlaceholderSet();
    };
    TextArea.prototype._observe = function () {
        var element = this.element, parent = this.parent, eventMapping = {
            focusin: "focus",
            focusout: "blur"
        }, events = this.wysihtml5.browser.supportsEvent("focusin") ? [
            "focusin", 
            "focusout", 
            "change"
        ] : [
            "focus", 
            "blur", 
            "change"
        ];
        parent.observe("beforeload", function () {
            this._wysihtml5.dom.observe(element, events, function (event) {
                var eventName = eventMapping[event.type] || event.type;
                parent.fire(eventName).fire(eventName + ":textarea");
            });
            this._wysihtml5.dom.observe(element, [
                "paste", 
                "drop"
            ], function () {
                setTimeout(function () {
                    parent.fire("paste").fire("paste:textarea");
                }, 0);
            });
        });
    };
    return TextArea;
})(View);
