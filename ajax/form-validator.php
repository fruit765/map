<?php 

/**
 * Initiating $form_validator to construct FormValidator that runs Form processing
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

$form_validator = new FormValidator;

class FormValidator{

    public $errors = [];

    public $fields = '';

    public $subject = '';

    public function __construct(){
      
        foreach ($_POST as $key => $value){

            $name_field = explode('-', $key)[0];
                
            $type_check = explode('-', $key)[1];

            $obligatory_field = explode('-', $key)[2];

            if (!$name_field || !$type_check || !$obligatory_field) {

                $this->errors = ['Что-то пошло не так! (Имя не соответствует формату проверки)'];

                break;
            }

            if ($obligatory_field === '*') {

                if ($value === '') {

                    $this->errors[] = "Поле \"$name_field\" обязательно для заполнения!";
                }
            }

            switch($type_check) {

                case 'phone':

                    $this->fields .= $value . '<br>';
    
                    $this->checkPhone($value, $name_field);

                    break;
    
                case 'captcha':
    
                    $this->checkCaptcha($value);
    
                    break;

                case 'string':

                    if (explode('-', $key)[0] === 'subject') {

                        $this->subject = $value;
                    }
                    else {

                        $this->fields .= $value . '<br>';
                    }
    
                    $this->checkString($value, $name_field);
    
                    break;

                case 'text':

                    $this->fields .= $value . '<br>';
    
                    $this->checkText($value, $name_field);
    
                    break;

                case 'email':

                    $this->fields .= $value . '<br>';
    
                    $this->checkEmail($value, $name_field);
    
                    break;

                case 'ga_cid':
    
                    break;
                
                default:
    
                    $this->errors = ['Что-то пошло не так, обновите страницу! (Не соответствие типа проверки)'];

                    $this->viewErrors();

                    return;
    
                    break;
            }
        }

        if ($this->errors) {

            $this->viewErrors();

            return;
        }
        else {

            // Выполняем функцию Mail

            $mail = new PHPMailer(true);
            try {
                //$mail->SMTPDebug = 2;
                $mail->isSMTP();
                $mail->Host = 'smtp.gmail.com';
                $mail->SMTPAuth = true;
                $mail->Username = 'sidorov.mihail.maykop@gmail.com';
                $mail->Password = 'wmf-sever';
                $mail->SMTPSecure = 'tls';
                $mail->Port = 587;
                $mail->CharSet = 'UTF-8';

                //Recipients
                $mail->setFrom('sidorov.mihail.maykop@gmail.com', 'B2B');
                $mail->addAddress('sidorov.mihail.maykop@gmail.com', 'B2B');
                $mail->addReplyTo('sidorov.mihail.maykop@gmail.com', 'B2B');

                //Content
                $mail->isHTML(true);
                $mail->Subject = $this->subject;

                // Формируем тело отправляемого сообщения

                $mail->Body    = $this->fields;
                $mail->AltBody = $this->fields;

                $mail->send();
               
            } catch (Exception $e) {

                $this->errors = ['Сообщениине не отправлено: ' . $mail->ErrorInfo];

                $this->viewErrors();

                return;
            }

            // Создание лида в Bitrix

            require_once 'new-lid.php';
        }
    }
    
    private function checkPhone($value, $name_field){
    
        if (!empty($value)) {

            if (!preg_match('/^\+7\s\([0-9]{3}\)\s[0-9]{3}\-[0-9]{4}$/u', $value)) {
                
                $this->errors[] = "Поле \"$name_field\" не соответствует формату!";
            }
        }
    }

    private function checkCaptcha($value){
    
        if ($value !== 'on') {
                            
            $this->errors[] = 'Вы должны принять согласие на обработку персональных данных!';
        }
    }

    private function checkString($value, $name_field){
    
        if (!empty($value)) {
                            
            $rusChars = 'абвгдеёжзийклмнопрстуфхцчшщьыъэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ';

            if (!preg_match('/^[a-zA-Z'.$rusChars.'0-9\_\s]+$/u', $value)) {
                
                $this->errors[] = "Текстовое поле \"$name_field\" может содержать латинские или кириллические символы, цифры и знак \"_\"";
            }
        }
    }

    private function checkText($value, $name_field){
    
        if (!empty($value)) {
                            
            $rusChars = 'абвгдеёжзийклмнопрстуфхцчшщьыъэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ';

            if (!preg_match('/^[a-zA-Z'.$rusChars.'0-9\.\,\;\:\?\!\'\"\(\)\_\s]+$/u', $value)) {
                
                $this->errors[] = "Текстовое поле \"$name_field\" может содержать латинские или кириллические символы, цифры и знак \"_\"";
            }
        }
    }

    private function checkEmail($value, $name_field){
    
        if (!empty($value)) {
                            
            $rusChars = 'абвгдеёжзийклмнопрстуфхцчшщьыъэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ';

            if (!preg_match('/^(['.$rusChars.'a-zA-Z0-9_\.-])+@['.$rusChars.'a-zA-Z0-9-]+[\.]+(['.$rusChars.'a-zA-Z]{2,6}\.)?['.$rusChars.'a-z]{2,6}$/u', $value)) {
                
                $this->errors[] = "Поле \"$name_field\" не соответствует формату!";
            }
        }
    }

    private function viewErrors(){

        echo json_encode($this->errors);
    }
}

?>