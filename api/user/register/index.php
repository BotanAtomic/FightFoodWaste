<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once "../../../vendor/autoload.php";
require_once "../../token/utils.php";
require_once "../../utils/index.php";

$requiredFields = ['email', 'password', 'name', 'forename', 'type'];
$input = json_decode(file_get_contents('php://input'), TRUE);

if (!checkFields($requiredFields, $input)) {
    http_response_code(404);
    return;
}

$collection = (new MongoDB\Client)->ffw->users;

$existingDocument = $collection->findOne(['email' => $input['email']]);

if(!$existingDocument) {
    $collection->insertOne([
        'email' => $input['email'],
        'password' => $input['password'],
        'name' => $input['name'],
        'forename' => $input['forename'],
        'type' => $input['type'],
        'date' => [
            'register' => new MongoDB\BSON\UTCDateTime()
        ]
    ]);
    http_response_code(200);
} else {
    http_response_code(409);
}

