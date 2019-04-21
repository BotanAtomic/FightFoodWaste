//
// Created by botan on 4/20/19.
//

#include "discovery_server.h"

void bindDiscoveryServer(GtkLabel *statusLabel) {
    int socketPtr;
    struct sockaddr_in server, client;

    if ((socketPtr = socket(AF_INET, SOCK_DGRAM, 0)) < 0) {
        perror("socket creation failed");
        return;
    }

    memset(&server, 0, sizeof(server));
    memset(&client, 0, sizeof(client));

    server.sin_family = AF_INET;
    server.sin_addr.s_addr = INADDR_ANY;
    server.sin_port = htons(6789);

    if (bind(socketPtr, (const struct sockaddr *) &server, sizeof(server)) < 0) {
        perror("bind failed");
        return;
    }

    unsigned int len, n;
    char *buffer = malloc(1);
    while ((n = recvfrom(socketPtr, (char *) buffer, 1, MSG_WAITALL, (struct sockaddr *) &client, &len)) != -1) {
        char *address = inet_ntoa(client.sin_addr);
        printf("Client[%s:%d] : %d\n", address, client.sin_port, buffer[0]);
        sendto(socketPtr, (const char *) buffer, strlen(buffer), MSG_CONFIRM, (const struct sockaddr *) &client, len);
        buffer[0] = 0;
        PangoAttrList *attrList = gtk_label_get_attributes(statusLabel);
        pango_attr_list_insert(attrList, pango_attr_foreground_new(0, 27323, 0));
        gtk_label_set_attributes(statusLabel, attrList);
        gtk_label_set_text(statusLabel, "Status : connected");
    }

    printf("Close UDP socket server, last size : %d\n", n);

    sleep((unsigned short) 5);

    bindDiscoveryServer(statusLabel);

}
