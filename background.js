if (localStorage.activated == undefined)
{
	setIcon(true);
}

var portsByScriptId = {};

chrome.runtime.onConnect.addListener(function(port) {
    portsByScriptId[port.sender.id + port.name] = port;
});

function sendMessage(message)
{
        for (var contentScriptId in portsByScriptId)
        {
                var port = portsByScriptId[contentScriptId];
                try
                {
                        port.postMessage(message);
                }
                catch (e)
                {
                        delete portsByScriptId[contentScriptId];
                }
        }
}

function updateIcon()
{
	if (localStorage.activated != "false")
	{
		localStorage.activated = "false";
		chrome.browserAction.setIcon({path:"images/white_youtube_19.png"});
	}
	else
	{
		localStorage.activated = "true";
		chrome.browserAction.setIcon({path:"images/black_youtube_19.png"});
	}

	sendMessage(localStorage.activated);
}

function setIcon(dark)
{
	if (!dark)
	{
		localStorage.activated = "false";
		chrome.browserAction.setIcon({path:"images/white_youtube_19.png"});
	}
	else
	{
		localStorage.activated = "true";
		chrome.browserAction.setIcon({path:"images/black_youtube_19.png"});
	}
	sendMessage(localStorage.activated);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "isActivated")
      sendResponse({status: localStorage.activated});
    else
      sendResponse({});
});

if (localStorage.activated != "false")
{
	chrome.browserAction.setIcon({path:"images/black_youtube_19.png"});
}
else
{
	chrome.browserAction.setIcon({path:"images/white_youtube_19.png"});
}

chrome.browserAction.onClicked.addListener(updateIcon);