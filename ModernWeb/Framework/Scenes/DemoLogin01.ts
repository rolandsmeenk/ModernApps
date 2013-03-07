/// <reference path="..\Layouts\Layout003.ts"/>
/// <reference path="..\Controls\LayoutPanelControl.ts"/>




class DemoLogin01 extends Layout003 {

    private _shadowBackgroundDiv : any;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger) {
        super(UIRenderer, Debugger, 500, 250);


        var _html = '<div id="divLogin01">'
        + '     <div class="authWindowsLive" data-command="action" data-action="windows" />'
        + '     <div class="authIncite" data-command="action" data-action="xbox" />'
        + '     <div class="authLeighton" data-command="action" data-action="phone" />'
        + '</div>';


        this._shadowBackgroundDiv = this.UIRenderer.LoadHTMLElement("divLogin01", null, _html);

        this._shadowBackgroundDiv.find('div[data-command="action"]').on("click", function () {
            //alert($(this).attr("class"));
            //alert($(this).data("action"));

            switch ($(this).data("action")) {
                case "phone": _bootup.SceneManager.NavigateToScene("DemoLogin01"); break;
                case "windows": _bootup.SceneManager.NavigateToScene("DemoLogin01"); break;
                case "xbox": _bootup.SceneManager.NavigateToScene("DemoLogin01"); break;
            }

        });


 
        //WHEN LAYOUTS UPDATE THIS IS WHAT IS USED TO REFRESH OTHER CONTROLS
        var _self = this;
        this.AreaA.LayoutChangedCallback = (rect) => {
            this.Debugger.Log("AreaA.LayoutChangedCallback");
            
            _self._shadowBackgroundDiv
                .css("left", rect.x1)
                .css("top", rect.y1)
                .width(rect.w)
                .height(rect.h);

        };


    }

    public Show() {
        super.Show();
        this.Debugger.Log("DemoLogin01.Show");
    
        this._shadowBackgroundDiv.show();

    }


    public Unload() {
        
        this.Debugger.Log("DemoLogin01.Unload");

        this._shadowBackgroundDiv.find('div[data-command="action"]').off("click");
        this._shadowBackgroundDiv.remove();

        super.Unload();

    }



    // =======================
    // SHOW / HIDES
    // =======================


    // =======================
    // INITIALIZE CONTROLS
    // =======================






}


