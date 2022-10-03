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
        let url = new URL(tabs[0].url);
        let actual_url = `https://${url.host}`;

        // get any previously set cookie for the current tab
        let gettingCookies = browser.cookies.get({
            url: actual_url,
            name: settings_name
        });
        gettingCookies.then((cookie) => {
            if (cookie) {
                const cookieValue = JSON.parse(cookie.value);
                addObjectToTable(cookieValue.selector, Settings.SELECTOR);
                addObjectToTable(cookieValue.field, Settings.FIELD);
                host.innerText = `https://${url.host}`;

                selector.value = cookieValue.selector;
                field.value = cookieValue.field;

                browser.tabs.sendMessage(tabs[0].id, JSON.parse(cookie.value));
            }
        });
    });
}

function writeUrl() {

    getActiveTab().then((tabs) => {
        let url = new URL(tabs[0].url);
        browser.tabs.sendMessage(tabs[0].id, { selector: selector.value, field : field.value });
        
        addObjectToTable(selector.value, Settings.SELECTOR);
        addObjectToTable(field.value, Settings.FIELD);
        host.innerText = `https://${url.host}`;

        browser.cookies.set({
            url: "https://" + url.host,
            name: settings_name,
            value : JSON.stringify({ selector: selector.value, field : field.value })
        });
     });

}

function addObjectToTable(value, settings) {
    let new_node = settings_map[settings].row.cloneNode(true);
    let table = settings_map[settings].table;

    console.log(settings);

    new_node.childNodes[1].innerText = settings;
    new_node.childNodes[3].innerText = value;
    new_node.removeAttribute('id');

    if (settings_map[settings].ref) {
        settings_map[settings].ref.remove();
    }

    table.appendChild(new_node);
    settings_map[settings].ref = new_node;
}