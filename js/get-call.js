
$(document).ready(function(){

    $('#get-call-modal').on('show.bs.modal', function(){
        
        $(this).css('display', 'block');

        $(this).css('width');

        $(this).addClass('show');
    });

    $('#get-call-modal').on('hide.bs.modal', function(){
        
        $(this).addClass('close');

        $('.modal-backdrop').removeClass('show');
    });

    $('#get-call-modal').on('hidden.bs.modal', function(){
        
        $(this).removeClass('close');
    });

    $('.get-call-modal-close, .get-call-modal-close-mobile').click(function(){

        $('#get-call-modal').modal('hide');
    });
});