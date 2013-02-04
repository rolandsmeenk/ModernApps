

declare var $;

class UIRenderer {

    constructor(public RootUI: any, public HeadUI: any) {

    }


    public LoadCSS(css: string) {

        this.HeadUI.append($('<link rel="stylesheet" type="text/css" />').attr('href', '/Themes/' + css + ".css"));

    }


    //=========
    //DIV
    //=========
    public FindDiv(id: string) {
        var found = $("#" + id);
        return found;
    }

    public LoadDiv(id: string) {
        return this.RootUI.append('<div id="' + id + '"></div>');

    }

    public UnloadDiv(id: string) {
        var found = $("#" + id);
        if (found != null) found.remove();
    }

    public AppendToDiv(id: string, text: string, className: string) {
        var found = $("#" + id);
        if (found != null) found.append('<div class="' + className + '">' + text + '</div>');
    }

    public FillDivContent(id: string, message: string) {
        var found = $("#" + id);
        if (found != null) found.html(message);
    }

    public ShowDiv(id: string) {
        var found = $("#" + id);
        if (found != null) found.css("display", "");
    }

    public AnimateDiv(id: string, animateProperties: any, duration: number) {
        var found = $("#" + id);
        if (found != null) found.animate(animateProperties, duration) ;
    }


    public HideDiv(id: string) {
        var found = $("#" + id);
        if (found != null) found.css("display", "none"); 
    }
    
    public RemoveFirstChild(id: string) {
        $("#" + id + " ").children(":first").remove();
    }



    //=========
    //CANVAS
    //=========
    public LoadCanvas(id: string) {
        this.RootUI.append('<canvas id="' + id + '"></canvas>');

    }

    public UnloadCanvas(id: string) {
        var found = $("#" + id);
        if (found != null) found.remove(); 
    }
}

