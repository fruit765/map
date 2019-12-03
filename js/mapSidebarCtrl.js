
var viewPortHeight, sidebarHeight, sidebarTitleHeight, sidebarToggleListHeight;

closeCityBlockArrow();

sidebarInit();

$(window).resize(function(){

    sidebarInit();
});

function sidebarInit(){

    viewPortHeight = window.innerHeight;

    sidebarHeight = viewPortHeight - 80;

    $('.map-sidebar-wrapper .map-container, .map-sidebar-wrapper .sidebar').css('height', sidebarHeight + 'px');

    sidebarTitleHeight = $('.map-sidebar-wrapper .sidebar .cities-block .sidebar-title').outerHeight();

    sidebarToggleListHeight = sidebarHeight - sidebarTitleHeight;

    $('.map-sidebar-wrapper .sidebar .shops-block').css('height', sidebarToggleListHeight + 'px');

    if ($('.map-sidebar-wrapper .sidebar .cities-block .sidebar-toggle-list').height()) {

        $('.map-sidebar-wrapper .sidebar .cities-block .sidebar-toggle-list').css('height', sidebarToggleListHeight + 'px');
    }
}

function displayCityShops(currCitySlug){ 
    var shopsReady = new Promise(function(resolve, reject){                       
        setTimeout(function(){                           
            if($('.shops-block').length > 0){                          
                resolve();
                clearTimeout();
            }
        },250);
    });
    shopsReady.then(function(){             
        var shop_blocks = ($('.shops-block ul'));        
        if(shop_blocks){
            for(var i = 0; i< shop_blocks.length; i++){            
                if($(shop_blocks[i]).attr('class') == currCitySlug){                 
                    $(shop_blocks[i]).css({
                        display:'block',
                    })
                }
                else{
                    $(shop_blocks[i]).css({
                        display:'none',
                    })
                }
            }
        }               
        showAllCityShops();              
        }) 
        .catch(function(){
            alert('Probl');
        })
    }
    function hideAllCityShops(){    
        $('.shops-block').css({
            display: 'none',
        })       
    }
    function showAllCityShops(){    
        $('.shops-block').css({
            display: 'block',
        })       
    }
     
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
    
    function toggleShopDetails(that){
        $('.is-on').removeClass('is-on').addClass('is-off');        
        let shop_item = $(that).children()[1];
        let shop_item_block =($(that).parent()[0]);              
        $(shop_item).toggleClass('is-off');  
        /* Blank all shop blocks */         
        $('.shops-block-list-item').css({
            background:'rgb(255,255,255)',
        }) ; 
       /* Highlight shop block */
        shop_item_block = $(shop_item_block).find('.shops-block-list-item')[0];               
        $(shop_item_block).css({
            background:'rgba(232, 191, 162, 0.1)',
        }) ; 
        
        $('.map-sidebar-wrapper .sidebar .shops-block .shops-block-list-item').removeClass('open');
    }
    function showShopDetails(that){  
        
        let shop_item = $(that).children()[1];

        console.log($(shop_item).attr('class'));
        console.log('--------------');
        
        toggleShopDetails(that);
        //closeCityBlockArrow();      
          
        $(shop_item).toggleClass('is-on');     
        $(that).toggleClass('open');    
    }
    function hideAllShopDetails(){     
        $('.is-on').removeClass('is-on').addClass('is-off');             
    }
    function collHasCity(citiesCollection, item){
        /* Init forEachable array out of  assoc array citiesCollection */ 
        var cityFound="";
        citiesCollection.forEach(function(city){                                          
            if(city.name == item.city){                
                cityFound=city.name;                
            }             
        });        
        if(cityFound){
            return cityFound;
        }
        return false;       
    }
    function getAnotherCity(){
        toggleCityBlock();
        hideCityPopup();
    }
    function toggleCityBlock(){   

        if( $('.city-block').attr('class') == 'sidebar-toggle-list city-block is-on-city'){

            $('.sidebar .cities-block .sidebar-toggle-list').stop().animate(

                {
                    
                    height: '0'
                },
    
                {
    
                    duration: 1000,
    
                    easing: 'easeInCubic',
    
                    queue: false,

                    complete: function(){

                        $(this).css('overflow', 'hidden');
                    },
                }
            );

            closeCityBlock();
            closeCityBlockArrow();
        }
        else{

            $('.sidebar .cities-block .sidebar-toggle-list').stop().animate(

                {
                    
                    height: sidebarToggleListHeight + 'px'
                },
    
                {
    
                    duration: 1000,
    
                    easing: 'easeInCubic',
    
                    queue: false,

                    complete: function(){

                        $(this).css('overflow', 'auto');
                    },
                }
            );

            openCityBlock();
            openCityBlockArrow();
        }
    }
    function closeCityBlock(){
        $('.city-block').removeClass('is-on-city').addClass('is-off-city');        
    }
    function openCityBlock(){
        $('.city-block').removeClass('is-off-city').addClass('is-on-city');        
    }
    function openCityBlockArrow(){
        $('.sidebar-title-city-arrow').css({                
            '-ms-transform': 'rotate(90deg)', /* ��� IE */                
            '-o-transform': 'rotate(90deg)', /* ��� Opera */
            '-webkit-transform': 'rotate(90deg)',/* ��� Safari, Chrome, iOS */
            '-moz-transform': 'rotate(90deg)'
        });
    }
    function closeCityBlockArrow(){
        $('.sidebar-title-city-arrow').css({
            '-ms-transform': 'rotate(-90deg)', /* ��� IE */                
            '-o-transform': 'rotate(-90deg)', /* ��� Opera */
            '-webkit-transform': 'rotate(-90deg)',/* ��� Safari, Chrome, iOS */
            '-moz-transform': 'rotate(-90deg)'
        });
    }