import EventEmitter from 'eventemitter3';

export default class EventTarget {
    constructor() {
        this._emitter = new EventEmitter();
    }

    on(event, fn, context) {
        this._emitter.on(event, fn, context);
    }

    once(event, fn, context) {
        this._emitter.once(event, fn, context);
    }

    removeListener(event, fn, context, once) {
        this._emitter.removeListener(event, fn, context, once);
    }

    removeAllListeners(event) {
        this._emitter.removeAllListeners(event);
    }
}
