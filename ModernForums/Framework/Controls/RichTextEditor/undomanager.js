var UndoManager = (function () {
    function UndoManager(wysihtml5, editor) {
        this.Z_KEY = 90;
        this.Y_KEY = 89;
        this.BACKSPACE_KEY = 8;
        this.DELETE_KEY = 46;
        this.MAX_HISTORY_ENTRIES = 40;
        this.UNDO_HTML = '<span id="_wysihtml5-undo" class="_wysihtml5-temp">' + wysihtml5.INVISIBLE_SPACE + '</span>';
        this.REDO_HTML = '<span id="_wysihtml5-redo" class="_wysihtml5-temp">' + wysihtml5.INVISIBLE_SPACE + '</span>';
        this._composer = editor.composer;
        this._position = 1;
        this._wysihtml5 = wysihtml5;
        this._editor = editor;
        this._composer = editor.composer;
        this._element = this._composer.element;
        this._history = [
            this._composer.getValue()
        ];
        this._position = 1;
        if(this._composer.commands.support("insertHTML")) {
            this._observe();
        }
    }
    UndoManager.prototype.cleanTempElements = function (doc) {
        var tempElement;
        while(tempElement = doc.querySelector("._wysihtml5-temp")) {
            tempElement.parentNode.removeChild(tempElement);
        }
    };
    UndoManager.prototype._observe = function () {
        var that = this, doc = this._composer.sandbox.getDocument(), lastKey;
        this._wysihtml5.dom.observe(this._element, "keydown", function (event) {
            if(event.altKey || (!event.ctrlKey && !event.metaKey)) {
                return;
            }
            var keyCode = event.keyCode, isUndo = keyCode === this.Z_KEY && !event.shiftKey, isRedo = (keyCode === this.Z_KEY && event.shiftKey) || (keyCode === this.Y_KEY);
            if(isUndo) {
                that.undo();
                event.preventDefault();
            } else if(isRedo) {
                that.redo();
                event.preventDefault();
            }
        });
        this._wysihtml5.dom.observe(this._element, "keydown", function (event) {
            var keyCode = event.keyCode;
            if(keyCode === lastKey) {
                return;
            }
            lastKey = keyCode;
            if(keyCode === this.BACKSPACE_KEY || keyCode === this.DELETE_KEY) {
                that.transact();
            }
        });
        if(this._wysihtml5.browser.hasUndoInContextMenu()) {
            var interval, observed, cleanUp = function () {
                this.cleanTempElements(doc);
                clearInterval(interval);
            };
            this._wysihtml5.dom.observe(this._element, "contextmenu", function () {
                cleanUp();
                that._composer.selection.executeAndRestoreSimple(function () {
                    if(that._element.lastChild) {
                        that._composer.selection.setAfter(that._element.lastChild);
                    }
                    doc.execCommand("insertHTML", false, this.UNDO_HTML);
                    doc.execCommand("insertHTML", false, this.REDO_HTML);
                    doc.execCommand("undo", false, null);
                });
                interval = setInterval(function () {
                    if(doc.getElementById("_wysihtml5-redo")) {
                        cleanUp();
                        that.redo();
                    } else if(!doc.getElementById("_wysihtml5-undo")) {
                        cleanUp();
                        that.undo();
                    }
                }, 400);
                if(!observed) {
                    observed = true;
                    this._wysihtml5.dom.observe(document, "mousedown", cleanUp);
                    this._wysihtml5.dom.observe(doc, [
                        "mousedown", 
                        "paste", 
                        "cut", 
                        "copy"
                    ], cleanUp);
                }
            });
        }
        this._editor.observe("newword:composer", function () {
            that.transact();
        }).observe("beforecommand:composer", function () {
            that.transact();
        });
    };
    UndoManager.prototype.transact = function () {
        var previousHtml = this._history[this._position - 1], currentHtml = this._composer.getValue();
        if(currentHtml == previousHtml) {
            return;
        }
        var length = this._history.length = this._position;
        if(length > this.MAX_HISTORY_ENTRIES) {
            this._history.shift();
            this._position--;
        }
        this._position++;
        this._history.push(currentHtml);
    };
    UndoManager.prototype.undo = function () {
        this.transact();
        if(this._position <= 1) {
            return;
        }
        this.set(this._history[--this._position - 1]);
        this._editor.fire("undo:composer");
    };
    UndoManager.prototype.redo = function () {
        if(this._position >= this._history.length) {
            return;
        }
        this.set(this._history[++this._position - 1]);
        this._editor.fire("redo:composer");
    };
    UndoManager.prototype.set = function (html) {
        this._composer.setValue(html);
        this._editor.focus(true);
    };
    return UndoManager;
})();
