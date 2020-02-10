var myApp = angular.module('myApp',[]);
myApp.controller('myCtrl', function($scope, $http) {
    var myMap, zoomControl = null, BalloonContentLayout, BalloonContentLayoutWithoutSite;

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
    .then(function(){
        
    });
});