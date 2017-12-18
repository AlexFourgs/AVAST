#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h> /* close */
#include <netdb.h> /* gethostbyname */
#include <errno.h>
#define INVALID_SOCKET -1
#define SOCKET_ERROR -1
#define closesocket(s) close(s)
#define BUFFER_SIZE 4000
#define PORT_S 7777

typedef int SOCKET_S;
typedef struct sockaddr_in SOCKADDR_IN_S;
typedef struct sockaddr SOCKADDR_S;
typedef struct in_addr IN_ADDR_S;

char* buffer;
int endEvent;

char* init_buffer();
void* reception_thread(void* args);
SOCKET_S init_sock_s();
