/// <reference path="..\..\UIRenderer.ts"/>
/// <reference path="..\..\Debugger.ts"/>
/// <reference path="..\FrameworkControl.ts"/>


declare var $;

class Wysihtml5Control extends FrameworkControl {
   
    private _shadowTextArea: any;

    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string, public ParentUniqueID: string) {
        super(UIRenderer, Debugger, UniqueID, ParentUniqueID);


        //load toolbar
        var styleHtml = '<style>'
            + '    body {'
            + '        font-family: Verdana;'
            + '        font-size: 11px;'
            + '    }'

            + '    h2 {'
            + '        margin-bottom: 0;'
            + '    }'

            + '    small {'
            + '        display: block;'
            + '        margin-top: 40px;'
            + '        font-size: 9px;'
            + '    }'

            + '    small,'
            + '    small a {'
            + '        color: #666;'
            + '    }'

            + '    a {'
            + '        color: #000;'
            + '        text-decoration: underline;'
            + '        cursor: pointer;'
            + '    }'

            + '    #toolbar[data-wysihtml5-action]{'
            + '        float: right;'
            + '    }'

            + '    #toolbar,'
            + '    textarea {'
            + '        width: 850px;'
            + '        padding: 5px;'
            + '        -webkit-box-sizing: border - box;'
            + '        -ms-box-sizing: border - box;'
            + '        -moz-box-sizing: border - box;'
            + '        box-sizing: border - box;'
            + '    }'

            + '    textarea {'
            + '        height: 280px;'
            + '        border: 2px solid green;'
            + '        font-family: Verdana;'
            + '        font-size: 11px;'
            + '    }'

            + '    textarea: focus {'
            + '        color: black;'
            + '        border: 2px solid black;'
            + '    }'

            + '    .wysihtml5-command-active {'
            + '        font-weight: bold;'
            + '    }'

            + '    [data-wysihtml5-dialog]{'
            + '        margin: 5px 0 0;'
            + '        padding: 5px;'
            + '        border: 1px solid #666;'
            + '    }'

            + '    a[data-wysihtml5-command-value="red"]{'
            + '        color: red;'
            + '    }'

            + '    a[data-wysihtml5-command-value="green"]{'
            + '        color: green;'
            + '    }'

            + '    a[data-wysihtml5-command-value="blue"]{'
            + '        color: blue;'
            + '    }'
            + '</style>';


        var toolbarHtml = '<div id="toolbar" style="display: none;" >'
            + '<a data-wysihtml5-command = "bold" title = "CTRL+B" > bold </a> |'
            + '<a data-wysihtml5-command = "italic" title = "CTRL+I" > italic </a> |'
            + '<a data-wysihtml5-command = "createLink" > insert link </a> |'
            + '<a data-wysihtml5-command = "insertImage" > insert image </a> |'
            + '<a data-wysihtml5-command = "formatBlock" data-wysihtml5-command-value = "h1" > h1 </a> |'
            + '<a data-wysihtml5-command = "formatBlock" data-wysihtml5-command-value = "h2" > h2 </a> |'
            + '<a data-wysihtml5-command = "insertUnorderedList" > insertUnorderedList </a> |'
            + '<a data-wysihtml5-command = "insertOrderedList" > insertOrderedList </a> |'
            + '<a data-wysihtml5-command = "foreColor" data-wysihtml5-command-value="red" > red </a> |'
            + '<a data-wysihtml5-command = "foreColor" data-wysihtml5-command-value="green" > green </a> |'
            + '<a data-wysihtml5-command = "foreColor" data-wysihtml5-command-value="blue" > blue </a> |'
            + '<a data-wysihtml5-command = "insertSpeech" > speech </a>'
            + '<a data-wysihtml5-action = "change_view" >switch to html view </a>'

            + '<div data-wysihtml5-dialog = "createLink" style = "display: none;" >'
            + '  <label>'
            + '            Link:'
            + '        <input data-wysihtml5-dialog-field = "href" value = "http://" >'
            + '      </label>'
            + '      <a data-wysihtml5-dialog-action="save"> OK </a>&nbsp;<a data-wysihtml5-dialog-action="cancel">Cancel</a>'
            + '    </div>'

            + '    <div data-wysihtml5-dialog="insertImage" style="display: none;">'
            + '      <label>'
            + '            Image:'
            + '        <input data-wysihtml5-dialog-field="src" value="http://" >'
            + '      </label>'
            + '      <label>'
            + '            Align:'
            + '        <select data-wysihtml5-dialog-field="className" >'
            + '          <option value=""> default </option>'
            + '          <option value="wysiwyg-float-left"> left </option>'
            + '          <option value="wysiwyg-float-right"> right </option>'
            + '        </select>'
            + '      </label >'
            + '      <a data-wysihtml5-dialog-action="save"> OK </a>&nbsp;<a data-wysihtml5-dialog-action="cancel">Cancel</a>'
            + '    </div>'

            + '  </div>';
        this._rootDiv.html(styleHtml + toolbarHtml);

        //load textarea
        this._shadowTextArea = this.UIRenderer.LoadTextAreaInParent("wysihtml5ta", this._rootDiv);

    }

    public InitUI(startHeight: number) {
        this.Debugger.Log("Wysihtml5Control:InitUI");


        if (typeof wysihtml5ParserRules == "undefined" ) {

            
            //load wysihtml5
            this.Debugger.Log("Wysihtml5Control:InitUI - loading 'advanced.js'");
            $.getScript('/Framework/ThirdParty/xing-wysihtml5/parser_rules/advanced.js', function () {
                _bootup.SceneManager.MasterLayoutScene.Debugger.Log("Wysihtml5Control:InitUI - loaded 'advanced.js'");

                if (typeof wysihtml5 == "undefined") {

                    _bootup.SceneManager.MasterLayoutScene.Debugger.Log("Wysihtml5Control:InitUI - loading 'wysihtml5-0.3.0.js'");
                    $.getScript('/Framework/ThirdParty/xing-wysihtml5/dist/wysihtml5-0.3.0.js', function () {
                        _bootup.SceneManager.MasterLayoutScene.Debugger.Log("Wysihtml5Control:InitUI - loaded 'wysihtml5-0.3.0.js'");

                        var editor = new wysihtml5.Editor("wysihtml5ta", {
                            toolbar: "toolbar",
                            stylesheets: "css/stylesheet.css",
                            parserRules: wysihtml5ParserRules
                        });

                        var log = document.getElementById("log");

                        editor
                          .on("load", function () {
                              log.innerHTML += "<div>load</div>";
                          })
                          .on("focus", function () {
                              log.innerHTML += "<div>focus</div>";
                          })
                          .on("blur", function () {
                              log.innerHTML += "<div>blur</div>";
                          })
                          .on("change", function () {
                              log.innerHTML += "<div>change</div>";
                          })
                          .on("paste", function () {
                              log.innerHTML += "<div>paste</div>";
                          })
                          .on("newword:composer", function () {
                              log.innerHTML += "<div>newword:composer</div>";
                          })
                          .on("undo:composer", function () {
                              log.innerHTML += "<div>undo:composer</div>";
                          })
                          .on("redo:composer", function () {
                              log.innerHTML += "<div>redo:composer</div>";
                          });


                    });

                };

            });


            
        }




        



        this.UIRenderer.LoadDivInParent(this.UniqueID + "_Overlay", this.UniqueID);

        ////wait 15ms till control is finished loading then redimension it
        //setTimeout(function () {
        //    $(".mceIframeContainer").height(startHeight - 26);
        //}, 15);
        
    }


    private _rect: any;
    public UpdateFromLayout(rect: any) {
        this.Debugger.Log("Wysihtml5Control:UpdateFromLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rect = rect;
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1 - 10).height(rect.y2 - rect.y1 - 35);
        //$(".mceIframeContainer").height(rect.y2 - rect.y1 - 26);
    }


    public Unload() {
        super.Unload();
    }


}

