$(document).ready(function() {

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

});

