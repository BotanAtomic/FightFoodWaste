//
// Created by botan on 4/21/19.
//

#ifndef FFW_PRODUCT_H
#define FFW_PRODUCT_H

#include "malloc.h"
#include "string.h"
#include <glib.h>
#include <gtk/gtk.h>

typedef struct Product {
    char barcode[128];
    const char * name;
    GtkWidget * label;
    int quantity;
    unsigned hash;
} Product;

Product * newProduct(char *barcode, const char *name);

char compareProduct(void *first, void *second);

#endif //FFW_PRODUCT_H
