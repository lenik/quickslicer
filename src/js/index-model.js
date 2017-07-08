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
    
});

