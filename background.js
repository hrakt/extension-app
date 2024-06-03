chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes("admin.shopify.com/") ||  tab.url.includes("windsorstore.com")) {
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);
    // console.log(urlParameters.get("appLoadId") ,'this is the inside')
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      videoId: urlParameters.get("v"),
    });
  }
});

// Listen for messages from popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // console.log(message, 'background');

  if (message.type === "SAVE_DATA") {
    // Fetch existing data from storage
    chrome.storage.local.get("savedData", (data) => {
      let fetchedData = data.savedData || []; // Initialize with existing data or an empty array
      // Update fetched data with new data
      fetchedData.push(message.data);
      // Save updated data to storage
      chrome.storage.local.set({ savedData: fetchedData }, () => {
        // Send a response back to the popup script
        sendResponse({ type: "DATA_SAVED" });
      });
    });
    // Return true to indicate that sendResponse will be called asynchronously
    return true;
  } 
  if (message.type === "STORAGE_CLEARED") {
    // Fetch existing data from storage
    chrome.storage.local.clear(() => {
      // Notify the popup script that the storage has been cleared
      chrome.runtime.sendMessage({ type: "STORAGE_CLEARED_SUCCESS" });
    });
    // Return true to indicate that sendResponse will be called asynchronously
    return true;
  } 
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.savedData) {
    const newData = changes.savedData.newValue;
    // Send message to popup script
    chrome.runtime.sendMessage({ type: "STORAGE_CHANGED", newData });
  }
});
