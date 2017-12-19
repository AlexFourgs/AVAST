int photo_resistance ;
int green_led;
int red_led;
int buzzer;
boolean sensor_state ;

int read;

char datax[1];
char state ;
int go_alarm;
int sensor_measure;

void setup()
{
  Serial.begin(9600);
  photo_resistance = A0;
  green_led = 2 ;
  red_led = 4 ;
  buzzer = 9 ;
  pinMode(green_led, OUTPUT);
  pinMode(red_led, OUTPUT);
  pinMode(photo_resistance, INPUT);
  pinMode(buzzer, OUTPUT);
  
  state = 'r' ; // État armé au départ. (iddle)
  read = 0 ;
  Serial.println("REDY");
}

void manage_states() {

  /*Propre à chaque sensor*/
  sensor_measure = analogRead(photo_resistance);
  if (sensor_measure < 550) {
    go_alarm = 1;
  } else {
    go_alarm = 0;
  }
  datax[0] = '\0' ;
  /**/

  if(Serial.available()) {
    datax[0]=Serial.read();
    Serial.flush();
  }

  if(state == 'r') {// ready
    digitalWrite(red_led, LOW);
    digitalWrite(green_led, HIGH);
    noTone(buzzer);
    
    if(go_alarm)
    {
      Serial.println("ALRM");
      state = 'a' ;
    }  
    if(datax[0] == 'a')
    {
      state = 'a' ;
      Serial.println("ALRM");
    }
    else if(datax[0] == 'd')
    {
      state = 'd' ;
      Serial.println("DEAC");
    }
    else if(datax[0] == 'r'){
      Serial.println("REDY");
    }
    else 
    {
      //Serial.println("ERR!");
    }
    }
    else if(state == 'a') { // alarm 
      digitalWrite(green_led, LOW);
      digitalWrite(red_led, HIGH);
      tone(buzzer, 700);
      
      if(datax[0] == 'r')
      {
        state = 'r' ;
        Serial.println("REDY");
      }
      else if(datax[0] == 'd')
      {
        state = 'd' ;
        Serial.println("DEAC");
      }
      else if(datax[0] == 'a')
      {
        Serial.println("ALRM");
      }
      else 
      {
        //Serial.println("ERR!");
      }
    }
    else if(state = 'd') // deactivated
    {
      digitalWrite(red_led, HIGH);
      digitalWrite(green_led, LOW);
      noTone(buzzer);
      if(datax[0] == 'r')
      {
        state = 'r' ;
        Serial.println("REDY");
      }
      else if(datax[0] == 'a')
      {
        state = 'a' ;
        Serial.println("ALRM");
      }
      else if(datax[0] == 'd')
      {
        Serial.println("DEAC");
      }
      else 
      {
        //Serial.println("ERR!");
      }
    }
}

void loop()
{
  manage_states();
}
