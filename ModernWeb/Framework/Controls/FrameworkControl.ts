/// <reference path="..\UIRenderer.ts"/>
/// <reference path="..\Debugger.ts"/>

declare var $;

class FrameworkControl {
    public _rootDiv;
    public _parentObject: any;
    public _parentClickCallback: any;
    public _eventData: any;

    
    constructor(public UIRenderer: UIRenderer, public Debugger: Debugger, public UniqueID: string, public ParentUniqueID: string) {

        if (this.ParentUniqueID!=null)
            this._rootDiv = this.UIRenderer.LoadDivInParent(this.UniqueID, this.ParentUniqueID);
        else 
            this._rootDiv = this.UIRenderer.LoadDiv(this.UniqueID);

    }

    public InitCallbacks(parentObject: any, parentClickCallback: any, eventData: any) {
        this.Debugger.Log("FrameworkControl:InitCallbacks");

        this._parentObject = parentObject;
        this._parentClickCallback = parentClickCallback;
        this._eventData = eventData;

    }

      
    public Show(parentObject: any, parentClickCallback: any, eventData: any) {
        this.Debugger.Log("FrameworkControl:Show - " + this.UniqueID);

        this.InitCallbacks(parentObject, parentClickCallback, eventData);

        this.UIRenderer.ShowDiv(this.UniqueID);
        if(this.ParentUniqueID!=null)
            this._rootDiv.off('click').on('click', this, () => { this._parentObject.data = this._eventData; this._parentClickCallback(this._parentObject); });
        else
            this._rootDiv.off('click').on('click', this._parentObject, this._parentClickCallback);
        
    }

    public Hide() {
        this.Debugger.Log("FrameworkControl:Hide");
        this.UIRenderer.HideDiv(this.UniqueID);
        this._rootDiv.off('click');
        
    }


    public Unload() {
        this.Debugger.Log("FrameworkControl:Unload");
        this._rootDiv.off('click');
        this._rootDiv.remove();
    }

    public UpdateContent(content: any) {
        this.Debugger.Log("FrameworkControl:UpdateContent");
        this._rootDiv.html(content);
    }



    public TemporaryNotification(message: string, styleClass: string) {
        var loadingDiv = this.UIRenderer.LoadDivInParent(this.UniqueID + "_TemporaryNotification", this.UniqueID);  //message, this.UniqueID + "_" + styleClass);
        loadingDiv.html(message);
        loadingDiv.addClass(styleClass);
    }

    public ClearTemporaryNotification() {
        this.UIRenderer.UnloadDiv(this.UniqueID + "_TemporaryNotification");
    }


    public Translate(x: number, y: number) {
        this.Debugger.Log("FrameworkControl:Translate x=" + x + " y=" + y);
        if (this._rootDiv!=null)
            this._rootDiv
                .css("left", parseFloat(this._rootDiv.css("left")) + x)
                .css("top", parseFloat(this._rootDiv.css("top")) + y);
    }
}

