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
                'creation' => new MongoDB\BSON\UTCDateTime()
            ],
            'user' => [
                'root' => $_id
            ],
            'package' => $input['package'],
            'location' => UserPattern::getSingleField($client->users, $_id, 'location'),
            'status' => TO_PROGRAM,
            'reception' => true
        ]);
    }

    public static function get($collection, $_id, $all, $status) {
        $params = ['status' => ['$in' => $status]];

        if (!$all)
            $params['user.client'] = $_id;

        $cursor = $collection->find($params);

        return $cursor->toArray();
    }

    public static function format($data) {
        $base = [
            '_id' => $data['_id']->__toString(),
            'package' => $data['package'],
            'date' => [
                'creation' => $data['date']['creation']->__toString(),
            ],
            'user' => [
                'root' => $data['user']['root']->__toString(),
            ],
            'status' => $data['status'],
            'location' => $data['location']['coordinates']
        ];

        return $base;
    }

    public static function formatMultiple($entities) {
        $array = [];

        foreach ($entities as $entity) {
            array_push($array, self::format($entity));
        }

        return json_encode($array);
    }

}