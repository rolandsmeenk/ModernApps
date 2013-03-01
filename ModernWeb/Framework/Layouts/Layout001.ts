/// <reference path="MasterLayout.ts"/>
/// <reference path="..\Controls\LayoutPanelControl.ts"/>

//       |   
//       |      A
//       |
//   C   |--------------
//       |
//       |      B
//       |

class Layout001 extends MasterLayout{

    public VerticalDividerControl: VerticalDividerControl;
    public HorizontalDividerControl: HorizontalDividerControl;

    //LAYOUTS
    public AreaA: LayoutPanelControl;
    public AreaB: LayoutPanelControl;
    public AreaC: LayoutPanelControl;

    ////LAYOUT CHILDREN
    ////private _tinyMCEControl: TinyMCEControl;
    //private _infiniteCanvasControl: InfiniteCanvasControl;
    //private _dataGridControl: DataGridControl;
    //private _modernTreeControl: ModernTreeControl;
    ////private _wysihtml5Control: Wysihtml5Control;
    ////private _videoPlayerControl: VideoPlayerControl;
    ////private _audioPlayerControl: AudioPlayerControl;


    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {
        super(UIRenderer, Debugger);


        this.HorizontalDividerControl = new HorizontalDividerControl(UIRenderer, Debugger, "divHorizontalDivider", null);
        this.VerticalDividerControl = new VerticalDividerControl(UIRenderer, Debugger, "divVerticalDivider", null);


        //LAYOUTS
        this.AreaA = new LayoutPanelControl(UIRenderer, Debugger, "divTopRightPanel", null);
        this.AddLayoutControl(this.AreaA);

        this.AreaB = new LayoutPanelControl(UIRenderer, Debugger, "divBottomRightPanel", null);
        this.AddLayoutControl(this.AreaB);

        this.AreaC = new LayoutPanelControl(UIRenderer, Debugger, "divLeftPanel", null);
        this.AddLayoutControl(this.AreaC);


        ////LAYOUT CHILDREN
        ////this._tinyMCEControl = new TinyMCEControl(UIRenderer, Debugger, "divTinyMCE", null);
        //this._infiniteCanvasControl = new InfiniteCanvasControl(UIRenderer, Debugger, "divInfiniteCanvas", null);
        //this._dataGridControl = new DataGridControl(UIRenderer, Debugger, "divDataGrid", null);
        //this._modernTreeControl= new ModernTreeControl(UIRenderer, Debugger, "divModernTree", null);
        ////this._wysihtml5Control = new Wysihtml5Control(UIRenderer, Debugger, "divWysihtml5", null);
        ////this._videoPlayerControl = new VideoPlayerControl(UIRenderer, Debugger, "divVideoPlayer", null);
        ////this._audioPlayerControl = new AudioPlayerControl(UIRenderer, Debugger, "divAudioPlayer", null);




        ////WHEN LAYOUTS UPDATE THIS IS WHAT IS USED TO REFRESH OTHER CONTROLS
        //this.AreaA.LayoutChangedCallback = (rect) => {
        //    this.Debugger.Log("AreaA.LayoutChangedCallback");
        //    //this._tinyMCEControl.UpdateFromLayout(rect);
        //    this._infiniteCanvasControl.UpdateFromLayout(rect);
        //    //this._wysihtml5Control.UpdateFromLayout(rect);
        //};


        //this.AreaB.LayoutChangedCallback = (rect) => {
        //    this.Debugger.Log("AreaB.LayoutChangedCallback");
        //    this._dataGridControl.UpdateFromLayout(rect);
        //};

        //this.AreaC.LayoutChangedCallback = (rect) => {
        //    this.Debugger.Log("AreaC.LayoutChangedCallback");
        //    this._modernTreeControl.UpdateFromLayout(rect);
        //};


    }

    public Show() {
        super.Show();

        this.Debugger.Log("Layout001.LayoutChangedCallback");

        //INIT/RESIZE THE Dividers Followed by the LayoutControls that need tohe dimensions of the Dividers
        var minTop: number = 45;
        var starting_vertical_left: number = parseFloat(this.VerticalDividerControl._rootDiv.css("left"));
        var starting_horizontal_top: number = parseFloat(this.HorizontalDividerControl._rootDiv.css("top"));


        this._IntializeVerticalDivider(minTop);
        this._IntializeHorizontalDivider(minTop, starting_vertical_left);

        this.VerticalDividerControl.UpdateHeight(minTop);
        this.HorizontalDividerControl.UpdateWidth(starting_vertical_left);

        this._ResizeVerticalDivider(starting_vertical_left, 0);
        this._ResizeHorizontalDivider(starting_vertical_left, starting_horizontal_top);

        this.HorizontalDividerControl.InitUI(starting_horizontal_top);
        this.VerticalDividerControl.InitUI(starting_vertical_left);

        this._InitializeLayoutPanels();



        ////LAYOUT CHILDREN        
        ////this._InitializeTinyMCE(this.AreaB.Dimension.y2 - this.AreaB.Dimension.y1);
        //this._InitializeInfiniteCanvas(this.AreaA.Dimension.y2 - this.AreaA.Dimension.y1);
        //this._InitializeDataGrid(this.AreaB.Dimension.y2 - this.AreaB.Dimension.y1);
        //this._InitializeModernTree(this.AreaC.Dimension.x2);
        ////this._InitializeWysihtml5(this.AreaA.Dimension.y2 - this.AreaA.Dimension.y1);
    }


    public Unload() {
        super.Unload();

        this.Debugger.Log("Layout001.LayoutChangedCallback");

        this.VerticalDividerControl.Unload();
        this.HorizontalDividerControl.Unload();

        this.AreaA.Unload();
        this.AreaB.Unload();
        this.AreaC.Unload();

        ////this._tinyMCEControl.Unload();
        //this._infiniteCanvasControl.Unload();
        //this._dataGridControl.Unload();
        //this._modernTreeControl.Unload();
        ////this._wysihtml5Control.Unload();
        ////this._videoPlayerControl.Unload();
        ////this._audioPlayerControl.Unload();
    }



    // =======================
    // SHOW / HIDES
    // =======================

    public ShowVerticalDivider() {
        this.Debugger.Log("Layout001:ShowVerticalDivider");
        this.VerticalDividerControl.Show(null);
    }

    public HideVerticalDivider() {
        this.Debugger.Log("Layout001:HideVerticalDivider");
        this.VerticalDividerControl.Hide();
    }

    public ShowHorizontalDivider() {
        this.Debugger.Log("Layout001:ShowHorizontalDivider");
        this.HorizontalDividerControl.Show(null);
    }

    public HideHorizontalDivider() {
        this.Debugger.Log("Layout001:HideHorizontalDivider");
        this.HorizontalDividerControl.Hide();
    }

    public ShowTopRightPanel() {
        this.Debugger.Log("Layout001:ShowTopRightPanel");
        this.AreaA.Show(this, null, null);

    }

    public HideTopRightPanel() {
        this.Debugger.Log("Layout001:HideTopRightPanel");
        this.AreaA.Hide();
    }

    public ShowBottomRightPanel() {
        this.Debugger.Log("Layout001:ShowBottomRightPanel");
        this.AreaB.Show(this, null, null);
    }

    public HideBottomRightPanel() {
        this.Debugger.Log("Layout001:HideBottomRightPanel");
        this.AreaB.Hide();
    }

    public ShowLeftPanel() {
        this.Debugger.Log("Layout001:ShowLeftPanel");
        this.AreaC.Show(this, null, null);
    }

    public HideLeftPanel() {
        this.Debugger.Log("Layout001:HideLeftPanel");
        this.AreaC.Hide();
    }

    ////public ShowTinyMCE() {
    ////    this.Debugger.Log("MasterLayoutScene:ShowTinyMCE");
    ////    this._tinyMCEControl.Show(this, null, null);
    ////}

    ////public HideTinyMCE() {
    ////    this.Debugger.Log("MasterLayoutScene:HideTinyMCE");
    ////    this._tinyMCEControl.Hide();
    ////}

    //public ShowInfiniteCanvas() {
    //    this.Debugger.Log("Layout001:ShowInfiniteCanvas");
    //    this._infiniteCanvasControl.Show(this, null, null);
    //}

    //public HideInfiniteCanvas() {
    //    this.Debugger.Log("Layout001:HideInfiniteCanvas");
    //    this._infiniteCanvasControl.Hide();
    //}

    //public ShowDataGrid() {
    //    this.Debugger.Log("Layout001:ShowDataGrid");
    //    this._dataGridControl.Show(this, null, null);
    //}

    //public HideDataGrid() {
    //    this.Debugger.Log("Layout001:HideDataGrid");
    //    this._dataGridControl.Hide();
    //}

    //public ShowModernTree() {
    //    this.Debugger.Log("Layout001:ShowModernTree");
    //    this._modernTreeControl.Show(this, null, null);
    //}

    //public HideModernTree() {
    //    this.Debugger.Log("Layout001:HideModernTree");
    //    this._modernTreeControl.Hide();
    //}

    ////public ShowWysihtml5() {
    ////    this.Debugger.Log("MasterLayoutScene:ShowWysihtml5");
    ////    this._modernTreeControl.Show(this, null, null);
    ////}

    ////public HideWysihtml5() {
    ////    this.Debugger.Log("MasterLayoutScene:HideWysihtml5");
    ////    this._modernTreeControl.Hide();
    ////}

    ////public ShowVideoPlayer() {
    ////    this.Debugger.Log("MasterLayoutScene:ShowVideoPlayer");
    ////    this._videoPlayerControl.Show(this, null, null);
    ////}

    ////public HideVideoPlayer() {
    ////    this.Debugger.Log("MasterLayoutScene:HideVideoPlayer");
    ////    this._videoPlayerControl.Hide();
    ////}

    ////public ShowAudioPlayer() {
    ////    this.Debugger.Log("MasterLayoutScene:ShowAudioPlayer");
    ////    this._audioPlayerControl.Show(this, null, null);
    ////}

    ////public HideAudioPlayer() {
    ////    this.Debugger.Log("MasterLayoutScene:HideAudioPlayer");
    ////    this._audioPlayerControl.Hide();
    ////}




    //// =======================
    //// INITIALIZE CONTROLS
    //// =======================



    ////private _InitializeTinyMCE(startHeight: number) {
    ////    this._tinyMCEControl.InitCallbacks({ parent: this, data: null }, null, null);
    ////    this._tinyMCEControl.InitUI(startHeight);

    ////    this.ShowTinyMCE();
    ////}

    //private _InitializeInfiniteCanvas(startHeight: number) {
    //    this.Debugger.Log("Layout001._InitializeInfiniteCanvas");
    //    this._infiniteCanvasControl.InitCallbacks({ parent: this, data: null }, null, null);
    //    this._infiniteCanvasControl.InitUI(startHeight);

    //    this.ShowInfiniteCanvas();
    //}

    //private _InitializeDataGrid(startHeight: number) {
    //    this.Debugger.Log("Layout001._InitializeDataGrid");
    //    this._dataGridControl.InitCallbacks({ parent: this, data: null }, null, null);
    //    this._dataGridControl.InitUI(startHeight);

    //    this.ShowDataGrid();
    //}

    //private _InitializeModernTree(startHeight: number) {
    //    this.Debugger.Log("Layout001._InitializeModernTree");
    //    this._modernTreeControl.InitCallbacks({ parent: this, data: null }, null, null);
    //    this._modernTreeControl.InitUI(startHeight);

    //    this.ShowModernTree();
    //}

    ////private _InitializeWysihtml5(startHeight: number) {
    ////    this._wysihtml5Control.InitCallbacks({ parent: this, data: null }, null, null);
    ////    this._wysihtml5Control.InitUI(startHeight);

    ////    this.ShowWysihtml5();
    ////}

    ////private _InitializeVideoPlayer(startHeight: number) {
    ////    this._videoPlayerControl.InitCallbacks({ parent: this, data: null }, null, null);
    ////    this._videoPlayerControl.InitUI(startHeight);

    ////    this.ShowVideoPlayer();
    ////}

    ////private _InitializeAudioPlayer(startHeight: number) {
    ////    this._audioPlayerControl.InitCallbacks({ parent: this, data: null }, null, null);
    ////    this._audioPlayerControl.InitUI(startHeight);

    ////    this.ShowAudioPlayer();
    ////}






    private _IntializeVerticalDivider(minTop: number) {
        this.Debugger.Log("Layout001._IntializeVerticalDivider");
        this.VerticalDividerControl.InitCallbacks({ parent: this, data: null }, null, null);
        this.VerticalDividerControl.MinimumY = minTop;

        this.VerticalDividerControl.ParentResizeCompleteCallback = (x, y) => {
            this._ResizeVerticalDivider(x, y);
        };

        this.ShowVerticalDivider();
        //this.VerticalDividerControl.UpdateHeight(parseFloat(this.HorizontalDividerControl._rootDiv.css("top")));
        this.VerticalDividerControl.UpdateHeight(minTop);
    }

    private _ResizeVerticalDivider(x: number, y: number) {
        this.Debugger.Log("Layout001._ResizeVerticalDivider");
        this.HorizontalDividerControl.UpdateWidth(x);

        //top right
        var newRect = this.HorizontalDividerControl.GetTopRectangle();
        newRect.x1 = x;
        this.AreaA.UpdateLayout(newRect);

        //bottom right
        var newRect = this.HorizontalDividerControl.GetBottomRectangle();
        newRect.x1 = x;
        this.AreaB.UpdateLayout(newRect);

        //left
        var newRect = this.VerticalDividerControl.GetLeftRectangle();
        newRect.x1 = 0;
        newRect.x2 = x;
        this.AreaC.UpdateLayout(newRect);
    }


    private _IntializeHorizontalDivider(minTop: number, minLeft: number) {
        this.Debugger.Log("Layout001._IntializeHorizontalDivider");
        this.HorizontalDividerControl.InitCallbacks({ parent: this, data: null }, null, null);
        this.HorizontalDividerControl.MinimumY = minTop;

        this.HorizontalDividerControl.ParentResizeCompleteCallback = (x, y) => {

            this._ResizeHorizontalDivider(x, y);

        };

        this.ShowHorizontalDivider();
        this.HorizontalDividerControl.UpdateWidth(minLeft);

    }


    private _ResizeHorizontalDivider(x: number, y: number) {

        //this.VerticalDividerControl.UpdateHeight(y);

        this._UpdateLayoutPanels();
    }


    private _InitializeLayoutPanels() {
        this.Debugger.Log("Layout001._InitializeLayoutPanels");
        this.AreaA.InitCallbacks({ parent: this, data: null }, null, null);
        this.ShowTopRightPanel();


        this.AreaB.InitCallbacks({ parent: this, data: null }, null, null);
        this.ShowBottomRightPanel();


        this.AreaC.InitCallbacks({ parent: this, data: null }, null, null);
        this.ShowLeftPanel();

        this._UpdateLayoutPanels();
    }

    private _UpdateLayoutPanels() {
        this.Debugger.Log("Layout001._UpdateLayoutPanels");
        this.AreaA.UpdateLayout(this.HorizontalDividerControl.GetTopRectangle());
        this.AreaB.UpdateLayout(this.HorizontalDividerControl.GetBottomRectangle());
        this.AreaC.UpdateLayout(this.VerticalDividerControl.GetLeftRectangle());
    }


}


