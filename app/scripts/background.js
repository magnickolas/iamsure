chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "closeActiveTab") {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var activeTab = tabs[0]
                if (activeTab) {
                    chrome.tabs.remove(activeTab.id)
                }
            })
        }
    }
)

chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
    if(details.frameId === 0) {
        chrome.tabs.get(details.tabId, function(tab) {
            if(tab.url === details.url) {
                chrome.tabs.sendMessage(details.tabId, {action: "showPopup"})
            }
        })
    }
})