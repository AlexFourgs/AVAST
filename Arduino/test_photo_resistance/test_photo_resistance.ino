const int green_led = 2; // broche 2 du micro-contrôleur (led verte)
const int red_led = 4 ; // broche 4 du micro-controleur (led rouge) 

void setup() {

  pinMode(green_led, OUTPUT);
  pinMode(red_led, OUTPUT);
  
  Serial.begin(9600);

}

void loop() {
  // put your main code here, to run repeatedly:
  int valeur = analogRead(A0);

  Serial.println(valeur);

  digitalWrite(green_led, HIGH); //allumer L1
  delay(1000); // attendre 1 seconde
  digitalWrite(green_led, LOW); // Eteindre L1
  delay(2000); // attendre 2 seconde
  digitalWrite(red_led, HIGH);
  delay(1000);
  digitalWrite(red_led, LOW);
  delay(2000);

}
