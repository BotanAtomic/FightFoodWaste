//
// Created by botan on 4/21/19.
//

#include "utils.h"


char *getBarcode(const char *data) {

    char *barcode = malloc(128);

    for (int i = 0; data[i] != 0; i++) {
        if (data[i] == '(') {
            int j = i + 1;
            char nextChar = data[j];

            while (nextChar != 0 && nextChar != ')') {
                barcode[j - i - 1] = nextChar;
                nextChar = data[++j];
            }

            barcode[j - 1] = 0;
        }
    }

    return barcode;
}
