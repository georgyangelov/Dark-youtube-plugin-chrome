var active = false;
var head, link;

function activate()
{
	head  = document.getElementsByTagName('head')[0];
    link = document.createElement('link');
    link.id   = "darkstyle_css";
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.extension.getURL('dark.css');
    link.media = 'all';
    head.appendChild(link);

    active = true;
}

chrome.runtime.sendMessage({method: "isActivated"}, function(response) {
  if (response.status == "true")
  {
	  	activate();
  }
});

var myPort = chrome.runtime.connect({name: "main"});

myPort.onMessage.addListener(function(data) {
    if ( data == "true" )
    {
        if (!active)
        {
        	activate();
        }
    }
    else
    {
    	if (active)
    	{
        	head.removeChild(link);

        	active = false;
    	}
   	}
});