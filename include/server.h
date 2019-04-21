//
// Created by botan on 4/20/19.
//

#ifndef FFW_SERVER_H
#define FFW_SERVER_H

#include <sys/socket.h>
#include <netinet/in.h>
#include "malloc.h"
#include <string.h>
#include <arpa/inet.h>
#include <unistd.h>
#include "gtk/gtk.h"

void bindMainServer(gboolean (*callback)(gpointer));

#endif //FFW_SERVER_H
