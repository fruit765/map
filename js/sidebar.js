$(document).ready(function(){
    $('.sidebar__checks-content .switch').click(function(){
        if ($(this).hasClass('switch_active')) {
            $('.sidebar__items_inet-shops .sidebar__item[delivery-on-russia="0"]').css('display', 'none');
        }
        else {
            $('.sidebar__items_inet-shops .sidebar__item[delivery-on-russia="0"]').css('display', 'block');
        }
        $('.sidebar__items_inet-shops').scrollTop(0);
    });

    $('.sidebar__check_inet-shops').click(function(){
        $('.sidebar__checks-content .switch').removeClass('switch_active');
        $('.sidebar__items_inet-shops .sidebar__item[delivery-on-russia="0"]').css('display', 'block');
    });
});