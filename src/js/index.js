$(document).ready(function() {
    
    $(document.body).keydown(function (e) {
        var el = $(e.target);
        if (el.hasClass("editable")) return;
        if (el.is("input, select")) return;
        
        if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey)
            return;
            
        switch (e.keyCode) {
        case 27: // ESC
        case 32: // SPC
            app.init('select'); break;
        case 65: // A
            app.attributesView = ! app.attributesView; break;
        case 66: // B
            app.useRatioDim = ! app.useRatioDim; break;
        case 67: // C
            app.showTags = ! app.showTags;
            if (app.showTags)
                $(".root").addClass("showTags");
            else
                $(".root").removeClass("showTags");
            break;
        case 46: // DEL
        case 68: // D
            app.init("erase"); break;
        case 69: // E
            app.view = "editor"; break;
        case 70: // F
            app.fillColor = ! app.fillColor;
            if (app.fillColor)
                $(".root").addClass("fillColor");
            else
                $(".root").removeClass("fillColor");
            break;
        case 72: // H
            app.init("horiz"); break;
        case 79: // O
            app.init("offset"); break;
        case 82: // R
            app.roundCorner = ! app.roundCorner;
            if (app.roundCorner)
                $(".root").addClass("round");
            else
                $(".root").removeClass("round");
            break;
        case 83: // S
            app.view = "options"; break;
        case 86: // V
            app.init("vert"); break;
        case 88: // X
            app.view = "export"; break;
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
    
    $(".toolbox #compid").inlineEdit(function(e, s) { app.compid = s; });
    
    $("#refresh-btn").click(function() {
        app.$forceUpdate();
    });
    
    $("#copy-btn").click(function() {
        var code = $("#code").text();
        Clipboard.set(code);
    });
    
    fullScreen();
    
});

