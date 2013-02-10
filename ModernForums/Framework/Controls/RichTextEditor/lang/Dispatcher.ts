/// <reference path="..\..\..\UIRenderer.ts"/>
/// <reference path="..\..\..\Debugger.ts"/>

/// <reference path="..\wysihtml5.ts"/>

declare var $;

class Dispatcher  {
    public wysihtml5: wysi;
    public events: any;

    constructor(wysihtml5: wysi) {
        
        this.wysihtml5 = wysihtml5;
        this.wysihtml5.Debugger.Log("Dispatcher:constructor");

    }


    public observe(eventName, handler) {
        this.wysihtml5.Debugger.Log("Dispatcher:observe");
        this.events = this.events || {};
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(handler);
        return this;
    }

    public on(eventName, handler) {
        this.wysihtml5.Debugger.Log("Dispatcher:on");
        return this.observe.apply(this, this.wysihtml5.lang.array(arguments).get());
    }

    public fire(eventName, payload) {
        this.wysihtml5.Debugger.Log("Dispatcher:fire");
        this.events = this.events || {};
        var handlers = this.events[eventName] || [],
            i = 0;
        for (; i < handlers.length; i++) {
            handlers[i].call(this, payload);
        }
        return this;
    }

    public stopObserving(eventName, handler) {
        this.wysihtml5.Debugger.Log("Dispatcher:stopObserving");
        this.events = this.events || {};
        var i = 0,
            handlers,
            newHandlers;
        if (eventName) {
            handlers = this.events[eventName] || [],
            newHandlers = [];
            for (; i < handlers.length; i++) {
                if (handlers[i] !== handler && handler) {
                    newHandlers.push(handlers[i]);
                }
            }
            this.events[eventName] = newHandlers;
        } else {
            // Clean up all events
            this.events = {};
        }
        return this;
    }
}



