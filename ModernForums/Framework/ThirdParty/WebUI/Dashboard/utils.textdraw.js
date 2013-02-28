function TextDraw() {
}

TextDraw.Init = function () {
    TextDraw.SystemVoiceIndicator = Preloader.Open("/slices/system_voice_indicator.png");
}

TextDraw.Batch = [];

function GetBoundingBox(lines) {
    // compute optimal bounding box
    var maxWidth = 0;
    var maxHeight = 0;

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var size = Dbg.Surface.measureText(line); // get width
        size.height = 19; // presume line-height

        maxHeight += size.height;
        maxWidth = Math.max(maxWidth, size.width);
    }

    return { "maxWidth": maxWidth, "maxHeight": maxHeight };
}

TextDraw.RetainedDraw = function () {
    Dbg.Surface.font = "11pt Comic Sans MS";
    Dbg.Surface.textBaseline = "top";
    Dbg.Surface.textAlign = "left";
    Dbg.Surface.globalAlpha = 1;

    var dialogs = TextDraw.Batch;

    // crunch data
    for (var d = 0; d < dialogs.length; d++) {
        var dialog = dialogs[d];

        var lines = dialog.str.split("\n");

        var size = GetBoundingBox(lines);

        var x = dialog.x;
        var y = dialog.y;
        var lineHeight = 19;
        var yOffset = y;
        var paddingX = 10;
        var paddingY = 9;

        var systemIconAlignment = 30;

        dialog.rect = [
			x - paddingX - systemIconAlignment,
			y - paddingY,
			size.maxWidth + paddingX * 2 + systemIconAlignment * 1.5,
			size.maxHeight + paddingY * 2
		];

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            dialog.lines.push({ "str": line, "x": x, "y": yOffset });
            yOffset += lineHeight;
        }
    }

    // render containers
    Dbg.Surface.fillStyle = "rgba(0,0,0,0.8)";
    for (var d = 0; d < dialogs.length; d++) {
        var dialog = dialogs[d];

        if (dialog.isBubble) {
        }
        else {
            Dbg.Surface.globalAlpha = dialog.opacity;
            Dbg.Surface.fillRect(dialog.rect[0], dialog.rect[1], dialog.rect[2], dialog.rect[3]);
            Dbg.Surface.drawImage(TextDraw.SystemVoiceIndicator, dialog.rect[0] - 35, dialog.rect[1] - 30, 79, 91);
        }
    }

    // render text
    for (var d = 0; d < dialogs.length; d++) {
        var dialog = dialogs[d];
        var lines = dialog.lines;
        Dbg.Surface.globalAlpha = dialog.opacity;

        if (dialog.isBubble) {
            Dbg.Surface.font = "10pt Comic Sans MS";
            Dbg.Surface.textAlign = "center";
        }
        else {
            Dbg.Surface.font = "11pt Comic Sans MS";
            Dbg.Surface.textAlign = "left";
        }

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            Dbg.Surface.fillStyle = "#000";
            Dbg.Surface.fillText(line.str, line.x + 1, line.y + 1);

            if (!dialog.isBubble) {
                Dbg.Surface.fillStyle = "#fff";
                Dbg.Surface.fillText(line.str, line.x, line.y);
            }
        }
    }

    TextDraw.Batch.length = 0;
}

TextDraw.DrawString = function (str, x, y, opacity) {
    var batch = {
        "x": x, "y": y,
        "lines": [],
        "opacity": opacity,
        "str": str,
        "isBubble": false
    };

    TextDraw.Batch.push(batch);
}

TextDraw.DrawBubble = function (str, x, y, opacity) {
    var batch = {
        "x": x, "y": y,
        "lines": [],
        "opacity": opacity,
        "str": str,
        "isBubble": true
    };

    TextDraw.Batch.push(batch);
}

TextDraw.DrawBubbleNow = function (str, x, y, opacity) {
    TextDraw.DrawNow(str, x, y, opacity, 1);
}

TextDraw.DrawNarationNow = function (str, x, y, opacity) {
    TextDraw.DrawNow(str, x, y, opacity, 0);
}

TextDraw.DrawText = function (str, x, y, fontSettings, lineHeight, fontColor, textAlign) {
    // TradeGothicLTComBold2
    var processLines = [];
    var lines = str.split("\n");

    // naration
    Dbg.Surface.font = fontSettings;
    Dbg.Surface.textBaseline = "top";
    Dbg.Surface.textAlign = textAlign;

    var size = GetBoundingBox(lines);

    var yOffset = y;
    var paddingX = 10;
    var paddingY = 9;

    width = size.maxWidth + paddingX * 2;

    var rect = [
		x, y, width, size.maxHeight + paddingY * 2
	];

    x += (width - size.maxWidth) / 2;
    yOffset += paddingY;

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        processLines.push({ "str": line, "x": x, "y": yOffset });
        yOffset += lineHeight;
    }

    Dbg.Surface.globalAlpha = 1;
    Dbg.Surface.fillStyle = fontColor;

    for (var i = 0; i < processLines.length; i++) {
        var line = processLines[i];


        Dbg.Surface.fillText(line.str, line.x, line.y);
    }
}

TextDraw.CreateSimpleNaration = function (str, x, y, opacity, width) {
}

TextDraw.DrawSimpleNarationNow = function (str, x, y, opacity, width) {
    var processLines = [];
    var lines = str.toUpperCase().split("\n");

    // naration
    Dbg.Surface.font = "11pt Comic Sans MS";
    Dbg.Surface.textBaseline = "top";
    Dbg.Surface.textAlign = "left";

    var size = GetBoundingBox(lines);

    var lineHeight = 20;
    var yOffset = y;
    var paddingX = 10;
    var paddingY = 9;

    if (!width)
        width = size.maxWidth + paddingX * 2;

    var rect = [
		x, y, width, size.maxHeight + paddingY * 2
	];

    x += (width - size.maxWidth) / 2;
    yOffset += paddingY;

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        processLines.push({ "str": line, "x": x, "y": yOffset });
        yOffset += lineHeight;
    }

    Dbg.Surface.globalAlpha = opacity;
    Dbg.Surface.fillStyle = "rgba(0,0,0,0.8)";
    Dbg.Surface.fillRect(rect[0], rect[1], rect[2], rect[3]);

    Dbg.Surface.fillStyle = "#fff";

    for (var i = 0; i < processLines.length; i++) {
        var line = processLines[i];


        Dbg.Surface.fillText(line.str, line.x, line.y);
    }
}

TextDraw.DrawNow = function (str, x, y, opacity, isBubble, requestedWidth) {
    // have to be this explicit with firefox, undefined -> zeroes
    if (!opacity)
        opacity = 0;
    if (!isBubble)
        isBubble = 0;
    if (!requestedWidth)
        requestedWidth = 0;

    Dbg.Surface.textBaseline = "top";

    var processLines = [];
    var lines = str.toUpperCase().split("\n");

    if (isBubble == 1) {	// character speech
        Dbg.Surface.font = "10pt Comic Sans MS";
        Dbg.Surface.textAlign = "center";
    }
    else {	// naration
        Dbg.Surface.font = "11pt Comic Sans MS";
        Dbg.Surface.textAlign = "left";
    }

    var size = GetBoundingBox(lines);

    var lineHeight = 19;
    var yOffset = y;
    var paddingX = 10;
    var paddingY = 9;

    var systemIconAlignment = 30;

    if (isBubble == -1) {
        systemIconAlignment = 0;
        paddingX += 2;
        if (requestedWidth > size.maxWidth) {
            paddingX = (requestedWidth - size.maxWidth) / 2;
        }
    }

    var rect = [
		x - paddingX - systemIconAlignment,
		y - paddingY,
		size.maxWidth + paddingX * 2 + systemIconAlignment * 1.5,
		size.maxHeight + paddingY * 2
	];

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        processLines.push({ "str": line, "x": x, "y": yOffset });
        yOffset += lineHeight;
    }

    if (isBubble == -1) {
        x += paddingX;
        rect[0] = x;
    }

    Dbg.Surface.globalAlpha = opacity;

    if (isBubble == 1) {	// character speech
    }

    if (isBubble != 1) {	// naration
        Dbg.Surface.fillStyle = "rgba(0,0,0,0.8)";
        Dbg.Surface.fillRect(rect[0], rect[1], rect[2], rect[3]);

        if (isBubble != -1)
            Dbg.Surface.drawImage(TextDraw.SystemVoiceIndicator, rect[0] - 35, rect[1] - 30, 79, 91);
    }

    for (var i = 0; i < processLines.length; i++) {
        var line = processLines[i];

        Dbg.Surface.fillStyle = "#000";
        Dbg.Surface.fillText(line.str, line.x + 1, line.y + 1);

        if (isBubble != 1) {
            Dbg.Surface.fillStyle = "#fff";
            Dbg.Surface.fillText(line.str, line.x, line.y);
        }
    }
}