<?php

use MongoDB\BSON\UTCDateTime;

define("TO_PROGRAM", 0);
define("TAKEN", 1);
define("IN_PROGRESS", 2);
define("DONE", 3);
define("CANCELED", 4);

class DeliveryPattern {

    private static $REQUIRED_CREATE_FIELDS = [
        'token' => JSON_STRING,
        'package' => JSON_ARRAY
    ];

    public static function isValidCreateInput($input): bool {
        return checkFields(self::$REQUIRED_CREATE_FIELDS, $input);
    }

    public static function isPackageFree($collection, $package): bool {
        return !$collection->findOne(['package' => ['$in' => $package]]);
    }

    public static function create($client, $input, $_id) {
        $client->deliveries->insertOne([
            'date' => [
                'delivered' => new MongoDB\BSON\UTCDateTime()
            ],
            'user' => [
                'client' => $_id
            ],
            'package' => $input['package'],
            'location' => UserPattern::getLocation($client->users, $_id),
            'status' => TO_PROGRAM,
            'getBack' => true
        ]);
    }
}