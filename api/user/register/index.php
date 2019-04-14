<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once "../../../vendor/autoload.php";
require_once "../../token/utils.php";
require_once "../../utils/index.php";
require_once "../../pattern/index.php";

$input = json_decode(file_get_contents('php://input'), TRUE);

if (!UserPattern::isValidRegisterInput($input)) {
    http_response_code(404);
    return;
}

$collection = (new MongoDB\Client)->ffw->users;

if (UserPattern::isEmailFree($collection, $input['email'])) {
    UserPattern::create($collection, $input);
    http_response_code(200);
} else {
    http_response_code(409);
}

