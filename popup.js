import { getActiveTabURL } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  // console.log(activeTab, 'activetab in the popup')

  if (activeTab.url.includes("admin.shopify.com") || activeTab.url.includes("windsorstore.com") ) {
    // You can add code here to interact with the Shopify page
    // For example, adding an input field for saving data
    const container = document.getElementsByClassName("bookmarks")[0];
    container.innerHTML = `
      <div class="title">Enter your data:</div>
      <input type="text" id="dataInput">
      <button id="saveButton">Save</button>
      <div id="savedData"></div>
    `;

    chrome.storage.local.get("savedData", (data) => {
      // Log the fetched data
      // console.log('Fetched data from Chrome storage:', data.savedData);

      // Display saved data in the popup
      const savedDataContainer = document.getElementById("savedData");
      data.savedData.map((newData) => {
        let link = '';
        const url = new URL(window.location.href);
        link = `windsorstore.com?preview_theme_id=${newData}`;
        console.log(url, link)
        savedDataContainer.innerHTML += `<div>Saved Data: ${newData} <a href="${link}" class="previewLink">Preview</a></div>`;
      })
    });

    // Add event listener to the save button
    const saveButton = document.getElementById("saveButton");
    saveButton.addEventListener("click", async () => {
      const dataInput = document.getElementById("dataInput").value;
      // You can now use the dataInput variable to save the input data
      console.log("Data input:", dataInput);
      // Example: send a message to background script to save the data
      chrome.runtime.sendMessage({ type: "SAVE_DATA", data: dataInput });
      container.querySelector('#dataInput').value = "";
    });


    const clearButton = document.getElementById("clearButton");
    clearButton.addEventListener("click", async () => {
      // Clear the Chrome storage
      container.querySelector('#dataInput').value = "";
      chrome.storage.local.clear(() => {
        // Send a message to the background script indicating that the storage has been cleared
        chrome.runtime.sendMessage({ type: "STORAGE_CLEARED" });
      });
    });



    // Request saved data from background script when popup is loaded
    chrome.runtime.sendMessage({ type: "GET_SAVED_DATA" });
  } else {
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML = '<div class="title">This is not a Shopify admin page.</div>';
  }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // console.log('message', message);
  if (message.type === "STORAGE_CHANGED") {
    const savedDataContainer = document.getElementById("savedData");
    // Retrieve saved data from the message
    savedDataContainer.innerHTML = ''
    chrome.storage.local.get("savedData", (data) => {
    
      data.savedData.length > 0 && data.savedData.map((newData) => {
        let link = '';
        const url = new URL(window.location.href);
        link = `windsorstore.com?preview_theme_id=${newData}`;
        console.log(url, link)
    
        savedDataContainer.innerHTML += `<div>Saved Data: ${newData}  <a href="${link}" class="previewLink">Preview</a></div>`;
      })
    })
    // Display saved data in the popup

  }
});
