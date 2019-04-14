<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once "../../../vendor/autoload.php";
require_once "../../token/utils.php";
require_once "../../utils/index.php";
require_once "../../pattern/index.php";

$input = json_decode(file_get_contents('php://input'), TRUE);

if (!DeliveryPattern::isValidGetInput($input)) {
    http_response_code(404);
    return;
}


if (!($_id = isValidToken($input['token']))) {
    http_response_code(401);
    return;
}

$client = (new MongoDB\Client)->ffw;

if ($input['all']) {
    $permission = UserPattern::getSingleField($client->users, $_id, 'permission');

    if ($permission != ADMIN) {
        http_response_code(401);
        return;
    }
}

echo bsonToJsonArray(DeliveryPattern::get($client->deliveries, $_id, $input['all'], $input['status']));




