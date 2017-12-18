#include "receiver.h"

char* init_buffer(){
	char* buf = (char*)malloc(BUFFER_SIZE*sizeof(char));
	return buf;
}

void* reception_thread(void* arg){
	
	(void) arg;
	SOCKET_S sock = init_sock_s();

	SOCKADDR_IN_S csin = { 0 };
	SOCKET_S csock;
	
	int sinsize = sizeof csin;
	
	if(listen(sock, 5) == SOCKET_ERROR)
	{
	    perror("listen()");
	    exit(errno);
	}

	csock = accept(sock, (SOCKADDR_S *)&csin, &sinsize);

	if(csock == INVALID_SOCKET)
	{
	    perror("accept()");
	    exit(errno);
	}

	

	while(1){
		int n = 0;

   		if((n = recv(csock, buffer, BUFFER_SIZE - 1, 0)) < 0)
   		{
   		   perror("recv()");
   		   exit(errno);
   		}
		printf("buffer: %s\n", buffer);
	
	}

	pthread_exit(NULL);
}

SOCKET_S init_sock_s(){
	SOCKET_S sock = socket(AF_INET, SOCK_STREAM, 0);
	if(sock == INVALID_SOCKET)
	{
	    perror("socket()");
	    exit(errno);
	}

	SOCKADDR_IN_S sin = { 0 };

	sin.sin_addr.s_addr = htonl(INADDR_ANY); /* nous sommes un serveur, nous acceptons n'importe quelle adresse */

	sin.sin_family = AF_INET;

	sin.sin_port = htons(PORT_S);

	if(bind (sock, (SOCKADDR_S *) &sin, sizeof sin) == SOCKET_ERROR)
	{
	    perror("bind()");
	    exit(errno);
	}

	return sock;
}
