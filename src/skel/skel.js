$(document).ready(function() {
    
    $("#view-nav > a").click(function(e) {
        var k = $(this).attr('href');
        app.view = k;
        return false;
    });
    
});

function fullScreen() {
    var hideTop = function() {
        $("#proj-info").slideUp({
            done: function() {
                $("#top").addClass("hide");
            }
        });
        $("#footbar").fadeOut();
    };

    var hTimeout;
    hTimeout = setTimeout(hideTop, 3000);
    $("#top").hover(function() {
        clearTimeout(hTimeout);
        hTimeout = null;
        $("#top").removeClass("hide");
        $("#proj-info").fadeIn();
        $("#footbar").fadeIn();
    }, function() {
        hTimeout = setTimeout(hideTop, 2000);
    });
}

