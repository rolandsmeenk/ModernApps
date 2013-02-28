//CheckBrowserCompatibility <== found in application.appcontainer.js
function Bootstrap()
{
    var canvas = document.createElement('canvas');

    if (!canvas.getContext)
    {
        CheckBrowserCompatibility(1)
    }
    else
    {
        CheckBrowserCompatibility(0);
    }

}



$(document).ready(Bootstrap);