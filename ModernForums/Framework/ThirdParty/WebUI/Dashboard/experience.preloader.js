function Preloader() {
}

Preloader.SpinnersLoaded = 0;

Preloader.Init = function () {
    this.SpinnerLayer1 = this.OpenSpecial("/slices/loading-base-128.png");
    this.SpinnerLayer2 = this.OpenSpecial("/slices/loading-glow-128.png");

}

// missing-image substitute for quicker debugging
Preloader.ErrorImage = ""; // a datauri base64 encoded png here

Preloader.OpenSpecial = function (imgUrl) {
    var img = new Image();

    // custom functor for this image
    var functor = function (loadedEvent) { Preloader.OnImageLoaded(img, loadedEvent); };
    var errFunctor = function (errorEvent) { Preloader.OnImageError(img, errorEvent); }

    img.onload = functor;
    img.onerror = errFunctor;
    img.ReadyForRendering = false;
    img.IsSpinner = true;
    img.src = imgUrl;

    return img;
}

Preloader.Open = function (imgUrl) {
    var img = new Image();

    // custom functor for this image
    var functor = function (loadedEvent) { Preloader.OnImageLoaded(img, loadedEvent); };
    var errFunctor = function (errorEvent) { Preloader.OnImageError(img, errorEvent); }

    img.onload = functor;
    img.onerror = errFunctor;
    img.ReadyForRendering = false;

    if (bSimulateHighLatency) {
        setTimeout(function () {
            img.src = imgUrl;
        }, fSimulateLatencyAmount + Math.random() * fSimulateLatencyVariance);
    } else {
        img.src = imgUrl;
    }

    return img;
}

// attachable callback
Preloader.OnReady = null;

Preloader.OnImageLoaded = function (img, loadedEvent) {
    //Dbg.Print("Loaded image: " + img.src);
    Dbg.PreDraw(img);
    img.ReadyForRendering = true;

    if (img.IsSpinner)
        Preloader.SpinnersLoaded++;

    if (Preloader.SpinnersLoaded == 2 && img.IsSpinner) {
        if (Preloader.OnReady != null)
            Preloader.OnReady();
        else
            Dbg.Print("Preloader.OnReady IS NULL; Not firing spinners-ready callback!");
    }
}

Preloader.OnImageError = function (img, errorEvent) {
    Dbg.Print("Error loading image: " + img.src);
    //img.src = Preloader.ErrorImage;
    img.ReadyForRendering = true;
    img.ErrorLoading = true;
}
