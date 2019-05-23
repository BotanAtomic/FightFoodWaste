<?php

class WarehousePattern {

    private static $REQUIRED_GET_FIELDS = [
        'token' => JSON_STRING,
    ];

    public static function isValidGetInput($input): bool {
        return checkFields(self::$REQUIRED_GET_FIELDS, $input);
    }

    public static function get($collection): Array {
        return $collection->find()->toArray();
    }

    public static function formatStock($stock, $client): Array {
        $array = [];

        foreach ($stock as $data) {
            $giverUser = UserPattern::get($client->users, $data['user']['giver']);
            $base = [
                'package' => $data['package'],
                'date' => [
                    'arrival' => $data['date']['arrival']->__toString(),
                ],
                'user' => [
                    'giver' => $data['user']['giver']->__toString(),
                    'giver.name' => $giverUser['name'] . ' ' . $giverUser['forename']
                ],
            ];

            array_push($array, $base);
        }


        return $array;
    }

    public static function format($data, $client): Array {
        $stock = isset($data['stock']) ? self::formatStock($data['stock'], $client) : [];
        return [
            'city' => $data['city'],
            'location' => $data['location']['coordinates'],
            'stock' => $stock
        ];
    }

    public static function formatMultiple($entities, $client) {
        $array = [];

        foreach ($entities as $entity) {
            array_push($array, self::format($entity, $client));
        }

        return json_encode($array);
    }

    public static function getNearest($collection, $position) {
        return $collection->findOne(['location' => ['$near' => [
                '$geometry' => [
                    'type' => "Point",
                    'coordinates' => $position
                ]
            ]]]
        );
    }

    public static function addPackage($collection, $warehouseId, $package, $giver) {
        $collection->updateOne(['_id' => $warehouseId], [
            '$push' =>
                ['stock' =>
                    [
                        'date' => [
                            'arrival' => new MongoDB\BSON\UTCDateTime()
                        ],
                        'package' => $package,
                        'user' => [
                            'giver' => $giver
                        ]
                    ]
                ]
        ]);
    }

}