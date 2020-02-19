if (window.innerWidth <= 1000) {
    var sidebarHeight = window.innerHeight - $('.header').outerHeight() - 40;
    $('.sidebar').addClass('sidebar_mobile').css('height', sidebarHeight + 'px');
    $('.sidebar__check').click(function(){
        $(this).parent().find('.sidebar__check').removeClass('sidebar__check_mobile_active');
        $(this).addClass('sidebar__check_mobile_active');
    });
}