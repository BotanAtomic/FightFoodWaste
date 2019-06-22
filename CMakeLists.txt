project(FFW C)
cmake_minimum_required(VERSION 2.6)

set(CMAKE_C_STANDARD 11)

set(CMAKE_C_FLAGS "-pthread -lm")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra")

include_directories(${GTK3_INCLUDE_DIRS})
link_directories(${GTK3_LIBRARY_DIRS})

set(CURL_LIBRARY ${CMAKE_SOURCE_DIR}/lib)
set(CURL_INCLUDE_DIR ${CMAKE_SOURCE_DIR}/include)
find_package(CURL)

include_directories(${CURL_INCLUDE_DIRS})
link_directories(${CURL_LIBRARIES})

link_directories(${PROJECT_SOURCE_DIR}/lib/json-c/.libs)

include_directories(include lib)

add_executable(FFW src/core/main.c src/views/login.c include/login.h src/views/dashboard.c
        include/dashboard.h include/dashboard.h include/user.h include/request.h src/network/request.c
        src/network/discovery_server.c include/discovery_server.h src/network/server.c include/server.h src/list/list.c include/list.h src/entity/product.c include/product.h include/utils.h src/utils/utils.c)

target_link_libraries(FFW ${GTK3_LIBRARIES} curl json-c)

