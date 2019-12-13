<!DOCTYPE html>
<html lang="en" ng-app="myApp">
  <head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <title>Где купить Karmy</title>   
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <!-- <link rel="stylesheet" type="text/css" href="https://yastatic.net/bootstrap/3.3.4/css/bootstrap.min.css"> -->
    <link rel="stylesheet" type="text/css" href="css/bootstrap-reboot.min.css"> 
    <!-- <link rel="stylesheet" type="text/css" href="node_modules/motion-ui/dist/motion-ui.min.css"> -->
    <link rel="stylesheet" type="text/css" href="css/style.css">  
    <link rel="stylesheet" type="text/css" href="css/new-style.css">

    <link rel="icon" type="image/png" href="img/index.ico" />
  </head>
  <body ng-controller="myCtrl">

    <div class="header">
      <!-- <h1>Karmy YmapsAPI Test</h1> -->

      <a href="http://karmypet.ru" class="logo"><img src="img/logo.png" alt=""></a>

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
      </ul>

      <div id="get-call" class="slide-in-up" data-toggle="modal" data-target="#get-call-modal">Заказать звонок</div>

      <div class="mobile-btn">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>    


    <div class="wrapper map-sidebar-wrapper">     
      <div class="map-btn"><span class="btn-title">Показать список магазинов</span></div>
      <!-- Here goes Map container -->
      <div id="map" class="map-container">
      </div>
      
      <!-- Here goes Sidebar container -->
      <div class="sidebar">
        <div class="sidebar-block cities-block">        
          <h2 class="sidebar-title"><span>Ваш город:</span><span class="sidebar-title-city" ng-click="showCityPopup('enter-city')">{{city.Name}}</span>
            <div class="sidebar-close"></div>
          </h2>         
        </div> 

        <div class="sidebar-block shops-block">        
          <ul ng-repeat="cityShop in cityShops" ng-class="{'active':$first}" city-id="{{$index}}">
            <li>{{cityShop.name}}</li>
            <li>{{cityShop.street_type}} {{cityShop.street}}, {{cityShop.house}}</li>
            <li>{{cityShop.hours}}</li>
            <li>{{cityShop.phone}}</li>
            <li>{{cityShop.site}}</li>
          </ul>
        </div>
      </div>

      <div class="choose-city-wrapper">
        <div class="preloader"></div>
        <div class="auto-city">
          <h2>Ваш город - {{autoCity.Name}}?</h2>
          <div class="btns">
            <button class="other-city" ng-click="showCityPopup('enter-city')">Выбрать другой</button>
            <button class="this-city" ng-click="confirmAutoCity()">Да, это мой город</button>
          </div>
        </div>
        <div class="enter-city">
          <h2>Начните вводить название города</h2>
          <div class="enter-city-container">
            <div class="enter-city-container-controls">
              <input type="text" name="search-city-name" ng-model="searchCityName" ng-change="searchCityByName()" value="">
              <button ng-click="confirmSearchCity()">Да, это мой город</button>
              <div class="enter-city-container-controls-search-cities">
                <div class="search-city" ng-repeat="searchCity in searchCities">{{searchCity.Name}}</div>
              </div>
              <div class="enter-city-container-controls-error">{{searchError}}</div>
            </div>
          </div>
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

    <script src="js/sidebar.js"></script>
    <script src="js/mapSidebarCtrl.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/mapCtrl.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/jquery.easing.min.js"></script>
    <script src="js/jquery.easing.compatibility.js"></script>
    <script src="js/detect.min.js"></script>
    <script src="js/phone-mask.js"></script>
    <!-- <script src="node_modules/motion-ui/dist/motion-ui.min.js"></script> -->

    <script src="js/menu.js"></script>
    <script src="js/get-call.js"></script>
    <script src="js/form-validator.js"></script>
    <script src="js/form-dispatcher.js"></script>

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-140125983-2"></script>
    <script>
      
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-140125983-2');
      
      setTimeout(function(){
          
          //console.log($('form'));
          
          $('#get-call-modal form').append('<input type="hidden" name="ga_cid-ga_cid-!" value='+ga.getAll()[0].get('clientId')+'>');
          
          //console.log(ga.getAll()[0].get('clientId'));
      }, 3000)
    </script>
    
  </body>
</html>