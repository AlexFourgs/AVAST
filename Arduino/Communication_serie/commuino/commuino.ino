int read;

char datax[1];
char state ;

void setup()
{
  
  Serial.begin(9600);
  state = 'r' ; // État armé au départ. (iddle)
  read = 0 ;
}

void loop()
{
  datax[0] = '\0' ;
  
  if(Serial.available())
  {
    datax[0]=Serial.read();
    Serial.flush();
    
    if(state == 'r')
    {
      if(datax[0] == 'a')
      {
        state = 'a' ;
        Serial.println("Alarm turned on.");
      }
      else if(datax[0] == 'd')
      {
        state = 'd' ;
        Serial.println("Sensor deactivated.");
      }
      else if(datax[0] == 'r'){
        Serial.println("Already iddle.");
      }
      else 
      {
        Serial.println("Error, unknown message");
      }
    }
    else if(state == 'a') // armed
    {
      if(datax[0] == 'r')
      {
        state = 'r' ;
        Serial.println("Alarm turned off. Sensor Armed.");
      }
      else if(datax[0] == 'd')
      {
        state = 'd' ;
        Serial.println("Alarm turned off. Sensor deactivated.");
      }
      else if(datax[0] == 'a')
      {
        Serial.println("Alarm already on");
      }
      else 
      {
        Serial.println("Error, unknown message");
      }
    }
    else if(state = 'd')
    {
      if(datax[0] == 'r')
      {
        state = 'r' ;
        Serial.println("Reactivation. Sensor ready.");
      }
      else if(datax[0] == 'a')
      {
        state = 'a' ;
        Serial.println("Sensor reactivated. Alarm turned on.");
      }
      else if(datax[0] == 'd')
      {
        Serial.println("Sensor already deactivated.");
      }
      else 
      {
        Serial.println("Error, unknown message");
      }
    }        
        
    /*if((datax[0] == 'r') && (state != 'r')) // Réarmement
    {
      Serial.println("Réarmement");
      state = datax[0];
    }
    else if((datax[0] == 'r') && (state == 'r'))
    {
      Serial.println("Déjà réarmé");
    }  
    else if((datax[0] == 'u') && (state != 'u')) // Désactivation
    {
      Serial.println("Désactivation");
      state = datax[0];
    }
    else if((datax[0] == 'u') && (state == 'u'))
    {
     Serial.println("Déjà désactivé"); 
    }
    else if((datax[0] == 'a') && (state != 'a')) // Activation de l'alarme
    {
      Serial.println("Activation de l'alarme");
      state = datax[0];
    }
    else if((datax[0] == 'a') && (state == 'a'))
    {
      Serial.println("Déjà activé");
    }
    else // Error, message inconnu. 
    {
      Serial.println("Erreur, message inconnu");
    }*/
  }
}
