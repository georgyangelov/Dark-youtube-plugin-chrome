class StyleSwitcher {
    constructor(fileUrl) {
        this.head = document.getElementsByTagName('head')[0];
        this.link = document.createElement('link');

        this.link.id    = 'dark-youtube-styles';
        this.link.rel   = 'stylesheet';
        this.link.type  = 'text/css';
        this.link.href  = fileUrl;
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
}

const styleURL      = chrome.extension.getURL('styles.css'),
      styleSwitcher = new StyleSwitcher(styleURL),
      port          = chrome.runtime.connect({name: 'dark-youtube'});

port.onMessage.addListener((status) => {
    if (typeof status.active !== 'undefined') {
        styleSwitcher.switch(status.active);
    }
});

port.postMessage({method: 'notifyActiveStatus', args: {}});
