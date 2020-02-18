$('.search-block__input').val('');

$('.search-block__input').on('input', function(){
    if ($(this).val() !== '') {
        $(this).closest('.search-block').addClass('search-block_writting');
    }
    else {
        $(this).closest('.search-block').removeClass('search-block_writting');
    }
});