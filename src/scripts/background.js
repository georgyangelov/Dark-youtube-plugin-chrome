var configStore = new ConfigStore(),
    messenger   = new Messenger(chrome.runtime),
    controller  = new Controller(configStore, messenger);

messenger.onMessage((request) => {
    controller.callMethod(request.method, request.arguments || {});
});

chrome.browserAction.onClicked.addListener(() => controller.toggleActive());

controller.onUpdate((config) => {
    var icon = config.active ? 'images/black_youtube_19.png' : 'images/white_youtube_19.png';

    chrome.browserAction.setIcon({path: icon});

    messenger.notify({active: controller.isActive()});
});
