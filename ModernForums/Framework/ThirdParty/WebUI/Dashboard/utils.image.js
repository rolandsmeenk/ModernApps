function OpenImage(imgUrl)
{
    var img = new Image();
    img.src = imgUrl;
    return img;
}

var bSimulateHighLatency = false;
var fSimulateLatencyAmount = 300; // in msec, base latency
var fSimulateLatencyVariance = 500; // in msec, random variance

function OpenImageWithCallback(imgUrl, loadedCallback)
{
    var img = new Image();
    var functor = function () { loadedCallback(img); }
    img.onload = functor;
    img.ReadyForRendering = false;

    if (bSimulateHighLatency)
    {
        setTimeout(function ()
        {
            img.src = imgUrl;
        }, fSimulateLatencyAmount + Math.random() * fSimulateLatencyVariance);
    } else
    {
        img.src = imgUrl;
    }

    return img;
}