class StyleSwitcher {
    constructor() {
        this.head = document.getElementsByTagName('head')[0];
        this.link = document.createElement('link');

        this.link.id    = 'dark-youtube-styles';
        this.link.rel   = 'stylesheet';
        this.link.type  = 'text/css';
        this.link.href  = this.styleURL();
        this.link.media = 'screen';

        this.active = false;
    }

    activate() {
        if (this.active) {
            return;
        }

        this.active = true;
        this.head.appendChild(this.link);
    }

    deactivate() {
        if (!this.active) {
            return;
        }

        this.active = false;
        this.head.removeChild(this.link);
    }

    switch(active) {
        if (active) {
            this.activate();
        } else {
            this.deactivate();
        }
    }

    styleURL() {
        if (document.querySelector('ytd-app')) {
            return chrome.extension.getURL('styles.css');
        } else {
            return chrome.extension.getURL('legacy_styles.css');
        }
    }
}

const port = chrome.runtime.connect({name: 'dark-youtube'});

const interval = setInterval(() => {
    if (document.querySelector('body > *')) {
        const styleSwitcher = new StyleSwitcher();

        port.onMessage.addListener((status) => {
            if (typeof status.active !== 'undefined') {
                styleSwitcher.switch(status.active);
            }
        });

        port.postMessage({method: 'notifyActiveStatus', args: {}});
        clearInterval(interval);
    }
}, 30);
