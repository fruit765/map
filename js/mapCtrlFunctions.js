function getShop(fullCityName, shops){
    for (var i = 0; i < shops.length; i++) {
        if (shops[i].full_city_name === fullCityName) {
            break;
        }
    }

    return shops[i];
}

function getCityName(fullCityName, shops){
    for (var i = 0; i < shops.length; i++) {
        if (shops[i].full_city_name === fullCityName) {
            break;
        }
    }

    return shops[i].prefix + ' ' + shops[i].city;
}

function scrollToActiveShop(){
    var top = 0, heightElement;

    $('.sidebar__items_shops .sidebar__item').css('height', 'auto');

    $('.sidebar__items_shops .sidebar__item').each(function(index, element){
        if (!$(element).hasClass('sidebar__item_active')) {
            heightElement = Math.floor($(element).innerHeight());
            $(element).css('height', heightElement + 'px');
            top += heightElement;
        }
        else {
            return false;
        }
    });

    $('.sidebar__items_shops').scrollTop(top);
}