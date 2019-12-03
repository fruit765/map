<?php

require_once($_SERVER['DOCUMENT_ROOT'].'/controllers/PDOController.php');

echo 'Check_db';

$conn = new PDOController;

$pdo = $conn->getConnection();

$result = $conn->getQuery($pdo, 'SELECT * FROM points');

var_dump($result);

$pdo = $conn->closeConnection($pdo);

