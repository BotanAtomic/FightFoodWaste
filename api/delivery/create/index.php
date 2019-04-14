<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once "../../../vendor/autoload.php";
require_once "../../token/utils.php";
require_once "../../utils/index.php";
require_once "../../pattern/index.php";

$input = json_decode(file_get_contents('php://input'), TRUE);

if (!DeliveryPattern::isValidCreateInput($input)) {
    http_response_code(404);
    return;
}


if (!($_id = isValidToken($input['token']))) {
    http_response_code(401);
    return;
}

$client = (new MongoDB\Client)->ffw;

if (DeliveryPattern::isPackageFree($client->deliveries, $input['package'])) {
    DeliveryPattern::create($client, $input, $_id);
    http_response_code(200);
} else {
    http_response_code(409);
}

