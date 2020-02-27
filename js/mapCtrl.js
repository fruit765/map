var myApp = angular.module('myApp',[]);
myApp.controller('myCtrl', function($scope, $http) {
  var myMap, zoomControl, BalloonContentLayout, BalloonContentLayoutWithoutSite, fullCityName, shops, inetShops, isPoints = false;

  $scope.cityName = '';
  $scope.searchCityName = '';
  $scope.cityShops = [];
  $scope.cityInetShops = [];
  $scope.searchCities = [];

  $scope.addZoomControls = function(){
    var mapHeight = $('#map').height();

    if (window.innerWidth <= 1000) {
      mapHeight -= getSidebarChecksHeight();
    }
    
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
    var sidebarChecksHeight;

    if (isPoints) {
      sidebarChecksHeight = getSidebarChecksHeight();

      if (window.innerWidth > 1000) {
        myMap.setBounds(myMap.geoObjects.getBounds(), {checkZoomRange:true, zoomMargin: [100, 20, sidebarChecksHeight + 20, 460]});
      }
      else {
        myMap.setBounds(myMap.geoObjects.getBounds(), {checkZoomRange:true, zoomMargin: [20, 20, sidebarChecksHeight + 20, 20]});
      }
    }
  }

  $scope.addCityShops = function(){
    $scope.cityShops = [];
    shops.forEach(function(shop){
      if (shop.full_city_name === fullCityName) {
        $scope.cityShops.push(shop);
      }
    });
  }

  $scope.addCityPoints = function(){
    myMap.geoObjects.removeAll();

    $scope.cityShops.forEach(function(cityShop, index){
      var balloonLayout;

      if (cityShop.site) {
        balloonLayout = BalloonContentLayout;
      }
      else {
        balloonLayout = BalloonContentLayoutWithoutSite;
      }

      var placemark = new ymaps.Placemark([cityShop.lng, cityShop.lat],
        {
          id: index,
          type: 'shop',
          active: 0,
          name: cityShop.name,
          address: cityShop.street_type + ' ' + cityShop.street + ', ' + cityShop.house,
          hours: cityShop.hours,
          phone: cityShop.phone,
          site: cityShop.site,
        },
        {
          iconLayout: 'default#image',
          iconImageHref: '/img/city-icon.svg',
          iconImageSize: [21, 39],
          balloonLayout: balloonLayout,
          balloonOffset: [5, 40],
          hideIconOnBalloonOpen: false,
        }
      );

      if (index === 0) {
        //placemark.options.set('iconImageHref', '/img/placemark-active.svg');
        placemark.options.set('iconImageSize', [30, 55]);
        placemark.properties.set('active', 1);
      }

      placemark.events.add('click', function(e){
        $scope.activeShop(e.get('target').properties.get('id'));
        scrollToActiveShop();
      });

      myMap.geoObjects.add(placemark);
      isPoints = true;
    });

    $scope.setCorrectZoom();
  }

  $scope.addCityInetShops = function(){
    $scope.cityInetShops = [];
    inetShops.forEach(function(inetShop){
      if (inetShop.full_city_name === fullCityName) {
        $scope.cityInetShops.push(inetShop);
      }
    });
  }

  $scope.activeShop = function(id){
    myMap.geoObjects.each(function(geoObject){
      if (geoObject.properties.get('type') == 'shop') {
        if (geoObject.properties.get('id') == id) {
          geoObject.properties.set('active', 1);
          //geoObject.options.set('iconImageHref', '/img/placemark-active.svg');
          geoObject.options.set('iconImageSize', [30, 55]);
        }
        else {
          if (geoObject.properties.get('active') == 1) {
            geoObject.properties.set('active', 0);
            //geoObject.options.set('iconImageHref', '/img/city-icon.svg');
            geoObject.options.set('iconImageSize', [21, 39]);
          }
        }
      }
    });

    $('.sidebar__items_shops .sidebar__item').removeClass('sidebar__item_active');
    $($('.sidebar__items_shops .sidebar__item')[id]).addClass('sidebar__item_active');
  }

  $scope.searchCityByName = function(){
    var uniqueArr, punct;

    setTimeout(function(){
      $('.change-city__search-cities').css('display', 'none');
      $('.change-city__error').css('display', 'none');
    }, 0);

    if ($scope.searchCityName !== '') {
      $scope.searchCities = [];
      uniqueArr = [];
      shops.forEach(function(shop){
        punct = shop.full_city_name.split(', ')[0].toLowerCase().replace('ё', 'е');
        if (punct.match($scope.searchCityName.toLowerCase().replace('ё', 'е'))) {
          if (!uniqueArr[punct])
          $scope.searchCities.push(shop);
          uniqueArr[punct] = true;
        }
      });

      if ($scope.searchCities.length > 0) {
        setTimeout(function(){
          $('.change-city__search-cities').css('max-height', $('.change-city .modal-window__content').height() - $('.change-city .modal-window__head').outerHeight(true) - $('.change-city .search-block').outerHeight());
          $('.change-city__search-cities').css('display', 'block').scrollTop(0);
          $('.change-city__error').css('display', 'none');
        }, 0);
      }
      else {
        setTimeout(function(){
          $('.change-city__search-cities').css('display', 'none');
          $('.change-city__error').css('display', 'block');
        }, 0);
      }
    }
  }

  $scope.loadAllShops = function(){
    if (shops.length > 0) {
      $scope.addCityShops();
      if ($scope.cityShops.length > 0) {
        $scope.$apply(function(){
          $scope.cityName = $scope.cityShops[0].prefix + ' ' + $scope.cityShops[0].city;

          setTimeout(function(){
            $('.sidebar__city').css('display', 'block');
            $('.sidebar__check_shops').addClass('sidebar__check_active').css('display', 'inline-block');
            setSidebarItemsShopsHeight();
            $('.sidebar__items_shops').css('display', 'block').scrollTop(0);
          }, 0);

          $scope.addCityPoints();
        });
      }
    }

    if (inetShops.length > 0) {
      $scope.addCityInetShops();
      if ($scope.cityInetShops.length > 0) {
        $scope.$apply(function(){
          setTimeout(function(){
            $('.sidebar__check_inet-shops').css('display', 'inline-block');
          }, 0);

          if ($scope.cityShops.length === 0) {
            $scope.cityName = $scope.cityInetShops[0].prefix + ' ' + $scope.cityInetShops[0].city;
            setTimeout(function(){
              $('.sidebar__check_inet-shops').addClass('sidebar__check_active');
              $('.sidebar__switch').css('display', 'block');
              $('.sidebar__city').css('display', 'block');
              $('.sidebar__items_inet-shops').css('display', 'block').scrollTop(0);
            }, 0);
          }

          setTimeout(function(){
            setSidebarItemsInetShopsHeight();
            $('.change-city').removeClass('modal-window_show');
            $('.header__change-city-btn').removeClass('header__change-city-btn_active');
          }, 0);
        });
      }
    }

    if ($scope.cityInetShops.length === 0) {
      setTimeout(function(){
        $('.change-city').removeClass('modal-window_show');
        $('.header__change-city-btn').removeClass('header__change-city-btn_active');
      }, 0);
    }
  }



  // Обработчики событий
  $('.sidebar__items_shops').on('click', '.sidebar__item', function(){
    $scope.activeShop($(this).attr('shop-id'));
    $scope.setCorrectZoom();
    myMap.balloon.close();
  });

  $('.sidebar__check').click(function(){
    $('.sidebar__check').removeClass('sidebar__check_active');
    $(this).addClass('sidebar__check_active');
    $('.sidebar__items').css('display', 'none');

    if ($(this).hasClass('sidebar__check_shops')) {
      $('.sidebar__switch').css('display', 'none');
      $('.sidebar__items_shops').css('display', 'block').scrollTop(0);
      $scope.addCityPoints();
      $('.sidebar__items_shops .sidebar__item').removeClass('sidebar__item_active');
      $($('.sidebar__items_shops .sidebar__item')[0]).addClass('sidebar__item_active');
    }

    if ($(this).hasClass('sidebar__check_inet-shops')) {
      isPoints = false;
      myMap.geoObjects.removeAll();
      $('.sidebar__switch').css('display', 'block');
      $('.sidebar__items_inet-shops').css('display', 'block').scrollTop(0);
    }
  });

  $('.sidebar__city, .header__change-city-btn').click(function(){
    $scope.$apply(function(){
      $scope.searchCityName = '';
      $scope.searchCityByName();
      setTimeout(function(){
        $('.change-city .search-block').removeClass('search-block_writting');
        $('.change-city').addClass('modal-window_show');
        $('.header__change-city-btn').addClass('header__change-city-btn_active');
        setTimeout(function(){
          $('.change-city .search-block__input').focus();
        }, 0);
      }, 0);
    });
  });

  $('.change-city__search-cities').on('click', '.change-city__search-city', function(){
    fullCityName = $(this).text();
    $('.sidebar__city, .sidebar__check, .sidebar__switch, .sidebar__items').css('display', 'none');
    $('.sidebar__check').removeClass('sidebar__check_active');
    $scope.loadAllShops();
  });



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
        provider: 'auto',
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
  // Подгружаем все магазины и интернет-магазины из БД
  .then(function(response){
    var promiseGetShops, promiseGetInetShops;

    fullCityName = response;
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"; 

    promiseGetShops = $http({
      method:'post',
      url:'controllers/CSVControllerShops.php',
      data:{'points':'all'}
    });
    promiseGetInetShops = $http({
      method:'post',
      url:'controllers/CSVControllerInetShops.php',
      data:{'points':'all'}
    });

    return Promise.all([promiseGetShops, promiseGetInetShops]);
  })
  // Выводим магазины и интернет-магазины на карте и в сайдбаре
  .then(function(response){
    shops = response[0].data;
    inetShops = response[1].data;

    $scope.loadAllShops();

    $(window).resize(function(){
      setTimeout(function(){
        $scope.setCorrectZoom();
      }, 0);
    });
  });
});