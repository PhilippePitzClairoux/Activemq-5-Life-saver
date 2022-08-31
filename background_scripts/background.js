const settings_name = "Persistent-Pretty-JSON.settings";


function getActiveTab() {
  return browser.tabs.query({active: true, currentWindow: true});
}


function sendEvent() {
    getActiveTab().then((tabs) => {
        let url = new URL(tabs[0].url);

        // get any previously set cookie for the current tab
        let gettingCookies = browser.cookies.get({
            url: "https://" + url.host,
            name: settings_name
        });

        gettingCookies.then((cookie) => {
        if (cookie) {
            browser.tabs.sendMessage(tabs[0].id, {selector : cookie.value });
        }
        });
    });
}


// update when the tab is updated
browser.tabs.onUpdated.addListener(sendEvent);
// update when the tab is activated
browser.tabs.onActivated.addListener(sendEvent);
