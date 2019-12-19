var viewPortHeight, sidebarHeight, sidebarTitleHeight, sidebarToggleListHeight;

sidebarInit();

$(window).resize(function(){

    sidebarInit();
});

function sidebarInit(){

    viewPortHeight = window.innerHeight;

    sidebarHeight = viewPortHeight - 80;

    $('.map-sidebar-wrapper').css('height', sidebarHeight + 'px');

    sidebarTitleHeight = $('.map-sidebar-wrapper .sidebar .cities-block .sidebar-title').outerHeight();

    sidebarToggleListHeight = sidebarHeight - sidebarTitleHeight;

    $('.map-sidebar-wrapper .sidebar .shops-block').css('height', sidebarToggleListHeight + 'px');

    if ($('.map-sidebar-wrapper .sidebar .shops-block > ul.active').length > 0) {
        scrollToActiveShop();
    }
}

$('.map-sidebar-wrapper .map-btn').click(function(){

    $(this).parent().children('.sidebar').addClass('open');

    if ($('.map-sidebar-wrapper .sidebar .shops-block > ul.active').length > 0) {
        scrollToActiveShop();
    }
});

$('.map-sidebar-wrapper .sidebar .sidebar-close').click(function(){

    $(this).parents('.sidebar').removeClass('open');
});