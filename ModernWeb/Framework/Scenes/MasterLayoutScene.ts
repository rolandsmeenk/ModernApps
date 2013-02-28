/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>
/// <reference path="..\Controls\LoadingControl.ts"/>
/// <reference path="..\Controls\AppBarControl.ts"/>
/// <reference path="..\Controls\ToolBarControl.ts"/>
/// <reference path="..\Controls\VerticalDividerControl.ts"/>
/// <reference path="..\Controls\HorizontalDividerControl.ts"/>

/// <reference path="..\Controls\LayoutPanelControl.ts"/>
/// <reference path="..\Controls\TinyMCE\TinyMCEControl.ts"/>
/// <reference path="..\Controls\InfiniteCanvas\InfiniteCanvasControl.ts"/>
/// <reference path="..\Controls\DataGrid\DataGridControl.ts"/>
/// <reference path="..\Controls\ModernTree\ModernTreeControl.ts"/>
/// <reference path="..\Controls\Wysihtml5\Wysihtml5Control.ts"/>
/// <reference path="..\Controls\Media\VideoPlayerControl.ts"/>
/// <reference path="..\Controls\Media\AudioPlayerControl.ts"/>



class MasterLayoutScene {
    

    private _loadingControl: LoadingControl;
    private _appbarControl: AppBarControl;
    private _toolbarControl: ToolBarControl;
    private _verticalDividerControl: VerticalDividerControl;
    private _horizontalDividerControl: HorizontalDividerControl;

    //LAYOUTS
    private _topRightAreaControl: LayoutPanelControl;
    private _bottomRightAreaControl: LayoutPanelControl;
    private _leftAreaControl: LayoutPanelControl;

    //LAYOUT CHILDREN
    //private _tinyMCEControl: TinyMCEControl;
    private _infiniteCanvasControl: InfiniteCanvasControl;
    private _dataGridControl: DataGridControl;
    private _modernTreeControl: ModernTreeControl;
    //private _wysihtml5Control: Wysihtml5Control;
    //private _videoPlayerControl: VideoPlayerControl;
    //private _audioPlayerControl: AudioPlayerControl;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {

        this._toolbarControl = new ToolBarControl(UIRenderer, Debugger, "divToolBar");
        this._appbarControl = new AppBarControl(UIRenderer, Debugger, "divAppBar");
        this._loadingControl = new LoadingControl(UIRenderer, Debugger, "divLoading");
        
        this._horizontalDividerControl = new HorizontalDividerControl(UIRenderer, Debugger, "divHorizontalDivider", null);
        this._verticalDividerControl = new VerticalDividerControl(UIRenderer, Debugger, "divVerticalDivider", null);

        //LAYOUTS
        this._topRightAreaControl = new LayoutPanelControl(UIRenderer, Debugger, "divTopRightPanel", null);
        this._bottomRightAreaControl = new LayoutPanelControl(UIRenderer, Debugger, "divBottomRightPanel", null);
        this._leftAreaControl = new LayoutPanelControl(UIRenderer, Debugger, "divLeftPanel", null);


        //LAYOUT CHILDREN
        //this._tinyMCEControl = new TinyMCEControl(UIRenderer, Debugger, "divTinyMCE", null);
        this._infiniteCanvasControl = new InfiniteCanvasControl(UIRenderer, Debugger, "divInfiniteCanvas", null);
        this._dataGridControl = new DataGridControl(UIRenderer, Debugger, "divDataGrid", null);
        this._modernTreeControl= new ModernTreeControl(UIRenderer, Debugger, "divModernTree", null);
        //this._wysihtml5Control = new Wysihtml5Control(UIRenderer, Debugger, "divWysihtml5", null);
        //this._videoPlayerControl = new VideoPlayerControl(UIRenderer, Debugger, "divVideoPlayer", null);
        //this._audioPlayerControl = new AudioPlayerControl(UIRenderer, Debugger, "divAudioPlayer", null);



        //WHEN LAYOUTS UPDATE THIS IS WHAT IS USED TO REFRESH OTHER CONTROLS
        this._topRightAreaControl.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("_topRightAreaControl.LayoutChangedCallback");
            //this._tinyMCEControl.UpdateFromLayout(rect);
            this._infiniteCanvasControl.UpdateFromLayout(rect);
            //this._wysihtml5Control.UpdateFromLayout(rect);
        };
        

        this._bottomRightAreaControl.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("_bottomRightAreaControl.LayoutChangedCallback");
            this._dataGridControl.UpdateFromLayout(rect);
        };

        this._leftAreaControl.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("_leftAreaControl.LayoutChangedCallback");
            this._modernTreeControl.UpdateFromLayout(rect);
        };


    }


    public Start() {
        this.Debugger.Log("MasterLayoutScene:Start");

    }

    public Stop() {
        this.Debugger.Log("MasterLayoutScene:Stop");

    }



    public Show() {
        this.Debugger.Log("MasterLayoutScene:Show");


        //APPBAR and TOOLBAR
        this._InitializeToolbar();
        this._InitializeAppbar();
        


        //INIT/RESIZE THE Dividers Followed by the LayoutControls that need tohe dimensions of the Dividers
        var minTop: number = 45;
        var starting_vertical_left: number = parseFloat(this._verticalDividerControl._rootDiv.css("left"));
        var starting_horizontal_top: number = parseFloat(this._horizontalDividerControl._rootDiv.css("top"));

        
        this._IntializeVerticalDivider(minTop);
        this._IntializeHorizontalDivider(minTop, starting_vertical_left);

        this._verticalDividerControl.UpdateHeight(minTop);
        this._horizontalDividerControl.UpdateWidth(starting_vertical_left);

        this._ResizeVerticalDivider(starting_vertical_left, 0);
        this._ResizeHorizontalDivider(starting_vertical_left, starting_horizontal_top);
        
        this._horizontalDividerControl.InitUI(starting_horizontal_top);
        this._verticalDividerControl.InitUI(starting_vertical_left);

        this._InitializeLayoutPanels();



        //LAYOUT CHILDREN        
        //this._InitializeTinyMCE(this._bottomRightAreaControl.Dimension.y2 - this._bottomRightAreaControl.Dimension.y1);
        this._InitializeInfiniteCanvas(this._topRightAreaControl.Dimension.y2 - this._topRightAreaControl.Dimension.y1);
        this._InitializeDataGrid(this._bottomRightAreaControl.Dimension.y2 - this._bottomRightAreaControl.Dimension.y1);
        this._InitializeModernTree(this._leftAreaControl.Dimension.x2);
        //this._InitializeWysihtml5(this._topRightAreaControl.Dimension.y2 - this._topRightAreaControl.Dimension.y1);
    }

    public Hide() {

    }



    public Unload() {
        this._appbarControl.Unload();
        this._toolbarControl.Unload();

        this._verticalDividerControl.Unload();
        this._horizontalDividerControl.Unload();

        this._topRightAreaControl.Unload();
        this._bottomRightAreaControl.Unload();
        this._leftAreaControl.Unload();

        //this._tinyMCEControl.Unload();
        this._infiniteCanvasControl.Unload();
        this._dataGridControl.Unload();
        this._modernTreeControl.Unload();
        //this._wysihtml5Control.Unload();
        //this._videoPlayerControl.Unload();
        //this._audioPlayerControl.Unload();
    }



    // =======================
    // SHOW / HIDES
    // =======================



    public ShowLoading(message: string) {
        this.Debugger.Log("MasterLayoutScene:ShowLoading");
        this._loadingControl.Show(message)
    }

    public HideLoading() {
        this.Debugger.Log("MasterLayoutScene:HideLoading");
        this._loadingControl.Hide();
    }

    public ShowAppBar() {
        this.Debugger.Log("MasterLayoutScene:ShowAppBar");
        this._appbarControl.Show(null);
    }

    public HideAppBar() {
        this.Debugger.Log("MasterLayoutScene:HideAppBar");
        this._appbarControl.Hide();
    }

    public ShowToolBar() {
        this.Debugger.Log("MasterLayoutScene:ShowToolBar");
        //this._toolbarControl.Show(this, function (event) { event.data.ShowAppBar(); });
        this._toolbarControl.Show( null);
    }

    public HideToolBar() {
        this.Debugger.Log("MasterLayoutScene:HideToolBar");
        this._toolbarControl.Hide();
    }

    public ShowVerticalDivider() {
        this.Debugger.Log("MasterLayoutScene:ShowVerticalDivider");
        this._verticalDividerControl.Show(null);
    }

    public HideVerticalDivider() {
        this.Debugger.Log("MasterLayoutScene:HideVerticalDivider");
        this._verticalDividerControl.Hide();
    }

    public ShowHorizontalDivider() {
        this.Debugger.Log("MasterLayoutScene:ShowHorizontalDivider");
        this._horizontalDividerControl.Show(null);
    }

    public HideHorizontalDivider() {
        this.Debugger.Log("MasterLayoutScene:HideHorizontalDivider");
        this._horizontalDividerControl.Hide();
    }

    public ShowTopRightPanel() {
        this.Debugger.Log("MasterLayoutScene:ShowTopRightPanel");
        this._topRightAreaControl.Show( this, null, null);

    }

    public HideTopRightPanel() {
        this.Debugger.Log("MasterLayoutScene:HideTopRightPanel");
        this._topRightAreaControl.Hide();
    }

    public ShowBottomRightPanel() {
        this.Debugger.Log("MasterLayoutScene:ShowBottomRightPanel");
        this._bottomRightAreaControl.Show(this, null, null);
    }

    public HideBottomRightPanel() {
        this.Debugger.Log("MasterLayoutScene:HideBottomRightPanel");
        this._bottomRightAreaControl.Hide();
    }

    public ShowLeftPanel() {
        this.Debugger.Log("MasterLayoutScene:ShowLeftPanel");
        this._leftAreaControl.Show(this, null, null);
    }

    public HideLeftPanel() {
        this.Debugger.Log("MasterLayoutScene:HideLeftPanel");
        this._leftAreaControl.Hide();
    }

    //public ShowTinyMCE() {
    //    this.Debugger.Log("MasterLayoutScene:ShowTinyMCE");
    //    this._tinyMCEControl.Show(this, null, null);
    //}

    //public HideTinyMCE() {
    //    this.Debugger.Log("MasterLayoutScene:HideTinyMCE");
    //    this._tinyMCEControl.Hide();
    //}

    public ShowInfiniteCanvas() {
        this.Debugger.Log("MasterLayoutScene:ShowInfiniteCanvas");
        this._infiniteCanvasControl.Show(this, null, null);
    }

    public HideInfiniteCanvas() {
        this.Debugger.Log("MasterLayoutScene:HideInfiniteCanvas");
        this._infiniteCanvasControl.Hide();
    }

    public ShowDataGrid() {
        this.Debugger.Log("MasterLayoutScene:ShowDataGrid");
        this._dataGridControl.Show(this, null, null);
    }

    public HideDataGrid() {
        this.Debugger.Log("MasterLayoutScene:HideDataGrid");
        this._dataGridControl.Hide();
    }

    public ShowModernTree() {
        this.Debugger.Log("MasterLayoutScene:ShowModernTree");
        this._modernTreeControl.Show(this, null, null);
    }

    public HideModernTree() {
        this.Debugger.Log("MasterLayoutScene:HideModernTree");
        this._modernTreeControl.Hide();
    }

    //public ShowWysihtml5() {
    //    this.Debugger.Log("MasterLayoutScene:ShowWysihtml5");
    //    this._modernTreeControl.Show(this, null, null);
    //}

    //public HideWysihtml5() {
    //    this.Debugger.Log("MasterLayoutScene:HideWysihtml5");
    //    this._modernTreeControl.Hide();
    //}

    //public ShowVideoPlayer() {
    //    this.Debugger.Log("MasterLayoutScene:ShowVideoPlayer");
    //    this._videoPlayerControl.Show(this, null, null);
    //}

    //public HideVideoPlayer() {
    //    this.Debugger.Log("MasterLayoutScene:HideVideoPlayer");
    //    this._videoPlayerControl.Hide();
    //}

    //public ShowAudioPlayer() {
    //    this.Debugger.Log("MasterLayoutScene:ShowAudioPlayer");
    //    this._audioPlayerControl.Show(this, null, null);
    //}

    //public HideAudioPlayer() {
    //    this.Debugger.Log("MasterLayoutScene:HideAudioPlayer");
    //    this._audioPlayerControl.Hide();
    //}




    // =======================
    // CLICK HANDLERS
    // =======================


    private _ToolbarClicked(event) {

        event.parent.Debugger.Log("MasterLayoutScene:_ToolbarClicked " + event.data);
        
        switch (event.data) {
            case "item1": break;
            case "item2":
                //event.data.HideToolBar();
                event.parent.ShowAppBar();
                break;
            case "item3": break;
            case "item4": break;
        }
        
    }

    private _AppBarClicked(event) {
        event.parent.Debugger.Log("MasterLayoutScene:_AppBarClicked " + event.data);

        switch (event.data) {
            case "item1": break;
            case "item2":
                event.parent.HideAppBar();
                break;
        }

    }








    // =======================
    // INITIALIZE CONTROLS
    // =======================


    private _InitializeToolbar() {
        this._toolbarControl.InitCallbacks({ parent: this, data: null }, this._ToolbarClicked, null);
        this._toolbarControl.AddItem("tbi1", "ToolbarItem 1", "item1");
        this._toolbarControl.AddItem("tbi2", "Show AppBar", "item2");
        this._toolbarControl.AddItem("tbi3", "ToolbarItem 3", "item3");
        this._toolbarControl.AddItem("tbi4", "ToolbarItem 4", "item4");

        this.ShowToolBar();
    }

    private _InitializeAppbar() {
        this._appbarControl.InitCallbacks({ parent: this, data: null }, this._AppBarClicked, null);
        this._appbarControl.AddItem("abi1", "AppbarItem 1", "item1");
        this._appbarControl.AddItem("abi2", "Close AppBar", "item2");
        
    }

    //private _InitializeTinyMCE(startHeight: number) {
    //    this._tinyMCEControl.InitCallbacks({ parent: this, data: null }, null, null);
    //    this._tinyMCEControl.InitUI(startHeight);

    //    this.ShowTinyMCE();
    //}

    private _InitializeInfiniteCanvas(startHeight: number) {
        this._infiniteCanvasControl.InitCallbacks({ parent: this, data: null }, null, null);
        this._infiniteCanvasControl.InitUI(startHeight);

        this.ShowInfiniteCanvas();
    }

    private _InitializeDataGrid(startHeight: number) {
        this._dataGridControl.InitCallbacks({ parent: this, data: null }, null, null);
        this._dataGridControl.InitUI(startHeight);

        this.ShowDataGrid();
    }

    private _InitializeModernTree(startHeight: number) {
        this._modernTreeControl.InitCallbacks({ parent: this, data: null }, null, null);
        this._modernTreeControl.InitUI(startHeight);

        this.ShowModernTree();
    }

    //private _InitializeWysihtml5(startHeight: number) {
    //    this._wysihtml5Control.InitCallbacks({ parent: this, data: null }, null, null);
    //    this._wysihtml5Control.InitUI(startHeight);

    //    this.ShowWysihtml5();
    //}

    //private _InitializeVideoPlayer(startHeight: number) {
    //    this._videoPlayerControl.InitCallbacks({ parent: this, data: null }, null, null);
    //    this._videoPlayerControl.InitUI(startHeight);

    //    this.ShowVideoPlayer();
    //}

    //private _InitializeAudioPlayer(startHeight: number) {
    //    this._audioPlayerControl.InitCallbacks({ parent: this, data: null }, null, null);
    //    this._audioPlayerControl.InitUI(startHeight);

    //    this.ShowAudioPlayer();
    //}






    private _IntializeVerticalDivider(minTop: number) {

        this._verticalDividerControl.InitCallbacks({ parent: this, data: null }, null, null);
        this._verticalDividerControl.MinimumY = minTop;

        this._verticalDividerControl.ParentResizeCompleteCallback = (x, y) => {
            this._ResizeVerticalDivider(x, y);
        };

        this.ShowVerticalDivider();
        //this._verticalDividerControl.UpdateHeight(parseFloat(this._horizontalDividerControl._rootDiv.css("top")));
        this._verticalDividerControl.UpdateHeight(minTop);
    }

    private _ResizeVerticalDivider(x:number, y:number) {
        this._horizontalDividerControl.UpdateWidth(x);

        //top right
        var newRect = this._horizontalDividerControl.GetTopRectangle();
        newRect.x1 = x;
        this._topRightAreaControl.UpdateLayout(newRect);

        //bottom right
        var newRect = this._horizontalDividerControl.GetBottomRectangle();
        newRect.x1 = x;
        this._bottomRightAreaControl.UpdateLayout( newRect);

        //left
        var newRect = this._verticalDividerControl.GetLeftRectangle();
        newRect.x1 = 0;
        newRect.x2 = x;
        this._leftAreaControl.UpdateLayout(newRect);
    }

    
    private _IntializeHorizontalDivider(minTop: number, minLeft: number) {

        this._horizontalDividerControl.InitCallbacks({ parent: this, data: null }, null, null);
        this._horizontalDividerControl.MinimumY = minTop;
        
        this._horizontalDividerControl.ParentResizeCompleteCallback = (x, y) => {
            
            this._ResizeHorizontalDivider(x, y);
  
        };

        this.ShowHorizontalDivider();
        this._horizontalDividerControl.UpdateWidth(minLeft);
        
    }


    private _ResizeHorizontalDivider(x: number, y: number) {
        //this._verticalDividerControl.UpdateHeight(y);

        this._UpdateLayoutPanels();
    }


    private _InitializeLayoutPanels() {
        this._topRightAreaControl.InitCallbacks({ parent: this, data: null }, null, null);
        this.ShowTopRightPanel();


        this._bottomRightAreaControl.InitCallbacks({ parent: this, data: null }, null, null);
        this.ShowBottomRightPanel();


        this._leftAreaControl.InitCallbacks({ parent: this, data: null }, null, null);
        this.ShowLeftPanel();

        this._UpdateLayoutPanels();
    }

    private _UpdateLayoutPanels() {
        this._topRightAreaControl.UpdateLayout( this._horizontalDividerControl.GetTopRectangle());
        this._bottomRightAreaControl.UpdateLayout(this._horizontalDividerControl.GetBottomRectangle());
        this._leftAreaControl.UpdateLayout(this._verticalDividerControl.GetLeftRectangle());
    }

}


