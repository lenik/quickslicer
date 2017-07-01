$(document).ready(function() {
    
    var head = $("#content h2");
    var text = $("#content h2 + div");
    
    head.hide();
    text.hide();
    
    head.slideDown(
        function() {
            text.show('slide', { direction: 'left' } );
        }
    );
    
    $("#proj-pager > a").click(function() {
        var item = $(this);
        item.siblings().removeClass("selected");
        item.addClass("selected");
        
        var p = $(this).attr('p');
        $("#pages > *").removeClass('selected');
        $("#pages [page=" + p + "]").addClass('selected');
    });
    
    $(".toolbox li").click(function() {
        var item = $(this);
        var dst = item.data("state");
        if (dst != null) {
            item.siblings().removeClass("selected");
            item.addClass("selected");
            state = dst;
        } else {
            var action = item.data("action");
            alert(action);
        }
    });
    
    state = "select";
    
    $(".root").mousemove(function(e) {
        var div = $(e.target);
        
        switch (state) {
        case "select":
        case "erase":
            if (! div.hasClass("selected")) {
                $(".root div").removeClass("selected");
                div.addClass("selected");
            }
            break;
        
        case "k-horiz":
        case "k-vert":
            break;
            
        case "offset":
            break;
        }
    });
    
    $(".root").mouseup(function(e) {
        var div = $(e.target);
        
        switch (state) {
        case "select":
            break;
            
        case "erase":
            if (div.hasClass("root")) return;
            div.detach();
            break;
        
        case "k-horiz":
        case "k-vert":
            break;
            
        case "offset":
            break;
        }
    });
    
});

