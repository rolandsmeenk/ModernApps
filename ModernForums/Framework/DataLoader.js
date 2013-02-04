var DataLoader = (function () {
    function DataLoader(Debugger) {
        this.Debugger = Debugger;
    }
    DataLoader.prototype.RetrieveData = function (handler, type, data, dataType, callback) {
        this.Debugger.Log("DataLoader:RetrieveData");
        var request = $.ajax({
            url: "Handlers/" + handler + ".ashx",
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
    };
    return DataLoader;
})();
