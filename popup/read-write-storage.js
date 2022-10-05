// cookie name
const settings_name = "Persistent-Pretty-JSON.settings";

// display properties selectors
const row = document.getElementById("example");
const table = document.getElementById("rows");

// form selectors
let selector = document.getElementById("selector");
let field = document.getElementById("field");
const host = document.getElementById("host");

// settings
const Settings = {
    SELECTOR : "selector",
    FIELD : "field"
}


// settings map
settings_map = {
    "selector" : {
        row : row,
        table : table,
        ref : undefined
    },

    "field" : {
        row : row,
        table : table,
        ref : undefined
    }
}


//load urls every time this script is called
getUrls();

//add event for button "send"
document.getElementById("send").addEventListener('click', (event) => {
    writeUrl();
});


function getActiveTab() {
  return browser.tabs.query({active: true, currentWindow: true});
}

function getUrls() {
    getActiveTab().then((tabs) => {
        for (const tab of tabs) {

            let url = new URL(tab.url);
            let actual_url = `https://${url.host}`;

            // get any previously set cookie for the current tab
            let gettingCookies = browser.cookies.get({
                url: actual_url,
                name: settings_name
            });

            gettingCookies.then((cookie) => {
                if (cookie) {
                    const cookieValue = JSON.parse(cookie.value);
                    addObjectToTable(Settings.SELECTOR, cookieValue.selector);
                    addObjectToTable(Settings.FIELD, cookieValue.field);
                    host.innerText = actual_url;

                    selector.value = cookieValue.selector;
                    field.value = cookieValue.field;

                    browser.tabs.sendMessage(tab.id, cookieValue);
                }
            });
        }
    });
}

function writeUrl() {

    getActiveTab().then((tabs) => {
        let url = new URL(tabs[0].url);
        browser.tabs.sendMessage(tabs[0].id, { selector: selector.value,
            field : field.value });
        
        addObjectToTable(Settings.SELECTOR, selector.value);
        addObjectToTable(Settings.FIELD, field.value);
        host.innerText = `https://${url.host}`;

        browser.cookies.set({
            url: "https://" + url.host,
            name: settings_name,
            value : JSON.stringify({ selector: selector.value, field : field.value })
        });
     });

}

function addObjectToTable(settings, value) {
    const new_node = settings_map[settings].row.cloneNode(true);
    const table = settings_map[settings].table;

    new_node.childNodes[1].innerText = settings;
    new_node.childNodes[3].innerText = value;
    new_node.removeAttribute('id');

    if (settings_map[settings].ref) {
        settings_map[settings].ref.remove();
    }

    table.appendChild(new_node);
    settings_map[settings].ref = new_node;
}