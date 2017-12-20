
#include "sender.h"

// Socket initialisation
SOCKET init_sock(){
	SOCKET sock = socket(AF_INET, SOCK_STREAM, 0);
	if(sock == INVALID_SOCKET)
	{
	    perror("socket()");
	    exit(errno);
	}

	//declare structures
	struct hostent *hostinfo = NULL;
	SOCKADDR_IN sin = { 0 }; /* initialise la structure avec des 0 */
	const char *hostname = "localhost";

	//get informations from host
	hostinfo = gethostbyname(hostname); 
	if (hostinfo == NULL) 
	{
	    fprintf (stderr, "Unknown host %s.\n", hostname);
    	exit(EXIT_FAILURE);
	}

	//Fill structures
	sin.sin_addr = *(IN_ADDR *) hostinfo->h_addr;
	sin.sin_port = htons(PORT);
	sin.sin_family = AF_INET;
	
	//Connect to host
	if(connect(sock,(SOCKADDR *) &sin, sizeof(SOCKADDR)) == SOCKET_ERROR)
	{
	    perror("connect()");
	    exit(errno);
	}

	return sock;
}

//Send data String
void send_datas(char* buffer, SOCKET sock){
	if(send(sock, buffer, strlen(buffer), 0) < 0){
		perror("send()");
    		exit(errno);
	}
}

