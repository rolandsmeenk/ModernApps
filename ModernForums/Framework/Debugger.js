var Debugger = (function () {
    function Debugger(UIRenderer, maxLinesToDisplay) {
        this.UIRenderer = UIRenderer;
        this._lineCount = 0;
        this._displayLineNumner = 0;
        this._maxLinesToDisplay = 0;
        this._debuggerVisible = false;
        this._maxLinesToDisplay = maxLinesToDisplay;
    }
    Debugger.prototype.Start = function () {
        this._debuggerVisible = true;
        this.UIRenderer.LoadDiv("divDebugger");
        this._lineCount = 0;
        this._displayLineNumner = 0;
    };
    Debugger.prototype.Stop = function () {
        this._debuggerVisible = false;
        this.UIRenderer.UnloadDiv("divDebugger");
        this._lineCount = 0;
        this._displayLineNumner = 0;
    };
    Debugger.prototype.Log = function (text) {
        if(!this._debuggerVisible) {
            return;
        }
        this._lineCount++;
        this._displayLineNumner++;
        this.UIRenderer.AppendToDiv("divDebugger", text + " : " + this._displayLineNumner, "dbgl");
        if(this._lineCount > this._maxLinesToDisplay) {
            this.UIRenderer.RemoveFirstChild("divDebugger");
            this._lineCount--;
        }
    };
    return Debugger;
})();
