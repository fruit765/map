$(document).ready(function(){
    $('.modal-window__wrapper').click(function(e){
        if (e.target === this) {
            $(this).parent().removeClass('modal-window_show');
        }
    });

    $('.modal-window__close').click(function(){
        $(this).closest('.modal-window').removeClass('modal-window_show');
    });
});