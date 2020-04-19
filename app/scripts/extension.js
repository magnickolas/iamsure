var addedConfirmDialogInTab = false

function showConfirmDialog() {
  if (!addedConfirmDialogInTab) {
    addedConfirmDialogInTab = true
  
    function sendCloseRequest() {
      window.postMessage({ action: "closeActiveTab" }, "*")
    }
    
    function removePopup(head_element, body_element) {
      document.head.removeChild(head_element)
      document.body.removeChild(body_element)
      addedConfirmDialogInTab = false
    }

    var styles = document.createElement('link')
    styles.rel = "stylesheet"
    styles.href = chrome.runtime.getURL("styles/confirm.css")
    document.head.appendChild(styles)

    var outer_div_element = document.createElement('div')
    outer_div_element.className = "modal-outer"

    var div_element = document.createElement('div')
    div_element.className = "modal"

    var div_p_element = document.createElement('div')
    div_p_element.className = "text"
    div_p_element.textContent = "Are you sure this page won't distract you?"

    var div_buttons = document.createElement('div')
    div_buttons.className = "buttons"

    var div_reject_button = document.createElement('button')
    div_reject_button.className = "reject-button"
    div_reject_button.textContent = "No"
    div_reject_button.addEventListener('click', function() {
      sendCloseRequest()
    })

    var div_accept_button = document.createElement('button')
    div_accept_button.className = "accept-button"
    div_accept_button.textContent = "I am sure"
    div_accept_button.addEventListener('click', function() {
      removePopup(styles, outer_div_element)
    })


    div_buttons.appendChild(div_reject_button)
    div_buttons.appendChild(div_accept_button)
    
    div_element.appendChild(div_p_element)
    div_element.appendChild(div_buttons)

    outer_div_element.appendChild(div_element)

    document.body.appendChild(outer_div_element)

    window.addEventListener("message", function(event) {
      if (event.source != window)
        return

      if (event.data.action && (event.data.action == "closeActiveTab")) {        
        chrome.runtime.sendMessage(event.data)
      }
    }, false)

    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if (request.action === 'removePopup') {
          removePopup(styles, outer_div_element)
        }
    })
  }
}

function verifyCurrentUrl() {
  chrome.storage.sync.get("filters", function(filtersText) {
    if (!chrome.runtime.error) {
      var filters =
        filtersText.filters
          .split("\n")
          .map(glob => globToFilter(glob))
      var url = location.href
      
      var matches = false

      for (const filter of filters) {
        var pattern = filter.pattern
        var isBlackList = filter.blacklist
        if (url.match(pattern)) {
          if (!isBlackList) {
            matches = true
          } else {
            matches = false
          }
        }
      }

      if (matches) {
        showConfirmDialog()
      }
    }
  })
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === 'showPopup') {
      verifyCurrentUrl()
    }
})

verifyCurrentUrl()

function globToFilter(glob) {
  var regexp = ""
  var isBlackList = false

  if (glob.charAt(0) == '-') {
    isBlackList = true
    glob = glob.substr(1)
  }

  for (const c of glob) {
    switch (c) {
    case ",":
    case "!":
    case ".":
    case "(":
    case ")":
    case "/":
    case "^":
    case "+":
    case "=":
    case "|":
    case "$":
      regexp += `\\${c}`
      break
    case "*":
      regexp += ".*"
      break
    default:
      regexp += c
    }
  }

  return {
    "pattern": new RegExp(`^${regexp}$`),
    "blacklist": isBlackList
  }
}
