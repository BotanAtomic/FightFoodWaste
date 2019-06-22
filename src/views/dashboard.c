#include "dashboard.h"

GtkListBox *listbox;
GtkWidget *window;
List *package;
Blob *blob;

GtkLabel *selectedLabel;
GtkListBoxRow *selectedRow;

char sessionToken[34];

void removePackageList() {
    if (selectedLabel != NULL) {
        listDelete(package, getBarcode(gtk_label_get_text(selectedLabel)));
        clearPackageDisplay(selectedLabel);
    }
}

void clearPackageDisplay() {
    if (selectedRow != NULL && selectedLabel != NULL) {
        gtk_container_remove(GTK_CONTAINER(selectedRow), GTK_WIDGET(selectedLabel));
        gtk_container_remove(GTK_CONTAINER(listbox), GTK_WIDGET(selectedRow));
    }
}

void onSelect(GtkListBox *box, GtkListBoxRow *row) {
    if (box != NULL && row != NULL) {
        selectedRow = row;
        selectedLabel = gtk_container_get_children(GTK_CONTAINER(row))->data;
    } else {
        selectedRow = NULL;
        selectedLabel = NULL;
    }
}

void showDashboardView(User *user) {
    strcpy(sessionToken, user->token);

    GtkBuilder *builder = NULL;
    GError *error = NULL;
    gtk_init(NULL, NULL);

    package = createList();
    package->comparator = compareProduct;

    builder = gtk_builder_new();

    gtk_builder_add_from_file(builder, "../resources/dashboard.glade", &error);

    if (error)
        exit(-1);

    window = GTK_WIDGET(gtk_builder_get_object(builder, "window"));
    GtkWidget *scrolledWindow = GTK_WIDGET(gtk_builder_get_object(builder, "scrolledWindow"));
    GtkLabel *statusLabel = GTK_LABEL(gtk_builder_get_object(builder, "statusLabel"));
    GtkButton *removeButton = GTK_BUTTON(gtk_builder_get_object(builder, "removeButton"));
    GtkButton *validateButton = GTK_BUTTON(gtk_builder_get_object(builder, "validateButton"));

    listbox = GTK_LIST_BOX(gtk_list_box_new());


    g_signal_connect (removeButton, "clicked", G_CALLBACK(removePackageList), NULL);
    g_signal_connect (validateButton, "clicked", G_CALLBACK(sendPackage), NULL);

    g_signal_connect (listbox, "row-selected", G_CALLBACK(onSelect), NULL);


    gtk_container_add(GTK_CONTAINER (scrolledWindow), GTK_WIDGET(listbox));


    gtk_widget_show_all(window);

    blob = g_new (Blob, 1);
    g_mutex_init(&blob->m);

    g_thread_new("discovery-server", (GThreadFunc) bindDiscoveryServer, statusLabel);
    g_thread_new("main-server", (GThreadFunc) bindMainServer, addInPackage);

    gtk_main();
}

gboolean addInPackage(gpointer data) {
    g_mutex_lock(&blob->m);

    char *code = data;

    Product *same = listSearch(package, code);
    Product *product = same == NULL ? loadProduct(code) : same;

    if (product != NULL) {
        char *labelText = g_strdup_printf("%dx   %s (%s)", same == NULL ? product->quantity : product->quantity + 1,
                                          product->name, product->barcode);
        if (same == NULL) {
            listInsert(package, product);
            GtkWidget *label = gtk_label_new(labelText);
            gtk_widget_show(label);
            gtk_container_add(GTK_CONTAINER (listbox), GTK_WIDGET(label));
            product->label = label;
        } else {
            product->quantity++;
            gtk_label_set_text(GTK_LABEL(same->label), labelText);
        }

    }

    g_mutex_unlock(&blob->m);

    return FALSE;
}

void sendPackage() {
    char response = postPackage(package, sessionToken);

    if (response == 1) {
        package = createList();
        package->comparator = compareProduct;

        while(1) {
            GtkListBoxRow *row = gtk_list_box_get_row_at_index(listbox, 0);

            if (row == NULL) {
                break;
            } else {
                gtk_container_remove(GTK_CONTAINER(listbox), GTK_WIDGET(row));
            }
        }
    }
}
