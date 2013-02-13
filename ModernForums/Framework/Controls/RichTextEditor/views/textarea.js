var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TextArea = (function (_super) {
    __extends(TextArea, _super);
    function TextArea() {
        _super.apply(this, arguments);

    }
    TextArea.prototype.clear = function () {
        this.wysihtml5.Debugger.Log("TextArea:clear");
        this.element.value = "";
    };
    TextArea.prototype.getValue = function (parse) {
        this.wysihtml5.Debugger.Log("TextArea:getValue");
        var value = this.isEmpty() ? "" : this.element.value;
        if(parse) {
            value = this.parent.parse(value);
        }
        return value;
    };
    TextArea.prototype.setValue = function (html, parse) {
        this.wysihtml5.Debugger.Log("TextArea:setValue");
        if(parse) {
            html = this.parent.parse(html);
        }
        this.element.value = html;
    };
    TextArea.prototype.hasPlaceholderSet = function () {
        this.wysihtml5.Debugger.Log("TextArea:hasPlaceholderSet");
        var supportsPlaceholder = this.wysihtml5.browser.supportsPlaceholderAttributeOn(this.element), placeholderText = this.element.getAttribute("placeholder") || null, value = this.element.value, isEmpty = !value;
        return (supportsPlaceholder && isEmpty) || (value === placeholderText);
    };
    TextArea.prototype.isEmpty = function () {
        this.wysihtml5.Debugger.Log("TextArea:isEmpty");
        return !this.wysihtml5.lang.string(this.element.value).trim() || this.hasPlaceholderSet();
    };
    TextArea.prototype._observe = function () {
        this.wysihtml5.Debugger.Log("TextArea:_observe");
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
