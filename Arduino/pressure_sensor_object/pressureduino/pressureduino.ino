const int green_led = 2;
const int red_led = 4;
const int buzzer = 9;

/*TO CHANGE FOR EACH SENSOR*/
const char uid[5] = "Ubtn";
const int sensor_pin = 10;
/**/

char command[1]; //incoming command
char state; //current state
int go_alarm; //should we trigger alarm ?
int sensor_measure;

void setup(){

  Serial.begin(9600);

  pinMode(green_led, OUTPUT);
  pinMode(red_led, OUTPUT);
  pinMode(sensor_pin, INPUT);
  pinMode(buzzer, OUTPUT);
  
  state = 'r' ; // État armé au départ. (idle)
  Serial.println("HELO");
}

void manage_states() {

  /*TO CHANGE FOR EACH SENSOR*/
  sensor_measure = digitalRead(sensor_pin);
  if(sensor_measure == 1) {
    go_alarm=1;
  }
  else {
    go_alarm=0;
  }
  /**/

  command[0] = '\0' ;

  if(Serial.available()) {

    command[0]=Serial.read();

    if(command[0] == 'u') { // We're asked to provide the uid
      Serial.println(uid);
    } else if(command[0] == 's') { //We're asked the current state
      switch(state) {
          case 'r':
            Serial.println("REDY");
            break;
          case 'a':
            Serial.println("ALRM");
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
    noTone(buzzer);
    

    if(command[0] == 'a' || go_alarm) {
      state = 'a';
      Serial.println("ALRM");

    } else if(command[0] == 'd') {
      state = 'd';
      Serial.println("DEAC");

    } else if(command[0] == 'r') {
      Serial.println("REDY");
    }


   } else if(state == 'a') { // alarm 


      digitalWrite(green_led, LOW);
      digitalWrite(red_led, HIGH);
      tone(buzzer, 700);
      
      if(command[0] == 'r') {
        state = 'r';
        Serial.println("REDY");
      }
      else if(command[0] == 'd')
      {
        state = 'd' ;
        Serial.println("DEAC");
      }
      else if(command[0] == 'a')
      {
        Serial.println("ALRM");
      }


   } else if(state == 'd') { // deactivated
    

      digitalWrite(red_led, HIGH);
      digitalWrite(green_led, LOW);
      noTone(buzzer);

      if(command[0] == 'r')
      {
        state = 'r' ;
        Serial.println("REDY");
      }
      else if(command[0] == 'a')
      {
        state = 'a' ;
        Serial.println("ALRM");
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
