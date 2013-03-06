

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
        this.RootUI.append('<div id="' + id + '"></div>');
        var found = $("#" + id);
        return found;
    }

    public LoadDivInParent(id: string, parentid: string) {
        var found = $("#" + parentid);
        if (found != null) found.append('<div id="' + id + '"></div>');
        found = $("#" + id);
        return found;
    } 

    public UnloadDiv(id: string) {
        var found = $("#" + id);
        if (found != null) found.remove();
    }

    public AppendToDiv(id: string, text: string, className: string) {
        var found = $("#" + id);
        var newDiv;
        if (found != null) newDiv = found.append('<div class="' + className + '">' + text + '</div>');
        return newDiv;
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
    public LoadCanvasInParent(id: string, parent: any) {
        parent.append('<canvas id="' + id + '"></canvas>');
        var found = $("#" + id);
        return found;
    }

    public UnloadCanvas(id: string) {
        var found = $("#" + id);
        if (found != null) found.remove(); 
    }

    //=========
    //TEXTAREA
    //=========
    public FindTextArea(id: string) {
        var found = $("#" + id);
        return found;
    }

    public LoadTextAreaInParent(id: string, parent:any ) {
        parent.append('<textarea id="' + id + '" name="' + id + '" style="width: 100%; height:100%; " >this is a test</textarea>');
        var found = $("#" + id);
        return found;
    }



    //=========
    //HTML
    //=========
    public FindHTMLElement(id: string) {
        var found = $("#" + id);
        return found;
    }

    public FindHTMLElementInParent(id: string, parentId: string) {
        var found = $("#" + parentId + " #" + id);
        return found;
    }

    public FindHTMLElementInParentByClass(className: string, parentId: string) {
        var found = $("#" + parentId + " ." + className);
        return found;
    }

    public LoadHTMLElement(id: string, parent: any, html: string) {

        if (parent == null) {
            this.RootUI.append(html);
        } else {
            parent.append(html);
        }
        if (id != null) {
            var found = $("#" + id);
            return found;
        } 
    }

}

