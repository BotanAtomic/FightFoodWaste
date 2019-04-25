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
        ]]]);
    }

}