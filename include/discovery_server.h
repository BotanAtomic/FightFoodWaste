//
// Created by botan on 4/20/19.
//

#ifndef FFW_DISCOVERY_SERVER_H
#define FFW_DISCOVERY_SERVER_H

#include "stdio.h"
#include "gtk/gtk.h"
#include <sys/socket.h>
#include <netinet/in.h>
#include "malloc.h"
#include <string.h>
#include <arpa/inet.h>
#include <unistd.h>

void bindDiscoveryServer(GtkLabel * statusLabel);

#endif //FFW_DISCOVERY_SERVER_H
