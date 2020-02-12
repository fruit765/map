var myApp = angular.module('myApp',[]);
myApp.controller('myCtrl', function($scope, $http) {
  var myMap, zoomControl = null, BalloonContentLayout, BalloonContentLayoutWithoutSite, fullCityName, shops;

  $scope.shop = {};
  $scope.cityShops = [];

  $scope.addZoomControls = function(){
    var mapHeight = $('#map').height();
    
    if (zoomControl) {
      myMap.controls.remove(zoomControl);
    }
    zoomControl = new ymaps.control.ZoomControl({
      options: {
        size: "small",
        position: {
          top: Math.floor(mapHeight / 2) - 31,
          left: 10
        }
      }
    });
    myMap.controls.add(zoomControl);
  }

  $scope.setCorrectZoom = function(){
    myMap.setBounds(myMap.geoObjects.getBounds(), {checkZoomRange:true, zoomMargin: [0, 0, 0, 450]});
  }

  $scope.addShops = function(){
    var index = 0;

    myMap.geoObjects.removeAll();

    shops.forEach(function(shop){
      var balloonLayout;

      if (shop.site) {
        balloonLayout = BalloonContentLayout;
      }
      else {
        balloonLayout = BalloonContentLayoutWithoutSite;
      }

      if (shop.full_city_name === $scope.shop.full_city_name) {
        var placemark = new ymaps.Placemark([shop.lng, shop.lat],
          {
            id: index,
            type: 'shop',
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
            iconImageSize: [21, 35],
            balloonLayout: balloonLayout,
            balloonOffset: [5, 30],
            hideIconOnBalloonOpen: false,
          }
        );
        if (index === 0) {
          //placemark.options.set('iconImageHref', '/img/placemark-active.svg');
          placemark.options.set('iconImageSize', [30, 50]);
          placemark.properties.set('active', 1);
        }
        placemark.events.add('click', function(e){
          $scope.activeShop(e.get('target').properties.get('id'));
        });
        myMap.geoObjects.add(placemark);

        $scope.cityShops.push(shop);

        index++;
      }
    });

    $scope.setCorrectZoom();
    $scope.$apply();
  }

  $scope.activeShop = function(id){
    myMap.geoObjects.each(function(geoObject){
      if (geoObject.properties.get('type') == 'shop') {
        if (geoObject.properties.get('id') == id) {
          geoObject.properties.set('active', 1);
          //geoObject.options.set('iconImageHref', '/img/placemark-active.svg');
          geoObject.options.set('iconImageSize', [30, 50]);
        }
        else {
          if (geoObject.properties.get('active') == 1) {
            geoObject.properties.set('active', 0);
            //geoObject.options.set('iconImageHref', '/img/placemark.svg');
            geoObject.options.set('iconImageSize', [21, 35]);
          }
        }
      }
    });
  }



  // Подгружаем карту
  new Promise(function(resolve, reject){
    ymaps.ready(function(){
      myMap = new ymaps.Map('map', {
        center: [55.73, 37.75],
        zoom: 9,
        controls: []
      });

      $scope.addZoomControls();

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

      $(window).resize(function(){
        $scope.addZoomControls();
      });

      resolve();
    });
  })
  // Пытаемся определить полное наименование населенного пункта
  .then(function(){
    return ymaps.geolocation.get(
      {
        provider: 'yandex',
        autoReverseGeocode: true,
      }
    );
  })
  // Возвращаем определенное наименование населенного пункта или Москву, если не удалось определить
  .then(function(response){
    return response.geoObjects.get(0).properties.get('metaDataProperty').GeocoderMetaData.text.split(', ').reverse().join(', ');
  }, function(){
    return 'Москва, Россия';
  })
  // Подгружаем все магазины из БД
  .then(function(response){
    fullCityName = response;

    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
    return $http({
      method:'post',
      url:'controllers/CSVControllerShops.php',
      data:{'points':'all'}
    });
  })
  // Выводим магазины на карте и в сайдбаре
  .then(function(response){
    shops = response.data;
    $scope.$apply(function(){
      $scope.shop = getShop(fullCityName, shops);
    });
    $scope.addShops();

    $(window).resize(function(){
      $scope.setCorrectZoom();
    });
  });

  // Вспомогательные функции
  function getShop(fullCityName, shops){
    for (var i = 0; i < shops.length; i++) {
      if (shops[i].full_city_name === fullCityName) {
        break;
      }
    }

    return shops[i];
  }
});