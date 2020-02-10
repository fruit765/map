<?php

    error_reporting(0);
    require_once $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';



    $start_row = 2;
    $end_row = 1000;
    $spreadsheetId = '1HRw_rZ-r6w8LIvkwJk5IQWQYk-8539RbACAWUn_ZgKA';
    $sheet_id = 0;



    /**
    * Получаем данные из БД
    *******************************************************/
    $mysqli = new mysqli('localhost', 'root', '', 'map_beta');
    if ($mysqli->connect_errno) {
        die('Не удалось подключиться к MySQL');
    }
    $mysqli->set_charset("utf8");
    $db_response = $mysqli->query("SELECT * FROM `inet_shops` ORDER BY `id` ASC");



    /**
    * Получаем данные из Google cheets
    *******************************************************/
    // Путь к файлу ключа сервисного аккаунта
    $googleAccountKeyFilePath = $_SERVER['DOCUMENT_ROOT'] . '/check-points-914cb303b3f9.json';
    putenv('GOOGLE_APPLICATION_CREDENTIALS=' . $googleAccountKeyFilePath);
    $client = new Google_Client();
    $client->useApplicationDefaultCredentials();
    $client->addScope('https://www.googleapis.com/auth/spreadsheets');
    $service = new Google_Service_Sheets($client);

    $range = "Лист1!A$start_row:G$end_row";
    $sheet_response = $service->spreadsheets_values->get($spreadsheetId, $range);



    /**
    * Сравниваем данные между Google sheets и БД и выделяем уже занесенные точки
    *******************************************************/
    $requests = [];
    foreach($sheet_response->values as $index => $row_sheet) {
        $db_response->data_seek(0);
        while($row = $db_response->fetch_assoc()) {
            if ($row_sheet[6] === $row['site']) {
                // Формируем запросы на подсвечивание уже добавленных точек
                $startRowIndex = $index + $start_row - 1;
                $endRowIndex = $startRowIndex + 1;
                $background_color = ["green" => 1, "red" => 0, "blue" => 0];

                $requests[] = new Google_Service_Sheets_Request([
                    'repeatCell' => [
            
                        // Диапазон, который будет затронут
                        "range" => [
                            "sheetId"          => $sheet_id, // ID листа
                            "startRowIndex"    => $startRowIndex,
                            "endRowIndex"      => $endRowIndex,
                            "startColumnIndex" => 0,
                            "endColumnIndex"   => 7
                        ],
            
                        // Формат отображения данных
                        // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets#CellFormat
                        "cell"  => [
                            "userEnteredFormat" => [
                                // Фон (RGBA)
                                // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets#Color
                                "backgroundColor" => $background_color
                            ]
                        ],
            
                        "fields" => "UserEnteredFormat(backgroundColor)"
                    ]
                ]);

                break;
            }
        }
    }
    
    // Выполняем запрос на подсветку строк гугл таблицы
    if ($requests) {
        sleep(1);
        $batchUpdateRequest = new Google_Service_Sheets_BatchUpdateSpreadsheetRequest([
            'requests' => $requests
        ]);
        $service->spreadsheets->batchUpdate($spreadsheetId, $batchUpdateRequest);
    }



    echo 'Проверка точек завершена!';
?>