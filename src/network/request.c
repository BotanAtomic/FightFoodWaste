//
// Created by botan on 4/19/19.
//

#include "request.h"

size_t writeData(void *ptr, size_t length, size_t n, struct ResponseData *response) {
    size_t newLength = length * n;
    response->data = (char *) realloc(response->data, response->length + newLength + 1);

    if (response->data == NULL) {
        fprintf(stderr, "ERROR: Failed to expand buffer in curl write data");
        free(response->data);
        return -1;
    }

    memcpy(&(response->data[response->length]), ptr, newLength);
    response->length += newLength;
    response->data[response->length] = 0;

    return newLength;

}

User *loadUser(char *email, char *password) {
    CURL *curl;
    CURLcode response;

    ResponseData *responseData = malloc(sizeof(ResponseData));
    responseData->length = 0;
    responseData->data = malloc(4096);

    curl = curl_easy_init();
    if (curl == NULL) {
        return NULL;
    }

    json_object *object = json_object_new_object();
    json_object_object_add(object, "email", json_object_new_string(email));
    json_object_object_add(object, "password", json_object_new_string(password));

    const char *json = json_object_to_json_string(object);

    curl_easy_setopt(curl, CURLOPT_URL, "http://51.75.203.112/api/user/login/");

    curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, writeData);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, responseData);

    response = curl_easy_perform(curl);

    curl_easy_cleanup(curl);
    curl_global_cleanup();


    long http_code = 0;
    curl_easy_getinfo (curl, CURLINFO_RESPONSE_CODE, &http_code);
    if (http_code == 200 && response != CURLE_ABORTED_BY_CALLBACK) {
        json_object *jsonResponse = json_tokener_parse(responseData->data);

        User *user = malloc(sizeof(User));

        user->forename = json_object_get_string(json_object_object_get(jsonResponse, "forename"));
        user->name = json_object_get_string(json_object_object_get(jsonResponse, "name"));
        user->token = json_object_get_string(json_object_object_get(jsonResponse, "token"));

        return user;
    }

    return NULL;
}

Product *loadProduct(char *barcode) {
    CURL *curl;
    CURLcode response;

    ResponseData *responseData = malloc(sizeof(ResponseData));
    responseData->length = 0;
    responseData->data = malloc(4096);

    curl = curl_easy_init();
    if (curl == NULL) {
        return NULL;
    }


    curl_easy_setopt(curl, CURLOPT_URL,
                     g_strdup_printf("https://fr.openfoodfacts.org/api/v0/produit/%s.json", barcode));

    curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "GET");
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, writeData);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, responseData);

    response = curl_easy_perform(curl);

    curl_easy_cleanup(curl);
    curl_global_cleanup();


    long http_code = 0;
    curl_easy_getinfo (curl, CURLINFO_RESPONSE_CODE, &http_code);
    if (http_code == 200 && response != CURLE_ABORTED_BY_CALLBACK) {
        json_object *jsonResponse = json_tokener_parse(responseData->data);

        json_object *productObject = json_object_object_get(jsonResponse, "product");

        const char *productName = json_object_get_string(json_object_object_get(productObject, "product_name"));

        free(jsonResponse);
        free(productObject);
        if (productName == NULL)
            return NULL;


        return newProduct(barcode, productName);
    }

    return NULL;
}

char postPackage(List *package, const char *token) {
    CURL *curl;
    CURLcode response;

    ResponseData *responseData = malloc(sizeof(ResponseData));
    responseData->length = 0;
    responseData->data = malloc(4096);

    curl = curl_easy_init();
    if (curl == NULL) {
        return 0;
    }

    json_object *object = json_object_new_object();
    json_object *idArray = json_object_new_array();

    Element *element = package->element;

    while (element) {
        Product *product = (Product *) element->value;

        for (int i = 0; i < product->quantity; i++) {
            json_object_array_add(idArray, json_object_new_string(product->barcode));
        }

        element = element->next;
    }

    json_object_object_add(object, "token", json_object_new_string(token));
    json_object_object_add(object, "package", idArray);
    json_object_object_add(object, "reception", json_object_new_boolean(1));

    const char *json = json_object_to_json_string(object);

    curl_easy_setopt(curl, CURLOPT_URL, "http://51.75.203.112/api/delivery/create/");

    curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, writeData);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, responseData);

    response = curl_easy_perform(curl);

    curl_easy_cleanup(curl);
    curl_global_cleanup();


    long http_code = 0;
    curl_easy_getinfo (curl, CURLINFO_RESPONSE_CODE, &http_code);

    if (http_code == 200 && response != CURLE_ABORTED_BY_CALLBACK)
        return 1;

    return 0;
}


