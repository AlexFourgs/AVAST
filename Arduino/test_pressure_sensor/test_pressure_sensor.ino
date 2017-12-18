int pressure_sensor ;
int green_led;
int red_led;
int buzzer;

void setup()
{
  Serial.begin(9600);
  pressure_sensor = 10;
  green_led = 2 ;
  red_led = 4 ;
  buzzer = 9 ;
  pinMode(green_led, OUTPUT);
  pinMode(red_led, OUTPUT);
  pinMode(pressure_sensor, INPUT);
  pinMode(buzzer, OUTPUT);
}

void loop()
{
  boolean sensor_state = digitalRead(pressure_sensor);
  Serial.println(sensor_state);
  
  if(sensor_state == 0){ // alarm ON
    digitalWrite(green_led, LOW);
    digitalWrite(red_led, HIGH);
    tone(buzzer, 2000);
    delay(250);
    tone(buzzer, 3000);
    delay(250);
  }
  else { // alarm OFF
    digitalWrite(red_led, LOW);
    digitalWrite(green_led, HIGH);
    noTone(buzzer);
  }  
}
