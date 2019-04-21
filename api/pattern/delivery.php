<?php

define("WAITING", 0);// grey
define("TAKEN", 1);// blue
define("IN_PROGRESS", 2);// orange
define("DONE", 3); // green
define("CANCELED", 4); // red

class DeliveryPattern {

    private static $REQUIRED_CREATE_FIELDS = [
        'token' => JSON_STRING,
        'package' => JSON_ARRAY
    ];

    private static $REQUIRED_UPDATE_FIELDS = [
        'token' => JSON_STRING,
        'delivery' => JSON_STRING,
        'status' => JSON_NUMBER
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

    public static function isValidUpdateInput($input): bool {
        return checkFields(self::$REQUIRED_UPDATE_FIELDS, $input);
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
            'status' => WAITING,
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

    public static function getById($collection, $id) {
        $cursor = $collection->find(['_id' => new MongoDB\BSON\ObjectId($id)]);

        return $cursor->toArray()[0];
    }

    public static function updateStatus($collection, $id, $status) {
        $collection->updateOne(['_id' => new MongoDB\BSON\ObjectId($id)],
            ['$set' => ['status' => $status]]);
    }

    public static function format($data, $client) {
        $rootUser = UserPattern::get($client->users, $data['user']['root']);

        $base = [
            '_id' => $data['_id']->__toString(),
            'package' => $data['package'],
            'date' => [
                'creation' => $data['date']['creation']->__toString(),
            ],
            'user' => [
                'root' => $data['user']['root']->__toString(),
                'root.name' => $rootUser['name'] . ' ' . $rootUser['forename']
            ],
            'status' => $data['status'],
            'location' => $data['location']['coordinates']

        ];

        return $base;
    }

    public static function formatMultiple($entities, $client) {
        $array = [];

        foreach ($entities as $entity) {
            array_push($array, self::format($entity, $client));
        }

        return json_encode($array);
    }

}