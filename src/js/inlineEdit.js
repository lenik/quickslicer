(function($) {

    var input = $('<input class="inlineEdit" type="text" />');
    
    $.fn.inlineEdit = function(callback) {
        $(this).click(function() {
            var el = $(this);
            el.hide();
            el.after(input);
            input.focus();
            input.val(el.text());
            
            var commit = function(e) {
                var text = input.val();
                el.text(text);
                input.detach();
                el.show();
                callback(e, text);
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
