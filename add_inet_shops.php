<?php

require_once($_SERVER['DOCUMENT_ROOT'].'/controllers/CSVControllerInetShops.php');

$csv = new CSVClass;

?>

<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <title>Karmy API Test</title>
   
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <link rel="stylesheet" type="text/css" href="https://yastatic.net/bootstrap/3.3.4/css/bootstrap.min.css">

    <link rel="stylesheet" type="text/css" href="css/style.css">    

  </head>
  <body>

    <div class="container-fluid">

        <div class="row">

            <div class="data-checker-content">

                <?php $csv->processCSVFile(); ?>
            
            </div>       
        
        </div>

        
        <?php if(!$_GET && $csv->checkFileLoaded()): ?>

        <div class="row">

            <div class="col-6 button-subdiv">

                <form method="post" action="/add_inet_shops.php?save=1&show_reps=0">            

                <input type="submit" class="btn btn-primary" value="Проверка и запись в БД"/>        

                </form> 

            </div>

            <div class="col-6 button-subdiv">

                <form method="post" action="/add_inet_shops.php?save=2">         

                    <input type="submit" class="btn btn-danger" value="Запись в БД (без проверок)"/>

                </form>                
            
            </div>

        </div> 
        
        <?php endif; ?>

    </div>    
    
  </body>

    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.5/angular.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script> 

   
</html>