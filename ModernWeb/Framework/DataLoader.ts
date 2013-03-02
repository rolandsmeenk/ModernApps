/// <reference path="Debugger.ts"/>

declare var $;

class DataLoader {

    constructor(public Debugger: Debugger) {

    }

    //eg.  RetrieveData("GetForums", "POST", {id : 100}, "html");
    public RetrieveData(handler: string, type: string, data: any, dataType: string, callback: (result: any)=> any) {
        
        this.Debugger.Log("DataLoader:RetrieveData");

        var request = $.ajax({
            url: "/Handlers/" + handler + ".ashx",
            type: type,
            data: data,
            dataType: dataType
        });

        request.done(function (msg) {

            callback(msg);
            
        });

        request.fail(function (jqXHR, textStatus) {
            callback("Request failed: " + textStatus);
        });

    }


}

