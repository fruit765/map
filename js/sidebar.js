$(document).ready(function(){
    // Показываем или скрываем магазины, у которых нет доставки только по России
    $('.sidebar__checks-content .switch').click(function(){
        if ($(this).hasClass('switch_active')) {
            $('.sidebar__items_inet-shops .sidebar__item[delivery-on-russia="0"]').css('display', 'none');
        }
        else {
            $('.sidebar__items_inet-shops .sidebar__item[delivery-on-russia="0"]').css('display', 'block');
        }
        $('.sidebar__items_inet-shops').scrollTop(0);
    });

    // Возвращаем состояние вкладки интернет-магазинов в исходное состояние
    $('.sidebar__check_inet-shops').click(function(){
        $('.sidebar__checks-content .switch').removeClass('switch_active');
        $('.sidebar__items_inet-shops .sidebar__item[delivery-on-russia="0"]').css('display', 'block');
    });
});