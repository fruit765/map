var mapSidebarVersionWidth = window.innerWidth;

initMapSidebarVersion();

$(window).resize(function(){
    if (!((mapSidebarVersionWidth <= 1000 && window.innerWidth <= 1000) || (mapSidebarVersionWidth > 1000 && window.innerWidth > 1000))) {
        initMapSidebarVersion();
    }
    mapSidebarVersionWidth = window.innerWidth;
});

function initMapSidebarVersion(){
    var sidebarChecksHeight, sidebarBottom;

    if (window.innerWidth <= 1000) {
        $('.map-sidebar-wrapper__cover').css({display: 'none', opacity: '0'});

        if ($('.map-sidebar-wrapper .sidebar__check').css('display') === 'none') {
            sidebarChecksHeight = $('.map-sidebar-wrapper .sidebar__checks').innerHeight() + $('.map-sidebar-wrapper .sidebar__check').outerHeight();
        }
        else {
            sidebarChecksHeight = $('.map-sidebar-wrapper .sidebar__checks').innerHeight();
        }
        sidebarBottom = window.innerHeight - $('.header').outerHeight() - sidebarChecksHeight - 40;
        $('.map-sidebar-wrapper').addClass('map-sidebar-wrapper_mobile');
        $('.map-sidebar-wrapper .sidebar').css('bottom', -sidebarBottom + 'px');
    
        $('.map-sidebar-wrapper .sidebar__check').on('click.map-sidebar-wrapper-event', function(){
            $(this).closest('.sidebar').stop().animate(
                {
                    bottom: 0
                },
                {
                    duration: 1000,
                    easing: 'easeInCubic',
                    queue: false,
                }
            );
    
            $(this).closest('.map-sidebar-wrapper').find('.map-sidebar-wrapper__cover').stop().animate(
                {
                    opacity: 0.6
                },
                {
                    duration: 1000,
                    easing: 'easeInCubic',
                    queue: false,
                    start: function(){
                        $(this).css('display', 'block');
                    },
                }
            );
        });
    
        $('.map-sidebar-wrapper__cover').on('click.map-sidebar-wrapper-event', function(){
            $(this).parent().find('.sidebar__check').removeClass('sidebar__check_mobile_active');
    
            $(this).parent().find('.sidebar').stop().animate(
                {
                    bottom: -sidebarBottom + 'px'
                },
                {
                    duration: 1000,
                    easing: 'easeInCubic',
                    queue: false,
                }
            );
    
            $(this).stop().animate(
                {
                    opacity: 0
                },
                {
                    duration: 1000,
                    easing: 'easeInCubic',
                    queue: false,
                    complete: function(){
                        $(this).css('display', 'none');
                    },
                }
            );
        });
    
        $('.map-sidebar-wrapper .sidebar__items_shops').on('click.map-sidebar-wrapper-event', '.sidebar__item', function(){
            $(this).closest('.map-sidebar-wrapper').find('.sidebar__check').removeClass('sidebar__check_mobile_active');
    
            $(this).closest('.map-sidebar-wrapper').find('.sidebar').stop().animate(
                {
                    bottom: -sidebarBottom + 'px'
                },
                {
                    duration: 1000,
                    easing: 'easeInCubic',
                    queue: false,
                }
            );
    
            $(this).closest('.map-sidebar-wrapper').find('.map-sidebar-wrapper__cover').stop().animate(
                {
                    opacity: 0
                },
                {
                    duration: 1000,
                    easing: 'easeInCubic',
                    queue: false,
                    complete: function(){
                        $(this).css('display', 'none');
                    },
                }
            );
        });
    }
    else {
        $('.map-sidebar-wrapper').removeClass('map-sidebar-wrapper_mobile');
        $('.map-sidebar-wrapper .sidebar__check').off('.map-sidebar-wrapper-event');
        $('.map-sidebar-wrapper__cover').off('.map-sidebar-wrapper-event');
        $('.map-sidebar-wrapper .sidebar__items_shops').off('.map-sidebar-wrapper-event');
        $('.map-sidebar-wrapper .sidebar').css('bottom', '0');
    }
}