/// <reference path="..\..\Layouts\Layout003.ts"/>
/// <reference path="..\..\Controls\LayoutPanelControl.ts"/>




class ReaderComposeMessage01 extends Layout003 {


    private _modernIFrame: ModernIFrameControl;


    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {
        super(UIRenderer, Debugger, $(window).width(), $(window).height() - 45);

        this._modernIFrame = new ModernIFrameControl(this.UIRenderer, this.Debugger, "divModernIFrameNewMessage", null);

        //WHEN LAYOUTS UPDATE THIS IS WHAT IS USED TO REFRESH OTHER CONTROLS
        this.AreaA.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("AreaA.LayoutChangedCallback");

        };




    }



    public ExecuteAction(data: any) {
        //override this from the scene
        this.Debugger.Log("ReaderComposeMessage01.ExecuteAction params = " + data);
        
        if (data != null) {
            var parts = data.split("|");

            this.Debugger.Log("url : " + parts[2]);



        }
    }


    // =======================
    // SHOW / HIDES
    // =======================
    public Show() {

        var useThisLogo = this.GetCompanyLogo(this.GetQueryVariable("gid"));
        var useThisTheme = _bootup.Theme.GetTheme(this.GetQueryVariable("gid"));
        var useThisName = this.GetQueryVariable("un"); useThisName = useThisName == undefined ? "Theme (Lazy Blue)" : useThisName;
        var useThisProjectName = this.GetQueryVariable("prjn"); useThisProjectName = useThisProjectName == undefined ? "Group 1" : useThisProjectName;

        super.Show(
           [
               { "id": "app1", "text": "Message", "data": "act|ReaderComposeMessage01|Reader/", "style": '' },
           ],
           {
               "logoUrl": "/Content/Icons/dark/Like.png",
               "items": [
                            { "id": "tb1", "text": "Save", "data": "scene2|ReaderPreviewMessage01|Reader/", "style": 'background-image:url("/Content/icons/dark/save.png");background-position:0px 0px;background-size:50px; background-repeat:no-repeat;padding-left:35px;' },
                            { "id": "tb2", "text": "Schedule", "data": "", "style": 'background-image:url("/Content/icons/dark/feature.alarm.png");background-position:0px 0px;background-size:50px; background-repeat:no-repeat;padding-left:35px;' },
                            { "id": "tb3", "text": "Upload", "data": "", "style": 'background-image:url("/Content/icons/dark/upload.png");background-position:0px 0px;background-size:50px; background-repeat:no-repeat;padding-left:35px;' },
                            { "id": "tb9", "text": "Share", "data": "", "style": 'background-image:url("/Content/icons/dark/share.png");background-position:0px 0px;background-size:50px; background-repeat:no-repeat;padding-left:35px;' },
                            { "id": "tb10", "text": "Preview", "data": "scene2|ReaderPreviewMessage01|Reader/", "style": 'background-image:url("/Content/icons/dark/preview.png");background-position:0px 0px;background-size:50px; background-repeat:no-repeat;padding-left:35px; float:right; margin-right:240px;' },
                            { "id": "tb11", "text": "", "data": "act2|ReaderHelpMessage01|Reader/", "style": 'background-image:url("/Content/icons/dark/questionmark.png");background-position:0px 0px;background-size:50px; background-repeat:no-repeat;padding-left:35px;float:right;' },
               ],
               "title": "READER",
               "titleLength": 220,
               "backgroundColor": useThisTheme.accent2
           },
            {
                "accent1": useThisTheme.accent1,
                "accent2": useThisTheme.accent2,
                "accent3": useThisTheme.accent3,
                "accent4": useThisTheme.accent4,
                "backgroundColor": useThisTheme.backgroundColor,
                "foregroundColor": useThisTheme.foregroundColor,
            }
       );
        this.Debugger.Log("ReaderComposeMessage01.Show");

        //update theme
        _bootup.Theme.AccentColor1 = this.GetSetting("accent1");
        _bootup.Theme.AccentColor2 = this.GetSetting("accent2");
        _bootup.Theme.AccentColor3 = this.GetSetting("accent3");
        _bootup.Theme.AccentColor4 = this.GetSetting("accent4");
        _bootup.Theme.BackgroundColor = this.GetSetting("backgroundColor");
        _bootup.Theme.ForegroundColor = this.GetSetting("foregroundColor");


        document.head.title = "Reader - Preview";

        //$("#divToolBar .tbiTitle").css("color", "blue");




        this._Init(this.AreaA.Dimension.y2 - this.AreaA.Dimension.y1);

        this._modernIFrame.LoadUrl("/Content/Reader/SampleComposeMessage.html");

        $("#divToolBar").css("border-top", "3px solid " + useThisTheme.backgroundColor);


    }




    // =======================
    // CLEANUP
    // =======================


    public Unload() {
        
        this.Debugger.Log("ReaderComposeMessage01.Unload");

        if (this._modernIFrame != null) this._modernIFrame.Unload();

        super.Unload();

    }



    // =======================
    // INITIALIZE CONTROLS
    // =======================


    private _Init(startHeight: number) {

        this.Debugger.Log("ReaderComposeMessage01._InitAct1 startHeight = " + startHeight);

        
        this._modernIFrame.InitCallbacks({ parent: this, data: null }, null, null);
        this._modernIFrame.InitUI(startHeight);
        this._modernIFrame.Show(this, null, null);
    }



}


