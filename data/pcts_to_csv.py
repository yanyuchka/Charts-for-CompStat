#!/usr/bin/python

import pandas as pd

dpath = './'

crash = pd.read_csv(dpath+"crash_precincts.csv")

for year in crash.year.unique():
  crash['year'].loc[(crash['week']==1) & (crash['year']==year) & (crash['label'].str[0:4] == str(year))
] = crash['year'].loc[(crash['week']==1) & (crash['year']==year) & (crash['label'].str[0:4] == str(year))].apply(lambda x: x+1)

crash = crash.groupby(['year', 'week','precinct','label'])['all_collisions','injury_collisions','fatal_collisions','injures','fatalities','cyclists_involved','pedestrians_involved'].sum().reset_index()

#stops = stops.groupby(['year','week','precinct'])['stops'].sum().reset_index()

pcts = sorted(crash.precinct.unique())

for pct in pcts:
  pct_csv = crash[crash['precinct']==int(pct)].sort(['year','week'])
  pct_csv['index'] = range(1, len(pct_csv) + 1)
  #pct_csv['year'].loc[(pct_csv['week']==1) & (crash['year']==2012) & pct_csv['label'][]] = crash['year'].loc[(crash['week']==1) & (crash['year']==2013)].apply(lambda x: x+1)

  pct_csv.to_csv(dpath+"../page/csv/pcts/collisions_%s.csv" % (pct), index=False)
  #print '<option value="%s">Precinct %s</option>' % (pct,pct)

