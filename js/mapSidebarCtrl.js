function getCityShops(cityObject, shops){
    var cityShops = [];

    shops.forEach(function(shop){
        if (shop.slug === cityObject.Slug) {
            cityShops.push(shop);
        }
    });

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
        cityResult = cities[108];
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