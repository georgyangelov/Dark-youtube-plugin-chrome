if (localStorage.activated == undefined)
{
	setIcon(true);
}

var portsByTabId = {};

chrome.extension.onConnect.addListener(function(port) {
	if (!portsByTabId[port.sender.id])
		portsByTabId[port.sender.id] = new Array();
	portsByTabId[port.sender.id].push(port);	
});

function sendMessage(message)
{
	for (var tabid in portsByTabId)
	{
		var ports = portsByTabId[tabid];
		for (var i = 0; i < ports.length; i++) 
		{
			try
			{
				ports[i].postMessage(message);
			}
			catch (e)
			{
				/* Assume that if one port from a tab is missing, the rest are missing too. */
				delete portsByTabId[tabid];
			}
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

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
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