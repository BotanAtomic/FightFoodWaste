<?php

function generateToken($id): string {
    $chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return substr(str_shuffle($chars), 0, 10) . $id;
}

function getIdByToken($token) {
    return new MongoDB\BSON\ObjectId(substr($token, 10));
}

function isValidToken($token) {
    try {
        $collection = (new MongoDB\Client)->ffw->users;
        $_id = getIdByToken($token);
        $result = $collection->findOne(['_id' => $_id, 'token.value' => $token, 'token.expiration' => [
            '$gte' => new MongoDB\BSON\UTCDateTime()
        ]], ['projection' => ['_id' => 1]]);
    } finally {
        return isset($result) ? $_id : false;
    }
}