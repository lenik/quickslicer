
function resolvVar(path, start) {
    if (start == null)
        start = window;
    var offset = 0;
    while (start != null) {
        var dot = path.indexOf('.', offset);
        if (dot == -1)
            break;
        var head = path.substr(0, dot);
        path = path.substr(dot + 1);
        start = start[head];
    }
    return { ctx: start, path: path, value: start[path] };
}

function writeVar(path, value, start) {
    var v = resolvVar(path, start);
    v.ctx[v.path] = value;
}

$(document).ready(function() {
    
    appModel = {
        facet: 'editor',
        state: 'select',
        attributesView: false,
        dim: 'ratio',
        toTheEnd: false,
        roundCorner: false,
        showTags: true,
        fillColor: false,
        
        compid: "div",
        idpool: {},
        
        ex: {
            htmlSkel: true,
            htmlCode: false,
            cssStyle: false,
            cssFile: false,
            scssFile: false
        },
        
        libjs: {
            bootstrap: true,
            jquery: true,
            vuejs: true
        },
        
        init: function(s) {
            this.state = s;
            $(".block.selected").removeClass("selected");
            $(".block .helper").detach();
        }
    };

    app = new Vue({
        el: "#facets",
        data: appModel,
        computed: {
            useRatioDim: {
                get: function() { return this.dim == 'ratio'; },
                set: function(v) { this.dim = v ? 'ratio' : 'px'; }
            }
        },
        
        watch: {
            compid: function(val) {
                $("#compid").text(val);
            }
        },
        
        methods: {
            buildCode: function() {
                var map = buildHtml(this);
                var sb = "";
                {
                    if (this.ex.htmlSkel)
                        sb += map.html;
                        
                    if (this.ex.htmlCode)
                        sb += map.body;
                        
                    if (this.ex.cssStyle) {
                        var style = "<style>\n";
                        style += map.css;
                        style += "</style>";
                        sb += style;
                    }
                    if (this.ex.cssFile)
                        sb += map.css;
                }
                
                // Update preview frame.
                var iframe = $("[k=preview] iframe")[0];
                    // IE7: contentDocument not work.
                    var iframedoc = iframe.contentWindow.document;
                    iframedoc.documentElement.innerHTML = map.html;
                    // iframedoc.write(map.html);
                    
                return sb;
            },
            
            choosebg: function(e) {
                alert("bg");
            }
        }
    });
    
    new Vue({ el: "#projbar", data: app });
    new Vue({ el: "#attrviews", data: app });
    
    $(document.body).keydown(function (e) {
        var el = $(e.target);
        if (el.hasClass("editable")) return;
        if (el.is("input, select")) return;
        
        switch (e.keyCode) {
        case 27: // ESC
        case 32: // SPC
            app.init('select'); break;
        case 72: // H
            app.init("horiz"); break;
        case 86: // V
            app.init("vert"); break;
        case 79: // O
            app.init("offset"); break;
        case 46: // DEL
        case 69: // E
            app.init("erase"); break;
        case 65: // A
            app.attributesView = ! app.attributesView; break;
        case 66: // B
            app.useRatioDim = ! app.useRatioDim; break;
        case 70: // F
            app.fillColor = ! app.fillColor; break;
        case 82: // R
            app.roundCorner = ! app.roundCorner; break;
        case 84: // T
            app.showTags = ! app.showTags; break;
        case 90: // Z
            app.toTheEnd = ! app.toTheEnd; break;
        default:
            return;
        }
        return false;
    });
    
    var titlebar = 
    $(".palette > .title");
    {
        var palette = titlebar.parent();
        var body = $("body");
        var drag = {};
        
        titlebar.mousedown(function(e) {
            drag.x0 = e.pageX;
            drag.y0 = e.pageY;
            palette.addClass("moving");
            drag.sel = palette;
            drag.release = function() {
                palette.removeClass("moving");
            };
        });
        
        body.mousemove(function(e) {
            if (drag.sel != null) {
                var dx = e.pageX - drag.x0;
                var dy = e.pageY - drag.y0;
                var pos = drag.sel.offset();
                drag.sel.offset({
                    left: pos.left + dx,
                    top: pos.top + dy
                });
                drag.x0 = e.pageX;
                drag.y0 = e.pageY;
                return false;
            }
        });
        
        body.mouseup(function(e) {
            if (drag.sel != null) {
                drag.release();
                drag.sel = null;
                return false;
            }
        });
    }
    
    $("#proj-pager > a").click(function(e) {
        var item = $(this);
        item.siblings().removeClass("selected");
        item.addClass("selected");
        
        var k = $(this).attr('href');
        app.facet = k;
        return false;
    });
    
    function mkblock() {
        var cid = app.compid;
        var el = $("<div class='block'><span class='cid'>"
                        + cid +"</span>");
        // if (app.fillColor) ...
        el.css("background", buildRandomHSL());
        
        var c = new CompId(cid);
        app.compid = c.next().toString();
        
        return el;
    }
    
    $(".root").mousedown(function(e) {
        if (e.button != 0) return;
        
        var block = $(e.target).closest(".block:not(.helper)");
        var reset = block.hasClass('root');
        
        switch (app.state) {
        case "horiz":
        case "vert":
            var isVert = app.state == "vert";
            var dir = isVert ? "cols" : "rows";
            if (block.parent().data("dir") != dir)
                reset = true;
            if (reset) {
                block.data("dir", dir);
                block.addClass(dir);
                block.data("dim", app.dim);
                
                var hdr = mkblock();
                if (app.dim == 'ratio') {
                    hdr.data("val", 100);
                } else {
                    hdr.data("val", isVert ? block.width() : block.height());
                }
                hdr.css("flex", "1");
                block.append(hdr);
                block = hdr;
            }
            
            var tmp = $(".ltmp");
                if (tmp.length == 0) return;
            var pos = tmp.position();
            
            var px, ratio;
            if (isVert) {
                px = pos.left;
                ratio = px / block.width();
            } else {
                px = pos.top;
                ratio = px / block.height();
            }
            
            var newblk = mkblock();
            newblk.insertAfter(block);
            
            var outer = block.parent();
            if (outer.data('dim') == 'ratio') {
                var val2 = block.data("val");
                var val1 = val2 * ratio;
                val2 -= val1;
                block.data("val", val1);
                block.css("flex", val1 + " 1 0");
                newblk.data("val", val2);
                newblk.css("flex", val2 + " 1 0");
            } else {
                var px1 = px;
                var px2 = block.data("val") - px1;
                block.data("val", px1);
                block.css("flex", "0 0 " + px1 + "px");
                newblk.data("val", px2);
                newblk.css("flex", "0 0 " + px2 + "px");
            }
            break;
            
        case "offset":
            break;
        }
    });
    
    $(".root").mousemove(function(e) {
        var div = $(e.target);
            if (div.hasClass("helper")) return;
        var block = div.closest(".block:not(.helper)");
        
        switch (app.state) {
        case "select":
        case "erase":
            if (block.hasClass("root"))
                return;
            if (! block.hasClass("selected")) {
                $(".root .block.selected").removeClass("selected");
                block.addClass("selected");
            }
            break;
        
        case "horiz":
        case "vert":
            var isVert = app.state == "vert";
            var tmp = $(".ltmp");
            if (tmp.length == 0) {
                tmp = $("<div class='helper ltmp'></div>");
            }
            block.append(tmp);
            tmp.attr("data-type", isVert ? "vert" : "horiz");
            if (isVert) {
                tmp.css("left", e.offsetX + "px");
                tmp.css("top", "");
            } else {
                tmp.css("left", "");
                tmp.css("top", e.offsetY + "px");
            }
            break;
            
        case "offset":
            var otmp = $(".otmp");
            if (otmp.length == 0) {
                otmp = $("<div class='helper otmp'></div>");
            }
            block.append(otmp);
            break;
        }
    });
    
    $(".root").mouseup(function(e) {
        var div = $(e.target);
        var block = div.closest('.block:not(.helper)');
        
        switch (app.state) {
        case "select":
            var target = $(e.target);
            if (target.hasClass("cid")) {
                var cid = target.text();
                var val = prompt("Please enter a new composite id: ", cid);
                if (val != null)
                    target.text(val);
                return false;
            }
            break;
            
        case "erase":
            if (block.hasClass("root")) return;
            var outer = block.parent();
            var siblings = outer.children(".block");
            if (siblings.length == 2) {
                siblings.detach();
                return;
            }
            var prev = block.prev();
            var next = block.next();
            var sibling = prev.length ? prev : next;
            block.detach();
            var val = block.data("val");
            
            if (sibling.length) {
                var merge = sibling.data("val");
                merge += val;
                sibling.data("val", merge);
                if (outer.data("dim") == "ratio") {
                    sibling.css("flex", merge + " 1 0");
                } else {
                    sibling.css("flex", "0 0 " + merge + "px");
                }
            }
            break;
        
        case "k-horiz":
        case "k-vert":
            break;
            
        case "offset":
            break;
        }
    });

    $("[data-control=combo] [data-val]").click(function() {
        var item = $(this);
        var val = item.data("val");
        var control = item.parent("[data-control]");
        var path = control.data("var");
        var v = resolvVar(path);
        v.ctx[v.path] = val;
        if (path == "app.state") {
            app.init(val);
        }
    });
        
    $("[data-toggle]").click(function() {
        var item = $(this);
        var path = item.data("toggle");
        var v = resolvVar(path);
        v.ctx[v.path] = ! v.value;
    });

    $(".editable").inlineEdit();
    $(".toolbox #compid").inlineEdit(function(e, s) { app.compid = s; });
    
    $("[data-control=multi] [data-var]").click(function(e) {
        var toggle = $(this).data("toggle");
        var single = ! e.ctrlKey;
        if (single)
            $(this).siblings().each(function() {
                var path = $(this).data("var");
                writeVar(path, false);
            });
        var path = $(this).data("var");
        var v = resolvVar(path);
        v.ctx[v.path] = single ? true : !v.value;
    });

    $("#refresh-btn").click(function() {
        app.$forceUpdate();
    });
    
    $("#copy-btn").click(function() {
        var code = $("#code").text();
        Clipboard.set(code);
    });
    
});

