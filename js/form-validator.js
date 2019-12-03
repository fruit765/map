
function formValidator($form, $scrollObject, modalWindow = false){

    var self = this;

    var timerId;

    var scrollOffset = 0;

    var captcha_mouseY;

    var alt_captcha_mouseY;

    // Внутренние методы Валидатора
        function createInfoDiv(classname){  
                
            var error_div = document.createElement('div');        

            error_div.className = classname + ' error_div';          
                        
            $form.find('.inputs').after(error_div);

            var ml_elem = document.createElement('ul');

            var small_errors = document.createElement('div');

            ml_elem.className = 'errors_ml';

            small_errors.className = 'small_errors';

            $form.find('.error_div').append(small_errors);

            $form.find('.error_div').append(ml_elem);
        }
    // Внутренние методы Валидатора КОНЕЦ

    // Поля Валидатора
        self.errors = [];
    // Поля Валидатора КОНЕЦ

    // Методы проверки Валидатора
        self.checkPhone = function(value, nameField){

            if (value){

                if (!value.match('^\\+7\\s\\([0-9]{3}\\)\\s[0-9]{3}\\-[0-9]{4}$')){

                    self.errors.push('Поле "' + nameField + '" не соответствует формату!');
                }
            }
        }

        self.checkCaptcha = function($element){
            
            if (!$element.prop('checked')){

                self.errors.push('Вы должны принять согласие на обработку персональных данных!');
            }
            else {

                if (!alt_captcha_mouseY || !captcha_mouseY){ 

                    self.errors.push('Зафиксировано поведение робота! Отметьте галочку мышкой и нажмите на кнопку мышкой!');
                } 
            }
        }

        self.checkString = function(value, nameField){
        
            if (value){

                var rusChars = 'абвгдеёжзийклмнопрстуфхцчшщьыъэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ';

                if (!value.match('^[a-zA-Z'+rusChars+'0-9\_\ ]+$')) {
                    
                    self.errors.push('Поле "' + nameField + '" может содержать латинские или кириллические символы, цифры и знак "_"');
                }
            }
        }

        self.checkText = function(value, nameField){
        
            if (value){

                var rusChars = 'абвгдеёжзийклмнопрстуфхцчшщьыъэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ';

                if (!value.match('^[a-zA-Z'+rusChars+'0-9\.\,\;\:\?\!\'\"\(\)\_\ ]+$')) {
                    
                    self.errors.push('Поле "' + nameField + '" содержит недопустимые символы!');
                }
            }
        }

        self.checkEmail = function(value, nameField){
        
            if (value){

                var rusChars = 'абвгдеёжзийклмнопрстуфхцчшщьыъэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ';

                if (!value.match('^(['+rusChars+'a-zA-Z0-9_\.-])+@['+rusChars+'a-zA-Z0-9-]+[\.]+(['+rusChars+'a-zA-Z]{2,6}\.)?['+rusChars+'a-z]{2,6}$')) {
                    
                    self.errors.push('Поле "' + nameField + '" не соответствует формату!');
                }
            }
        }
    // Методы проверки Валидатора КОНЕЦ

    // Вывод сообщений валидатора
        self.getInfoMsg = function(){

            var typeError;

            if (self.errors.length) {

                typeError = 'feed_errors';

                $form.find('#get-call-modal-phone').css('border', '1px solid red');
            }
            else {

                self.errors = ['Спасибо! Мы перезвоним вам в ближайшее время'];

                typeError = 'success_div';
            }

            createInfoDiv(typeError);       
            
            self.errors.forEach(function(item){

                $form.find('.error_div .small_errors').append('<p>' + item + '</p>');

                $form.find('.error_div > ul').append('<li>' + item + '</li>');
            });

            // $form.find('.error_div').slideToggle();

            // timerId = setTimeout(function(){

            //     $form.find('.error_div').slideToggle();
            // }, 6000); 
        }
    // Вывод сообщений валидатора КОНЕЦ

    // Валидация формы
        self.validate = function(){

            self.errors = [];

            // clearTimeout(timerId);

            $form.find('#get-call-modal-phone').css('border', '1px solid #c9c9c9');
            
            $form.find('.error_div').remove();

            var $fieldsArr = $form.find('input[type="text"], input[type="checkbox"], input[type="hidden"], textarea');

            $fieldsArr.each(function(){

                var nameField = $(this).attr('name').split('-')[0];
                
                var typeCheck = $(this).attr('name').split('-')[1];

                var obligatoryField = $(this).attr('name').split('-')[2];

                if (!nameField || !typeCheck || !obligatoryField) {

                    self.errors = ['Что-то пошло не так! (Имя не соответствует формату проверки)'];

                    return;
                }

                if (obligatoryField && obligatoryField === '*') {

                    if ($(this).val() === '') {

                        self.errors.push('Поле "' + nameField + '" обязательно для заполнения!');
                    }
                }

                switch(typeCheck) {

                    case 'phone':
        
                        self.checkPhone($(this).val(), nameField);
        
                        break;
        
                    case 'captcha':
        
                        self.checkCaptcha($(this));
        
                        break;
        
                    case 'string':
        
                        self.checkString($(this).val(), nameField);
        
                        break;

                    case 'text':
        
                        self.checkText($(this).val(), nameField);
        
                        break;
        
                    case 'email':
        
                        self.checkEmail($(this).val(), nameField);
        
                        break;

                    case 'ga_cid':
        
                        break;
                    
                    default:
        
                        self.errors = ['Что-то пошло не так, обновите страницу! (Не соответствие типа проверки)'];
        
                        return;
        
                        break;
                }
            });

            if (self.errors.length){

                self.getInfoMsg();
            }
            else {

                var fields = $form.serialize();

                $form.find('.form_submit_btn').addClass('load');
                
                $.ajax({

                    type: 'POST',
                    url: '/ajax/form-validator.php',
                    data: fields,           
                    success:  function(response) { 

                        $form.find('.form_submit_btn').removeClass('load');
        
                        if (response) {
        
                            self.errors = JSON.parse(response);
                        }
                        else {
        
                            $form.find('input[name*="phone"]').css('display', 'none');

                            $form.find('.form-check-label').removeClass('active');
                        }
        
                        self.getInfoMsg();
                    }    
                });
            }
        }
    // Валидация формы КОНЕЦ

    // Конструктор формы

        // $form.find('input[name*="phone"]').on('input', function(){

        //     handlePhoneField($(this));
        // });

        phoneMask($form.find('input[name*="phone"]'));

        $form.find('input[name*="captcha"]').prop('checked', false);

        $scrollObject.scroll(function(event){

            if (modalWindow) {
            
                scrollOffset = event.target.scrollTop;
            }
            else {

                scrollOffset = document.documentElement.scrollTop;
            }
        });

        $form.find('input[name*="captcha"]').on('click', function(event){

            if (event.clientY) {

                captcha_mouseY = event.clientY + scrollOffset;
            }
            else {

                captcha_mouseY = 0;
            }
        });

        $form.find('.form_submit_btn').on('click', function(event){

            event.preventDefault();

            if (event.clientY) {

                alt_captcha_mouseY = event.clientY + scrollOffset;
            }
            else {

                alt_captcha_mouseY = 0;
            }

            $form.submit();
        });

        $form.on('submit', function(){

            self.validate();

            return false;
        });
    // Конструктор формы КОНЕЦ
}