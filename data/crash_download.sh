#!/bin/sh

# a shell script downloads NYPD Motor Vehicle Collisions Data: 
# https://data.cityofnewyork.us/Public-Safety/NYPD-Motor-Vehicle-Collisions/h9gi-nx95
# it should be executed from a crontab entry for keeping data uptodate 
# use URL link below to obtain a current data shapshot


# full path for correct cron job
DIR='/home/yanyuchka/repos/sp2015-group23/data'

# wget output file
FILE=crashdata.csv

# wget log file
LOGFILE=wget.log

# wget download url
URL=https://data.cityofnewyork.us/api/views/h9gi-nx95/rows.csv?accessType=DOWNLOAD

cd $DIR
wget $URL -O $FILE -o $LOGFILE

