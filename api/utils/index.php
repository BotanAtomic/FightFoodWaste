<?php

function checkFields($fields, $data): bool {
    foreach ($fields as $field) {
        if (!isset($data[$field])) {
            return false;
        }
    }
    return true;
}

function bsonToJson($bson): string {
    return MongoDB\BSON\toJSON(MongoDB\BSON\fromPHP($bson));
}