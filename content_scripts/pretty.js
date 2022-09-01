browser.runtime.onMessage.addListener(parse);


function parse(request, sender, sendResponse) {
    // Execute function when page is loaded and ready
    // let json = document.querySelector(request.selector);
    let payload = document.querySelector(request.selector);

    if (payload) {
        if (payload.innerText.startsWith("<")) {
            formatXml(payload, 4);
        } else {
            //json
            stringifyJson(payload);
        }
    }
}

// function stringifyJson(request, sender, sendResponse) {
function stringifyJson(json) {
    let obj = JSON.parse(json.innerText)
    json.innerText = JSON.stringify(obj, null, 4);
}

function formatXml(node, indent) {
    console.log("Parsing XML!")
    let xml = node.innerText;

    node.innerText = parseXml(xml, indent);
}

//https://github.com/vkiryukhin/vkBeautify/blob/master/vkbeautify.js
//We're using VKBeautify code!
function createShiftArr(step) {

    var space = '    ';

    if ( isNaN(parseInt(step)) ) {  // argument is string
        space = step;
    } else { // argument is integer
        switch(step) {
            case 1: space = ' '; break;
            case 2: space = '  '; break;
            case 3: space = '   '; break;
            case 4: space = '    '; break;
            case 5: space = '     '; break;
            case 6: space = '      '; break;
            case 7: space = '       '; break;
            case 8: space = '        '; break;
            case 9: space = '         '; break;
            case 10: space = '          '; break;
            case 11: space = '           '; break;
            case 12: space = '            '; break;
        }
    }

    var shift = ['\n']; // array of shifts
    for(ix=0;ix<100;ix++){
        shift.push(shift[ix]+space);
    }
    return shift;
}

function parseXml(text,step) {

    var ar = text.replace(/>\s{0,}</g,"><")
        .replace(/</g,"~::~<")
        .replace(/\s*xmlns\:/g,"~::~xmlns:")
        .replace(/\s*xmlns\=/g,"~::~xmlns=")
        .split('~::~'),
        len = ar.length,
        inComment = false,
        deep = 0,
        str = '',
        ix = 0,
        shift = step ? createShiftArr(step) : this.shift;

    for(ix=0;ix<len;ix++) {
        // start comment or <![CDATA[...]]> or <!DOCTYPE //
        if(ar[ix].search(/<!/) > -1) {
            str += shift[deep]+ar[ix];
            inComment = true;
            // end comment  or <![CDATA[...]]> //
            if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1 || ar[ix].search(/!DOCTYPE/) > -1 ) {
                inComment = false;
            }
        } else
            // end comment  or <![CDATA[...]]> //
        if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) {
            str += ar[ix];
            inComment = false;
        } else
            // <elm></elm> //
        if( /^<\w/.exec(ar[ix-1]) && /^<\/\w/.exec(ar[ix]) &&
            /^<[\w:\-\.\,]+/.exec(ar[ix-1]) == /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace('/','')) {
            str += ar[ix];
            if(!inComment) deep--;
        } else
            // <elm> //
        if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) == -1 && ar[ix].search(/\/>/) == -1 ) {
            str = !inComment ? str += shift[deep++]+ar[ix] : str += ar[ix];
        } else
            // <elm>...</elm> //
        if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
            str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
        } else
            // </elm> //
        if(ar[ix].search(/<\//) > -1) {
            str = !inComment ? str += shift[--deep]+ar[ix] : str += ar[ix];
        } else
            // <elm/> //
        if(ar[ix].search(/\/>/) > -1 ) {
            str = !inComment ? str += shift[deep]+ar[ix] : str += ar[ix];
        } else
            // <? xml ... ?> //
        if(ar[ix].search(/<\?/) > -1) {
            str += shift[deep]+ar[ix];
        } else
            // xmlns //
        if( ar[ix].search(/xmlns\:/) > -1  || ar[ix].search(/xmlns\=/) > -1) {
            str += shift[deep]+ar[ix];
        }

        else {
            str += ar[ix];
        }
    }

    return  (str[0] == '\n') ? str.slice(1) : str;
}