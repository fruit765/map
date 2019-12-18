$(document).ready(function(){
    $('.mobile-btn').on('click', function(){
        openMobileMenu();
    });

    $('.mobile-menu-wrapper-close, .mobile-menu-cover').on('click', function(){
        closeMobileMenu();
    });

    $('.mobile-menu-wrapper-body').on('click', '> ul > li.sub > a', function(){
        $(this).toggleClass('open');
    });

    function openMobileMenu(){
        $('.mobile-menu-cover').stop().animate(
            {
                opacity: '0.6',
            },
            {
                duration: 400,
                easing: 'easeInCubic',
                queue: false,
                start: function(){
                    $('.mobile-menu').css('display', 'block');
                },
            }
        );

        $('.mobile-menu-wrapper').stop().animate(
            {
                left: '0',
            },
            {
                duration: 400,
                easing: 'easeInCubic',
                queue: false,
            }
        );
    }

    function closeMobileMenu(){
        $('.mobile-menu-cover').stop().animate(
            {
                opacity: '0',
            },
            {
                duration: 400,
                easing: 'easeInCubic',
                queue: false,
                complete: function(){
                    $('.mobile-menu').css('display', 'none');
                },
            }
        );

        $('.mobile-menu-wrapper').stop().animate(
            {
                left: '-300px',
            },
            {
                duration: 400,
                easing: 'easeInCubic',
                queue: false,
            }
        );
    }
});