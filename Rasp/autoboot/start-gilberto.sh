#!/bin/bash
cd /home/pi/AVAST/Rasp/sensors/
git config user.name 'uj'
git config user.email 'sudo.screenlife@gmail.com'
git pull origin master
. /home/pi/AVAST/Rasp/sensors/bin/activate
python gilberto.py

