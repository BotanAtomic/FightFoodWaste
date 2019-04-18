<?php

define("VOLUNTEER", 0);
define("MERCHANT", 1);
define("INDIVIDUAL", 2);

define("NORMAL", 0);
define("ADMIN", 1);

class UserPattern {

    private static $REQUIRED_LOGIN_FIELDS = [
        'email' => JSON_STRING,
        'password' => JSON_STRING
    ];

    private static $REQUIRED_REGISTER_FIELDS = [
        'email' => JSON_STRING,
        'password' => JSON_STRING,
        'name' => JSON_STRING,
        'forename' => JSON_STRING,
        'type' => JSON_NUMBER,
        'location' => JSON_ARRAY
    ];

    public static function isValidLoginInput($input): bool {
        return checkFields(self::$REQUIRED_LOGIN_FIELDS, $input);
    }

    public static function isValidRegisterInput($input): bool {
        return checkFields(self::$REQUIRED_REGISTER_FIELDS, $input);
    }

    public static function setToken($collection, $user, $token) {
        $collection->updateOne(['_id' => $user['_id']], ['$set' => [
            'token' => [
                'value' => $token,
                'expiration' => new MongoDB\BSON\UTCDateTime((new DateTime())->getTimestamp() * 1000 + (3600000 * 2))
            ]
        ]]);

        unset($user['_id']);
        $user['token'] = $token;
    }

    public static function create($collection, $input) {
        $collection->insertOne([
            'email' => $input['email'],
            'password' => $input['password'],
            'name' => $input['name'],
            'forename' => $input['forename'],
            'type' => $input['type'],
            'date' => [
                'register' => new MongoDB\BSON\UTCDateTime()
            ],
            'location' => [
                'type' => 'Point',
                'coordinates' => $input['location']
            ],
            'permission' => 0
        ]);
    }

    public static function isEmailFree($collection, $email): bool {
        return !$collection->findOne(['email' => $email], ['projection' => ['_id' => 1]]);
    }

    public static function getSingleField($collection, $_id, $field) {
        return $collection->findOne(['_id' => $_id], ['projection' => [
            '_id' => 0,
            $field => 1
        ]])[$field];
    }

    public static function get($collection, $_id) {
        return $collection->findOne(['_id' => $_id]);
    }

}