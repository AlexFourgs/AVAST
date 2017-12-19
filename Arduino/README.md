# Arduino

Tout ce qui concerne le développement sur les arduino (objets)

## Protocol

### Sending instructions

| Code | Action                               | Comment                                                                                     |
| ---- | ------------------------------------ | ------------------------------------------------------------------------------------------- |
| `a`    | Force alarm state triggering       | Buzzer will make noise and an ALRM signal will be issued                                    |
| `r`    | Force ready state triggering       | Sensor is watching for environment, potentially going into alarm mode if something is wrong |
| `d`    | Force deactivated state triggering | Sensor will do nothing by itself                                                            |
| `s`    | Ask for current state              | Sensor will tell its master in which state it is                                            |
| `u`    | Ask for uid                        | Sensor will give his unique id to its master                                                |

### Getting information

| Message | Meaning                               | Comment                                                                                                     |
| ------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `ALRM`  | Sensor just entered Alarm state       |                                                                                                             |
| `REDY`  | Sensor just entered Ready state       |                                                                                                             |
| `DEAC`  | Sensor just entered Deactivated state |                                                                                                             |
| `Uxxx`  | Sensor gives its uid                  | uid is 3-character long, identifying the sensor. It can be used to authentificate itself to the controller. |

### Example of communication

* M > `u`
* S > `Uba3`
* M > `r`
* S > `REDY`
* M > `s`
* S > `REDY`
* M > `a`
* S > `ALRM`