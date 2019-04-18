<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once "../../../vendor/autoload.php";
require_once "../../token/utils.php";
require_once "../../utils/index.php";
require_once "../../pattern/index.php";

$input = json_decode(file_get_contents('php://input'), TRUE);

if (!DeliveryPattern::isValidUpdateInput($input)) {
    http_response_code(404);
    return;
}

if (!($_id = isValidToken($input['token']))) {
    http_response_code(401);
    return;
}

$client = (new MongoDB\Client)->ffw;
$package = DeliveryPattern::getById($client->deliveries, $input['delivery']);
$permission = UserPattern::getSingleField($client->users, $_id, 'permission');

if ($permission != ADMIN && $package->user->root != $_id) {
    http_response_code(401);
    return;
}

DeliveryPattern::updateStatus($client->deliveries, $input['delivery'], $input['status']);

