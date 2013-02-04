/// <reference path="UIRenderer.ts"/>


declare var $;

class Debugger {

    _lineCount: number = 0;
    _displayLineNumner: number = 0;
    _maxLinesToDisplay: number = 0;
    _debuggerVisible = false;


    constructor(public UIRenderer: UIRenderer, maxLinesToDisplay: number) {
        this._maxLinesToDisplay = maxLinesToDisplay;
    }

    public Start() {
        this._debuggerVisible = true;
        this.UIRenderer.LoadDiv("divDebugger");
        this._lineCount = 0;
        this._displayLineNumner = 0;

    }

    public Stop() {
        this._debuggerVisible = false;
        this.UIRenderer.UnloadDiv("divDebugger");
        this._lineCount = 0;
        this._displayLineNumner = 0;

    }

    public Log(text: string) {

        if (!this._debuggerVisible) return;

        this._lineCount++;
        this._displayLineNumner++;
        this.UIRenderer.AppendToDiv("divDebugger", text + " : " + this._displayLineNumner, "dbgl");

        if (this._lineCount > this._maxLinesToDisplay) {
            this.UIRenderer.RemoveFirstChild("divDebugger");
            this._lineCount--;
        }


    }

}

