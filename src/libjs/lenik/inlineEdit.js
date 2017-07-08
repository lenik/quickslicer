// require: jquery

(function($) {

    var input = $('<input class="inlineEdit" type="text" />');
    var csscopies = [
        "font-family", "font-size", "font-style", "font-decoration",
        "color", "border"
    ];
    
    $.fn.inlineEdit = function(callback) {
        $(this).click(function() {
            var el = $(this);
            input.val(el.text().trim());
            
            for (var i = 0; i < csscopies.length; i++) {
                var k = csscopies[i];
                var v = el.css(k);
                input.css(k, v);
            }
            input.width(el.width() + 32);
            
            el.hide();
            el.after(input);
            input.focus();
            
            var commit = function(e) {
                var text = input.val();
                el.text(text);
                input.detach();
                el.show();
                el.text(text);
                if (callback != null)
                    callback(e, text);
                input.off();
            };
            
            var hblur = input.blur(commit);
            var hkeydown = input.keydown(function(e) {
                switch (e.keyCode) {
                case 13:
                case 10:
                    commit(); break;
                case 27:
                    commit(); break; // cancel()?
                }
            });
        });
    };
    
})(jQuery);
