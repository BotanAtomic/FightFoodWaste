<?php

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

    private static $REQUIRED_GET_FIELDS = [
        'token' => JSON_STRING,
        'all' => JSON_BOOLEAN,
        'status' => JSON_ARRAY
    ];

    public static function isValidCreateInput($input): bool {
        return checkFields(self::$REQUIRED_CREATE_FIELDS, $input);
    }

    public static function isValidGetInput($input): bool {
        return checkFields(self::$REQUIRED_GET_FIELDS, $input);
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
            'location' => UserPattern::getSingleField($client->users, $_id, 'location'),
            'status' => TO_PROGRAM,
            'getBack' => true
        ]);
    }

    public static function get($collection, $_id, $all, $status) {
        $params = ['status' => ['$in' => $status]];

        if (!$all)
            $params['user.client'] = $_id;

        $cursor= $collection->find($params);

        return $cursor->toArray();
    }
}