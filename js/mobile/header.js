initHeaderVersion();

$(window).resize(function(){
    initHeaderVersion();
});

function initHeaderVersion(){
    if (window.innerWidth <= 1000) {
        $('.header').addClass('header_mobile');

        $('.header__change-city-btn').off('.header-event');
        $('.modal-window__wrapper').off('.header-event');
        $('.modal-window__close').off('.header-event');

        $('.header__change-city-btn').on('click.header-event', function(){
            $(this).addClass('header__change-city-btn_active');
        });

        $('.modal-window__wrapper').on('click.header-event', function(e){
            if (e.target === this) {
                $('.header__change-city-btn').removeClass('header__change-city-btn_active');
            }
        });
        
        $('.modal-window__close').on('click.header-event', function(){
            $('.header__change-city-btn').removeClass('header__change-city-btn_active');
        });
    }
    else {
        $('.header').removeClass('header_mobile');
    }
}