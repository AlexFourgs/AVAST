#include <Servo.h>

const int green_led = 2;
const int red_led = 4;

Servo motor_hori ;
Servo motor_vert ;

/*TO CHANGE FOR EACH SENSOR*/
const char uid[5] = "UCAM";
const int motor_vert_pin = 8;
const int motor_hori_pin = 7 ;
/**/

char command[1]; //incoming command
char state; //current state

int motor_vert_angle;
int motor_hori_angle;

void setup(){

  Serial.begin(9600);

  pinMode(green_led, OUTPUT);
  pinMode(red_led, OUTPUT);
  motor_vert.attach(motor_vert_pin);
  motor_hori.attach(motor_hori_pin);
  
  reset_motor();
  
  state = 'r' ; // État armé au départ. (idle)
  Serial.println("REDY");
}

void manage_states() {

  command[0] = '\0' ;

  if(Serial.available()) {

    command[0]=Serial.read();
    
    if(command[0] == 'u') { // We're asked to provide the uid
      Serial.println(uid);
    } else if(command[0] == 's') { // We're asked the current state
      switch(state) {
          case 'r':
            Serial.println("REDY");
            break;
          case 'd':
            Serial.println("DEAC");
            break; 
      }
    }

    Serial.flush();
  }

  if(state == 'r') {// ready


    digitalWrite(red_led, LOW);
    digitalWrite(green_led, HIGH);    

    if(command[0] == 'd') {
      state = 'd';
      Serial.println("DEAC");

    } else if(command[0] == 'r') {
      Serial.println("REDY");
    } else if(command[0] == 'D') { // Tourner à droite
      Serial.println("TURR");
      turn_right();
    } else if(command[0] == 'Q') { // Tourner à gauche
      Serial.println("TURL");
      turn_left();
    } else if(command[0] == 'Z') { // Tourner en haut
      Serial.println("TURU");
      turn_up();
    } else if(command[0] == 'S') { // Tourner en bas
      Serial.println("TURD");
      turn_down();
    }
   } else if(state == 'd') { // deactivated
    

      digitalWrite(red_led, HIGH);
      digitalWrite(green_led, LOW);

      if(command[0] == 'r')
      {
        state = 'r' ;
        Serial.println("REDY");
      }
      else if(command[0] == 'd')
      {
        Serial.println("DEAC");
      }
    }
}

void loop()
{
  manage_states();
}

void reset_motor()
{
  motor_hori_angle = 90 ;
  motor_vert_angle = 90 ;
  motor_hori.write(motor_hori_angle);
  motor_vert.write(motor_vert_angle);
  delay(100);
}

void turn_up()
{
  if(motor_vert_angle < 155) // pour éviter de dépasser la limite du servo
  {
    motor_vert_angle += 5 ;
    motor_vert.write(motor_vert_angle);
    Serial.println(motor_vert_angle);
    delay(100);
  }
}

void turn_down()
{
  if(motor_vert_angle > 4) // pour éviter de dépasser la limite du servo
  {
    motor_vert_angle -= 5 ; 
    motor_vert.write(motor_vert_angle);
    Serial.println(motor_vert_angle);
    delay(100);
  }
}

void turn_right()
{
  if(motor_hori_angle < 175) // pour éviter de dépasser la limite du servo
  {
    motor_hori_angle += 5 ;
    motor_hori.write(motor_hori_angle);
    delay(100);
  }
}

void turn_left()
{
  if(motor_hori_angle > 5) // pour éviter de dépasser la limite du servo
  {
    motor_hori_angle -= 5 ; 
    motor_hori.write(motor_hori_angle);
    delay(100);
  }
}
