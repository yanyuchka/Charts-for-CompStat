#!/user/bin/python

# this python script cleans raw crash data and subsets the last n days of observations
# if n=-1 all rows of the raw dataset are kept
# WEEK and YEAR attributes are derived

import pandas as pd
import numpy as np
import datetime as dt
import re
import os
import logging

dpath = './'

def date_parser(ds):
  if type(ds) == str:
    return dt.datetime.date(dt.datetime.strptime(ds, "%m/%d/%Y"))
  else:
    return np.nan

def time_parser(ts):
  if type(ts) == str:
    return dt.datetime.time(dt.datetime.strptime(ts, "%H:%M"))
  else:
    return np.nan

#zip-s war by brigitte.jellinek@nyu.edu 

def zip_cleaner(s):
  if type(s) != str:
    return np.nan
  elif re.match('^\d\d\d\d\d$', s):
    return s
  elif re.match('^\d\d\d\d\d-\d*$', s):
    return re.sub('-\d*$', '', s)
  else:
    return np.nan

def test_zip_cleaner():
  assert '12345' == zip_cleaner('12345')
  assert '12345' == zip_cleaner('12345-1234')
  assert np.isnan( zip_cleaner(np.nan) )
  assert np.isnan( zip_cleaner('1234') )
  assert np.isnan( zip_cleaner('0') )
  assert np.isnan( zip_cleaner('UNKNOWN'))


# reads the raw crash data

def read_crash_csv(data):
  df = pd.read_csv(data, 
    dtype={
     'DATE' : str,
     'TIME' : str,
     'BOROUGH': str,
     'ZIP CODE': str,
     'LATITUDE': np.floating,
     'LONGITUDE': np.floating,
     'LOCATION' : str, # derived type
     'ON STREET NAME' : str,
     'CROSS STREET NAME': str,
     'OFF STREET NAME' : str,
     'NUMBER OF PERSONS INJURED' : np.integer,
     'NUMBER OF PERSONS KILLED' : np.integer,
     'NUMBER OF PEDESTRIANS INJURED' : np.integer,
     'NUMBER OF PEDESTRIANS KILLED' : np.integer,
     'NUMBER OF CYCLIST INJURED' : np.integer,
     'NUMBER OF CYCLIST KILLED' : np.integer,
     'NUMBER OF MOTORIST INJURED' : np.integer,
     'NUMBER OF MOTORIST KILLED' : np.integer,
     'CONTRIBUTING FACTOR VEHICLE 1' : str,
     'CONTRIBUTING FACTOR VEHICLE 2' : str,
     'CONTRIBUTING FACTOR VEHICLE 3' : str,
     'CONTRIBUTING FACTOR VEHICLE 4' : str,
     'CONTRIBUTING FACTOR VEHICLE 5' : str,
     'UNIQUE KEY' : np.integer,
     'VEHICLE TYPE CODE 1' : str,
     'VEHICLE TYPE CODE 2' : str,
     'VEHICLE TYPE CODE 3' : str,
     'VEHICLE TYPE CODE 4' : str,
     'VEHICLE TYPE CODE 5' : str})
  df['DATE'] = map(date_parser, df['DATE'])  
  df['TIME'] = map(time_parser, df['TIME'])  
  df['LOCATION'] = zip(df.LATITUDE,df.LONGITUDE)
  df['ZIP CODE'] = map(zip_cleaner,df['ZIP CODE'])
  df['WEEK'] = df['DATE'].apply(lambda x: pd.to_datetime(x).week)
  df['YEAR'] = df['DATE'].apply(lambda x: pd.to_datetime(x).year) 
  df.columns = [field.replace(" ","_") for field in df.columns]
  return(df)

# subsets the last n days of the crash data and logs a number of records in the dataset
# no subseting if n=-1

def sample_crash_data(n,path,folder):
  df = read_crash_csv(os.path.join(path,'crashdata.csv'))
  logging.basicConfig(filename=os.path.join(path,'sample.log'),level=logging.DEBUG)
  df_new = df
  if n!=-1:
    start = dt.date.today()
    logging.info('As for %s raw data set contains %s records ...' % (dt.datetime.strftime(start,"%m/%d/%Y %H:%M:%S")
,df.shape[0]))
    end = dt.date.today()-dt.timedelta(days=n)
    df_new = df[(df.DATE >= end) & (df.DATE <= start)]
    df_new.to_csv(os.path.join(path,'%sdays_crashdata.csv' %(n)), index=False)
    logging.info('Raw data set for the last %s days contains %s records' % (n, df_new.shape[0]))
  else:
    df_new.to_csv(os.path.join(path,'%srows_crashdata.csv' %(df_new.shape[0])), index=False)


# n = 150; n =-1
if __name__ == "__main__":
  sample_crash_data(150,dpath,'data')
  sample_crash_data(-1,dpath,'data')

