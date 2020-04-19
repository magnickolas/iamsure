'use strict'

let filters = document.getElementById("filter-input")
let button = document.getElementById("filters-save-button")

chrome.storage.sync.get("filters", function(filtersText) {
  if (!chrome.runtime.error) {
    if (filtersText.filters) {
      filters.value = filtersText.filters
    }
  }
})

button.addEventListener("click", () => {
  chrome.storage.sync.set({
    "filters": filters.value
  }, function() {
    console.log(filters.value)
  })
})
