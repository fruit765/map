function getCityShops(cityObject, shops){
    var cityShops = [];

    shops.forEach(function(shop){
        if (shop.slug === cityObject.Slug) {
            cityShops.push(shop);
        }
    });

    $('.map-sidebar-wrapper .sidebar .shops-block').scrollTop(0);
    $('.map-sidebar-wrapper .sidebar .shops-block > ul.active').removeClass('active');
    $('.map-sidebar-wrapper .sidebar .shops-block > ul:first-child').addClass('active');

    return cityShops;
}

function getCityObject(city, cities){
    var cityWords = city.split(' '), cityResult;
    city = cityWords[cityWords.length - 1];
    cities.forEach(function(cityObject){
        if (city === cityObject.Name) {
            cityResult = cityObject;
            return false;
        }
    });

    if (!cityResult) {
        cityResult = cities[196];
    }

    return cityResult;
}

function setLeftPositionOnSearchCities(){
    if ($('.choose-city-wrapper .enter-city').css('display') === 'block') {
        if ($('.enter-city-container-controls > input').outerWidth() === 400) {
            let left = Math.floor(($('.enter-city-container-controls').width() - ($('.enter-city-container-controls > input').outerWidth(true) + $('.enter-city-container-controls > button').outerWidth())) / 2);
            $('.enter-city-container-controls-search-cities').css({left: left + 'px', width: '400px'});
            $('.enter-city-container-controls-error').css({left: left + 'px', width: '400px'});
        }
        if ($('.enter-city-container-controls > input').outerWidth() < 400) {
            $('.enter-city-container-controls-search-cities').css({left: '0', width: '100%'});
            $('.enter-city-container-controls-error').css({left: '0', width: '100%'});
        }
    }
}

function scrollToActiveShop(){
    var top = 0, heightElement;

    $('.map-sidebar-wrapper .sidebar .shops-block > ul').css('height', 'auto');

    $('.map-sidebar-wrapper .sidebar .shops-block > ul').each(function(index, element){
        if (!$(element).hasClass('active')) {
            heightElement = Math.floor($(element).height());
            $(element).css('height', heightElement + 'px');
            top += heightElement + 30;
        }
        else {
            return false;
        }
    });

    $('.map-sidebar-wrapper .sidebar .shops-block').scrollTop(top);
}