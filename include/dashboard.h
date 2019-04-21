//
// Created by botan on 4/19/19.
//

#ifndef FFW_DASHBOARD_H
#define FFW_DASHBOARD_H

#include "gtk/gtk.h"
#include "discovery_server.h"
#include "server.h"
#include "list.h"
#include "product.h"
#include "request.h"
#include "utils.h"

typedef struct {
    GMutex m;
} Blob;

void showDashboardView(User * user);

gboolean addInPackage(gpointer pointer);

void removePackageList();

void clearPackageDisplay();

void onSelect(GtkListBox *box, GtkListBoxRow *row);

void sendPackage();

#endif //FFW_DASHBOARD_H
