class Controller {
    constructor(configStore) {
        this.config   = configStore;
        this.listener = () => {};

        this.accessibleMethods = {
            notifyActiveStatus: () => this.listener(this.config.get())
        };
    }

    callMethod(method, args) {
        if (!this.accessibleMethods[method]) {
            return;
        }

        return this.accessibleMethods[method](...args);
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
