#include "login.h"


GtkWidget *window = NULL;
GtkEntry *email, *password;
GtkLabel *textError;

void showLoginScreen() {
    GtkBuilder *builder = NULL;
    GError *error = NULL;
    gtk_init(NULL, NULL);

    builder = gtk_builder_new();


    gtk_builder_add_from_file(builder, "../resources/login.glade", &error);

    if (error)
        exit(-1);

    window = GTK_WIDGET(gtk_builder_get_object(builder, "window"));
    email = GTK_ENTRY(gtk_builder_get_object(builder, "emailInput"));
    password = GTK_ENTRY(gtk_builder_get_object(builder, "passwordInput"));
    textError = GTK_LABEL(gtk_builder_get_object(builder, "textError"));

    GtkButton *validation = GTK_BUTTON(gtk_builder_get_object(builder, "validation"));

    g_signal_connect (GTK_BUTTON(validation), "clicked", login, NULL);

    gtk_widget_show(window);

    login();

    gtk_main();
}

void login() {
    User *user = loadUser((char *) gtk_entry_get_text(email),
                          (char *) gtk_entry_get_text(password));

    if (user != NULL) {
        gtk_window_close(GTK_WINDOW(window));
        printf("User token = %s\n", user->token);
        showDashboardView(user);
    } else {
        gtk_widget_show(GTK_WIDGET(textError));
    }

}