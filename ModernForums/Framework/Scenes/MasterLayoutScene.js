var MasterLayoutScene = (function () {
    function MasterLayoutScene(UIRenderer, Debugger) {
        this.UIRenderer = UIRenderer;
        this.Debugger = Debugger;
        var _this = this;
        this._toolbarControl = new ToolBarControl(UIRenderer, Debugger, "divToolBar");
        this._appbarControl = new AppBarControl(UIRenderer, Debugger, "divAppBar");
        this._loadingControl = new LoadingControl(UIRenderer, Debugger, "divLoading");
        this._horizontalDividerControl = new HorizontalDividerControl(UIRenderer, Debugger, "divHorizontalDivider", null);
        this._verticalDividerControl = new VerticalDividerControl(UIRenderer, Debugger, "divVerticalDivider", null);
        this._topRightAreaControl = new LayoutPanelControl(UIRenderer, Debugger, "divTopRightPanel", null);
        this._bottomRightAreaControl = new LayoutPanelControl(UIRenderer, Debugger, "divBottomRightPanel", null);
        this._leftAreaControl = new LayoutPanelControl(UIRenderer, Debugger, "divLeftPanel", null);
        this._infiniteCanvasControl = new InfiniteCanvasControl(UIRenderer, Debugger, "divInfiniteCanvas", null);
        this._topRightAreaControl.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("1");
            _this._infiniteCanvasControl.UpdateFromLayout(rect);
        };
        this._bottomRightAreaControl.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("2");
        };
        this._leftAreaControl.LayoutChangedCallback = function (rect) {
            _this.Debugger.Log("3");
        };
    }
    MasterLayoutScene.prototype.Start = function () {
        this.Debugger.Log("MasterLayoutScene:Start");
    };
    MasterLayoutScene.prototype.Stop = function () {
        this.Debugger.Log("MasterLayoutScene:Stop");
    };
    MasterLayoutScene.prototype.Show = function () {
        this.Debugger.Log("MasterLayoutScene:Show");
        this._InitializeToolbar();
        this._InitializeAppbar();
        var minTop = 45;
        var starting_vertical_left = parseFloat(this._verticalDividerControl._rootDiv.css("left"));
        var starting_horizontal_top = parseFloat(this._horizontalDividerControl._rootDiv.css("top"));
        this._IntializeVerticalDivider(minTop);
        this._IntializeHorizontalDivider(minTop, starting_vertical_left);
        this._verticalDividerControl.UpdateHeight(minTop);
        this._horizontalDividerControl.UpdateWidth(starting_vertical_left);
        this._ResizeVerticalDivider(starting_vertical_left, 0);
        this._ResizeHorizontalDivider(starting_vertical_left, starting_horizontal_top);
        this._horizontalDividerControl.InitUI(starting_horizontal_top);
        this._verticalDividerControl.InitUI(starting_vertical_left);
        this._InitializeLayoutPanels();
        this._InitializeInfiniteCanvas(this._topRightAreaControl.Dimension.y2 - this._topRightAreaControl.Dimension.y1);
    };
    MasterLayoutScene.prototype.Hide = function () {
    };
    MasterLayoutScene.prototype.Unload = function () {
        this._appbarControl.Unload();
        this._toolbarControl.Unload();
        this._verticalDividerControl.Unload();
        this._horizontalDividerControl.Unload();
        this._topRightAreaControl.Unload();
        this._bottomRightAreaControl.Unload();
        this._leftAreaControl.Unload();
        this._infiniteCanvasControl.Unload();
    };
    MasterLayoutScene.prototype.ShowLoading = function (message) {
        this.Debugger.Log("MasterLayoutScene:ShowLoading");
        this._loadingControl.Show(message);
    };
    MasterLayoutScene.prototype.HideLoading = function () {
        this.Debugger.Log("MasterLayoutScene:HideLoading");
        this._loadingControl.Hide();
    };
    MasterLayoutScene.prototype.ShowAppBar = function () {
        this.Debugger.Log("MasterLayoutScene:ShowAppBar");
        this._appbarControl.Show(null);
    };
    MasterLayoutScene.prototype.HideAppBar = function () {
        this.Debugger.Log("MasterLayoutScene:HideAppBar");
        this._appbarControl.Hide();
    };
    MasterLayoutScene.prototype.ShowToolBar = function () {
        this.Debugger.Log("MasterLayoutScene:ShowToolBar");
        this._toolbarControl.Show(null);
    };
    MasterLayoutScene.prototype.HideToolBar = function () {
        this.Debugger.Log("MasterLayoutScene:HideToolBar");
        this._toolbarControl.Hide();
    };
    MasterLayoutScene.prototype.ShowVerticalDivider = function () {
        this.Debugger.Log("MasterLayoutScene:ShowVerticalDivider");
        this._verticalDividerControl.Show(null);
    };
    MasterLayoutScene.prototype.HideVerticalDivider = function () {
        this.Debugger.Log("MasterLayoutScene:HideVerticalDivider");
        this._verticalDividerControl.Hide();
    };
    MasterLayoutScene.prototype.ShowHorizontalDivider = function () {
        this.Debugger.Log("MasterLayoutScene:ShowHorizontalDivider");
        this._horizontalDividerControl.Show(null);
    };
    MasterLayoutScene.prototype.HideHorizontalDivider = function () {
        this.Debugger.Log("MasterLayoutScene:HideHorizontalDivider");
        this._horizontalDividerControl.Hide();
    };
    MasterLayoutScene.prototype.ShowTopRightPanel = function () {
        this.Debugger.Log("MasterLayoutScene:ShowTopRightPanel");
        this._topRightAreaControl.Show(this, null, null);
    };
    MasterLayoutScene.prototype.HideTopRightPanel = function () {
        this.Debugger.Log("MasterLayoutScene:HideTopRightPanel");
        this._topRightAreaControl.Hide();
    };
    MasterLayoutScene.prototype.ShowBottomRightPanel = function () {
        this.Debugger.Log("MasterLayoutScene:ShowBottomRightPanel");
        this._bottomRightAreaControl.Show(this, null, null);
    };
    MasterLayoutScene.prototype.HideBottomRightPanel = function () {
        this.Debugger.Log("MasterLayoutScene:HideBottomRightPanel");
        this._bottomRightAreaControl.Hide();
    };
    MasterLayoutScene.prototype.ShowLeftPanel = function () {
        this.Debugger.Log("MasterLayoutScene:ShowLeftPanel");
        this._leftAreaControl.Show(this, null, null);
    };
    MasterLayoutScene.prototype.HideLeftPanel = function () {
        this.Debugger.Log("MasterLayoutScene:HideLeftPanel");
        this._leftAreaControl.Hide();
    };
    MasterLayoutScene.prototype.ShowInfiniteCanvas = function () {
        this.Debugger.Log("MasterLayoutScene:ShowInfiniteCanvas");
        this._infiniteCanvasControl.Show(this, null, null);
    };
    MasterLayoutScene.prototype.HideInfiniteCanvas = function () {
        this.Debugger.Log("MasterLayoutScene:HideInfiniteCanvas");
        this._infiniteCanvasControl.Hide();
    };
    MasterLayoutScene.prototype._ToolbarClicked = function (event) {
        event.parent.Debugger.Log("MasterLayoutScene:_ToolbarClicked " + event.data);
        switch(event.data) {
            case "item1":
                break;
            case "item2":
                event.parent.ShowAppBar();
                break;
            case "item3":
                break;
            case "item4":
                break;
        }
    };
    MasterLayoutScene.prototype._AppBarClicked = function (event) {
        event.parent.Debugger.Log("MasterLayoutScene:_AppBarClicked " + event.data);
        switch(event.data) {
            case "item1":
                break;
            case "item2":
                event.parent.HideAppBar();
                break;
        }
    };
    MasterLayoutScene.prototype._InitializeToolbar = function () {
        this._toolbarControl.InitCallbacks({
            parent: this,
            data: null
        }, this._ToolbarClicked, null);
        this._toolbarControl.AddItem("tbi1", "ToolbarItem 1", "item1");
        this._toolbarControl.AddItem("tbi2", "Show AppBar", "item2");
        this._toolbarControl.AddItem("tbi3", "ToolbarItem 3", "item3");
        this._toolbarControl.AddItem("tbi4", "ToolbarItem 4", "item4");
        this.ShowToolBar();
    };
    MasterLayoutScene.prototype._InitializeAppbar = function () {
        this._appbarControl.InitCallbacks({
            parent: this,
            data: null
        }, this._AppBarClicked, null);
        this._appbarControl.AddItem("abi1", "AppbarItem 1", "item1");
        this._appbarControl.AddItem("abi2", "Close AppBar", "item2");
    };
    MasterLayoutScene.prototype._InitializeInfiniteCanvas = function (startHeight) {
        this._infiniteCanvasControl.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this._infiniteCanvasControl.InitUI(startHeight);
        this.ShowInfiniteCanvas();
    };
    MasterLayoutScene.prototype._IntializeVerticalDivider = function (minTop) {
        var _this = this;
        this._verticalDividerControl.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this._verticalDividerControl.MinimumY = minTop;
        this._verticalDividerControl.ParentResizeCompleteCallback = function (x, y) {
            _this._ResizeVerticalDivider(x, y);
        };
        this.ShowVerticalDivider();
        this._verticalDividerControl.UpdateHeight(minTop);
    };
    MasterLayoutScene.prototype._ResizeVerticalDivider = function (x, y) {
        this._horizontalDividerControl.UpdateWidth(x);
        var newRect = this._horizontalDividerControl.GetTopRectangle();
        newRect.x1 = x;
        this._topRightAreaControl.UpdateLayout(newRect);
        var newRect = this._horizontalDividerControl.GetBottomRectangle();
        newRect.x1 = x;
        this._bottomRightAreaControl.UpdateLayout(newRect);
        var newRect = this._verticalDividerControl.GetLeftRectangle();
        newRect.x1 = 0;
        newRect.x2 = x;
        this._leftAreaControl.UpdateLayout(newRect);
    };
    MasterLayoutScene.prototype._IntializeHorizontalDivider = function (minTop, minLeft) {
        var _this = this;
        this._horizontalDividerControl.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this._horizontalDividerControl.MinimumY = minTop;
        this._horizontalDividerControl.ParentResizeCompleteCallback = function (x, y) {
            _this._ResizeHorizontalDivider(x, y);
        };
        this.ShowHorizontalDivider();
        this._horizontalDividerControl.UpdateWidth(minLeft);
    };
    MasterLayoutScene.prototype._ResizeHorizontalDivider = function (x, y) {
        this._UpdateLayoutPanels();
    };
    MasterLayoutScene.prototype._InitializeLayoutPanels = function () {
        this._topRightAreaControl.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this.ShowTopRightPanel();
        this._bottomRightAreaControl.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this.ShowBottomRightPanel();
        this._leftAreaControl.InitCallbacks({
            parent: this,
            data: null
        }, null, null);
        this.ShowLeftPanel();
        this._UpdateLayoutPanels();
    };
    MasterLayoutScene.prototype._UpdateLayoutPanels = function () {
        this._topRightAreaControl.UpdateLayout(this._horizontalDividerControl.GetTopRectangle());
        this._bottomRightAreaControl.UpdateLayout(this._horizontalDividerControl.GetBottomRectangle());
        this._leftAreaControl.UpdateLayout(this._verticalDividerControl.GetLeftRectangle());
    };
    return MasterLayoutScene;
})();
