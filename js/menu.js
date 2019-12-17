
$(document).ready(function(){

    var timers = [];

    $('.menu .item > a').each(function(){

        if ($(this).attr('timer')) {

            timers[$(this).attr('timer')] = null;
        }
    });

    $('.sub-menu').on('mouseenter', function(){

        clearTimeout(timers[$(this).parent().children('a').attr('timer')]);
    });

    $('.sub-menu').on('mouseleave', function(){

        var self = this;

        timers[$(this).parent().children('a').attr('timer')] = setTimeout(function(){

            $(self).stop().animate(

                {
                    
                    opacity: 0
                },
    
                {
    
                    duration: 100,
    
                    easing: 'easeOutSine',
    
                    queue: false,
    
                    complete: function(){
    
                        $(this).css('display', 'none');
                    },
                }
            );
        }, 200);
    });

    $('.menu .item > a').on('mouseover', function(){

        clearTimeout(timers[$(this).attr('timer')]);

        $(this).parent().children('.sub-menu').stop().animate(

            {
                
                opacity: 1
            },

            {

                duration: 200,

                easing: 'easeOutSine',

                queue: false,

                start: function(){

                    $(this).css('display', 'block');
                },
            }
        );
    });

    $('.menu .item > a').on('mouseout', function(){

        var self = this;
    
        timers[$(this).attr('timer')] = setTimeout(function(){

            $(self).parent().children('.sub-menu').stop().animate(

                {
                    
                    opacity: 0
                },
    
                {
    
                    duration: 100,
    
                    easing: 'easeOutSine',
    
                    queue: false,
    
                    complete: function(){
    
                        $(this).css('display', 'none');
                    },
                }
            );
        }, 200);
    });
});