$('.modal-window').each(function(index, element){
    var observer = new MutationObserver(function(res){
        var self = res[0].target;
        
        if ($(self).attr('class').indexOf('modal-window_show') + 1) {
            $(self).find('.modal-window__cover').stop().animate(
                {
                    opacity: '0.6'
                },
                {
                    duration: 300,
                    easing: 'easeInOut',
                    queue: false,
                    start: function(){
                        $(self).css('display', 'block');
                        $(self).css('width');
                        $(self).addClass('modal-window_animate');
                    },
                },
            );
        }
        else {
            $(self).find('.modal-window__cover').stop().animate(
                {
                    opacity: 0
                },
                {
                    duration: 300,
                    easing: 'easeInOut',
                    queue: false,
                    start: function(){
                        $(self).removeClass('modal-window_animate');
                    },
                    complete: function(){
                        $(self).css('display', 'none');
                    },
                }
            );
        }
    });
    observer.observe(element, {attributes: true, attributeFilter: ['class']});
});

$('.modal-window__wrapper').click(function(e){
    if (e.target === this) {
        $(this).parent().removeClass('modal-window_show');
    }
});

$('.modal-window__close').click(function(){
    $(this).closest('.modal-window').removeClass('modal-window_show');
});