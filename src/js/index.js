$(document).ready(function() {
    
    appModel = {
        version: '1.2',
        
        view: 'editor',
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
        el: "#views",
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
    
    new Vue({ el: "#view-nav", data: app });
    new Vue({ el: "#proj-info", data: app });
    new Vue({ el: "#attrviews", data: app });
    
    $(document.body).keydown(function (e) {
        var el = $(e.target);
        if (el.hasClass("editable")) return;
        if (el.is("input, select")) return;
        
        switch (e.keyCode) {
        case 27: // ESC
        case 32: // SPC
            app.init('select'); break;
        case 65: // A
            app.attributesView = ! app.attributesView; break;
        case 66: // B
            app.useRatioDim = ! app.useRatioDim; break;
        case 67: // C
            app.showTags = ! app.showTags; break;
        case 46: // DEL
        case 68: // D
            app.init("erase"); break;
        case 69: // E
            app.view = "editor"; break;
        case 70: // F
            app.fillColor = ! app.fillColor; break;
        case 72: // H
            app.init("horiz"); break;
        case 79: // O
            app.init("offset"); break;
        case 82: // R
            app.roundCorner = ! app.roundCorner; break;
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

