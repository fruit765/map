
$(document).ready(function(){

    $('.map-sidebar-wrapper .map-btn').click(function(){

        $(this).parent().children('.sidebar').addClass('open');
    });

    $('.map-sidebar-wrapper .sidebar .sidebar-close').click(function(){

        $(this).parents('.sidebar').removeClass('open');
    });

    $('.map-sidebar-wrapper .sidebar').on('click', '.shops-block-list-item .show-on-map', function(){

        $('.map-sidebar-wrapper .sidebar').removeClass('open');
    });
});