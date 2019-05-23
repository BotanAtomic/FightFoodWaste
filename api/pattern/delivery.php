<?php

use MongoDB\BSON\ObjectId;

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
        'reception' => JSON_BOOLEAN,
        'status' => JSON_ARRAY,
        'skip' => JSON_NUMBER,
        'limit' => JSON_NUMBER
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
                'giver' => $_id
            ],
            'package' => $input['package'],
            'location' => UserPattern::getSingleField($client->users, $_id, 'location'),
            'status' => WAITING,
            'reception' => true
        ]);
    }

    public static function get($collection, $reception, $status, $skip, $limit, $taken) {
        $params = ['status' => ['$in' => $status]];
        $params['reception'] = ['$eq' => $reception];

        if (isset($taken)) {
            $params['user.manager'] = ['$eq' => new MongoDB\BSON\ObjectId($taken)];
        }


        $cursor = $collection->find($params, ['sort' => ['date.creation' => -1],
            'limit' => $limit, 'skip' => $skip]);

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

    public static function defineManager($collection, $id, $user) {
        $collection->updateOne(
            ['_id' => new MongoDB\BSON\ObjectId($id)],
            [
                '$set' => ['user.manager' => new MongoDB\BSON\ObjectId($user)]
            ]
        );
    }

    public static function format($data, $client) {
        $giverUser = UserPattern::get($client->users, $data['user']['giver']);
        $managerUser = null;

        if (isset($data['user']['manager']))
            $managerUser = UserPattern::get($client->users, $data['user']['manager']);

        $warehouses = WarehousePattern::getNearest($client->warehouses, $data['location']['coordinates']);

        $base = [
            '_id' => $data['_id']->__toString(),
            'package' => $data['package'],
            'date' => [
                'creation' => $data['date']['creation']->__toString(),
            ],
            'user' => [
                'giver' => $data['user']['giver']->__toString(),
                'giver.name' => $giverUser['name'] . ' ' . $giverUser['forename']
            ],
            'status' => $data['status'],
            'location' => $data['location']['coordinates'],
            'warehouses' => WarehousePattern::format($warehouses, $client)
        ];

        if ($managerUser != null) {
            $base['user']['manager'] = $data['user']['manager']->__toString();
            $base['user']['manager.name'] = $managerUser['name'] . ' ' . $managerUser['forename'];
        }

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