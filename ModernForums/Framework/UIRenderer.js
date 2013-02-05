var UIRenderer = (function () {
    function UIRenderer(RootUI, HeadUI) {
        this.RootUI = RootUI;
        this.HeadUI = HeadUI;
    }
    UIRenderer.prototype.LoadCSS = function (css) {
        this.HeadUI.append($('<link rel="stylesheet" type="text/css" />').attr('href', '/Themes/' + css + ".css"));
    };
    UIRenderer.prototype.FindDiv = function (id) {
        var found = $("#" + id);
        return found;
    };
    UIRenderer.prototype.LoadDiv = function (id) {
        this.RootUI.append('<div id="' + id + '"></div>');
        var found = $("#" + id);
        return found;
    };
    UIRenderer.prototype.LoadDivInParent = function (id, parentid) {
        var found = $("#" + parentid);
        if(found != null) {
            found.append('<div id="' + id + '"></div>');
        }
        found = $("#" + id);
        return found;
    };
    UIRenderer.prototype.UnloadDiv = function (id) {
        var found = $("#" + id);
        if(found != null) {
            found.remove();
        }
    };
    UIRenderer.prototype.AppendToDiv = function (id, text, className) {
        var found = $("#" + id);
        if(found != null) {
            found.append('<div class="' + className + '">' + text + '</div>');
        }
    };
    UIRenderer.prototype.FillDivContent = function (id, message) {
        var found = $("#" + id);
        if(found != null) {
            found.html(message);
        }
    };
    UIRenderer.prototype.ShowDiv = function (id) {
        var found = $("#" + id);
        if(found != null) {
            found.css("display", "");
        }
    };
    UIRenderer.prototype.AnimateDiv = function (id, animateProperties, duration) {
        var found = $("#" + id);
        if(found != null) {
            found.animate(animateProperties, duration);
        }
    };
    UIRenderer.prototype.HideDiv = function (id) {
        var found = $("#" + id);
        if(found != null) {
            found.css("display", "none");
        }
    };
    UIRenderer.prototype.RemoveFirstChild = function (id) {
        $("#" + id + " ").children(":first").remove();
    };
    UIRenderer.prototype.LoadCanvas = function (id) {
        this.RootUI.append('<canvas id="' + id + '"></canvas>');
    };
    UIRenderer.prototype.UnloadCanvas = function (id) {
        var found = $("#" + id);
        if(found != null) {
            found.remove();
        }
    };
    return UIRenderer;
})();
