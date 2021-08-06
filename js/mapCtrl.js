var user = detect.parse(navigator.userAgent);
var deviceType = user.device.type;

$(document).ready(function(){
  if (!(deviceType === 'Desktop' && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
    $('.mobile-change-city').addClass('mobile-change-city_show');
    $('#map').css('paddingTop', $('.mobile-change-city').innerHeight() + 'px');
  }
});

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
    if (myMap.geoObjects.getLength() === 0) {
      //myMap.geoObjects.removeAll();

      var clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedDarkGreenClusterIcons',        
        groupByCoordinates: false,
        clusterDisableClickZoom: false,
        clusterHideIconOnBalloonOpen: false,
        geoObjectHideIconOnBalloonOpen: false,
        openBalloonOnClick: false,
        maxZoom: 9,
        gridSize: 80,
      });

      var geoObjects = [];

      shops.forEach(function(cityShop, index){
        var balloonLayout, iconImageHref, iconImageSize, active, isGeneralPartner, showStarInPopap;

        if (cityShop.site) {
          balloonLayout = BalloonContentLayout;
        }
        else {
          balloonLayout = BalloonContentLayoutWithoutSite;
        }

        // if ($scope.cityShops[0].lng === cityShop.lng && $scope.cityShops[0].lat === cityShop.lat) {
        //   iconImageSize = [30, 55];
        //   active = 1;

        //   if (cityShop.isGeneralPartner == 1) {
        //     isGeneralPartner = 1;
        //     iconImageHref = '/img/city-icon-partner-active.svg';
        //   }
        //   else {
        //     isGeneralPartner = 0;
        //     iconImageHref = '/img/city-icon-active.svg';
        //   }
        // }
        //else {
          iconImageSize = [21, 39];
          active = 0;

          if (cityShop.isGeneralPartner == 1) {
            isGeneralPartner = 1;
            iconImageHref = '/img/city-icon-partner.svg';
          }
          else {
            isGeneralPartner = 0;
            iconImageHref = '/img/city-icon.svg';
          }
        //}

        if (isGeneralPartner == 1) {
          showStarInPopap = ' active';
        }
        else {
          showStarInPopap = '';
        }

        var placemark = new ymaps.Placemark([cityShop.lng, cityShop.lat],
          {
            id: cityShop.lng + ',' + cityShop.lat,
            type: 'shop',
            active: active,
            isGeneralPartner: isGeneralPartner,
            showStarInPopap: showStarInPopap,
            name: cityShop.title,
            city: cityShop.full_city_name,
            address: cityShop.street + ', ' + cityShop.house,
            hours: cityShop.hours,
            phone: cityShop.phone,
            site: cityShop.site,
          },
          {
            iconLayout: 'default#image',
            iconImageHref: iconImageHref,
            iconImageSize: iconImageSize,
            balloonLayout: balloonLayout,
            balloonOffset: [5, 40],
            hideIconOnBalloonOpen: false,
            zIndex: 0,
          }
        );

        placemark.events.add('click', function(e){
          $scope.activeShop(e.get('target').properties.get('id'));
          scrollToActiveShop();
        });

        geoObjects.push(placemark);

        isPoints = true;
      });

      clusterer.add(geoObjects);
      myMap.geoObjects.add(clusterer);

      //$scope.setCorrectZoom();
    }
  }

  $scope.addCityInetShops = function(){
    // $scope.cityInetShops = [];
    // inetShops.forEach(function(inetShop){
    //   if (inetShop.full_city_name === fullCityName) {
    //     $scope.cityInetShops.push(inetShop);
    //   }
    // });

    $scope.cityInetShops = inetShops;
  }

  $scope.activeShop = function(id){
    var coords = id.split(',');

    myMap.geoObjects.each(function(cluster){
      cluster.getGeoObjects().forEach(function(geoObject){
        if (geoObject.properties.get('type') == 'shop') {
          if (geoObject.properties.get('id') == id) {
            geoObject.properties.set('active', 1);
            geoObject.options.set('iconImageSize', [30, 55]);
            if (geoObject.properties.get('isGeneralPartner') == 1) {
              geoObject.options.set('iconImageHref', '/img/city-icon-partner-active.svg');
            }
            else {
              geoObject.options.set('iconImageHref', '/img/city-icon-active.svg');
            }
            geoObject.options.set('zIndex', 1);
          }
          else {
            if (geoObject.properties.get('active') == 1) {
              geoObject.properties.set('active', 0);
              geoObject.options.set('iconImageSize', [21, 39]);
              if (geoObject.properties.get('isGeneralPartner') == 1) {
                geoObject.options.set('iconImageHref', '/img/city-icon-partner.svg');
              }
              else {
                geoObject.options.set('iconImageHref', '/img/city-icon.svg');
              }
              geoObject.options.set('zIndex', 0);
            }
          }
        }
      });
    });

    $('.sidebar__items_shops .sidebar__item').removeClass('sidebar__item_active');
    $('.sidebar__items_shops .sidebar__item[shop-id="' + id + '"]').addClass('sidebar__item_active');

    myMap.setCenter([coords[0], coords[1]], 10);
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
        if (shop.full_city_name.toLowerCase().replace('ё', 'е').match($scope.searchCityName.toLowerCase().replace('ё', 'е'))) {
          if (!uniqueArr[shop.full_city_name])
          $scope.searchCities.push(shop);
          uniqueArr[shop.full_city_name] = true;
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
          $scope.cityName = $scope.cityShops[0].full_city_name;

          setTimeout(function(){
            $('.sidebar__city').css('display', 'block');
            $('.sidebar__check_shops').addClass('sidebar__check_active').css('display', 'inline-block');
            setSidebarItemsShopsHeight();
            $('.sidebar__items_shops').css('display', 'block').scrollTop(0);
          }, 0);

          $scope.addCityPoints();

          setTimeout(function(){
            $scope.activeShop($scope.cityShops[0].lng + ',' + $scope.cityShops[0].lat);
            myMap.balloon.close();
          }, 0);
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
    //$scope.setCorrectZoom();
    myMap.balloon.close();
  });

  $('.sidebar__check').click(function(){
    $('.sidebar__check').removeClass('sidebar__check_active');
    $(this).addClass('sidebar__check_active');
    $('.sidebar__items').css('display', 'none');

    if ($(this).hasClass('sidebar__check_shops')) {
      $('.sidebar__switch').css('display', 'none');
      $('.sidebar__items_shops').css('display', 'block').scrollTop(0);
      if (deviceType === 'Desktop' && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        showPlacemark(myMap);
      }
      // $scope.addCityPoints();
      // $('.sidebar__items_shops .sidebar__item').removeClass('sidebar__item_active');
      // $($('.sidebar__items_shops .sidebar__item')[0]).addClass('sidebar__item_active');
      $scope.activeShop($($('.sidebar__items_shops .sidebar__item')[0]).attr('shop-id'));
      myMap.balloon.close();
    }

    if ($(this).hasClass('sidebar__check_inet-shops')) {
      isPoints = false;
      //myMap.geoObjects.removeAll();
      if (deviceType === 'Desktop' && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        hidePlacemark(myMap);
        myMap.balloon.close();
      }
      $('.sidebar__switch').css('display', 'block');
      $('.sidebar__items_inet-shops').css('display', 'block').scrollTop(0);
    }
  });

  $('.sidebar__city, .header__change-city-btn, .mobile-change-city__btn').click(function(){
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
    if (!(deviceType === 'Desktop' && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
      $('#map').css('paddingTop', $('.mobile-change-city').innerHeight() + 'px');
    }
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
              '<li class="balloon-popup-item{{properties.showStarInPopap}}">{{properties.name}}<span>(генеральный партнер)</span></li>',
              '<li>{{properties.city}}<br>{{properties.address}}</li>',
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
              '<li class="balloon-popup-item{{properties.showStarInPopap}}">{{properties.name}}<span>(генеральный партнер)</span></li>',
              '<li>{{properties.city}}<br>{{properties.address}}</li>',
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
    //console.log(response.geoObjects.get(0).geometry.getCoordinates());
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

    if (shops.find(function(shop){if (shop.full_city_name === fullCityName) return true; else return false}) === undefined && shops.length > 0) {
      if (shops.find(function(shop){if (shop.full_city_name === 'Москва, Россия') return true; else return false}) !== undefined) {
        fullCityName = 'Москва, Россия';
      }
      else {
        fullCityName = shops[0].full_city_name;
      }
    }

    $scope.loadAllShops();

    $(window).resize(function(){
      if (!(deviceType === 'Desktop' && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
        $('#map').css('paddingTop', $('.mobile-change-city').innerHeight() + 'px');
      }
      setTimeout(function(){
        //$scope.setCorrectZoom();
        if ($('div').is('.sidebar__items_shops .sidebar__item_active')) {
          $scope.activeShop($('.sidebar__items_shops .sidebar__item_active').attr('shop-id'));
        }
      }, 0);
    });
  });
});