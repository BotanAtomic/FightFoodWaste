<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once "../../../vendor/autoload.php";
require_once "../../token/utils.php";
require_once "../../utils/index.php";

$requiredFields = ['email', 'password'];
$input = json_decode(file_get_contents('php://input'), TRUE);

if (!checkFields($requiredFields, $input)) {
    http_response_code(404);
    return;
}

$collection = (new MongoDB\Client)->ffw->users;

$user = $collection->findOne($input);

if ($user) {
    $token = generateToken($user['_id']);

    $collection->updateOne(['_id' => $user['_id']], ['$set' => [
        'token' => [
            'value' => $token,
            'expiration' => new MongoDB\BSON\UTCDateTime((new DateTime())->getTimestamp() * 1000 + (3600000 * 2))
        ]
    ]]);

    unset($user['_id']);
    $user['token'] = $token;
    echo bsonToJson($user);
} else {
    http_response_code(401);
}

