#ifndef COMMUNICATION
#define COMMUNICATION

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <time.h>
#include <math.h>
#include <fcntl.h>
#include <termios.h>
#include <pthread.h>

#define ACM "/dev/ttyACM0"


typedef struct Serial_com Serial_com;
struct Serial_com{
    char name[20];
    int speed;
    int fd;
    char parity;
    int stop_bit;
};

int open_s(Serial_com* sc, char *name);
int write_s(Serial_com* sc, char *buffer, int nbyte);
int read_s(Serial_com* sc);
int close_s(Serial_com* sc);
void writeOnFile(FILE * fichier, char* texte);
void reset(Serial_com* sc);
