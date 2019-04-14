<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once "../../../vendor/autoload.php";
require_once "../../token/utils.php";
require_once "../../utils/index.php";

$requiredFields = ['token'];
$input = json_decode(file_get_contents('php://input'), TRUE);

if (!checkFields($requiredFields, $input)) {
    http_response_code(404);
    return;
}

if (!isValidToken($input['token'])) {
    http_response_code(401);
    return;
}

$id = getIdByToken($input['token']);

echo $id;

http_response_code(200);
