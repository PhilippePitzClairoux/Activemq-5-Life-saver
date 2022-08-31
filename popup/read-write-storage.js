const settings_name = "Persistent-Pretty-JSON.settings";
const row_example = document.getElementById("example");
const table = document.getElementById("rows");

function getActiveTab() {
  return browser.tabs.query({active: true, currentWindow: true});
}

function getUrls() {
    getActiveTab().then((tabs) => {
        let url = new URL(tabs[0].url);
        let actual_url = "https://" + url.host;
        // get any previously set cookie for the current tab
        let gettingCookies = browser.cookies.get({
            url: actual_url,
            name: settings_name
        });
        gettingCookies.then((cookie) => {
            if (cookie) {
                addObjectToTable(actual_url, cookie.value);
                browser.tabs.sendMessage(tabs[0].id, { selector: cookie.value});
            }
        });
    });
}

function writeUrl() {
    let selector = document.getElementsByName("selector")[0].value;

    getActiveTab().then((tabs) => {
        let url = new URL(tabs[0].url);
        browser.tabs.sendMessage(tabs[0].id, { selector: selector });
        addObjectToTable("https://" + url.host, selector);

        browser.cookies.set({
            url: "https://" + url.host,
            name: settings_name,
            value: selector
        });
     });

}

function addObjectToTable(url, selector) {
    let new_node = row_example.cloneNode(true);

    new_node.childNodes[1].innerText = url;
    new_node.childNodes[3].innerText = selector;
    new_node.removeAttribute('id');

    table.removeChild(table.lastChild);
    table.appendChild(new_node);

}

document.getElementById("send").addEventListener('click', (event) => {
        writeUrl();
});

getUrls();
