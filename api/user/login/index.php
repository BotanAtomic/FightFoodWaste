<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once "../../../vendor/autoload.php";
require_once "../../token/utils.php";
require_once "../../utils/index.php";
require_once "../../pattern/index.php";

$input = json_decode(file_get_contents('php://input'), TRUE);

if (!UserPattern::isValidLoginInput($input)) {
    http_response_code(404);
    return;
}

$collection = (new MongoDB\Client)->ffw->users;
$user = $collection->findOne($input);

if ($user) {
    UserPattern::addToken($collection, $user, generateToken($user['_id']));
    echo bsonToJson($user);
} else {
    http_response_code(401);
}

