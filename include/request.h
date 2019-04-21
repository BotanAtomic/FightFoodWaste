//
// Created by botan on 4/19/19.
//

#ifndef FFW_REQUEST_H
#define FFW_REQUEST_H

#include <glob.h>
#include "user.h"
#include "product.h"
#include <malloc.h>
#include <string.h>
#include "curl/curl.h"
#include "json-c/json_object.h"
#include "json-c/json_tokener.h"
#include "list.h"
#include <glib.h>

typedef struct ResponseData {
    size_t length;
    char *data;
} ResponseData;

size_t writeData(void *ptr, size_t size, size_t n, struct ResponseData *response);

User *loadUser(char *email, char *password);

Product *loadProduct(char *barcode);

char postPackage(List * package, const char * token);


#endif //FFW_REQUEST_H
