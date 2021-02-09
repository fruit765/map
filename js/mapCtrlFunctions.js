function scrollToActiveShop(){
    var top = 0, heightElement;

    if ($('.sidebar__items_shops .sidebar__item_active').length === 0) {
        $('.sidebar__items_shops').scrollTop(top);
        alert('Данный магазин находится за пределами выбранного населенного пункта!');
        return;
    }

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

function setSidebarItemsShopsHeight(){
    $('.sidebar__items_shops').css('height', $('.sidebar').height() - ($('.sidebar__city').outerHeight(true) + $('.sidebar__checks').outerHeight(true)) + 'px');
}

function setSidebarItemsInetShopsHeight(){
    $('.sidebar__items_inet-shops').css('height', $('.sidebar').height() - ($('.sidebar__city').outerHeight(true) + $('.sidebar__checks').outerHeight(true) + $('.sidebar__switch').outerHeight(true)) + 'px');
}

function getSidebarChecksHeight(){
    var sidebarChecksHeight = 0;

    if ($('.map-sidebar-wrapper .sidebar__check').length > 0) {
        sidebarChecksHeight = $('.map-sidebar-wrapper .sidebar__checks').innerHeight() + $('.map-sidebar-wrapper .sidebar__check').outerHeight();
        $('.map-sidebar-wrapper .sidebar__check').each(function(index, element){
            if ($(element).css('display') !== 'none') {
                sidebarChecksHeight = $('.map-sidebar-wrapper .sidebar__checks').innerHeight();
                return false;
            }
        });
    }

    return sidebarChecksHeight;
}

function hidePlacemark(map){
    map.geoObjects.each(function(geoObject){
        geoObject.options.set('visible', false);
    });
}

function showPlacemark(map){
    map.geoObjects.each(function(geoObject){
        geoObject.options.set('visible', true);
    });
}