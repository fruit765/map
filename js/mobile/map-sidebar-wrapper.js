if (window.innerWidth <= 1000) {
    var sidebarBottom = window.innerHeight - $('.header').outerHeight() - $('.map-sidebar-wrapper .sidebar__checks').innerHeight() - $('.map-sidebar-wrapper .sidebar__check').outerHeight() - 40;
    $('.map-sidebar-wrapper').addClass('map-sidebar-wrapper_mobile');
    $('.map-sidebar-wrapper .sidebar').css('bottom', -sidebarBottom + 'px');

    $('.map-sidebar-wrapper .sidebar__check').click(function(){
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

    $('.map-sidebar-wrapper__cover').click(function(){
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

    $('.map-sidebar-wrapper .sidebar__items_shops').on('click', '.sidebar__item', function(){
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