var sc_project = 11389146;
var sc_invisible = 0;
var sc_security = "cb1bef8f";

function installStatCounter() {
    var url;
    switch (document.location.protocol) {
        case "file:":
            document.write("(n/a counter @dev)");
            return;
        case "http:":
            url = "http://www.statcounter.com/counter/counter.js";
            break;
        case "https:":
            url = "https://secure.statcounter.com/counter/counter.js";
            break;
    }
    document.write("<script type='text/javascript' src='" + url + "'></script>");
    
    url = "//c.statcounter.com/" + sc_project + "/" + sc_invisible + "/" + sc_security + "/0/";
    document.write('<noscript><img class="statcounter" src="' + url + '"></noscript>');
}

