var myApp = angular.module('myApp',[]);
myApp.controller('myCtrl', function($scope, $http) { 
    /* Init vars */
    var myMap, BalloonContentLayout, BalloonContentLayoutWithoutSite;
    var zoomControl;
    var backBtnWay = 'modal';
    var user = detect.parse(navigator.userAgent);
    var deviceType = user.device.type;

    $scope.cities = [];
    $scope.city = {};
    $scope.autoCity = {};
    $scope.shops = [];
    $scope.cityShops = [];
    $scope.searchCityName = '';
    $scope.searchCities = [];
    $scope.searchError = '';

    /* Controller methods */
    $scope.showCityPopup = function(className){
        $('.choose-city-wrapper').show();

        $('.map-sidebar-wrapper .map-container, .map-sidebar-wrapper .sidebar').addClass('blur');
        $('.choose-city-wrapper').children().css('display', 'none');
        $('.choose-city-wrapper .' + className).css('display', 'block');

        if (className === 'enter-city') {
            $scope.searchCityName = '';
            $scope.searchCities = [];

            $('.choose-city-wrapper .enter-city .enter-city-container input').focus();
            setLeftPositionOnSearchCities();

            $('.enter-city-container-controls-error').css('display', 'none');
            $('.enter-city-container-controls-search-cities').css('display', 'none');
        }
    }
    $scope.confirmAutoCity = function(){
        if ($scope.autoCity.Name !== 'Москва') {
            $scope.showCityPopup('preloader');
            $scope.city = $scope.autoCity;
            $scope.cityShops = getCityShops($scope.city, $scope.shops);
            $scope.addShopPoints($scope.cityShops);
        }

        $('.map-sidebar-wrapper .map-container, .map-sidebar-wrapper .sidebar').removeClass('blur');
        $('.choose-city-wrapper').hide();
    }
    $scope.addShopPoints = function(cityShops){
        myMap.geoObjects.removeAll();

        cityShops.forEach(function(shop, index){
            var balloonLayout;

            if (shop.site) {
                balloonLayout = BalloonContentLayout;
            }
            else {
                balloonLayout = BalloonContentLayoutWithoutSite;
            }

            var placemark = new ymaps.Placemark([shop.lng, shop.lat],
                {
                    id: index,
                    type: 'shopPoint',
                    active: 0,
                    name: shop.name,
                    address: shop.street_type + ' ' + shop.street + ', ' + shop.house,
                    hours: shop.hours,
                    phone: shop.phone,
                    site: shop.site,
                },
                {
                    iconLayout: 'default#image',
                    iconImageHref: '/img/placemark.svg',
                    iconImageSize: [25, 37],
                    balloonLayout: balloonLayout,
                    balloonOffset: [7, 30],
                    hideIconOnBalloonOpen: false,
                }
            );

            if (index === 0) {
                placemark.options.set('iconImageHref', '/img/placemark-active.svg');
                placemark.options.set('iconImageSize', [34, 50]);
                placemark.properties.set('active', 1);
            }

            placemark.events.add('click', function(e){
                $scope.activeShop(e.get('target').properties.get('id'));
                scrollToActiveShop();
            });

            myMap.geoObjects.add(placemark);
        });

        $scope.setCorrectZoom();
    }
    $scope.activeShop = function(id){
        myMap.geoObjects.each(function(geoObject){
            if (geoObject.properties.get('type') == 'shopPoint') {
                if (geoObject.properties.get('id') == id) {
                    geoObject.properties.set('active', 1);
                    geoObject.options.set('iconImageHref', '/img/placemark-active.svg');
                    geoObject.options.set('iconImageSize', [34, 50]);
                }
                else {
                    if (geoObject.properties.get('active') == 1) {
                        geoObject.properties.set('active', 0);
                        geoObject.options.set('iconImageHref', '/img/placemark.svg');
                        geoObject.options.set('iconImageSize', [25, 37]);
                    }
                }
            }
        });

        $('.map-sidebar-wrapper .sidebar .shops-block > ul').removeClass('active');
        $($('.map-sidebar-wrapper .sidebar .shops-block > ul')[id]).addClass('active');
    }
    $scope.searchCityByName = function(){
        $scope.searchCities = [];
        if ($scope.searchCityName !== '') {
            $scope.cities.forEach(function(cityObject){
                if (cityObject.Name.toLowerCase().match('^' + $scope.searchCityName.toLowerCase())) {
                    $scope.searchCities.push(cityObject);
                }
            });

            if ($scope.searchCities.length > 0) {
                $('.enter-city-container-controls-error').css('display', 'none');
                $('.enter-city-container-controls-search-cities').css('display', 'flex');
            }
            else {
                $scope.searchError = 'Данного города нет!';
                
                $('.enter-city-container-controls-search-cities').css('display', 'none');
                $('.enter-city-container-controls-error').css('display', 'block');
            }
        }
        else {
            $('.enter-city-container-controls-search-cities').css('display', 'none');
            $('.enter-city-container-controls-error').css('display', 'none');
        }
    }
    $scope.confirmSearchCity = function(){
        if ($scope.searchCityName === '') {
            $scope.searchError = 'Введите название города!';

            $('.enter-city-container-controls-search-cities').css('display', 'none');
            $('.enter-city-container-controls-error').css('display', 'block');
        }
        else {
            if ($scope.searchCities.length > 0 && $scope.searchCityName.toLowerCase() === $scope.searchCities[0].Name.toLowerCase()) {
                $('.enter-city-container-controls-search-cities').css('display', 'none');
                $('.enter-city-container-controls-error').css('display', 'none');

                $scope.showCityPopup('preloader');
                $scope.city = $scope.searchCities[0];
                $scope.cityShops = getCityShops($scope.city, $scope.shops);
                $scope.addShopPoints($scope.cityShops);

                $('.map-sidebar-wrapper .sidebar').removeClass('open');

                $('.map-sidebar-wrapper .map-container, .map-sidebar-wrapper .sidebar').removeClass('blur');
                $('.choose-city-wrapper').hide();
            }
            else {
                $scope.searchError = 'Данного города нет!';
            
                $('.enter-city-container-controls-search-cities').css('display', 'none');
                $('.enter-city-container-controls-error').css('display', 'block');
            }
        }
    }
    $scope.updateZoomControl = function(){
        myMap.controls.remove(zoomControl);

        zoomControl = new ymaps.control.ZoomControl({
            options: {
                size: "small",
                position: {
                    top: Math.floor((sidebarHeight - parseInt($('.map-sidebar-wrapper .map-container').css('paddingBottom'), 10))  / 2) - 31,
                    left: 10
                }
            }
        });
        myMap.controls.add(zoomControl);
    }
    $scope.setCorrectZoom = function(){
        myMap.setBounds(myMap.geoObjects.getBounds(), {checkZoomRange:true});
    }


    // Обработчики событий на элементах
    $('.map-sidebar-wrapper .sidebar .shops-block').on('click', '> ul', function(){
        $scope.setCorrectZoom();
        myMap.balloon.close();
        $scope.activeShop($(this).attr('city-id'));
        $('.map-sidebar-wrapper .sidebar').removeClass('open');
    });

    $('.choose-city-wrapper .enter-city').on('click', '.enter-city-container-controls-search-cities .search-city', function(){
        var self = this;
        $scope.$apply(function(){
            $scope.searchCityName = $(self).text();
            $scope.searchCityByName();
            $('.enter-city-container-controls-search-cities').css('display', 'none');
        });
    });

    $('.back-btn').on('click', function(){
        switch(backBtnWay) {
            case 'modal':
                $scope.showCityPopup('auto-city');
                break;

            case 'map':
                $('.map-sidebar-wrapper .map-container, .map-sidebar-wrapper .sidebar').removeClass('blur');
                $('.choose-city-wrapper').hide();
                break;

            default:
                break;
        }
    });

    $('.sidebar-title-city').on('click', function(){
        $scope.showCityPopup('enter-city');
        $scope.$apply();
        backBtnWay = 'map';
    });

    $('.choose-city-wrapper').on('keydown', function(event) {
        if (event.which == 13) {
            $scope.$apply(function(){
                if ($('.choose-city-wrapper .enter-city').css('display') === 'block') {
                    $scope.confirmSearchCity();
                }

                if ($('.choose-city-wrapper .auto-city').css('display') === 'block') {
                    $scope.confirmAutoCity();
                }
            });
        }
    });
    // Обработчики событий на элементах КОНЕЦ


    $scope.showCityPopup('preloader');


    if (!(deviceType === 'Desktop' && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
        $('.enter-city-container-controls, .map-sidebar-wrapper .sidebar .shops-block').addClass('mobile');
    }

        
    /* Promise: GET Map using Y.Maps */
    new Promise(function(resolve, reject){                
        ymaps.ready(function(){
            myMap = new ymaps.Map('map', {
                center: [55.73, 37.75],
                zoom: 9,
                controls: []
            });             
            zoomControl = new ymaps.control.ZoomControl({
                options: {
                    size: "small",
                    position: {
                        top: Math.floor((sidebarHeight - parseInt($('.map-sidebar-wrapper .map-container').css('paddingBottom'), 10))  / 2) - 31,
                        left: 10
                    }
                }
            });
            myMap.controls.add(zoomControl);  
            
            // Стилизуем баллун
            BalloonContentLayout = ymaps.templateLayoutFactory.createClass([
                '<div class="balloon-popup">',
                    '<div class="balloon-finger"></div>',
                  '<a class="balloon-popup-close" href="#">X</a>',
                  '<div class="balloon-popup-content">',
                    '<ul>',
                        '<li>{{properties.name}}</li>',
                        '<li>{{properties.address}}</li>',
                        '<li>{{properties.hours}}</li>',
                        '<li>{{properties.phone}}</li>',
                        '<li><a href="{{properties.site}}" target="_blank">{{properties.site}}</a></li>',
                    '</ul>',
                  '</div>',
                '</div>'
              ].join(''), {
                build: function () {
                  BalloonContentLayout.superclass.build.call(this);
                  this.handleClose = $.proxy(this.handleClose, this);
                  jQuery(this.getParentElement)
                    .on('click', '.balloon-popup-close', this.handleClose);
                },
                clear: function () {
                  jQuery(this.getParentElement)
                    .off('click', '.balloon-popup-close', this.handleClose);
                  BalloonContentLayout.superclass.build.call(this);
                },
                handleClose: function () {
                  this.events.fire('userclose');
                }
            });

            BalloonContentLayoutWithoutSite = ymaps.templateLayoutFactory.createClass([
                '<div class="balloon-popup">',
                    '<div class="balloon-finger"></div>',
                  '<a class="balloon-popup-close" href="#">X</a>',
                  '<div class="balloon-popup-content">',
                    '<ul>',
                        '<li>{{properties.name}}</li>',
                        '<li>{{properties.address}}</li>',
                        '<li>{{properties.hours}}</li>',
                        '<li>{{properties.phone}}</li>',
                    '</ul>',
                  '</div>',
                '</div>'
              ].join(''), {
                build: function () {
                    BalloonContentLayoutWithoutSite.superclass.build.call(this);
                  this.handleClose = $.proxy(this.handleClose, this);
                  jQuery(this.getParentElement)
                    .on('click', '.balloon-popup-close', this.handleClose);
                },
                clear: function () {
                  jQuery(this.getParentElement)
                    .off('click', '.balloon-popup-close', this.handleClose);
                    BalloonContentLayoutWithoutSite.superclass.build.call(this);
                },
                handleClose: function () {
                  this.events.fire('userclose');
                }
            });
            // Стилизуем баллун КОНЕЦ

            resolve("Welcome to Karmy shops Map!");
        });        
    })
    .then(function(){
        /* Preload Cities array */
        $http.get("data/map_cities.json")
        .then(function(response) {
            $scope.cities = response.data["cities"];
            /* Preload Shop Points */
            $scope.city = $scope.cities[199];
        
            /* Run AJAX POST Shop Points request */
            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            $http({
                method:'post',
                url:'controllers/CSVController.php',
                data:{'points':'all'}
            })
            .then(function(response) {                
                $scope.shops = response.data;
                if($scope.shops){
                    $scope.cityShops = getCityShops($scope.city, $scope.shops);
                    $scope.addShopPoints($scope.cityShops);

                    $(window).resize(function(){
                        setTimeout(function(){
                            $scope.setCorrectZoom();
                            setLeftPositionOnSearchCities();
                            $scope.updateZoomControl();
                        }, 0);
                    });

                    /* Get Current User location (if allowed)*/
                    new Promise(function(resolve, reject){ 
                        setTimeout(function(){
                            reject();
                        }, 5000);
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(function(position){
                                var lat = position.coords.latitude;
                                var lng = position.coords.longitude;
                                /* Autodefine User location */   
                                $http({
                                    method: 'GET',       
                                    url: "https://geocode-maps.yandex.ru/1.x/?apikey=6c63b2b7-912b-40f2-a252-2cbdc56042b9&geocode="+lat+","+lng+"&sco=latlong&kind=locality&format=json",
                                })
                                .then(function(response) {
                                    if(response){
                                        resolve(response.data.response.GeoObjectCollection.featureMember[0].GeoObject.name);
                                    }                                                    
                                });    
                            });              
                        }           
                    })
                    .then(
                        function(result){
                            $scope.autoCity = getCityObject(result, $scope.cities);
                            $scope.$apply();
                            $scope.showCityPopup('auto-city');
                        },
                        function(){
                            $scope.autoCity = $scope.cities[199];
                            $scope.$apply();
                            $scope.showCityPopup('auto-city');
                        }
                    );
                }
            });  
        });     
    });
});  /* Endof Ng Controller */