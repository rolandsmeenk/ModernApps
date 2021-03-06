﻿/// <reference path="..\..\Layouts\Layout003.ts"/>
/// <reference path="..\..\Controls\LayoutPanelControl.ts"/>




class ReaderHelpMessage01 extends Layout003 {


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
        this.Debugger.Log("ReaderHelpMessage01.ExecuteAction params = " + data);
        
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
               { "id": "app1", "text": "Message", "data": "act2|ReaderPreviewMessage01|Reader/", "style": '' },
           ],
           {
               "logoUrl": "/Content/Icons/dark/Like.png",
               "items": [
                   
                   { "id": "tb11", "text": "", "data": "act2|ReaderPreviewMessage01|Reader/", "style": 'color:white; background-image:url("/Content/icons/dark/goback.png");background-position:0px 0px;background-size:50px; background-repeat:no-repeat;padding-left:35px;float:right;margin-right:220px;' },
               ],
               "title": "READER",
               "titleLength": 190,
               "backgroundColor": useThisTheme.backgroundColor
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
        this.Debugger.Log("ReaderHelpMessage01.Show");

       

        //$("#divToolBar .tbiTitle").css("color", "blue");




        this._Init(this.AreaA.Dimension.y2 - this.AreaA.Dimension.y1);

        this._modernIFrame.LoadUrl("/Content/Reader/SampleHelpMessage.html");

        $("#divToolBar").css("border-top", "3px solid " + useThisTheme.backgroundColor);


    }




    // =======================
    // CLEANUP
    // =======================


    public Unload() {
        
        this.Debugger.Log("ReaderHelpMessage01.Unload");

        if (this._modernIFrame != null) this._modernIFrame.Unload();

        super.Unload();

    }



    // =======================
    // INITIALIZE CONTROLS
    // =======================


    private _Init(startHeight: number) {

        this.Debugger.Log("ReaderHelpMessage01._InitAct1 startHeight = " + startHeight);

        
        this._modernIFrame.InitCallbacks({ parent: this, data: null }, null, null);
        this._modernIFrame.InitUI(startHeight);
        this._modernIFrame.Show(this, null, null);
    }



}


