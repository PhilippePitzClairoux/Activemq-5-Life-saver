const settings_name = "Persistent-Pretty-JSON.settings";
// query selector
const row = document.getElementById("example");
const table = document.getElementById("rows");

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
                addObjectToTable(actual_url, cookie.selector, Settings.SELECTOR);
                addObjectToTable(actual_url, cookie.field, Settings.FIELD);

                browser.tabs.sendMessage(tabs[0].id, { selector: cookie.selector, field : cookie.field });
            }
        });
    });
}

function writeUrl() {
    let selector = document.getElementsByName("selector")[0].value;
    let field = document.getElementsByName("field")[0].value;
    let host = document.getElementById("host");

    getActiveTab().then((tabs) => {
        let url = new URL(tabs[0].url);
        browser.tabs.sendMessage(tabs[0].id, { selector: selector, field : field });
        
        addObjectToTable(Settings.SELECTOR, selector, Settings.SELECTOR);
        addObjectToTable(Settings.FIELD, field, Settings.FIELD);
        host.innerText = `https://${url.host}`;

        browser.cookies.set({
            url: "https://" + url.host,
            name: settings_name,
            selector: selector,
            field : field
        });
     });

}

function addObjectToTable(url, value, settings) {
    let new_node = settings_map[settings].row.cloneNode(true);
    let table = settings_map[settings].table;

    console.log(settings);

    new_node.childNodes[1].innerText = url;
    new_node.childNodes[3].innerText = value;
    new_node.removeAttribute('id');

    if (settings_map[settings].ref) {
        settings_map[settings].ref.remove();
    }

    table.appendChild(new_node);
    settings_map[settings].ref = new_node;
}