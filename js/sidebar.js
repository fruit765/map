$(document).ready(function(){
    $('.sidebar__items').css('height', 567 - ($('.sidebar__city').outerHeight(true) + $('.sidebar__checks').outerHeight(true)) + 'px');
});