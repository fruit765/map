    var myApp = angular.module('myApp',[]);
    myApp.controller('myCtrl', function($scope, $http) { 
    /* Load Cities Data */     
    var myMap;
    var myGeoObjects = [];
    var myCollection;
    var myCluster;
    var myClusterCollection;
    var CollItemsNumber = 0;
    $scope.cities="";
    $scope.autoCityMode=true;

    /* Promise: GET Map using Y.Maps */
    var mapPromise = new Promise(function(resolve, reject){
        $('.page_title h1').text("Loading Init Map...");
        $('.page_title h1').css({
            'color':'red',
            'font-size':'2rem',
            'margin-left':'0px',
        });
        console.log("Loading Init Map...");
        ymaps.ready(function(){
            myMap = new ymaps.Map('map', {
                center: [52, 52],
                zoom: 13.25,
                controls: []
            });           
            resolve("Welcome to Karmy shops Map!");              
        });
    });
    mapPromise.then(function(initMap){
        $('.page_title h1').text(initMap);
        $('.page_title h1').css({
            'color':'Navy',
            'font-size':'3rem',
            'margin-left':'100px',
            'transition': 'all 1s linear',
        });

    /* Get Cities array */
        $http.get("data/map_cities.json")
        .then(function(response) {          
          $scope.cities = response.data["cities"]; 
        }); 
    });
    /* Get Current User location (if allowed)*/
    $scope.autoCity = new Promise(function(resolve, reject){        
        if (navigator.geolocation) {         
            navigator.geolocation.getCurrentPosition(function(position){            
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                console.log('lat: ' + lat);
                console.log('lng: ' + lng);
                /* Autodefine User location */   
                $http({
                    method: 'GET',       
                    url: "https://geocode-maps.yandex.ru/1.x/?apikey=6c63b2b7-912b-40f2-a252-2cbdc56042b9&geocode="+lat+","+lng+"&sco=latlong&kind=locality&format=json",
                })
                .then(function(response) { 
                    if(response){
                        console.log(response.data.response.GeoObjectCollection.featureMember[0].GeoObject.name);                
                        resolve(response.data.response.GeoObjectCollection.featureMember[0].GeoObject.name);
                    }                                                    
                });    
            });              
        }
        else{
            reject();       
        }            
    });

    $scope.autoCity.then(function(result){
        console.log(result);
        $scope.autoCity = result;        
        })
        .catch(function(error){
            console.log('autoCity reject');
            $scope.autoCity = "Локация не найдена";            
        })
        .finally(function(){
            /* Display Popup window with Response*/ 
            showCityPopup();
        }); 

    /* Choose City Data */
    $scope.getCityDataBySlug= function(citySlug){
        alert('dfg');
        console.log(citySlug);
    } 
        
    /* Choose City Data */
    $scope.getChosenCityData= function(cityData){      
        /* Check only 1 city obtained */
        console.log(cityData);
        /* Next line ONLY to test if came 2 or more cities */
        //cityData = [{'sdf':'sdf'}, {'sdf':'sfsdf'}];
        if(cityData.length == 1){
            cityData.forEach(function(item){
                $scope.changeCity(item);
                hideCityPopup();
            })
        }
        else{
            $('.popup-container-content-content').html('Воспользуйтесь ссылкой Выбрать свой город');
        }       
    }
    /* Get Another City select */
    $scope.getAnotherCity = function(){       
        $scope.autoCityMode = !$scope.autoCityMode;
    }

    /* Change City Func */
    $scope.changeCity = function(city_data){
        $scope.shops="";
        $scope.city = city_data;
        myMap.setCenter([city_data.Long, city_data.Lat], city_data.Scale);
        $http.get("controllers/CSVController.php?slug=" + city_data.Name)
            .then(function(response) {
                $scope.shops = response.data;
                console.log($scope.shops);               
                if($scope.shops){                   
                    /* Remove all items from Collection */
                    if(myCollection){
                        myCollection.removeAll(); 
                    } 
                    if(myClusterCollection){
                        myClusterCollection.removeAll(); 
                    }                   
                    
                    myCollection = new ymaps.GeoObjectCollection({}, {
                        preset: 'islands#greenGlyphIcon',                          
                     });

                    myClusterCollection = new ymaps.GeoObjectCollection({}, {
                        preset: 'islands#blueCircleIcon'                           
                     });

                    ClustersPointsCollLoader($scope.shops);                 
                    
                   myMap.events.add('actionend', function(){                                       
                
                        ClustersPointsCollLoader($scope.shops);
                    });                    

                } 

                function ClustersPointsCollLoader(shops){


                    if(myMap.getZoom() < 12){                        
                        
                        if(myCollection.getLength() > 0){
                        
                            myCollection.removeAll(); 
                        
                        }

                        if(myClusterCollection.getLength() == 0){
                            
                            getCollCluster(city_data.Name);
                            
                            myMap.geoObjects.add(myClusterCollection);

                        }
                        
                    }

                    else{

                        if(myClusterCollection.getLength() > 0){

                            myClusterCollection.removeAll();
                        }                                

                        if(myCollection.getLength() == 0){

                            getPointsToCollection(shops);

                            myMap.geoObjects.add(myCollection);

                        }

                    }
                }

                function getCollCluster(){

                    if(myClusterCollection){

                        myClusterCollection.removeAll(); 

                    }                

                    myCluster = new ymaps.GeoObject({
                                
                        geometry:{

                            type: "Point",

                            coordinates: [$scope.city.Long, $scope.city.Lat],
                                
                        },                         
                            
                        properties: {       
                           
                        iconContent: CollItemsNumber
                        }
                        
                        
                    });

                     myCluster.events.add('click', function(){ 

                        myMap.setCenter([$scope.city.Long, $scope.city.Lat], 13,{duration: 500});

                    });   

                    myClusterCollection.add(myCluster);

                    
                }
                
                
                function getPointsToCollection(shops){

                if(shops){

                    shops.forEach(function(value, index){
                
                        myGeoObjects[index] = new ymaps.GeoObject({
                                
                            geometry:{

                                type: "Point",

                                coordinates: [value.lng, value.lat],
                                    
                            },                         
                                
                            properties: {

                                name: 'Zoo' + index
                            
                            },
                            // options:{
                            //     preset: 'islands#blueGlyphIcon', 
                            //     iconGlyph: 'thumbs-up',
                            //     iconGlyphColor: 'blue'
                            // }
                            
                        });       
                        
                        
                        myGeoObjects[index].events.add('click', function(e){ 

                            myCollection.each(function(item){
                                
                                item.options.set('preset', 'islands#greenGlyphIcon');
                            });
                                                        
                            
                            myGeoObjects[index].options.set('preset', 'islands#redGlyphIcon').set('iconGlyphColor','red');                          

                            //console.log(e.get('target').options.getAll());                          

                            let placeName = getPointName(e);

                            let placeCoords = getPointCoords(e);

                            centrifyPoint(placeCoords);                                     

                            hideAllShopDetails();

                            $('#' + placeName).find('#shop-details-block').removeClass('is-off').addClass('is-on');                  

                        });

                        

                        myCollection.add(myGeoObjects[index]);

                        CollItemsNumber = myCollection.getLength();

                        //   myMap.geoObjects.add(myGeoObjects[index]); 
                
                    });
                }
            }
             
        });        

    } 
    
    
    $scope.zoomShop = function(shop, index){       
        
        $scope.shop_item = shop.name;

        myMap.setCenter([shop.lng, shop.lat], 15,{duration: 500}); 

         /*Make all points in Collection to be green */

        myCollection.each(function(item){
                                
            item.options.set('preset', 'islands#greenGlyphIcon');
        });

        
        /* Searching of required point in Collection */
        
        myCollection.each(function(item){          
                                
            if(item.properties.get('name') == ('Zoo' + index)){

                item.options.set('preset', 'islands#redGlyphIcon');

        }

        });

    } 
   

    function getPointName(e){

        let placeProps = e.get('target').properties.getAll();
        return placeProps['name'];
    }

    function getPointCoords(e){
        return placeProps = e.get('coords');        
    }

    function centrifyPoint(coords){
        myMap.panTo([coords[0], coords[1]], {duration: 500});
    }   
    
});    
    function showCityPopup(){
        $('.popup-wrapper').css({
            display:'flex',
        })
    }
    function hideCityPopup(){
        $('.popup-wrapper').css({
            display:'none',
        })
    }
   function showShopDetails(that){
        toggleShopDetails(that);
        console.log($(that).children()[1]);
        let shop_item = $(that).children()[1];        
        $(shop_item).toggleClass('is-on');    
    }

    function toggleShopDetails(that){
        $('.is-on').removeClass('is-on').addClass('is-off');
        let shop_item = $(that).children()[1];
        console.log(shop_item);        
        $(shop_item).toggleClass('is-off');
        // $('#shopList').find('.visible').removeClass('visible').addClass('hidden');
    }

    function hideAllShopDetails(){       
        console.log($('.is-on'));       
        $('.is-on').removeClass('is-on').addClass('is-off');       
    }


