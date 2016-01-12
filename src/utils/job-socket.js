let EventEmitter = require("eventemitter3");

export default class JobSocket extends EventEmitter {
    constructor(url) {
        // instantiate super EventEmitter
        super();

        // setup websocket
        this._socket = new WebSocket(url);

        this._socket.onopen = (event) => { this.emit("open"); };
        this._socket.onclose = (event) => { this.emit("close"); };
        this._socket.onmessage = this._onMessage.bind(this);
        this._socket.onerror = this._onError.bind(this);
    }

    _onError(event) {
        this.emit("error", JSON.parse(event.data));
    }

    _onMessage(event) {
        let msg = JSON.parse(event.data);

        // manage pings so the rest of the app doesn't have to
        if (msg.type === "ping") {
            this._socket.send({
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

        this.emit("message", msg);
    }

    close() {
        this._socket.close();
        this._socket = null;
    }

}
