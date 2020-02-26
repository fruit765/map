initHeaderVersion();

$(window).resize(function(){
    initHeaderVersion();
});

function initHeaderVersion(){
    if (window.innerWidth <= 1000) {
        $('.header').addClass('header_mobile');
    }
    else {
        $('.header').removeClass('header_mobile');
    }
}