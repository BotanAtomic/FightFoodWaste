function doRequest(api, method, data, onSuccess, onError, ...args) {
    var xhr = new XMLHttpRequest();
    var url = "http://51.75.203.112/api/";

    xhr.open(method, url + api, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                onSuccess(xhr.responseText, ...args);
            } else {
                onError(xhr.status);
            }
        }
    };

    var data = data instanceof String ? data : JSON.stringify(data);
    xhr.send(data);
}


function getProductName(id, callback) {
    let xhr = new XMLHttpRequest();

    xhr.open("GET", `https://ssl-api.openfoodfacts.org/api/product/produit/${id}.json`, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4)
            if (xhr.status === 200) {
                callback(JSON.parse(xhr.responseText)['product']['product_name']);
            } else {
                callback('Error');
            }
    };

    xhr.send(null);
}

/***********************************User Request******************************************* */

function loginRequest(email, password, callback, error) {
    doRequest("user/login/", "POST", {email, password}, callback, error);
}

function registerRequest(name, forename, email, type, password, callback, error) {
    doRequest("user/register/", "POST", {email, password, name, forename, type}, callback, error);
}

/**************************************************************************************** */


/***********************************Packages Request******************************************* */

function createPackageRequest(token, package, callback, error) {
    doRequest("delivery/create/", "POST", {token, package}, callback, error);
}

function getPackageRequest(token, all, status, callback, error) {
    doRequest("delivery/get/", "POST", {token, all, status}, callback, error);
}

function updatePackageRequest(token, delivery, status, callback, error) {
    doRequest("delivery/update/", "POST", {token, delivery, status}, callback, error, delivery, status)
}

/**************************************************************************************** */

