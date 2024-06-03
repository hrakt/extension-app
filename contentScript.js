(() => {
  // console.log(document);
  // Add an event listener for the DOMContentLoaded event
  document.addEventListener("DOMContentLoaded", () => {
    // console.log('DOM content loaded');

    // Perform the query selection after the DOM content has loaded
    const matchingLinks = document.querySelectorAll('a[aria-label*="Customize"]');

    // Loop through the selected elements and do something with them
    matchingLinks.forEach(link => {
      // Do something with each matching link
      // console.log(link.href);
    });
  });
})();
