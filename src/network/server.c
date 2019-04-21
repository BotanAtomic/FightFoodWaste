//
// Created by botan on 4/20/19.
//

#include "server.h"

void bindMainServer(gboolean (*callback)(gpointer)) {


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
    server.sin_port = htons(7890);

    if (bind(socketPtr, (const struct sockaddr *) &server, sizeof(server)) < 0) {
        perror("bind failed");
        return;
    }

    unsigned int len, n;
    char *buffer = malloc(128);
    while ((n = recvfrom(socketPtr, (char *) buffer, 13, MSG_WAITALL, (struct sockaddr *) &client, &len)) != -1) {
        gdk_threads_add_idle(callback,buffer);
        printf("Code bar : %s\n", buffer);
    }

    printf("Close UDP socket server, last size : %d\n", n);

    sleep((unsigned short) 5);

    bindMainServer(callback);
}
