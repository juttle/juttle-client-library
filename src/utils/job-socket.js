import EventEmitter from "eventemitter3";

export default class JobSocket {
    constructor(url) {
        // setup eventemitter
        this._emitter = new EventEmitter();

        // setup websocket
        this._socket = new WebSocket(url);

        this._socket.onopen = (event) => { this._emitter.emit("open"); };
        this._socket.onclose = (event) => { this._emitter.emit("close"); };
        this._socket.onmessage = this._onMessage.bind(this);
        this._socket.onerror = this._onError.bind(this);
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

    send(msg) {
        this._socket.send(JSON.stringify(msg));
    }

    _onError(event) {
        this._emitter.emit("error", JSON.parse(event.data));
    }

    _onMessage(event) {
        let msg = JSON.parse(event.data);

        // manage pings so the rest of the app doesn't have to
        if (msg.type === "ping") {
            this.send({
                type: "pong"
            });

            return;
        }

        if (msg.hasOwnProperty("time")) {
            msg.time = new Date(msg.time);
        }

        if (msg.hasOwnProperty("points")) {
            msg.points.forEach(point => {
                if (point.hasOwnProperty("time")) {
                    point.time = new Date(point.time);
                }
            });
        }

        if (msg.hasOwnProperty("sinks")) {
            msg.sinks.forEach((sink) => {
                sink.options._jut_time_bounds.forEach((timeBound) => {
                    if (timeBound.from) {
                        timeBound.from = new Date(timeBound.from);
                    }

                    if (timeBound.to) {
                        timeBound.to = new Date(timeBound.to);
                    }
                });
            });
        }

        this._emitter.emit("message", msg);
    }

    close() {
        let self = this;

        // use es6 Promise for now, but we might want to use Bluebird instead
        // problem is, there's no good way to override Promise in whatwg-fetch
        return new Promise((resolve, reject) => {
            self._socket.onclose = resolve;
            self._socket.close();
        });
    }

}
