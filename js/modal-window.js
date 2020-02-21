$('.modal-window').each(function(index, element){
    var observer = new MutationObserver(function(res){
        console.log($(res[0].target).attr('class'));
    });
    observer.observe(element, {attributeFilter: ['class']});
});

$('.modal-window__wrapper').click(function(e){
    if (e.target === this) {
        $(this).parent().removeClass('modal-window_show');
    }
});

$('.modal-window__close').click(function(){
    $(this).closest('.modal-window').removeClass('modal-window_show');
});