int pressure_sensor ;
int green_led;
int red_led;

void setup()
{
  Serial.begin(9600);
  pressure_sensor = 10;
  green_led = 2 ;
  red_led = 4 ;
  pinMode(green_led, OUTPUT);
  pinMode(red_led, OUTPUT);
  pinMode(pressure_sensor, INPUT);
}

void loop()
{
  boolean sensor_state = digitalRead(pressure_sensor);
  Serial.println(sensor_state);
  
  if(sensor_state == 0){
    digitalWrite(green_led, LOW);
    digitalWrite(red_led, HIGH);
  }
  else {
    digitalWrite(red_led, LOW);
    digitalWrite(green_led, HIGH);
  }  
}
