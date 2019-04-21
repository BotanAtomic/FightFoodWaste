//
// Created by botan on 4/21/19.
//

#include "product.h"

Product *newProduct(char *barcode, const char * name) {
    Product *product = malloc(sizeof(Product));
    strcpy(product->barcode, barcode);
    product->name = name;
    product->quantity = 1;
    return product;
}

char compareProduct(void *first, void *second) {
    Product *right = (Product *) second;

    if(right == NULL)
        return 0;

    return (char) strcmp((char *) first, (char *) right->barcode);
}
