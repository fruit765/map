$(document).ready(function(){
    $('.mobile-btn').on('click', function(){
        openMobileMenu();
    });

    $('.mobile-menu-close, .mobile-menu-cover').on('click', function(){
        closeMobileMenu();
    });

    $('.mobile-menu-body').on('click', '> ul > li.sub > a', function(){
        $(this).toggleClass('open');
    });

    function openMobileMenu(){
        $('.mobile-menu').addClass('open');

        $('.mobile-menu-cover').stop().animate(
            {
                opacity: '0.6',
            },
            {
                duration: 400,
                easing: 'easeInCubic',
                queue: false,
                start: function(){
                    $(this).css('display', 'block');
                },
            }
        );
    }

    function closeMobileMenu(){
        $('.mobile-menu').removeClass('open');

        $('.mobile-menu-cover').stop().animate(
            {
                opacity: '0',
            },
            {
                duration: 400,
                easing: 'easeInCubic',
                queue: false,
                complete: function(){
                    $(this).css('display', 'none');
                },
            }
        );
    }
});