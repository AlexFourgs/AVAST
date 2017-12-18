#include "communication.h"

int open_s(Serial_com* sc, char *name){

	struct termios toptions;

	strcpy(sc->name, name) ;


	#ifdef __DEBUG
	printf("Ouverture du port : %s\n", sc->name) ;
	#endif

	sc->fd = open(sc->name, O_RDWR) ;
	if(sc->fd == -1){
		return -1;
	}

	#ifdef __DEBUG
	printf("wait\n") ;
	#endif


	#ifdef __DEBUG
	printf("Ok\n") ;
	#endif

	tcgetattr(sc->fd, &toptions) ;

	cfsetispeed(&toptions, B9600) ;
	cfsetospeed(&toptions, B9600) ;
	toptions.c_cflag &= ~PARENB ;
	toptions.c_cflag &= ~CSTOPB ;
	toptions.c_cflag &= ~CSIZE;
	toptions.c_cflag |= CS8 ;
	toptions.c_cflag &= ~CRTSCTS;
	toptions.c_cflag |= CREAD | CLOCAL;
	toptions.c_iflag &= ~(IXON | IXOFF | IXANY);
	toptions.c_iflag &= ~(ICANON | ECHO | ECHOE | ISIG);
	toptions.c_oflag &= ~OPOST;

	toptions.c_cflag &= ~CRTSCTS;

	tcsetattr(sc->fd, TCSANOW, &toptions) ;

	usleep(3000000);

	return 1;
}

int write_s(Serial_com* sc, char *buffer, int nbyte){
	return write(sc->fd, buffer, nbyte);
}

int read_s(Serial_com* sc){
	char* buffer = (char*) malloc(sizeof(char));
	return read(sc->fd, buffer,1);
}

int close_s(Serial_com* sc){
	return close(sc->fd);
}

void writeOnFile(FILE * fichier, char* texte){
	fputs(texte, fichier);
}

void reset(Serial_com* sc) {

	//envoie de la commande au servo moteur
	if(write_s(sc, "r", 1) != -1){
		#ifdef DEBUG
		printf("signal envoyé : instruction pan\n");
		#endif
	}
}
