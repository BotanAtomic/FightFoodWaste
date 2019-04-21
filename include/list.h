//
// Created by botan on 4/21/19.
//

#ifndef FFW_LIST_H
#define FFW_LIST_H

#include <malloc.h>
#include <string.h>
#include <glib.h>

typedef char (*comparator)(void *, void *);

typedef struct Element {
    void *value;
    struct Element *next;
} Element;

typedef struct List {
    Element *element;
    __uint16_t length;
    comparator comparator;
} List;

List *createList();

void listInsert(List *, void *);

void listFree(List *);

void foreach(List *, void (*)(void *));

void * listSearch(List *, void *);

void listDelete(List *, void *);

#endif //FFW_LIST_H
