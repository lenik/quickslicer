(function($) {

    function csslink(url) {
        return '<link rel="stylesheet" text="text/css" href="' + url + '">';
    }
    
    function script(url) {
        return '<script type="text/javascript" src="' + url + '"></script>';
    }
    
    var globalPool = {};
    
    window.CompId = function(s) {
        this.cv = [];
        var parts = breakStr(s, /[#.]/);
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            switch (part.charAt(0)) {
            case '#':
                this.id = part.substr(1);
                break;
            case '.':
                this.cv.push(part.substr(1));
                break;
            default: // TAG
                this.tag = part;
            }
        }
        
        this.toString = function() {
            var sb = this.tag;
            if (this.id != null)
                sb += "#" + this.id;
            for (var i = 0; i < this.cv.length; i++)
                sb += "." + this.cv[i];
            return sb;
        };
        
        this.next = function(pool) {
            if (pool == null)
                pool = globalPool;
                
            var id = "_";
            if (this.id != null) id = this.id;
            var NUM = /\d+/g;
            var matcher;
            var pre = id, post = '', val = 0;
            while (matcher = NUM.exec(id)) {
                pre = id.substr(0, matcher.index);
                val = matcher[0] * 1;
                post = id.substr(NUM.lastIndex);
            }
            val++;
            var nextId = pre + val + post;
            pool[pre] = val;
            
            var dup = $.extend({}, this);
            dup.id = nextId;
            return dup;
        };
    }
        
    window.buildHtml = function(app) {
        var csslinks = "";                
        var scripts = "";
        var css = "*:not(body) { border: solid 1px gray; }\n"
            + ".block { position: relative; display: flex; }\n"
            + ".root { position: absolute; top: 0; bottom: 0; left: 0; right: 0; }\n"
            + ".rows { flex-direction: column; }\n"
            + ".cols { flex-direction: row; }\n"
            ;
        var scss = "";
        if (app.libjs.bootstrap) {
            scripts += '        ' + script("libjs/twitter-bootstrap3/js/bootstrap.min.js") + '\n';
        }
        if (app.libjs.jquery)
            scripts += '        ' + script("libjs/jquery/jquery.min.js") + '\n';
        if (app.libjs.jqueryui) {
            csslinks += '        ' + csslink("libjs/jquery-ui/themes/base/jquery-ui.css") + '\n';
            scripts += '        ' + script("libjs/jquery-ui/jquery-ui.min.js") + '\n';
        }
        if (app.libjs.vuejs)
            scripts += '        ' + script("libjs/vuejs/vue.js") + '\n';
        
        var title = $("#projbar h2").text();
        var subtitle = $("#projbar .subtitle").text();
        
        var root = $(".root").clone();
        var body = "";
        if (root.length) {
            $(".helper", root).detach();
            
            var blocks = $(".block", root).add(root);
            
            // clean up internal attributes.
                blocks.attr("data-dim", null);
                blocks.attr("data-dir", null);
                blocks.attr("data-val", null);
                blocks.removeClass("selected");
                blocks.css("background", "");
            
            // clean up empty @class.
                blocks.each(function() {
                    if ($(this).attr("class") == '')
                        $(this).attr("class", null);
                });
            
            // Parse compid => TAG#ID.CLASS...
                $(".cid", root).each(function() {
                    var compid = $(this).text();
                    var blk = $(this).parent();
                    var c = new CompId(compid);
                    if (c.id != null) {
                        blk.attr("id", c.id);
                        
                        // For named node, move @style* to <style>.
                        var style = blk.attr("style");
                        blk.attr("style", null);
                        style = style.replace(/;\s*/mg, ";\n    ").trim();
                        css += "#" + c.id + " {\n";
                        css += "    " + style + "\n";
                        css += "}\n";
                    }
                    for (i = 0; i < c.cv.length; i++)
                        blk.addClass(c.cv[i]);
                    if (c.tag != null && c.tag != 'div') {
                        // blk.attr("x-tag", c.tag);
                        var newTag = $("<" + c.tag + ">");
                        newTag.append(blk.children());
                        $.each(blk[0].attributes, function() {
                            newTag.attr(this.name, this.value);
                        });
                        blk.replaceWith(newTag);
                    }
                    $(this).detach();
                });
            
            // HTML tidy
                body = root[0].outerHTML;
                var options = {
                    "indent": "auto",
                    "indent-spaces": 4,
                    "wrap": 100,
                    "markup": true,
                    "numeric-entities": true,
                    "quote-marks": true,
                    "show-body-only": true
                };
                body = tidy_html5(body, options);
                // body = body.replace(/<div (.*) x-tag=\"(\w+)\"/mg, "<$2 $1");
        }
        // indent in 2-tab.
        var body2 = body.replace(/^/mg, '    ').trim();

        var sk1 = "<html>\n    <head>\n"
            + "        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n";
        var sk2 = "    </head>\n    <body>\n\n    ";
        var sk3 = "\n    </body>\n</html>\n";
        var html = "";
            html += sk1;
            html += "        <title>" + title + "</title>\n";
            html += csslinks;
            html += scripts;
            html += sk2;
            html += body2 + "\n\n";
            html += "    <style>\n        " + css.replace(/^/mg, '        ').trim() + "\n    </style>\n";
            html += sk3;
        
        return {
            html: html,
            body: body,
            css: css,
            scss: scss
        };
    }
    
})(jQuery);
