browser.runtime.onMessage.addListener(stringifyJson);


function stringifyJson(request, sender, sendResponse) {
    console.log("Got an event!");
    // Execute function when page is loaded and ready
    let json = document.querySelector(request.selector);

    if (json) {
        let obj = JSON.parse(json.innerText)
        json.innerText = JSON.stringify(obj, null, 4);
    } else {
        console.log("query selector returned null!");
    }
}
