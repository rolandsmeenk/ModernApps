var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DemoInfiniteCanvasDataGridModernTree = (function (_super) {
    __extends(DemoInfiniteCanvasDataGridModernTree, _super);
    function DemoInfiniteCanvasDataGridModernTree(UIRenderer, Debugger) {
        var _this = this;
        _super.call(this, UIRenderer, Debugger);
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        this._infiniteCanvasControl = new InfiniteCanvasControl(UIRenderer, Debugger, "divInfiniteCanvas", null, 0);
        this._dataGridControl = new DataGridControl(UIRenderer, Debugger, "divDataGrid", null);
        this._modernTreeControl = new ModernTreeControl(UIRenderer, Debugger, "divModernTree", null);
        this.AreaA.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaA.LayoutChangedCallback");
            _this._infiniteCanvasControl.UpdateFromLayout(rect);
        };
        this.AreaB.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaB.LayoutChangedCallback");
            _this._dataGridControl.UpdateFromLayout(rect);
        };
        this.AreaC.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("AreaC.LayoutChangedCallback");
            _this._modernTreeControl.UpdateFromLayout(rect);
        };
    }
    DemoInfiniteCanvasDataGridModernTree.prototype.Show = function () {
        _super.prototype.Show.call(this, [
            {
                "id": "app1",
                "text": "",
                "data": "scene|WindowsHome01",
                "style": 'background-color:#0281d5;background-image:url("/Content/Icons/MetroIcons/96x96/Folders & OS/Windows 8.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }, 
            {
                "id": "app3",
                "text": "",
                "data": "scene|XBoxHome01",
                "style": 'background-color:#228500;background-image:url("/Content/Icons/MetroIcons/96x96/Devices & Drives/XBox 360.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }, 
            {
                "id": "app2",
                "text": "",
                "data": "scene|WindowsPhoneHome01",
                "style": 'background-color:#0281d5;background-image:url("/Content/Icons/MetroIcons/96x96/Folders & OS/Windows.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }, 
            {
                "id": "app4",
                "text": "",
                "data": "scene|OfficeHome01",
                "style": 'background-color:#ff5e23;background-image:url("/Content/Icons/MetroIcons/96x96/Office Apps/MS Office.png");background-position-x:25px;background-position-y:25px;background-size:70px; background-repeat:no-repeat;'
            }
        ], [], {});
        this.Debugger.Log("DemoInfiniteCanvasDataGridModernTree.LayoutChangedCallback");
        this._InitializeInfiniteCanvas(this.AreaA.Dimension.y2 - this.AreaA.Dimension.y1);
        this._InitializeDataGrid(this.AreaB.Dimension.y2 - this.AreaB.Dimension.y1);
        this._InitializeModernTree(this.AreaC.Dimension.x2);
    };
    DemoInfiniteCanvasDataGridModernTree.prototype.Unload = function () {
        _super.prototype.Unload.call(this);
        this.Debugger.Log("DemoInfiniteCanvasDataGridModernTree.LayoutChangedCallback");
        this._infiniteCanvasControl.Unload();
        this._dataGridControl.Unload();
        this._modernTreeControl.Unload();
    };
    DemoInfiniteCanvasDataGridModernTree.prototype.ShowInfiniteCanvas = function () {
        this.Debugger.Log("DemoInfiniteCanvasDataGridModernTree:ShowInfiniteCanvas");
        this._infiniteCanvasControl.Show(this, null, null);
    };
    DemoInfiniteCanvasDataGridModernTree.prototype.HideInfiniteCanvas = function () {
        this.Debugger.Log("DemoInfiniteCanvasDataGridModernTree:HideInfiniteCanvas");
        this._infiniteCanvasControl.Hide();
    };
    DemoInfiniteCanvasDataGridModernTree.prototype.ShowDataGrid = function () {
        this.Debugger.Log("DemoInfiniteCanvasDataGridModernTree:ShowDataGrid");
        this._dataGridControl.Show(this, null, null);
    };
    DemoInfiniteCanvasDataGridModernTree.prototype.HideDataGrid = function () {
        this.Debugger.Log("DemoInfiniteCanvasDataGridModernTree:HideDataGrid");
        this._dataGridControl.Hide();
    };
    DemoInfiniteCanvasDataGridModernTree.prototype.ShowModernTree = function () {
        this.Debugger.Log("DemoInfiniteCanvasDataGridModernTree:ShowModernTree");
        this._modernTreeControl.Show(this, null, null);
    };
    DemoInfiniteCanvasDataGridModernTree.prototype.HideModernTree = function () {
        this.Debugger.Log("DemoInfiniteCanvasDataGridModernTree:HideModernTree");
        this._modernTreeControl.Hide();
    };
    DemoInfiniteCanvasDataGridModernTree.prototype._InitializeInfiniteCanvas = function (startHeight) {
        this.Debugger.Log("DemoInfiniteCanvasDataGridModernTree._InitializeInfiniteCanvas");
        this._infiniteCanvasControl.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this._infiniteCanvasControl.InitUI(startHeight);
        this.ShowInfiniteCanvas();
    };
    DemoInfiniteCanvasDataGridModernTree.prototype._InitializeDataGrid = function (startHeight) {
        this.Debugger.Log("DemoInfiniteCanvasDataGridModernTree._InitializeDataGrid");
        this._dataGridControl.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this._dataGridControl.InitUI(startHeight);
        this.ShowDataGrid();
    };
    DemoInfiniteCanvasDataGridModernTree.prototype._InitializeModernTree = function (startHeight) {
        this.Debugger.Log("DemoInfiniteCanvasDataGridModernTree._InitializeModernTree");
        this._modernTreeControl.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this._modernTreeControl.InitUI(startHeight);
        this.ShowModernTree();
    };
    return DemoInfiniteCanvasDataGridModernTree;
})(Layout001);
