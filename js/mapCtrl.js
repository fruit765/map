var myApp = angular.module('myApp',[]);
myApp.controller('myCtrl', function($scope, $http) { 
    /* Init vars */
    var myMap;

    $scope.cities = [];
    $scope.city = {};
    $scope.autoCity = '';
    $scope.shops = [];
    $scope.cityShops = [];

    /* Controller methods */
    $scope.showCityPopup = function(className){
        $('.map-sidebar-wrapper .map-container, .map-sidebar-wrapper .sidebar').addClass('blur');
        $('.choose-city-wrapper').children().css('display', 'none');
        $('.choose-city-wrapper .' + className).css('display', 'block');

        if (className === 'enter-city') {
            $('.choose-city-wrapper .enter-city .enter-city-container input').focus();
        }
    }
    $scope.confirmAutoCity = function(){
        if ($scope.autoCity !== 'Москва') {
            $scope.showCityPopup('preloader');
            $scope.city = getCityObject($scope.autoCity, $scope.cities);
            $scope.cityShops = getCityShops($scope.city, $scope.shops);
        }

        $('.map-sidebar-wrapper .map-container, .map-sidebar-wrapper .sidebar').removeClass('blur');
        $('.choose-city-wrapper').hide();
    }
    $scope.addShopPoints = function(cityShops){
        var greenCollection = new ymaps.GeoObjectCollection(null, {
            preset: 'islands#greenIcon'
        });

        cityShops.forEach(function(shop){
            greenCollection.add(new ymaps.Placemark([shop.lng, shop.lat]));
        });

        myMap.geoObjects.add(greenCollection);
    }


    $scope.showCityPopup('preloader');

        
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
                        top: Math.floor((sidebarHeight - 75)  / 2) - 31,
                        left: 10
                    }
                }
            });
            myMap.controls.add(zoomControl);
            resolve("Welcome to Karmy shops Map!");              
        });        
    })
    .then(function(){
        /* Preload Cities array */
        $http.get("data/map_cities.json")
        .then(function(response) {
            $scope.cities = response.data["cities"];
            /* Preload Shop Points */
            $scope.city = $scope.cities[108];
        
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
                    myMap.setBounds(myMap.geoObjects.getBounds());

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
                            $scope.autoCity = result;
                            $scope.$apply();
                            $scope.showCityPopup('auto-city');
                        },
                        function(){
                            $scope.autoCity = 'Москва';
                            $scope.$apply();
                            $scope.showCityPopup('auto-city');
                        }
                    );
                }
            });  
        });     
    });
});  /* Endof Ng Controller */