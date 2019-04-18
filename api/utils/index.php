<?php

use function MongoDB\BSON\fromPHP;

function checkType($type, $value) {
    switch ($type) {
        case JSON_STRING:
            return is_string($value);
        case JSON_NUMBER:
            return is_numeric($value);
        case JSON_ARRAY:
            return is_array($value);
        case JSON_BOOLEAN:
            return is_bool($value);
        default:
            return false;
    }
}

function checkFields($fields, $data): bool {
    foreach ($fields as $field => $type) {
        if (!isset($data[$field]) || !checkType($type, $data[$field])) {
            return false;
        }
    }
    return true;
}

function bsonToJson($bson): string {
    return MongoDB\BSON\toJSON(MongoDB\BSON\fromPHP($bson));
}