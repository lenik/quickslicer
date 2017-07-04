$(document).ready(function() {
    
    appModel = {
        state: 'select',
        attributesView: false,
        dim: 'ratio',
        toTheEnd: false,
        roundCorner: false,
        tag: "DIV",
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
        methods: {
            choosebg: function(e) {
                alert("bg");
            }
        }
    });
    
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
        case 90: // Z
            app.toTheEnd = ! app.toTheEnd; break;
        case 82: // R
            app.roundCorner = ! app.roundCorner; break;
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
        $("#facets > *").removeClass('selected');
        $("#facets > [k=" + k + "]").addClass('selected');
        
        return false;
    });
    
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
                
                var hdr = $("<" + app.tag + " class='block'><span class='name'>"
                        + app.tag +"</span>");
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
            
            var newblk = $("<" + app.tag + " class='block'><span class='name'>"
                + app.tag +"</span>");
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
            if (target.hasClass("name")) {
                var name = target.text();
                var newName = prompt("Please enter a new composite id: ", name);
                if (newName != null)
                    target.text(newName);
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
    
    $(".toolbox li").click(function() {
        var item = $(this);
        var state = item.data("state");
        if (state != null) {
            app.init(state);
        }
        
        var toggle = item.data("toggle");
        if (toggle != null)
            app[toggle] = ! app[toggle];
    });

    $(".toolbox #compid").inlineEdit(function(e, s) {
        app.tag = s;
    });
    $(".toolbox #compid").keyup(function() {
        app.tag = $(this).text();
    });
    
});

