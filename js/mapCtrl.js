var myApp = angular.module('myApp',[]);
myApp.controller('myCtrl', function($scope, $http) { 
/* Init vars */     
var myMap;
var myGeoObjects = [];    
var myCluster=[]; 
var myCollection; 
var myClusterCollection; 
/* Init Promises states */
var clusterCollReady = false;
var pointsCollReady = false;
var ClustersPointsCollLoaderReady = false;
var changeCityReady = false;


$scope.cities="";
$scope.currCityName="";
$scope.currCitySlug = "";


// Центрирование по вертикали элементов zoomControl
var zoomControl;
$(window).resize(function(){

    myMap.controls.remove(zoomControl);

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
});

    
/* Promise: GET Map using Y.Maps */
var mapPromise = new Promise(function(resolve, reject){                
    ymaps.ready(function(){
        myMap = new ymaps.Map('map', {
            center: [52, 52],
            zoom: 13.25,
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
});
mapPromise.then(function(){
    /* Preload Cities array */
    $http.get("data/map_cities.json")
    .then(function(response) {          
        $scope.cities = response.data["cities"];
        /* Preload Shop Points */
        $scope.shops="";
        if($scope.autoCity){                
            var cityId = getCityIdByName($scope.autoCity);
            $scope.city = $scope.cities[cityId];
        }
        else{
            //console.log('$scope.autoCity not found');
            $scope.city = $scope.cities[3];
            $scope.autoCity = $scope.city.Name;                            
        } 
        $scope.city = $scope.cities[3];                     
        $scope.currCityName = $scope.city.Name;
        $scope.currCitySlug = $scope.city.Slug;
        myMap.setCenter([$scope.city.Long, $scope.city.Lat], $scope.city.Scale);
     
        /* Run AJAX POST Shop Points request */
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        $http({
            method:'post',
            url:'controllers/CSVController.php',
            data:{'points':'all'}
        })
        .then(function(response) {                
            $scope.shops = response.data; 
            //console.log($scope.shops);                                                  
            if($scope.shops){ 
                displayCityShops($scope.currCitySlug);            
                /* Load Point or Cluster Collection */           
                var ClustersPointsCollLoaderPromise = new Promise(function(resolve, reject){
                    //console.log('Preload>> ClustersPointsCollLoader');
                    ClustersPointsCollLoader();                        
                    var ClustersPointsCollLoaderReadyCheck = setInterval(function(){
                        if(ClustersPointsCollLoaderReady){
                            //console.logconsole.log('ClustersPointsCollLoaderPromise to resolve');
                            resolve();
                            clearInterval(ClustersPointsCollLoaderReadyCheck);
                            ClustersPointsCollLoaderReady = false;
                        }
                    },100);               
                });
                ClustersPointsCollLoaderPromise.then(function(){
                    //console.log('ACTION_END>>>');
                    if(myCollection != undefined){
                        //console.logconsole.log('myCollection.getLength: ' + myCollection.getLength());
                    }
                    if(myClusterCollection != undefined){
                        //console.log('myClusterCollection.getLength: ' + myClusterCollection.getLength());
                    }
                    //console.logconsole.log('ClustersPointsCollLoaderPromise return true');
                    ClustersPointsCollLoaderReady = true;
                    //console.log('currCity: ' + $scope.currCityName);
                        showAllCityShops();
                })   
                                       
                myMap.events.add('actionend', function(){                                        
                    //console.log('Preload Actionend ClustersPointsCollLoader');                        
                         ClustersPointsCollLoader();                         
                    var ClustersPointsCollLoaderPromise = new Promise(function(resolve, reject){                                               
                        var ClustersPointsCollLoaderReadyCheck = setInterval(function(){
                            if(ClustersPointsCollLoaderReady){
                                //console.log('ClustersPointsCollLoaderPromise to resolve');
                                resolve();
                                clearInterval(ClustersPointsCollLoaderReadyCheck);
                                ClustersPointsCollLoaderReady = false;
                            }
                        },100);               
                    });
                    ClustersPointsCollLoaderPromise.then(function(){                        
                        ClustersPointsCollLoaderReady = true;
                        //console.log('ACTION_END>>>');
                        if(myCollection != undefined){
                            //console.log('myCollection.getLength: ' + myCollection.getLength());
                        }
                        if(myClusterCollection != undefined){
                            //console.log('myClusterCollection.getLength: ' + myClusterCollection.getLength());
                        }
                        //console.log('currCity: ' + $scope.currCityName);
                        showAllCityShops(); 
                        /* Service Info */
                        //console.log('Map center: ' + myMap.getCenter());
                        //console.log('Map zoom: ' + myMap.getZoom());                       
                    }) 
                });
            }
        }); 
    });     
})
/* Get Current User location (if allowed)*/
$scope.autoCity = new Promise(function(resolve, reject){  
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
            }, function errorCallback() {
                reject();
              });    
        });              
    }
    else{
        reject();       
    }            
});

$scope.autoCity.then(function(result){             
    $scope.autoCity = result;        
    })
    .catch(function(error){
        //console.log('autoCity rejected');
        $('.popup-container-content-content').text("������� �� �������");            
    })
    .finally(function(){
        /* Display Popup window with Response*/ 
        //showCityPopup();
    });     
    
/* Choose City Data */
$scope.getChosenCityData= function(cityData){      
    /* Check only 1 city obtained         
    * Next line ONLY to test if came 2 or more cities
    */ 
    //cityData = [{'sdf':'sdf'}, {'sdf':'sfsdf'}];
    if(cityData.length == 1){
        cityData.forEach(function(item){
            $scope.changeCity(item);
            hideCityPopup();
        })
    }
    else{
        $('.popup-container-content-content').html('�������������� ������� ������� ���� �����');
    }       
}   

function ClustersPointsCollLoader(){ 
    /* Condition to show Clusters */
    if(myMap.getZoom() < 12){       
        /* Remove Points */
        if(myCollection!=undefined ){                        
            myCollection.removeAll();            
        }                      
        /* Show Clusters */
        if(myClusterCollection==undefined ){
            myClusterCollection = new ymaps.GeoObjectCollection({}, {
                preset: 'islands#blueCircleIcon',                          
            });
        } 
        /* Load Cluster Collection */               
        if(!myClusterCollection.getLength()){                           
            var clusterReady = new Promise(function(resolve,reject){
            getClusterCollection($scope.currCityName);
            /* check if getClusterCollection() executed with $scope.clusterCollReady */
            var clusterCollReadyCheck = setInterval(function(){
                if(clusterCollReady){                                                                
                resolve();
                clearInterval(clusterCollReadyCheck);
                clusterCollReady = false;
                }
            },100);                                                   
        });                           
        clusterReady.then(function(){
            myMap.geoObjects.add(myClusterCollection);
            ClustersPointsCollLoaderReady = true;
        });        
    } 
    else{        
        ClustersPointsCollLoaderReady = true;
        return;
    }                       
}
    /* Condition to show Points */
    else{
        /* Remove Clusters */
        if(myClusterCollection!=undefined ){        
            myClusterCollection.removeAll();
        }            
        /* Show Points */
        if(myCollection==undefined ){
            myCollection = new ymaps.GeoObjectCollection({}, {
                preset: 'islands#greenGlyphIcon',                          
            });
        }       
        if(!myCollection.getLength()){         
            getPointsCollection();             
            var PointsCollectionPromise = new Promise(function(resolve,reject){       
                var pointsReadyCheck = setInterval(function(){
                if(pointsCollReady){              
                    resolve();
                    clearInterval(pointsReadyCheck);
                    pointsCollReady = false;
                } 
                },100);
            });                           
            PointsCollectionPromise.then(function(){
                myMap.geoObjects.add(myCollection);  
                ClustersPointsCollLoaderReady = true;                         
                pointsCollReady = true;
            });            
        }
        else{  
            ClustersPointsCollLoaderReady = true;        
            pointsCollReady = true;
        }
    }
}

function getPointsCollection(){   
    if(parseInt(myCollection.getLength())>0){         
        return;
    }           
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    var pointsCollPromise = new Promise(function(resolve, reject){
        $http({
        method:'post',
        url:'controllers/CSVController.php',
        data:{'points':'all'}
    }).then(function(response){
        var shops = response.data;
        if(shops){                    
            shops.forEach(function(value, index){                
                myGeoObjects[index] = new ymaps.GeoObject({                                
                    geometry:{
                        type: "Point",
                        coordinates: [value.lng, value.lat],                                    
                    },                           
                    properties: {
                        name: 'Zoo' + index,
                        cityName:  value.city                           
                    },                            
                }); 
                                      
                /**
                 *  Point Click event 
                 **/
                myGeoObjects[index].events.add('click', function(e){                                             
                    let placeName = getPointName(e);                                      
                    let placeCoords = getPointCoords(e);                          
                    var CityId = getCityIdByName(getPointCityName(e));                      
                    var changeCityPromise = new Promise(function(resolve, reject){
                        $scope.changeCity($scope.cities[CityId], true);
                        var changeCityPromiseCheck = setInterval(function(){
                            if(changeCityReady){                                
                                resolve();
                                clearInterval(changeCityPromiseCheck);
                                changeCityReady = false;
                            }                          
                        },100);                        
                    });
                    changeCityPromise.then(function(){                        
                        $scope.zoomShop(value, index);
                        closeCityBlock();
                        closeCityBlockArrow();
                    });  
                    centrifyPoint(placeCoords);                             
                    hideAllShopDetails();
                    displayCityShops($scope.currCitySlug);            
                    showShopDetails($('#' + placeName));   
                    console.log('222');                                          
                });// Endof Point Click event

                /* Add Point to Pointscollection */                    
                myCollection.add(myGeoObjects[index]);                                   
                resolve();                                                                 
            });                       
        }
    });  
});
pointsCollPromise.then(function(){        
    pointsCollReady = true;    
});
}

function getClusterCollection(){                                              
    /* Obtain Cities shops list */
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    var clusterCollPromise = new Promise(function(resolve, reject){
        $http({
        method:'post',
        url:'controllers/CSVController.php',
        data:{'points':'all'}
    })
        .then(function(response) {            
            /* Init citiesCollection with all data required to create Clusters */
            var citiesCollection = [];                
            response.data.forEach(function(item){                                                                                       
                if(Object.keys(citiesCollection).length == 0){                                   
                    citiesCollection[item.city] = {
                        'name':item.city,
                        'slug':item.slug,                                      
                        'lng':item.lng,
                        'lat':item.lat,
                        'count':1
                    };                                                                                          
                }
                else{ 
                    cCollection =  Object.values(citiesCollection);                                   
                    var currCity = collHasCity(cCollection, item);                                 
                    if(currCity){                                        
                        citiesCollection[currCity].count++;                                      
                    }  
                    else{                                      
                        citiesCollection[item.city] = {
                            'name':item.city,                                            
                            'lng':item.lng,
                            'lat':item.lat,
                            'count':1
                        };                                 
                    }                                                            
                } 
            });                
            /* Get values of assoc array citiesCollection */
            citiesCollection = Object.values(citiesCollection);                                     
            citiesCollection.forEach(function(city, index){                                
                myCluster[index] = new ymaps.GeoObject({                                
                geometry:{
                    type: "Point",
                    coordinates: [city.lng, city.lat],                                
                },                     
                properties: {                    
                iconContent: city.count,
                name:city.name
                }                 
            });
            /* Set Cluster Click events */
             myCluster[index].events.add('click', function(e){
                myMap.setCenter([city.lng, city.lat], 13,{duration: 500});                               
                var CityId = getCityIdByName(getClusterName(e));                                                                        
                $scope.changeCity($scope.cities[CityId], true);                 
            }); 
            /* Add Cluster to myClusterCollection */                
            myClusterCollection.add(myCluster[index]);            
            resolve();                                                                        
        });                      
    }); 
});
    clusterCollPromise.then(function(){         
        clusterCollReady = true;        
    });                                              
}
function getCityIdByName(name){      
    var cityIndex=false;        
    $scope.cities.forEach(function(city, index){                                          
        if(city.Name == name){                        
            cityIndex=index;                
        }             
    });       
    return cityIndex;       
}

/* Change City Func */
$scope.changeCity = function(city_data, zoomClick=false){
    //console.log('ZOOM_CLICK: ' + zoomClick);
    if(zoomClick){     
    /* Sidebar City block reacting */       
    // closeCityBlock();
    // closeCityBlockArrow();
    if( $('.city-block').attr('class') == 'sidebar-toggle-list city-block is-on-city'){
        toggleCityBlock();
    }
    /* Check if City is the same */       
    if($scope.currCityName == city_data.Name){       
        changeCityReady = true;                                        
        return;
    }
    /* Sidebar Shops block reacting */ 
    hideAllCityShops();
    displayCityShops(city_data.Slug);    

    $scope.shops="";
    $scope.city = city_data;
    $scope.currCityName = city_data.Name;        
    $scope.currCitySlug = city_data.Slug;    
    changeCityReady = true;      
    /* Run AJAX POST request */
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $http({
        method:'post',
        url:'controllers/CSVController.php',
        data:{'points':'all'}
    })
        .then(function(response) {                
            $scope.shops = response.data;                        
    }); 
    changeCityReady = true;  
    }
    else{        
        myMap.setCenter([city_data.Long, city_data.Lat], city_data.Scale);   
        $scope.shops="";   
        $scope.city = city_data;
        $scope.currCityName = city_data.Name;        
        $scope.currCitySlug = city_data.Slug;
        /* Run AJAX POST request */
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    $http({
        method:'post',
        url:'controllers/CSVController.php',
        data:{'points':'all'}
    })
        .then(function(response) {                
            $scope.shops = response.data;
            /* Sidebar Shops block reacting */ 
            // closeCityBlock();
            // closeCityBlockArrow();
            toggleCityBlock();
            hideAllCityShops();
            displayCityShops(city_data.Slug);                         
    }); 
        changeCityReady = true;         
    }          
}  // Endof changeCity func  

$scope.zoomShop =function(shop, index){
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
            showShopDetails($('#' + item.properties.get('name')));
            console.log('111');
        }            
    });
    // closeCityBlock();
    // closeCityBlockArrow();

    //console.log('zoomShop');
}

function getPointName(e){
    let placeProps = e.get('target').properties.getAll();
    return placeProps['name'];
}
function getPointCityName(e){
    let placeProps = e.get('target').properties.getAll();
    return placeProps['cityName'];
}
function getClusterName(e){
    let placeProps = e.get('target').properties.getAll();
    return placeProps['name'];
}
function getPointCoords(e){
    return placeProps = e.get('coords');        
}
 function centrifyPoint(coords){
    myMap.panTo([coords[0], coords[1]], {duration: 500});
}
});  /* Endof Ng Controller */