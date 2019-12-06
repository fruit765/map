var viewPortHeight, sidebarHeight, sidebarTitleHeight, sidebarToggleListHeight;

sidebarInit();

$(window).resize(function(){

    sidebarInit();
});

function sidebarInit(){

    viewPortHeight = window.innerHeight;

    sidebarHeight = viewPortHeight - 80;

    $('.map-sidebar-wrapper .map-container, .map-sidebar-wrapper .sidebar').css('height', sidebarHeight + 'px');

    sidebarTitleHeight = $('.map-sidebar-wrapper .sidebar .cities-block .sidebar-title').outerHeight();

    sidebarToggleListHeight = sidebarHeight - sidebarTitleHeight;

    $('.map-sidebar-wrapper .sidebar .shops-block').css('height', sidebarToggleListHeight + 'px');
}

$('.map-sidebar-wrapper .map-btn').click(function(){

    $(this).parent().children('.sidebar').addClass('open');
});

$('.map-sidebar-wrapper .sidebar .sidebar-close').click(function(){

    $(this).parents('.sidebar').removeClass('open');
});