<?php
/* CRM Exchange Start */
writeToLog('print','New CRM attempt at: '.date("d/m/Y H:i:s",time()));
/* Prepare vars */
$url = $_SERVER['HTTP_REFERER'];
$phone_replace = '';
$checkLeadResult = array();
$form_phone = (isset($_POST['phone-phone-*']) && !empty($_POST['phone-phone-*']) && SanitizePhone($_POST['phone-phone-*']))?str_replace('+7','8',$_POST['phone-phone-*']):"";
$form_name = (isset($_POST['Name']) && !empty($_POST['Name'])&& SanitizeName($_POST['Name']))?$_POST['Name']:"";

// if(isset($_POST['phone']) && !empty($_POST['phone'])){
//   $phone_replace = PreparePhone();
// }

/**
 *  CRM Module Starts
 */
writeToLog('data');
  /*
   * Checking if the PhoneNumber already exists in CRM DB
   */

$checkLeadResult = CheckLeadExists($form_phone);
  if($checkLeadResult['total']){    
    ApplyTask($checkLeadResult['result'][0]['ID'], 'old');
    writeToLog('exists');
  }
  else{
    writeToLog('new');
    AddNewLead($form_phone);
    $checkLeadResult = CheckLeadExists($form_phone);
    if($checkLeadResult){      
      ApplyTask($checkLeadResult['result'][0]['ID'], 'new');      
    }
}

function SanitizeName($name){
  $rusChars = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
  if(preg_match("/^[a-zA-Z0-9\_\ $rusChars]{2,15}$/i",$name)){     
      return true;
  }  
  return false;
}

function SanitizePhone($phone){
  if(preg_match("/^[0-9\+\(\)\-\ ]+$/", $phone)){  
    writeToLog('print','Phone '.$phone.'match!');    
    return true;    
  }
  writeToLog('print','Phone '.$phone.' DONT match!');
  return false; 
}

function SanitizeUTM($utm){  
  if($utm === ""){
    return false;
  } 
  /* UTM may contain a-z, A-Z, 0-9, "_" ONLY! */      
  if(preg_match("/^[a-zA-Z0-9_]+$/i", $utm)){
  return true;
  }
  return false;
}

function SanitizeCID($cid){
  if($cid == ""){
    return false;
  }
  /* UTM may contain a-z, A-Z, 0-9, "_" ONLY! */      
  if(preg_match("/^[a-zA-Z0-9\_\.]+$/i", $cid)){
  return true;
  }
  return false;
}

function AddNewLead($phone_replace){
  /* Get UTM from URL */
  $ga_cid = (isset($_POST['ga_cid-ga_cid-!']) && !empty($_POST['ga_cid-ga_cid-!']) && SanitizeCID($_POST['ga_cid-ga_cid-!']))?$_POST['ga_cid-ga_cid-!']:"";
  $UTM = getUTM();
/* Perform Request */
  $queryUrl = 'https://b24.karmy.top/rest/147/v0667nojnurjxxpc/crm.lead.add.json'; 
  $queryData = http_build_query(array(
    'fields' => array(
        "TITLE" => "Лид с сайта Karmy",
        "STATUS_ID" => "NEW",
        "OPENED" => "Y",
        "SOURCE_ID" => "WEB",
        "ASSIGNED_BY_ID" => 112,
        "UTM_SOURCE"=> getUTM('utm_source'),
        "UTM_MEDIUM"=> getUTM('utm_medium'),
        "UTM_CAMPAIGN"=> getUTM('utm_campaign'),    
        "UF_CRM_1548922750"=> $ga_cid,
        "PHONE" => array(array("VALUE" => $phone_replace, "VALUE_TYPE" => "WORK")),    
    ),
    "params" => array("REGISTER_SONET_EVENT" => "Y")
  ));

  $curl = curl_init();
  curl_setopt_array($curl, array(
  CURLOPT_SSL_VERIFYPEER => 0,
  CURLOPT_POST => 1,
  CURLOPT_HEADER => 0,
  CURLOPT_RETURNTRANSFER => 1,
  CURLOPT_URL => $queryUrl,
  CURLOPT_POSTFIELDS => $queryData,
  ));
  $result = curl_exec($curl);
  curl_close($curl);
  $result = json_decode($result, 1);
  writeToLog('ok');
  //if (array_key_exists('error', $result)) echo "Ошибка при сохранении лида: ".$result['error_description']."<br/>";
}
function CheckLeadExists($phone_replace){
  $checkLeadURL = 'https://b24.karmy.top/rest/147/v0667nojnurjxxpc/crm.lead.list.json';
  $queryCheckData = http_build_query(array(    
    'filter' => array("PHONE" => $phone_replace),
    'select' => array("ID", "PHONE", "RESPONSIBLE_ID"),
  ));
  $curl0 = curl_init();
  curl_setopt_array($curl0, array(
  CURLOPT_SSL_VERIFYPEER => 0,
  CURLOPT_POST => 1,
  CURLOPT_HEADER => 0,
  CURLOPT_RETURNTRANSFER => 1,
  CURLOPT_URL => $checkLeadURL,
  CURLOPT_POSTFIELDS => $queryCheckData,
  )); 
  $result0 = curl_exec($curl0);
  curl_close($curl0); 
  $result0 = json_decode($result0, 1);
  return $result0;
}

function ApplyTask($lead_id, $status){
  switch ($status){
    case 'new':
      $title = "Назначить ответственного сотрудника новому лиду";
      $description = "Поступила заявка с сайта Karmy.su от лида с ID: <a href='https://b24.karmy.top/crm/lead/details/".$lead_id."/'>".$lead_id."</a>";
    break;
    case 'old':
      $title = "Повторная заявка. Клиент просил перезвонить";
      $description = "Заявка с сайта Karmy.su существующего лида с ID: <a href='https://b24.karmy.top/crm/lead/details/".$lead_id."/'>".$lead_id."</a>";
    break;
  }
  $queryUrl = 'https://b24.karmy.top/rest/147/v0667nojnurjxxpc/task.item.add.json';
  $queryData = http_build_query(     
    array(
    "arNewTaskData" => array(
      "UF_CRM_TASK" => "L_".$lead_id,
      "TITLE" => $title,
      "DESCRIPTION" => $description,
      "RESPONSIBLE_ID" => 112,
    )                  
  )
);
  $curl = curl_init();
  curl_setopt_array($curl, array(
  CURLOPT_SSL_VERIFYPEER => 0,
  CURLOPT_POST => 1,
  CURLOPT_HEADER => 0,
  CURLOPT_RETURNTRANSFER => 1,
  CURLOPT_URL => $queryUrl,
  CURLOPT_POSTFIELDS => $queryData,
  ));
  $result = curl_exec($curl);
  curl_close($curl);
  $result = json_decode($result, 1);
}

function writeToLog($status, $print="") { 
    global $form_name, $form_phone;
    switch($status){
        case 'data':
            $data = "POST came: ".date("d/m/Y H:i:s",time())." Name: ".$form_name."; Phone: ".$form_phone."UTM: ".getUTM('utm_source').", ".getUTM('utm_medium').", ".getUTM('utm_campaign')."; GA_CID: ".$_POST['ga_cid-ga_cid-!']."; REF: ".$_SERVER['HTTP_REFERER']."\n"; 
        break;
        case 'exists':
            $data = "Lead already exists - Add operation cancelled \n";
        break;
        case 'new':
            $data = "Adding new Lead... \n";
        break;
        case 'ok':
            $data = "Lead Add - success \n";
        break;

        case 'print':
          $data = $print."\n";
        break;
    }
    if(file_exists("tst_log.txt")){
        file_put_contents("tst_log.txt",$data, FILE_APPEND | LOCK_EX);
    }     
 }

 function getUTM($param = ""){
  /* Init vars */
  $url = parse_url($_SERVER['HTTP_REFERER']);
  $utm_search=array('utm_source', 'utm_medium', 'utm_campaign');
  $utm_array = array();
/* Get UTMs */
  if(isset($url['query']) && !empty($url['query'])){
      $utms = explode("&",$url['query']);      
      foreach($utms as $utm){
          foreach($utm_search as $search){
              if(strpos($utm,$search) !== false){
                $utm_item = explode("=", $utm);
                // foreach($utm_array as $k=>$it){
                //   writeToLog('print', 'utm Array item key'.$k.' : val:'.$it);
                // }                
                if(SanitizeUTM($utm_item[1])){                  
                  if(empty($utm_array[$utm_item[0]])){
                    // writeToLog('print', 'utm Array '.$utm_array[$utm_item[0]].' not set');
                    $utm_array[$utm_item[0]] = $utm_item[1]; 
                    writeToLog('print', 'SanitizeUTM : '.$utm_item[1].'- OK');
                  }                               
                }
                else{
                  writeToLog('print', 'SanitizeUTM failure: '.$utm_item[1].'- Aborted');
                }                  
              }
          }    
      }
  }
    switch($param){
      case 'utm_source':    
          return (isset($utm_array['utm_source']) && !empty($utm_array['utm_source']))?$utm_array['utm_source']:"";
      break;
      case 'utm_medium':      
        return (isset($utm_array['utm_medium']) && !empty($utm_array['utm_medium']))?$utm_array['utm_medium']:"";
      break;
      case 'utm_campaign':      
        return (isset($utm_array['utm_campaign']) && !empty($utm_array['utm_campaign']))?$utm_array['utm_campaign']:"";
      break;
      default:
        return $utm_array;
    } 
 }
