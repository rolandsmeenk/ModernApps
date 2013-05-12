var AnimationEngine = (function () {
    function AnimationEngine(experience) {
        this.AnimControl = null;
        this.AnimatorsIndex = -1;
        this.interval_id = null;
        this._experience = experience;
    }
    AnimationEngine.prototype.Run = function () {
        this.Stop();
        this.interval_id = setInterval(function () {
            if (_bootup.Storyboards == null) {
                return;
            }
            var i;
            for(i = 0; i < _bootup.Storyboards.length; i++) {
                var ctl = _bootup.Storyboards[i].Control;
                if (ctl.ParentPage.IsPageVisibleInCurrentViewport()) {
                    ctl.StoryboardOnLoad.NextFrame();
                }
            }
        }, 20);
    };
    AnimationEngine.prototype.Stop = function () {
        if (this.interval_id) {
            clearInterval(this.interval_id);
        }
    };
    return AnimationEngine;
})();
