int read;

char datax[1];
char state ;

void setup()
{
  Serial.begin(9600);
  state = 'r' ; // État armé au départ. (idle)
  read = 0 ;
  Serial.println("REDY");
}

void loop()
{
  datax[0] = '\0' ;
  
  if(Serial.available())
  {
    datax[0]=Serial.read();
    Serial.flush();

    
    if(state == 'r') //state: Ready
    {
      if(datax[0] == 'a') //Intentional alarm trigger
      {
        state = 'a' ;
        Serial.println("ALRM");
      }
      else if(datax[0] == 'd') //Intentional deactivation
      {
        state = 'd' ;
        Serial.println("DEAC");
      }
      else if(datax[0] == 'r' || datax[0] == 's'){ //Intentional ready
        Serial.println("REDY");
      }
      else  //Anything else raises error
      {
        Serial.println("ERR!");
      }
    }
    else if(state == 'a') // Alarm
    {
      if(datax[0] == 'r') // Intentional back to Ready
      {
        state = 'r' ;
        Serial.println("REDY");
      }
      else if(datax[0] == 'd') // Intentional back to Deatctivated
      {
        state = 'd' ;
        Serial.println("DEAC");
      }
      else if(datax[0] == 'a' || datax[0] == 's') // Alarm still on
      {
        Serial.println("ALRM");
      }
      else 
      {
        Serial.println("ERR!");
      }
    }
    else if(state = 'd')
    {
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
      else if(datax[0] == 'd' || datax[0] == 's')
      {
        Serial.println("DEAC");
      }
      else 
      {
        Serial.println("ERR!");
      }
    }        
  }
}
