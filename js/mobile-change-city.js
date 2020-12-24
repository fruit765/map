initChangeCityVersion();

$(window).resize(function(){
    initChangeCityVersion();
});

function initChangeCityVersion(){
    if (window.innerWidth <= 1000) {
        $('.change-city').addClass('change-city_mobile');
    }
    else {
        $('.change-city').removeClass('change-city_mobile');
    }
}