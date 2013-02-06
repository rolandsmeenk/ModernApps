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
        this.Debugger.Log("FrameworkControl:Show");

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
        
    }

    public UpdateContent(content: any) {
        this.Debugger.Log("FrameworkControl:UpdateContent");
        this._rootDiv.html(content);
    }


    public UpdateLayout(rect: any) {
        this.Debugger.Log("FrameworkControl:UpdateLayout " + rect.x1 + " " + rect.y1 + " " + rect.x2 + " " + rect.y2);
        this._rootDiv.css("left", rect.x1).css("top", rect.y1).width(rect.x2 - rect.x1).height(rect.y2 - rect.y1);
    }


}

