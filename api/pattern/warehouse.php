<?php

class WarehousePattern {

    public static function format($data): Array {
        return [
            'city' => $data['city'],
            'location' => $data['location']['coordinates'],
        ];
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