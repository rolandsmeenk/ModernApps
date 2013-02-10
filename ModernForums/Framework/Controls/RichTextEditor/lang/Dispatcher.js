var Dispatcher = (function () {
    function Dispatcher(wysihtml5) {
        alert("200");
        this.wysihtml5 = wysihtml5;
    }
    Dispatcher.prototype.observe = function (eventName, handler) {
        this.events = this.events || {
        };
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(handler);
        return this;
    };
    Dispatcher.prototype.on = function (eventName, handler) {
        return this.observe.apply(this, this.wysihtml5.lang.array(arguments).get());
    };
    Dispatcher.prototype.fire = function (eventName, payload) {
        this.events = this.events || {
        };
        var handlers = this.events[eventName] || [], i = 0;
        for(; i < handlers.length; i++) {
            handlers[i].call(this, payload);
        }
        return this;
    };
    Dispatcher.prototype.stopObserving = function (eventName, handler) {
        this.events = this.events || {
        };
        var i = 0, handlers, newHandlers;
        if(eventName) {
            handlers = this.events[eventName] || [] , newHandlers = [];
            for(; i < handlers.length; i++) {
                if(handlers[i] !== handler && handler) {
                    newHandlers.push(handlers[i]);
                }
            }
            this.events[eventName] = newHandlers;
        } else {
            this.events = {
            };
        }
        return this;
    };
    return Dispatcher;
})();
