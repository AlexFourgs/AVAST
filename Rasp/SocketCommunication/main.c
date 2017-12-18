#include <stdio.h>
#include <stdlib.h>
#include "sender.h"
#include "receiver.h"
#include <pthread.h> 

int main(){
	//buffer = init_buff(100);
	//SOCKET socket = init_sock();
	//buffer = "allelouya";
	//send_datas(buffer, socket);

	buffer = init_buffer();
	pthread_t recThread;
	pthread_create(&recThread, NULL, reception_thread, NULL);
	pthread_join(recThread, NULL);
	return 0;
}
