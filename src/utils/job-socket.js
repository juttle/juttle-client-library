let EventEmitter = require('eventemitter3');

export default class JobSocket {
    constructor(url) {
        // setup event emitter
        this.emitter = new EventEmitter();

        // setup websocket
        this.socket = new WebSocket(url);

        this.socket.onopen = (event) => { emitter.emit('open') };
        this.socket.onclose = (event) => { emitter.emit('close') };
        this.socket.onmessage = this._onMessage.bind(this);
        this.socket.onerror = this._onError.bind(this);

        // expose emitter on event (so peeps can subscribe)
        this.on = emitter.on;
    }

    _onError(event) {
        this.emitter.emit('error', JSON.parse(event.data));
    }

    _onMessage(event) {
        let msg = JSON.parse(event);

        // manage pings so the rest of the app doesn't have to
        if (msg.type === 'ping') {
            this.send({
                type: 'pong'
            });

            return;
        }

        if (msg.hasOwnProperty('time')) {
            msg.time = new Date(msg.time);
        }

        if (msg.hasOwnProperty('points')) {
            msg.points.forEach(point => {
                if (point.hasOwnProperty('time')) {
                    point.time = new Date(point.time);
                }
            });
        }

        this.emitter.emit('message', msg);
    }

    close() {
        this.socket.close();
        this.socket = null;
    }

}
