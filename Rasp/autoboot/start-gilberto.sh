#!/bin/bash
cd /home/pi/AVAST/Rasp/sensors/
git pull origin master
. /home/pi/AVAST/Rasp/sensors/bin/activate
python gilberto.py

