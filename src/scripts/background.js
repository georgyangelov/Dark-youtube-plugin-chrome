class Controller {
    constructor(configStore) {
        this.config   = configStore;
        this.listener = () => {};

        this.accessibleMethods = ['notifyActiveStatus'];
    }

    callMethod(method, args, respond) {
        if (!this.accessibleMethods.includes(method)) {
            return respond({});
        }

        return respond(this[method](...args));
    }

    onUpdate(listener) {
        this.listener = listener;
        this.listener(this.config.get());
    }

    isActive() {
        return this.config.get().active;
    }

    updateActive(active) {
        this.config.set({active: active});
        this.listener(this.config.get());
    }

    toggleActive() {
        this.updateActive(!this.isActive());
    }
}

class ConfigStore {
    defaults() {
        return {
            active: true
        };
    }

    get() {
        var config = localStorage.getItem('youtube_skin');

        if (!config) {
            return this.defaults();
        }

        return JSON.parse(config);
    }

    set(config) {
        var current = this.get();

        Object.keys(config).forEach((key) => { current[key] = config[key]; });

        this.replace(config);
    }

    replace(config) {
        localStorage.setItem('youtube_skin', JSON.stringify(config));
    }
}

class Messager {
    constructor(runtime, tabs) {
        this.runtime  = runtime;
        this.tabs     = tabs;
        this.listener = () => {};

        this.runtime.onMessage.addListener((request, sender, respond) => {
            this.listener(request, respond);
        });
    }

    onMessage(listener) {
        this.listener = listener;
    }

    notify(message) {
        this.tabs.query({currentWindow: true}, (tabs) => {
            tabs.forEach((tab) => {
                this.tabs.sendMessage(tab.id, message, () => {});
            });
        });
    }
}

var configStore = new ConfigStore(),
    messager    = new Messager(chrome.runtime, chrome.tabs),
    controller  = new Controller(configStore, messager);

messager.onMessage((request, respond) => {
    controller.callMethod(request.method, request.arguments, respond);
});

chrome.browserAction.onClicked.addListener(() => controller.toggleActive());

controller.onUpdate((config) => {
    var icon = config.active ? 'images/black_youtube_19.png' : 'images/white_youtube_19.png';

    chrome.browserAction.setIcon({path: icon});

    messager.notify({active: controller.isActive()});
});
