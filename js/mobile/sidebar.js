var sidebarVersionWidth = window.innerWidth;

initSidebarVersion();

$(window).resize(function(){
    if (!((sidebarVersionWidth <= 1000 && window.innerWidth <= 1000) || (sidebarVersionWidth > 1000 && window.innerWidth > 1000))) {
        initSidebarVersion();
    }
    sidebarVersionWidth = window.innerWidth;
});

function initSidebarVersion(){
    var sidebarHeight;

    if (window.innerWidth <= 1000) {
        sidebarHeight = window.innerHeight - $('.header').outerHeight() - 40;
        $('.sidebar').addClass('sidebar_mobile').css('height', sidebarHeight + 'px');
        setSidebarItemsShopsHeight();
        setSidebarItemsInetShopsHeight();
        $('.sidebar__check').on('click.sidebar-event', function(){
            $(this).parent().find('.sidebar__check').removeClass('sidebar__check_mobile_active');
            $(this).addClass('sidebar__check_mobile_active');
        });
    }
    else {
        $('.sidebar').removeClass('sidebar_mobile');
        $('.sidebar__check').removeClass('sidebar__check_mobile_active');
        $('.sidebar__check').off('.sidebar-event');
        $('.sidebar').css('height', '597px');
        setSidebarItemsShopsHeight();
        setSidebarItemsInetShopsHeight();
    }
}