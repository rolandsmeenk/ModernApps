/// <reference path="..\..\UIRenderer.ts"/>
/// <reference path="..\..\Debugger.ts"/>

/// <reference path="wysihtml5.ts"/>


declare var $;

class UndoManager  {
   
    public Z_KEY: number = 90;
    public Y_KEY : number = 89;
    public BACKSPACE_KEY: number = 8;
    public DELETE_KEY: number = 46;
    public MAX_HISTORY_ENTRIES: number = 40;
    public UNDO_HTML: string = '<span id="_wysihtml5-undo" class="_wysihtml5-temp">' + wysihtml5.INVISIBLE_SPACE + '</span>';
    public REDO_HTML: string = '<span id="_wysihtml5-redo" class="_wysihtml5-temp">' + wysihtml5.INVISIBLE_SPACE + '</span>';

    private _wysihtml5: wysi;
    private _editor: any;
    private _composer = editor.composer;
    private _element: any;
    private _history: any;
    private _position = 1;



    constructor(wysihtml5: wysi, editor: any) {
        this._wysihtml5 = wysihtml5;
        this._editor = editor;
        this._composer = editor.composer;
        this._element = this._composer.element;
        this._history = [this._composer.getValue()];
        this._position = 1;

        // Undo manager currently only supported in browsers who have the insertHTML command (not IE)
        if (this._composer.commands.support("insertHTML")) {
            this._observe();
        }
    }


    private cleanTempElements(doc) {
        var tempElement;
        while (tempElement = doc.querySelector("._wysihtml5-temp")) {
            tempElement.parentNode.removeChild(tempElement);
        }
    }

    private _observe() {
        var that = this,
                  doc = this._composer.sandbox.getDocument(),
                  lastKey;

        // Catch CTRL+Z and CTRL+Y
        this._wysihtml5.dom.observe(this._element, "keydown", function (event) {
            if (event.altKey || (!event.ctrlKey && !event.metaKey)) {
                return;
            }

            var keyCode = event.keyCode,
                isUndo = keyCode === this.Z_KEY && !event.shiftKey,
                isRedo = (keyCode === this.Z_KEY && event.shiftKey) || (keyCode === this.Y_KEY);

            if (isUndo) {
                that.undo();
                event.preventDefault();
            } else if (isRedo) {
                that.redo();
                event.preventDefault();
            }
        });

        // Catch delete and backspace
        this._wysihtml5.dom.observe(this._element, "keydown", function (event) {
            var keyCode = event.keyCode;
            if (keyCode === lastKey) {
                return;
            }

            lastKey = keyCode;

            if (keyCode === this.BACKSPACE_KEY || keyCode === this.DELETE_KEY) {
                that.transact();
            }
        });

        // Now this is very hacky:
        // These days browsers don't offer a undo/redo event which we could hook into
        // to be notified when the user hits undo/redo in the contextmenu.
        // Therefore we simply insert two elements as soon as the contextmenu gets opened.
        // The last element being inserted will be immediately be removed again by a exexCommand("undo")
        //  => When the second element appears in the dom tree then we know the user clicked "redo" in the context menu
        //  => When the first element disappears from the dom tree then we know the user clicked "undo" in the context menu
        if (this._wysihtml5.browser.hasUndoInContextMenu()) {
            var interval, observed, cleanUp = function () {
                this.cleanTempElements(doc);
                clearInterval(interval);
            };

            this._wysihtml5.dom.observe(this._element, "contextmenu", function () {
                cleanUp();
                that._composer.selection.executeAndRestoreSimple(function () {
                    if (that._element.lastChild) {
                        that._composer.selection.setAfter(that._element.lastChild);
                    }

                    // enable undo button in context menu
                    doc.execCommand("insertHTML", false, this.UNDO_HTML);
                    // enable redo button in context menu
                    doc.execCommand("insertHTML", false, this.REDO_HTML);
                    doc.execCommand("undo", false, null);
                });

                interval = setInterval(function () {
                    if (doc.getElementById("_wysihtml5-redo")) {
                        cleanUp();
                        that.redo();
                    } else if (!doc.getElementById("_wysihtml5-undo")) {
                        cleanUp();
                        that.undo();
                    }
                }, 400);

                if (!observed) {
                    observed = true;
                    this._wysihtml5.dom.observe(document, "mousedown", cleanUp);
                    this._wysihtml5.dom.observe(doc, ["mousedown", "paste", "cut", "copy"], cleanUp);
                }
            });
        }

        this._editor
          .observe("newword:composer", function () {
              that.transact();
          })

          .observe("beforecommand:composer", function () {
              that.transact();
          });
    }

    public transact(){
        var previousHtml = this._history[this._position - 1],
            currentHtml = this._composer.getValue();

        if (currentHtml == previousHtml) {
            return;
        }

        var length = this._history.length = this._position;
        if (length > this.MAX_HISTORY_ENTRIES) {
            this._history.shift();
            this._position--;
        }

        this._position++;
        this._history.push(currentHtml);
    }

    public undo() {
        this.transact();

        if (this._position <= 1) {
            return;
        }

        this.set(this._history[--this._position - 1]);
        this._editor.fire("undo:composer");
    }

    public redo() {
        if (this._position >= this._history.length) {
            return;
        }

        this.set(this._history[++this._position - 1]);
        this._editor.fire("redo:composer");
    }

    public set(html) {
        this._composer.setValue(html);
        this._editor.focus(true);
    }


}

