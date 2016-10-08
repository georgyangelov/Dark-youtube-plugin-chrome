class Messenger {
    constructor(runtime) {
        this.runtime  = runtime;
        this.listener = () => {};
        this.ports    = [];

        this.runtime.onConnect.addListener((port) => this.handleConnect(port));
    }

    onMessage(listener) {
        this.listener = listener;
    }

    handleConnect(port) {
        if (port.name !== 'dark-youtube') {
            return;
        }

        this.ports.push(port);

        port.onMessage.addListener((request) => this.listener(request));
        port.onDisconnect.addListener(() => this.removePort(port));
    }

    removePort(port) {
        this.ports.splice(this.ports.indexOf(port), 1);
    }

    notify(message) {
        this.ports.forEach((port) => {
            try {
                port.postMessage(message);
            } catch(e) {
                console.error('Could not send message to port', e);
            }
        });
    }
}
