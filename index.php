<!DOCTYPE html>
<html lang="en" ng-app="myApp">
  <head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <title>Где купить Karmy</title>   
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="css/bootstrap-reboot.min.css"> 
    <link rel="stylesheet" type="text/css" href="css/style.css">  
    <link rel="stylesheet" type="text/css" href="css/new-style.css">

    <link rel="icon" type="image/png" href="img/index.ico" />
  </head>
  <body ng-controller="myCtrl">

    <!-- <div class="header">
      <a href="http://karmypet.ru" class="logo"><img src="img/logo.svg" alt="" class="logo-img"><img src="img/logo-mobile.svg" alt="" class="logo-img-mobile"></a>

      <div class="header__change-city-btn">{{cityName}}</div>

      <ul class="menu">
        <li class="item has-sub-menu">
          <a href="#" timer="timer1">Для собак</a>
          <ul class="sub-menu">
            <li class="sub-item"><a href="http://karmypet.ru/starter">Starter</a></li>
            <li class="sub-item"><a href="http://karmypet.ru/miniline">Mini</a></li>
            <li class="sub-item"><a href="http://karmypet.ru/mediumline">Medium</a></li>
            <li class="sub-item"><a href="http://karmypet.ru/maxiline">Maxi</a></li>
            <li class="sub-item"><a href="http://karmypet.ru/specialine">Special</a></li>
          </ul>
        </li>

        <li class="item has-sub-menu">
          <a href="#" timer="timer2">Для кошек</a>
          <ul class="sub-menu">
            <li class="sub-item"><a href="http://karmypet.ru/kitten">Kitten</a></li>
            <li class="sub-item"><a href="http://karmypet.ru/adultline">Adult</a></li>
            <li class="sub-item"><a href="http://karmypet.ru/sterilized">Sterilized</a></li>
            <li class="sub-item"><a href="http://karmypet.ru/specialline">Special line</a></li>
            <li class="sub-item"><a href="http://karmypet.ru/breedline">Breed line</a></li>
          </ul>
        </li>

        <li class="item"><a href="#">Где купить</a></li>

        <li class="item"><a href="http://karmypet.ru/forbreeders">Заводчикам</a></li>
      </ul>

      <div id="get-call" class="slide-in-up" data-toggle="modal" data-target="#get-call-modal">Заказать звонок</div>

      <div class="mobile-btn">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div> -->
    
    <div class="map-sidebar-wrapper">
      <div id="map"></div>
      <div class="map-sidebar-wrapper__cover"></div>
      <div class="sidebar">
        <div class="sidebar__city">{{cityName}}</div>

        <div class="sidebar__checks">
          <span class="sidebar__check sidebar__check_shops">Зоомагазины</span>
          <span class="sidebar__check sidebar__check_inet-shops">Интернет-магазины</span>
        </div>

        <!-- <div class="sidebar__switch">
          <div class="switch"></div>
          Только с доставкой по России
        </div> -->

        <div class="sidebar__items sidebar__items_shops">
          <div ng-repeat="cityShop in cityShops" class="sidebar__item" ng-class="{'sidebar__item_active':$first}" shop-id="{{$index}}">
            <div class="sidebar__item-title{{cityShop.isGeneralPartner == 1 ? ' sidebar__item-title_star' : ''}}">{{cityShop.title}} <span>(генеральный партнер)</span></div>
            <div class="sidebar__item-content">{{cityShop.street_type}} {{cityShop.street}}, {{cityShop.house}}<br>{{cityShop.hours}}<br>{{cityShop.phone}}</div>
            <a href = "{{cityShop.site}}" class="sidebar__item-site" target="_blank">{{cityShop.site}}</a>
          </div>
        </div>

        <div class="sidebar__items sidebar__items_inet-shops">
          <div ng-repeat="cityInetShop in cityInetShops" class="sidebar__item" delivery-on-russia="{{cityInetShop.delivery_on_russia}}">
            <!-- <div class="sidebar__item-title">{{cityInetShop.title}}</div> -->
            <div class="sidebar__item-content">
              <div class="sidebar__item-content-img">
                <img src="{{cityInetShop.logo}}">
              </div>
              <div class="sidebar__item-content-desc">{{cityInetShop.description}}</div>
            </div>
            <a href = "{{cityInetShop.site}}" class="sidebar__item-site sidebar__item-site_otstup" target="_blank">перейти ></a>
          </div>
        </div>
      </div>
    </div>

    <!-- Блок для смены города-->
    <div class="modal-window change-city">
      <div class="modal-window__cover"></div>
      <div class="modal-window__wrapper">
        <div class="modal-window__content">
          <div class="modal-window__close"></div>
          <div class="modal-window__head">Введите свой город</div>
          <div class="modal-window__body">
            <div class="search-block">
              <input class="search-block__input" type="text" placeholder="Начните вводить название города" ng-model="searchCityName" ng-change="searchCityByName()">
              <div class="search-block__list-wrapper">
                <div class="search-block__list-content">
                  <ul class="change-city__search-cities">
                    <li class="change-city__search-city" ng-repeat="searchCity in searchCities">{{searchCity.full_city_name}}</li>
                  </ul>
                  <div class="change-city__error">Данного города нет!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Мобильное меню -->
    <div class="mobile-menu-cover"></div>
    <div class="mobile-menu">
      <div class="mobile-menu-close"></div>
      <div class="mobile-menu-body">
        <ul>
          <li class="sub">
            <a href="#">Для собак</a>
            <ul>
              <li><a href="http://karmypet.ru/starter">Starter</a></li>
              <li><a href="http://karmypet.ru/miniline">Mini</a></li>
              <li><a href="http://karmypet.ru/mediumline">Medium</a></li>
              <li><a href="http://karmypet.ru/maxiline">Maxi</a></li>
              <li><a href="http://karmypet.ru/specialine">Special</a></li>
            </ul>
          </li>
          <li class="sub">
            <a href="#">Для кошек</a>
            <ul>
              <li><a href="http://karmypet.ru/kitten">Kitten</a></li>
              <li><a href="http://karmypet.ru/adultline">Adult</a></li>
              <li><a href="http://karmypet.ru/sterilized">Sterilized</a></li>
              <li><a href="http://karmypet.ru/specialline">Special</a></li>
              <li><a href="http://karmypet.ru/breedline">Breed</a></li>
            </ul>
          </li>
          <li><a href="#">Где купить</a></li>
          <li><a href="http://karmypet.ru/forbreeders">Заводчикам</a></li>
        </ul>
      </div>
      <div class="mobile-menu-footer">
        <div class="mobile-menu-footer-social">
          <a href="https://www.facebook.com/KarmyRu" target="_blank">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 48"><path d="M47.761,24c0,13.121-10.638,23.76-23.758,23.76C10.877,47.76,0.239,37.121,0.239,24c0-13.124,10.638-23.76,23.764-23.76 C37.123,0.24,47.761,10.876,47.761,24 M20.033,38.85H26.2V24.01h4.163l0.539-5.242H26.2v-3.083c0-1.156,0.769-1.427,1.308-1.427 h3.318V9.168L26.258,9.15c-5.072,0-6.225,3.796-6.225,6.224v3.394H17.1v5.242h2.933V38.85z"></path></svg>
          </a>
          <a href="https://vk.com/karmyru" target="_blank">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 48"><path d="M47.761,24c0,13.121-10.639,23.76-23.76,23.76C10.878,47.76,0.239,37.121,0.239,24c0-13.123,10.639-23.76,23.762-23.76 C37.122,0.24,47.761,10.877,47.761,24 M35.259,28.999c-2.621-2.433-2.271-2.041,0.89-6.25c1.923-2.562,2.696-4.126,2.45-4.796 c-0.227-0.639-1.64-0.469-1.64-0.469l-4.71,0.029c0,0-0.351-0.048-0.609,0.106c-0.249,0.151-0.414,0.505-0.414,0.505 s-0.742,1.982-1.734,3.669c-2.094,3.559-2.935,3.747-3.277,3.524c-0.796-0.516-0.597-2.068-0.597-3.171 c0-3.449,0.522-4.887-1.02-5.259c-0.511-0.124-0.887-0.205-2.195-0.219c-1.678-0.016-3.101,0.007-3.904,0.398 c-0.536,0.263-0.949,0.847-0.697,0.88c0.31,0.041,1.016,0.192,1.388,0.699c0.484,0.656,0.464,2.131,0.464,2.131 s0.282,4.056-0.646,4.561c-0.632,0.347-1.503-0.36-3.37-3.588c-0.958-1.652-1.68-3.481-1.68-3.481s-0.14-0.344-0.392-0.527 c-0.299-0.222-0.722-0.298-0.722-0.298l-4.469,0.018c0,0-0.674-0.003-0.919,0.289c-0.219,0.259-0.018,0.752-0.018,0.752 s3.499,8.104,7.463,12.23c3.638,3.784,7.764,3.36,7.764,3.36h1.867c0,0,0.566,0.113,0.854-0.189 c0.265-0.288,0.256-0.646,0.256-0.646s-0.034-2.512,1.129-2.883c1.15-0.36,2.624,2.429,4.188,3.497 c1.182,0.812,2.079,0.633,2.079,0.633l4.181-0.056c0,0,2.186-0.136,1.149-1.858C38.281,32.451,37.763,31.321,35.259,28.999"></path></svg>
          </a>
          <a href="https://www.instagram.com/karmyru/?hl=ru" target="_blank">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-455 257 48 48"><path d="M-430.938,256.987c13.227,0,23.95,10.723,23.95,23.95c0,13.227-10.723,23.95-23.95,23.95 c-13.227,0-23.95-10.723-23.95-23.95C-454.888,267.71-444.165,256.987-430.938,256.987z M-421.407,268.713h-19.06 c-1.484,0-2.688,1.204-2.688,2.69v19.07c0,1.485,1.203,2.689,2.688,2.689h19.06c1.484,0,2.688-1.204,2.688-2.689v-19.07 C-418.72,269.917-419.923,268.713-421.407,268.713z M-430.951,276.243c2.584,0,4.678,2.096,4.678,4.681 c0,2.585-2.095,4.68-4.678,4.68c-2.584,0-4.678-2.096-4.678-4.68C-435.629,278.339-433.535,276.243-430.951,276.243z M-421.579,289.324c0,0.54-0.437,0.978-0.977,0.978h-16.779c-0.54,0-0.977-0.438-0.977-0.978V279.08h2.123 c-0.147,0.586-0.226,1.199-0.226,1.831c0,4.144,3.358,7.504,7.5,7.504c4.142,0,7.5-3.359,7.5-7.504c0-0.632-0.079-1.245-0.226-1.831 h2.061V289.324L-421.579,289.324z M-421.516,275.23c0,0.54-0.438,0.978-0.977,0.978h-2.775c-0.54,0-0.977-0.438-0.977-0.978v-2.777 c0-0.54,0.438-0.978,0.977-0.978h2.775c0.54,0,0.977,0.438,0.977,0.978V275.23z"></path></svg>
          </a>
        </div>
        <div class="mobile-menu-footer-right">
          © <span id="site-year"></span> karmypet.ru
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="get-call-modal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="get-call-modal-close"></div>
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
        <div class="get-call-modal-close-mobile"></div>
          <img src="img/get-call-modal-line.png" alt="">
          <div class="modal-body">
            <div class="title">Оставьте свой телефон</div>
            <div class="desc">Мы свяжемся с вами в ближайшее время</div>
            <form>

                <div class="inputs">

                    <div class="form-group">
                        <input type="text" class="form-control" id="get-call-modal-phone" placeholder="Телефон" name="phone-phone-*">
                    </div>
                </div>

                <button type="submit" class="form_submit_btn">Перезвоните мне</button>

                <input type="hidden" name="subject-string-*" value="Консультация">
                
                <div class="form-group form-check">
                    <!-- <input type="checkbox" class="form-check-input" id="get-call-modal-check" name="captcha-captcha-*"> -->
                    <label class="form-check-label" for="get-call-modal-check">Отправляя свой телефон вы соглашаетесь с политикой</label>
                    <a href="http://karmypet.ru/policy" target="_blank">обработки персональных данных</a>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;apikey=6c63b2b7-912b-40f2-a252-2cbdc56042b9" type="text/javascript"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.5/angular.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script src="js/detect.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/jquery.easing.min.js"></script>
    <script src="js/jquery.easing.compatibility.js"></script>
    <script src="js/phone-mask.js"></script>

    <script src="js/mapCtrlFunctions.js" type="text/javascript" charset="utf-8"></script>
    
    <script src="js/mobile-sidebar.js"></script>
    <script src="js/mobile-map-sidebar-wrapper.js"></script>
    <script src="js/mobile-header.js"></script>
    <script src="js/mobile-change-city.js"></script>

    <script src="js/menu.js"></script>
    <script src="js/mobile-menu.js"></script>
    <script src="js/get-call.js"></script>
    <script src="js/form-validator.js"></script>
    <script src="js/form-dispatcher.js"></script>
    <script src="js/switch.js"></script>
    <script src="js/sidebar.js"></script>
    <script src="js/modal-window.js"></script>
    <script src="js/search-block.js"></script>
    <script src="js/mapCtrl.js" type="text/javascript" charset="utf-8"></script>

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-140125983-2"></script>
    <script>
      
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-140125983-2');
      
      setTimeout(function(){
          $('#get-call-modal form').append('<input type="hidden" name="ga_cid-ga_cid-!" value='+ga.getAll()[0].get('clientId')+'>');
      }, 3000)
    </script>
    
  </body>
</html>