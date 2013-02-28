function Dbg() { }

// static public method
Dbg.Print = function (str)
{
    try
    {
        if (window.console && console.log)
        {
            console.log(str);
        }
    }
    catch (err)
    {
        alert("error: " + err);
    }
}

Dbg.Surface = null; // must be defined by the application container

Dbg.LogList = [];

// takes number or string, returns padded string
function pad(str, count) {
    str = "" + str; // to string
    if (str.length < count) str = "0" + str; // grow string
    return str;
}

Dbg.Log = function (str) {
    var now = new Date();
    var timeStr = pad(now.getHours(), 2) + ":" + pad(now.getMinutes(), 2) + ":" + pad(now.getSeconds(), 2) + "." + pad(now.getMilliseconds(), 3);

    Dbg.LogList.push(timeStr + " " + str);

    while (Dbg.LogList.length > 8)
        Dbg.LogList.shift();
}

Dbg.DrawLog = function (x, y) {
    if (!Dbg.Surface)
        return;

    Dbg.Surface.font = "8pt DebugFont";
    Dbg.Surface.textBaseline = "top";
    Dbg.Surface.textAlign = "left";

    for (var i = 0; i < Dbg.LogList.length; i++) {
        var str = Dbg.LogList[i];
        Dbg.Surface.fillStyle = "#000";
        Dbg.Surface.fillText(str, x, y + 1);

        Dbg.Surface.fillStyle = "#fff";
        Dbg.Surface.fillText(str, x, y);

        y += 13;
    }
}

Dbg.PreDraw = function (img) {
    if (!Dbg.Surface)
        return;

    Dbg.Surface.drawImage(img, -100, 0, 100, 100);
}

Dbg.DrawString = function (str, x, y) {
    if (!Dbg.Surface)
        return;

    Dbg.Surface.font = "10pt DebugFont";
    Dbg.Surface.textBaseline = "top";
    Dbg.Surface.textAlign = "left";

    //Dbg.Surface.fillStyle = "#000";
    //Dbg.Surface.fillText(str, x + 1, y + 1);

    //Dbg.Surface.fillStyle = "#fff";
    Dbg.Surface.fillStyle = "#f00";
    Dbg.Surface.fillText(str, x, y);
}
